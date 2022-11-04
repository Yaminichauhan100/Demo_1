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
exports.UserGiftcardController = void 0;
const _baseController_1 = __importDefault(require("@baseController"));
const swagger_express_ts_1 = require("swagger-express-ts");
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const mongoose_1 = require("mongoose");
const _services_1 = require("@services");
let UserGiftcardClass = class UserGiftcardClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async sendGiftCard(req, res, next) {
        try {
            let payload = req.body;
            payload.originalAmount = req.body.amount;
            payload.giftCardNo = _services_1.generateGiftCardNumber();
            payload.giftCardPin = _services_1.generatePin();
            payload.buyerId = mongoose_1.Types.ObjectId(res.locals.userId);
            let response = await _entity_1.GiftV1.insertGiftCard(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
    async listGiftCard(req, res, next) {
        try {
            let params = req.query;
            let buyerId = res.locals.userId;
            let response = await _entity_1.GiftV1.giftCardListing(Object.assign(Object.assign({}, params), { buyerId }));
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async listMyGiftCard(req, res, next) {
        try {
            let params = req.query;
            params['userId'] = res.locals.userId;
            let response = await _entity_1.GiftV1.userGiftCardListing(params);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
    async getAmounts(req, res, next) {
        try {
            let response = await _entity_1.ConfigV1.findOne({ type: _common_1.ENUM.CONFIG.TYPE.AMOUNT }, { data: 1 });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async redeemGiftCard(req, res, next) {
        var _a;
        try {
            const payload = req.body;
            const userId = res.locals.userId;
            const [giftCardDetails, bookingDetails] = await Promise.all([
                _entity_1.GiftV1.findOne({
                    _id: payload.giftCardId
                }),
                _entity_1.BookingV1.findOne({
                    _id: payload.bookingId,
                    bookingStatus: _common_1.ENUM.BOOKING.STATUS.ABANDONED
                }, { totalPayable: 1 })
            ]);
            if (!giftCardDetails) {
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).INVALID_REDEMPTION_CODE);
            }
            giftCardDetails.redemptionStatus == _common_1.ENUM.GIFT_CARD.REDEMPTION_STATUS.FULLY_REDEEMED
                ? this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).ALREADY_REDEEMED) : "";
            let booking = await _entity_1.GiftV1.redeemGiftCard(payload, userId, giftCardDetails, bookingDetails);
            if (((_a = booking === null || booking === void 0 ? void 0 : booking.bookingDuration) === null || _a === void 0 ? void 0 : _a.months) >= 2) {
                await _entity_1.PayV1.updateRecurringModel(booking);
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
    async removeGiftCard(req, res, next) {
        try {
            const payload = req.query;
            _entity_1.BookingV1.removeMultipleFields({ _id: mongoose_1.Types.ObjectId(payload.bookingId) }, {
                $unset: {
                    giftCardId: "",
                    giftCardAmount: "",
                    giftCardStatus: "",
                    giftCardNo: ""
                }
            });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
    async fetchGiftCard(req, res, next) {
        try {
            const payload = req.query;
            const userId = res.locals.userId;
            const giftCardDetails = await _entity_1.GiftV1.findOne({
                giftCardNo: payload === null || payload === void 0 ? void 0 : payload.giftCardNumber,
                giftCardPin: payload === null || payload === void 0 ? void 0 : payload.giftCardPin
            }, { transactionDetails: 0, updatedAt: 0, createdAt: 0 });
            if (!giftCardDetails) {
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).INVALID_REDEMPTION_CODE);
            }
            switch (giftCardDetails.redemptionStatus) {
                case _common_1.ENUM.GIFT_CARD.REDEMPTION_STATUS.FULLY_REDEEMED:
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).ALREADY_REDEEMED);
                case _common_1.ENUM.GIFT_CARD.REDEMPTION_STATUS.PARTIALLY_REDEEMED:
                    const validation = await _entity_1.GiftV1.validateUserAuth(userId, giftCardDetails);
                    if (validation == false) {
                        return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).INVALID_REDEMPTION_CODE);
                    }
                    break;
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, giftCardDetails);
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
    async checkOutUsingGiftCard(req, res, next) {
        try {
            const payload = req.body;
            let [bookingDetail, giftCardDetail] = await Promise.all([
                _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.bookingId), bookingStatus: _common_1.ENUM.BOOKING.STATUS.ABANDONED }),
                _entity_1.GiftV1.findOne({ giftCardNo: payload.giftCardNo })
            ]);
            if (!bookingDetail) {
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).INVALID_BOOKING_ID);
            }
            giftCardDetail.redemptionStatus == _common_1.ENUM.GIFT_CARD.REDEMPTION_STATUS.FULLY_REDEEMED
                ? this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).ALREADY_REDEEMED) : "";
            await _entity_1.GiftV1.giftCardCheckout(bookingDetail, giftCardDetail);
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, { bookingId: payload.bookingId });
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "User Update Profile",
        path: '/send',
        parameters: {
            body: {
                description: 'Body for update user profile',
                required: true,
                model: 'ReqSendUserdGiftCardModel'
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
], UserGiftcardClass.prototype, "sendGiftCard", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "gift card listing",
        path: '/',
        parameters: {
            query: {
                startDate: {
                    description: 'startDate',
                    required: false,
                },
                endDate: {
                    description: 'endDate',
                    required: false,
                },
                page: {
                    description: '1',
                    required: true,
                },
                limit: {
                    description: '10',
                    required: false,
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
], UserGiftcardClass.prototype, "listGiftCard", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "gift card listing",
        path: '/myCards',
        parameters: {
            query: {
                startDate: {
                    description: 'startDate',
                    required: false,
                },
                endDate: {
                    description: 'endDate',
                    required: false,
                },
                page: {
                    description: '1',
                    required: true,
                },
                limit: {
                    description: '10',
                    required: false,
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
], UserGiftcardClass.prototype, "listMyGiftCard", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "gift card listing",
        path: '/get-amount',
        parameters: {},
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
], UserGiftcardClass.prototype, "getAmounts", null);
UserGiftcardClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/user/giftCard",
        name: "User giftcard Module",
        security: {
            apiKeyHeader: []
        },
    }),
    __metadata("design:paramtypes", [])
], UserGiftcardClass);
exports.UserGiftcardController = new UserGiftcardClass();
//# sourceMappingURL=user.giftcard.controller.js.map