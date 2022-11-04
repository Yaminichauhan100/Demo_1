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
exports.UserPaymentController = void 0;
const _baseController_1 = __importDefault(require("@baseController"));
const swagger_express_ts_1 = require("swagger-express-ts");
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const mongoose_1 = require("mongoose");
const moment_1 = __importDefault(require("moment"));
const _services_1 = require("@services");
let UserPaymentClass = class UserPaymentClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async updatePaymentPlan(req, res, next) {
        var _a, _b;
        try {
            const { bookingId, paymentPlan } = req.body;
            let bookingDetails = await _entity_1.BookingV1.updateDocument({
                _id: mongoose_1.Types.ObjectId(bookingId),
                "propertyData.autoAcceptUpcomingBooking": true
            }, {
                paymentPlan: paymentPlan,
                paymentStatus: _common_1.ENUM.PAYMENT.STATUS.SUCCESS,
                bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED,
                acceptedOn: moment_1.default()
            });
            _entity_1.PropertyV1.updateOne({ _id: mongoose_1.Types.ObjectId((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyData) === null || _a === void 0 ? void 0 : _a.propertyId) }, {
                $inc: {
                    totalBookingsCount: 1,
                    averageDuration: (_b = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.bookingDuration) === null || _b === void 0 ? void 0 : _b.totalDays,
                    unitsBooked: parseInt(bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.quantity)
                }
            });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async fetchPaymentPlanAndPricing(req, res, next) {
        try {
            let payload = req.query;
            let response = await _entity_1.BookingV1.fetchPaymentPlanAndPrice(payload);
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, { paymentOptions: response });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async proceedPayment(req, res, next) {
        try {
            let payload = req.body;
            await _entity_1.BookingV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.bookingId) }, { paymentStatus: _common_1.ENUM.PAYMENT.STATUS.SUCCESS });
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async fetchInvoice(req, res, next) {
        try {
            let payload = req.query;
            await _services_1.GeneratePdf.invoice(payload.bookingId);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async fetchPlan(req, res, next) {
        try {
            let payload = req.query;
            let response = await _entity_1.PayV1.fetchPaymentPlans(payload.bookingId);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Complete abandoned booking",
        path: '/paymentPlan',
        parameters: {
            body: {
                description: 'Body for update payment plan',
                required: true,
                model: 'ReqUpdatePaymentPlanModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserPaymentClass.prototype, "updatePaymentPlan", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get paymentPlan id",
        path: '/paymentPlan',
        parameters: {
            query: {
                bookingId: {
                    description: 'bookingId type mongoId',
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
], UserPaymentClass.prototype, "fetchPaymentPlanAndPricing", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Complete abandoned booking",
        path: '/proceedPayment',
        parameters: {
            body: {
                description: 'bookingId _id',
                required: true,
                model: 'ReqProceedPaymentModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserPaymentClass.prototype, "proceedPayment", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Complete abandoned booking",
        path: '/invoice',
        parameters: {
            body: {
                description: 'bookingId _id',
                required: true,
                model: 'ReqProceedPaymentModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserPaymentClass.prototype, "fetchInvoice", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "View Plan",
        path: '/viewPlan?',
        parameters: {
            query: {
                bookingId: {
                    description: 'bookingId type mongoId',
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
], UserPaymentClass.prototype, "fetchPlan", null);
UserPaymentClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/user/payment",
        name: "User Payment Module",
        security: {
            apiKeyHeader: []
        },
    }),
    __metadata("design:paramtypes", [])
], UserPaymentClass);
exports.UserPaymentController = new UserPaymentClass();
//# sourceMappingURL=user.payment.controller.js.map