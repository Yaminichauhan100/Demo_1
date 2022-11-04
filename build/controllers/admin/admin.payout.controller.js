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
exports.AdminPayoutController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _builders_1 = __importDefault(require("@builders"));
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const mongoose_1 = require("mongoose");
const _services_1 = require("@services");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(_common_1.CONFIG.STRIPE.SECRET_KEY, {
    apiVersion: '2020-03-02',
    typescript: true,
});
let AdminPayoutClass = class AdminPayoutClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async getPayoutListing(req, res, next) {
        try {
            let payload = req.query;
            let pipeline = await _builders_1.default.Admin.Payout.payoutList(payload);
            let details = await _entity_1.PayV1.paginateAggregate(pipeline, Object.assign(Object.assign({}, payload), { getCount: true }));
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, details);
        }
        catch (err) {
            next(err);
        }
    }
    async payOut(req, res, next) {
        try {
            let host = await _entity_1.HostV1.findOne({ '_id': req.params.hostId });
            let adminCommissionAmount = (host === null || host === void 0 ? void 0 : host.commissionAmount) ? host.commissionAmount : 10;
            let hostAmount = (100 - adminCommissionAmount) / 100;
            if (host.stripeAccountId) {
                let pipeline = await _builders_1.default.Admin.Payout.payoutHostList(host._id);
                let list = await _entity_1.PayV1.basicAggregate(pipeline);
                let totalAmount = 0;
                let bookingIds = [];
                let paymentIds = [];
                if (list.length > 0) {
                    for (let i = 0; i < list.length; i++) {
                        totalAmount = totalAmount + list[i]['price'];
                        bookingIds.push(mongoose_1.Types.ObjectId(list[i]['bookingId']));
                        paymentIds.push(mongoose_1.Types.ObjectId(list[i]['_id']));
                    }
                    console.log("===>>>>>>>>>>> host amount", hostAmount);
                    console.log("===>>>>>>>>>>>>>>>> total amount calulated", totalAmount);
                    console.log("==>>>>>>>>>>>>> calculated amount payout", Math.round((totalAmount * hostAmount * 100)));
                    const payout = await stripe.payouts.create({
                        amount: Math.round((totalAmount * hostAmount) / 100),
                        currency: 'eur'
                    }, {
                        stripeAccount: host.stripeAccountId,
                    });
                    let stripePayoutId = _services_1.generateUniqueId(`DSKPAY`);
                    if (payout) {
                        await _entity_1.PayV1.update({ _id: { $in: paymentIds } }, { payoutStatus: true, payoutStripeId: stripePayoutId }, { multi: true });
                        await _entity_1.PayoutV1.createOne({
                            hostId: mongoose_1.Types.ObjectId(host._id),
                            adminCommissionAmount: Math.round((totalAmount * adminCommissionAmount) / 100),
                            hostAmount: Math.round((totalAmount * hostAmount * 100)),
                            status: _common_1.ENUM.PAYOUT.STATUS.SUCCESS,
                            payoutId: stripePayoutId,
                            bookingId: bookingIds,
                        });
                        return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
                    }
                    else
                        return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).NOT_FOUND);
                }
                else
                    return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).NO_PAYOUT_AMOUNT);
            }
            else
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).STRIPE_NOT_SETUP);
        }
        catch (err) {
            console.error(`we have an error in payout api ==> ${err}`);
            next(err);
        }
    }
    async bulkPayout(req, res, next) {
        try {
            const payload = req.body;
            let hostIds = payload.hostIds;
            for (let i = 0; i < hostIds.length; i++) {
                const hostId = hostIds[i];
                const host = await _entity_1.HostV1.findOne({ '_id': mongoose_1.Types.ObjectId(hostId) });
                let adminCommissionAmount = (host === null || host === void 0 ? void 0 : host.commissionAmount) ? host.commissionAmount : 10;
                let hostAmount = 100 - adminCommissionAmount;
                if (host === null || host === void 0 ? void 0 : host.stripeAccountId) {
                    let pipeline = await _builders_1.default.Admin.Payout.payoutHostList(host._id);
                    let list = await _entity_1.PayV1.basicAggregate(pipeline);
                    let totalAmount = 0;
                    let bookingIds = [];
                    let paymentIds = [];
                    if (list.length) {
                        for (let i = 0; i < list.length; i++) {
                            totalAmount += list[i]['price'];
                            bookingIds.push(mongoose_1.Types.ObjectId(list[i]['bookingId']));
                            paymentIds.push(mongoose_1.Types.ObjectId(list[i]['_id']));
                        }
                        const payout = await stripe.payouts.create({
                            amount: Math.round((totalAmount * hostAmount) / 100),
                            currency: 'eur',
                            method: 'instant',
                        }, {
                            stripeAccount: host === null || host === void 0 ? void 0 : host.stripeAccountId,
                        });
                        let stripePayoutId = payout.id;
                        if (payout) {
                            await _entity_1.PayV1.update({ _id: { $in: paymentIds } }, { payoutStatus: true, payoutStripeId: stripePayoutId }, { multi: true });
                            await _entity_1.PayoutV1.createOne({
                                hostId: mongoose_1.Types.ObjectId(host._id),
                                adminCommissionAmount: Math.round((totalAmount * adminCommissionAmount) / 100),
                                hostAmount: Math.round((totalAmount * hostAmount) / 100),
                                status: _common_1.ENUM.PAYOUT.STATUS.SUCCESS,
                                payoutId: stripePayoutId,
                                bookingId: bookingIds,
                            });
                            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
                        }
                        else
                            return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).NOT_FOUND);
                    }
                    else
                        return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).NOT_FOUND);
                }
                else
                    return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).STRIPE_NOT_SETUP);
            }
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
    async fetchPayoutRequests(req, res, next) {
        try {
            let payload = req.query;
            let pipeline = await _builders_1.default.Admin.Payout.payoutRequestList(payload);
            let response = await _entity_1.PayoutV1.paginateAggregate(pipeline, Object.assign(Object.assign({}, payload), { getCount: true }));
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
    async getPayoutLogs(req, res, next) {
        try {
            let payload = req.query;
            let pipeline = await _builders_1.default.Admin.Payout.payoutLogs(payload);
            let details = await _entity_1.PayoutV1.paginateAggregate(pipeline, Object.assign(Object.assign({}, payload), { getCount: true }));
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, details);
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "payout details",
        path: '/list',
        parameters: {
            query: {
                page: {
                    description: '1',
                    required: false,
                },
                limit: {
                    description: '10',
                    required: false,
                },
                search: {
                    description: 'searchkey',
                    required: false,
                },
            },
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
], AdminPayoutClass.prototype, "getPayoutListing", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Activate",
        path: '/{hostId}/payOut',
        parameters: {
            path: {
                hostId: {
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
], AdminPayoutClass.prototype, "payOut", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Activate",
        path: '/bulk?',
        parameters: {
            query: {
                hostId: {
                    description: 'mongoId by comma separated',
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
], AdminPayoutClass.prototype, "bulkPayout", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "payout details",
        path: '/requests',
        parameters: {
            query: {
                page: {
                    description: '1',
                    required: false,
                },
                limit: {
                    description: '10',
                    required: false,
                },
                search: {
                    description: 'searchkey',
                    required: false,
                },
            },
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
], AdminPayoutClass.prototype, "fetchPayoutRequests", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "payout details",
        path: '/payoutLogs',
        parameters: {
            query: {
                page: {
                    description: '1',
                    required: false,
                },
                limit: {
                    description: '10',
                    required: false,
                },
                search: {
                    description: 'searchkey',
                    required: false,
                },
                fromDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                toDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                minAmount: {
                    description: 'min:1,max:100',
                    required: false,
                },
                maxAmount: {
                    description: 'min:1,max:100',
                    required: false,
                },
                sortkey: {
                    description: 'send -1/1',
                    required: false
                }
            },
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
], AdminPayoutClass.prototype, "getPayoutLogs", null);
AdminPayoutClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/payout",
        name: "Admin Payout",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminPayoutClass);
exports.AdminPayoutController = new AdminPayoutClass();
//# sourceMappingURL=admin.payout.controller.js.map