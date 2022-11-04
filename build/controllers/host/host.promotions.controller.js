"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostPromotionController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const mongoose_1 = require("mongoose");
const _builders_1 = __importDefault(require("@builders"));
let HostPromotionClass = class HostPromotionClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async createPromotion(req, res, next) {
        try {
            let payload = req.body;
            const headers = req.headers;
            const offset = headers === null || headers === void 0 ? void 0 : headers.offset;
            payload["offset"] = -Number(offset);
            let dates = await _entity_1.PromotionV1.calculateDates(payload.duration, payload.offset);
            let response;
            if (payload === null || payload === void 0 ? void 0 : payload.promoId) {
                await _entity_1.PromotionV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.promoId) }, { promotionStatus: _common_1.ENUM.PROPERTY.PROMOTION_STATUS.RENEWED });
            }
            const propertyDetail = await _entity_1.PropertyV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.propertyId) }, { name: 1, address: 1 });
            if ((payload === null || payload === void 0 ? void 0 : payload.categoryId) && payload.subCategoryId) {
                const categoryObj = await _entity_1.CategoryV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.categoryId) });
                const subCategoryObj = await _entity_1.CategoryV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.subCategoryId) });
                payload['category'] = categoryObj;
                payload['subCategory'] = subCategoryObj;
            }
            else {
                payload['category'] = {};
                payload['subCategory'] = {};
            }
            payload['hostId'] = res.locals.userId;
            payload['fromDate'] = dates.fromDate;
            payload['toDate'] = dates.toDate;
            payload['transactionDetail'] = {
                price: payload['price'],
                totalPrice: payload['totalPrice'],
                tax: payload['tax'],
                dailyPrice: payload['dailyPrice'],
                taxPercentage: payload['taxPercentage']
            };
            payload['propertyName'] = propertyDetail['name'];
            payload['propertyAddress'] = propertyDetail['address'];
            switch (payload.listingType) {
                case _common_1.ENUM.ADVERTISEMENT.ListingPlacement.HOME: {
                    let flag = await _entity_1.PromotionV1.checkSlotAvailability(payload);
                    if (flag === true) {
                        response = await _entity_1.PromotionV1.createPromotionEntity(payload);
                    }
                    else {
                        return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NO_SLOTS_AVAILABLE);
                    }
                    break;
                }
                case _common_1.ENUM.ADVERTISEMENT.ListingPlacement.LISTING: {
                    let flag = await _entity_1.PromotionV1.checkSlotAvailability(payload);
                    if (flag === true) {
                        response = await _entity_1.PromotionV1.createPromotionEntity(payload);
                    }
                    else {
                        return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NO_SLOTS_AVAILABLE);
                    }
                    break;
                }
            }
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
    async fetchPromotionListing(req, res, next) {
        try {
            let payload = req.query;
            payload['getCount'] = true;
            payload['hostId'] = res.locals.userId;
            let pipeline = await _builders_1.default.User.HostBUilder.promoListing(payload);
            let promotions = await _entity_1.PromotionV1.paginateAggregate(pipeline, payload);
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, promotions);
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
    async fetchPromotionDetail(req, res, next) {
        try {
            let payload = req.params;
            const hostId = res.locals.userId;
            let promoDetail = await _entity_1.PromotionV1.findOne({ hostId: mongoose_1.Types.ObjectId(hostId), _id: mongoose_1.Types.ObjectId(payload.promoId) });
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, promoDetail);
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
    async checkPricing(req, res, next) {
        try {
            let payload = req.params;
            let promise = [];
            let categoryArray = [];
            let subCategoryArray = [];
            let result = [];
            promise.push(_entity_1.PropertyV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.id) }, { "city._id": 1, _id: 0 }));
            promise.push(_entity_1.PropertySpaceV1.findMany({ propertyId: mongoose_1.Types.ObjectId(payload.id) }, { "category._id": 1, "subCategory._id": 1, _id: 0 }));
            let [cityId, categoryId] = await Promise.all(promise);
            for (let i = 0; i < categoryId.length; i++)
                categoryArray.push(mongoose_1.Types.ObjectId(categoryId[i].category._id));
            for (let i = 0; i < categoryId.length; i++)
                subCategoryArray.push(mongoose_1.Types.ObjectId(categoryId[i].subCategory._id));
            promise.push(_entity_1.AdvV1.findOne({ "city._id": mongoose_1.Types.ObjectId(cityId.city._id), "category._id": { $in: categoryArray }, "subCategory._id": { $in: subCategoryArray } }, { listingPlacement: 1 }));
            promise.push(_entity_1.AdvV1.findOne({ listingPlacement: _common_1.ENUM.ADVERTISEMENT.ListingPlacement.HOME }, { listingPlacement: 1 }));
            let response = await _entity_1.AdvV1.findOne({ "city._id": mongoose_1.Types.ObjectId(cityId.city._id), "category._id": { $in: categoryArray }, "subCategory._id": { $in: subCategoryArray } }, { listingPlacement: 1 });
            let response1 = await _entity_1.AdvV1.findOne({ listingPlacement: _common_1.ENUM.ADVERTISEMENT.ListingPlacement.HOME }, { listingPlacement: 1 });
            if (!response && !response1)
                result = [];
            if (response)
                result.push(response);
            if (response1)
                result.push(response1);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, result);
        }
        catch (err) {
            next(err);
        }
    }
    async fetchPrice(req, res, next) {
        try {
            let payload = req.query;
            let response;
            let projection;
            let frequency;
            let dailyPriceDivider;
            const headers = req.headers;
            const offset = headers === null || headers === void 0 ? void 0 : headers.offset;
            payload["offset"] = -Number(offset);
            let checkSlotAvailability = await _entity_1.PromotionV1.findOne({
                promotionStatus: {
                    $nin: [
                        _common_1.ENUM.PROPERTY.PROMOTION_STATUS.EXPIRED,
                        _common_1.ENUM.PROPERTY.PROMOTION_STATUS.PENDING,
                        _common_1.ENUM.PROPERTY.PROMOTION_STATUS.RENEWED
                    ]
                },
                "transactionDetail.transactionStatus": {
                    $nin: [
                        _common_1.ENUM.PAYMENT.STATUS.PENDING,
                        _common_1.ENUM.PAYMENT.STATUS.FAILURE
                    ]
                },
                propertyId: mongoose_1.Types.ObjectId(payload.propertyId),
                listingType: payload.listingType
            });
            if (checkSlotAvailability)
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NO_SLOTS_AVAILABLE);
            switch (payload.duration) {
                case _common_1.ENUM.PROPERTY.PROMOTION.DURATION.DAILY:
                    projection = `slotType.${payload.slotType}.daily`;
                    frequency = "daily";
                    dailyPriceDivider = 1;
                    break;
                case _common_1.ENUM.PROPERTY.PROMOTION.DURATION.MONTHLY:
                    projection = `slotType.${payload.slotType}.monthly`;
                    frequency = "monthly";
                    dailyPriceDivider = 30;
                    break;
                case _common_1.ENUM.PROPERTY.PROMOTION.DURATION.WEEKLY:
                    projection = `slotType.${payload.slotType}.weekly`;
                    frequency = "weekly";
                    dailyPriceDivider = 7;
                    break;
            }
            if (payload.listingType == _common_1.ENUM.ADVERTISEMENT.ListingPlacement.HOME) {
                let checkSlotAvailability = await _entity_1.PromotionV1.findMany({
                    promotionStatus: {
                        $nin: [
                            _common_1.ENUM.PROPERTY.PROMOTION_STATUS.EXPIRED,
                            _common_1.ENUM.PROPERTY.PROMOTION_STATUS.PENDING,
                            _common_1.ENUM.PROPERTY.PROMOTION_STATUS.RENEWED
                        ]
                    },
                    "transactionDetail.transactionStatus": {
                        $nin: [
                            _common_1.ENUM.PAYMENT.STATUS.PENDING,
                            _common_1.ENUM.PAYMENT.STATUS.FAILURE
                        ]
                    },
                    slotType: payload.slotType,
                    listingType: payload.listingType
                });
                if (checkSlotAvailability.length >= 4)
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NO_SLOTS_AVAILABLE);
            }
            else if (payload.listingType == _common_1.ENUM.ADVERTISEMENT.ListingPlacement.LISTING) {
                let checkSlotAvailability = await _entity_1.PromotionV1.findMany({
                    promotionStatus: {
                        $nin: [
                            _common_1.ENUM.PROPERTY.PROMOTION_STATUS.EXPIRED,
                            _common_1.ENUM.PROPERTY.PROMOTION_STATUS.PENDING,
                            _common_1.ENUM.PROPERTY.PROMOTION_STATUS.RENEWED
                        ]
                    },
                    "transactionDetail.transactionStatus": {
                        $nin: [
                            _common_1.ENUM.PAYMENT.STATUS.PENDING,
                            _common_1.ENUM.PAYMENT.STATUS.FAILURE
                        ]
                    },
                    listingType: payload.listingType
                });
                if (checkSlotAvailability.length >= 3)
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NO_SLOTS_AVAILABLE);
            }
            let dates = await _entity_1.PromotionV1.calculateDates(payload.duration, payload.offset);
            let findTax = await _entity_1.PropertyV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.propertyId) }, { country: 1, state: 1 });
            let taxPercentage = findTax.state.tax ? findTax.state.tax : findTax.country.tax;
            if (payload.listingType == _common_1.ENUM.ADVERTISEMENT.ListingPlacement.LISTING) {
                response = await _entity_1.AdvV1.findOne({ listingPlacement: payload.listingType, "city._id": mongoose_1.Types.ObjectId(payload.cityId), "category._id": mongoose_1.Types.ObjectId(payload.categoryId), "subCategory._id": mongoose_1.Types.ObjectId(payload.subCategoryId) }, projection);
                if (!response)
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NO_PRICE_AVAILABLE);
                let price = response.slotType[payload.slotType][frequency];
                let finalTax = (price * taxPercentage) / 100;
                let finalPrice = price + finalTax;
                response = {
                    price: price,
                    taxPercentage: taxPercentage,
                    tax: finalTax,
                    totalPrice: finalPrice,
                    fromDate: dates.fromDate,
                    toDate: dates.toDate,
                    dailyPrice: price / dailyPriceDivider
                };
            }
            else if (payload.listingType == _common_1.ENUM.ADVERTISEMENT.ListingPlacement.HOME) {
                response = await _entity_1.AdvV1.findOne({ listingPlacement: payload.listingType }, projection);
                if (!response)
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NO_PRICE_AVAILABLE);
                let price = response.slotType[payload.slotType][frequency];
                let finalTax = (response.slotType[payload.slotType][frequency] * taxPercentage) / 100;
                let finalPrice = price + finalTax;
                response = {
                    price: price,
                    taxPercentage: taxPercentage,
                    tax: finalTax,
                    totalPrice: finalPrice,
                    fromDate: dates.fromDate,
                    toDate: dates.toDate,
                    dailyPrice: price / dailyPriceDivider
                };
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Create a promotion",
        path: '/',
        parameters: {
            body: {
                description: 'Body for creating a promotion',
                required: true,
                model: 'ReqAddPromotionModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPromotionClass.prototype, "createPromotion", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Fetch promotion listing",
        path: '/',
        parameters: {
            query: {
                page: {
                    description: 'Page must be a positive number',
                    required: true,
                },
                limit: {
                    description: 'Limit must be a positive number',
                    required: true,
                },
                promoStatus: {
                    description: 'status of the promotion',
                    required: true,
                },
                categoryId: {
                    description: 'mongoId',
                    required: true,
                },
                subCategoryIds: {
                    description: 'mongoId',
                    required: true,
                },
                paymentStatus: {
                    description: 'payment status',
                    required: true,
                },
                search: {
                    description: 'search on promotion id or transaction type',
                    required: true,
                },
                propertyId: {
                    description: 'mongoId',
                    required: true,
                },
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPromotionClass.prototype, "fetchPromotionListing", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Fetch promotion details",
        path: '/{promoId}',
        parameters: {
            path: {
                promoId: {
                    description: 'mongoId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPromotionClass.prototype, "fetchPromotionDetail", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "check pricing for a particular city",
        path: '/city/{id}',
        parameters: {
            path: {
                id: {
                    description: 'mongoId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPromotionClass.prototype, "checkPricing", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Fetch price for the slot available",
        path: '/price',
        parameters: {
            query: {
                propertyId: {
                    description: 'mongoId',
                    required: true,
                },
                cityId: {
                    description: 'mongoId',
                    required: true,
                },
                duration: {
                    description: 'duration of promotion must be a number',
                    required: true,
                },
                categoryId: {
                    description: 'mongoId',
                    required: true,
                },
                subCategoryId: {
                    description: 'mongoId',
                    required: true,
                },
                slotType: {
                    description: 'number',
                    required: true,
                },
                listingType: {
                    description: 'number',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPromotionClass.prototype, "fetchPrice", null);
HostPromotionClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/host/promote",
        name: "Host Promotion Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], HostPromotionClass);
exports.HostPromotionController = new HostPromotionClass();
//# sourceMappingURL=host.promotions.controller.js.map