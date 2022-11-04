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
exports.AdminAdvPrice = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const mongoose_1 = require("mongoose");
const _builders_1 = __importDefault(require("@builders"));
let AdvClass = class AdvClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async addAdvPrice(req, res, next) {
        try {
            let payload = req.body;
            payload.isDelete = false;
            let promise = [];
            let query = {};
            if (payload.cityId && payload.listingPlacement == _common_1.ENUM.ADVERTISEMENT.ListingPlacement.LISTING)
                query = { listingPlacement: payload.listingPlacement, "category._id": mongoose_1.Types.ObjectId(payload.categoryId), "subCategory._id": mongoose_1.Types.ObjectId(payload.subCategoryId), "city._id": mongoose_1.Types.ObjectId(payload.cityId) };
            else if (payload.listingPlacement == _common_1.ENUM.ADVERTISEMENT.ListingPlacement.HOME)
                query = { listingPlacement: payload.listingPlacement };
            let checkDataPresent = await _entity_1.AdvV1.findOne(query);
            if (checkDataPresent)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).DUPLICATE_PRICING);
            if (payload.cityId && payload.categoryId) {
                promise.push(_entity_1.CountriesV1.findOne({ id: payload.countryId }, { id: 1, sortname: 1, name: 1, countryId: 1, _id: 1, tax: 1 }));
                promise.push(_entity_1.StatesV1.findOne({ id: payload.stateId }, { name: 1, stateId: 1, id: 1, _id: 1 }));
                promise.push(_entity_1.CityV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.cityId) }, { cityName: 1, iconImage: 1, _id: 1 }));
                promise.push(_entity_1.CategoryV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.categoryId) }));
                promise.push(_entity_1.CategoryV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.subCategoryId) }));
                let [countryData, stateData, cityData, categoryData, subCategoryData] = await Promise.all(promise);
                payload.country = countryData;
                payload.state = stateData;
                payload.city = cityData;
                payload.category = categoryData;
                payload.subCategory = subCategoryData;
            }
            await _entity_1.AdvV1.updateDocument(query, payload, { upsert: true });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            next(err);
        }
    }
    async updateAdvPrice(req, res, next) {
        try {
            let payload = req.body;
            await _entity_1.AdvV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.id) }, payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            next(err);
        }
    }
    async fetchAdvData(req, res, next) {
        try {
            let payload = req.query;
            payload.getCount = true;
            let pipeline = await _builders_1.default.Admin.FAQ.AdvListing(payload);
            let response = await _entity_1.AdvV1.paginateAggregate(pipeline, payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async fetchAdvHomeData(req, res, next) {
        try {
            let response = await _entity_1.AdvV1.findOne({ listingPlacement: _common_1.ENUM.ADVERTISEMENT.ListingPlacement.HOME });
            if (!response)
                response = {};
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async advDetails(req, res, next) {
        try {
            let payload = req.params;
            let response = await _entity_1.AdvV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.id) });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async DeleteAdPrice(req, res, next) {
        try {
            let payload = req.params;
            await _entity_1.AdvV1.remove({ _id: mongoose_1.Types.ObjectId(payload.id) });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Admin details",
        path: '/',
        parameters: {
            body: {
                description: 'Body for add amenities',
                required: true,
                model: 'ReqAddPriceModel'
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
], AdvClass.prototype, "addAdvPrice", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "Admin details",
        path: '/',
        parameters: {
            body: {
                description: 'Body for add amenities',
                required: true,
                model: 'ReqUpdatePriceModel'
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
], AdvClass.prototype, "updateAdvPrice", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Admin details",
        path: '/',
        parameters: {
            query: {
                page: {
                    description: '1',
                    required: false,
                },
                limit: {
                    description: '10',
                    required: false,
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
], AdvClass.prototype, "fetchAdvData", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Admin details",
        path: '/home',
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
], AdvClass.prototype, "fetchAdvHomeData", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Admin details",
        path: '/{id}',
        parameters: {
            path: {
                id: {
                    description: 'mongo db',
                    required: false,
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
], AdvClass.prototype, "advDetails", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: "Admin delete adprice",
        path: '/{id}',
        parameters: {
            path: {
                id: {
                    description: 'mongo id',
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
], AdvClass.prototype, "DeleteAdPrice", null);
AdvClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/advPrice",
        name: "Admin Adverisement Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdvClass);
exports.AdminAdvPrice = new AdvClass();
//# sourceMappingURL=admin.advPrice.controller.js.map