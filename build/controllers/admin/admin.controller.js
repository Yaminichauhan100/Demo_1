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
exports.AdminController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _entity_1 = require("@entity");
const _baseController_1 = __importDefault(require("@baseController"));
const _services_1 = require("@services");
const _common_1 = require("@common");
const mongoose_1 = require("mongoose");
let AdminClass = class AdminClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async singleAdmin(req, res, next) {
        try {
            let adminId = res.locals.adminId, singleAdminData = await _entity_1.AdminV1.findOne({ _id: adminId });
            if (singleAdminData) {
                this.sendResponse(res, _common_1.SUCCESS.DEFAULT, _entity_1.AdminV1.filterAdminData(singleAdminData));
            }
            else
                this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async updateAdmin(req, res, next) {
        try {
            let adminId = res.locals.adminId, payload = req.body, updatedAdmin = await _entity_1.AdminV1.updateEntity({ _id: adminId }, payload);
            if (updatedAdmin.data) {
                this.sendResponse(res, _common_1.SUCCESS.DEFAULT, _entity_1.AdminV1.filterAdminData(updatedAdmin.data));
            }
            else
                this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async changePassword(req, res, next) {
        try {
            let adminId = res.locals.adminId, payload = req.body, singleAdminData = await _entity_1.AdminV1.findOne({ _id: adminId });
            if (singleAdminData) {
                if (await _entity_1.AdminV1.verifyPassword(singleAdminData, payload.oldPassword)) {
                    await _entity_1.AdminV1.updateEntity({ _id: adminId }, { password: _services_1.Auth.hashData(payload.newPassword, singleAdminData.salt) });
                    this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
                    _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.ADMIN.PASSWORD_CHANGE(singleAdminData.email));
                }
                else
                    this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).INCORRECT_OLD_PASSWORD);
            }
            else
                this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async adminLogout(req, res, next) {
        try {
            let adminId = res.locals.adminId, adminSessionId = res.locals.adminSessionId, checkAdminExists = await _entity_1.AdminV1.findOne({ _id: adminId });
            if (checkAdminExists) {
                await _entity_1.AdminV1.removePreviousSession(adminSessionId, false);
                this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
            }
            else
                this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async getDashBoardCount(req, res, next) {
        try {
            let query = req.query;
            let [userCount, ratingCount, propertyCount, onGoingBookingCount, totalBookingCount, revenueCount] = await Promise.all([
                _entity_1.UserV1.getUserCount(query),
                _entity_1.RatingV1.getRatingCount(query),
                _entity_1.PropertyV1.getPropertyCount(query),
                _entity_1.BookingV1.getBookingCount(Object.assign(Object.assign({}, query), { status: 0 })),
                _entity_1.BookingV1.getTotalBookingCount(Object.assign({}, query)),
                _entity_1.BookingV1.fetchTotalRevenue(Object.assign({}, query)),
                _entity_1.PayV1.fetchTotalPayout(Object.assign({}, query))
            ]);
            let response = {
                userCount: userCount,
                ratingCount: ratingCount,
                propertyCount: propertyCount,
                onGoingBookingCount: onGoingBookingCount,
                totalBookingCount: totalBookingCount,
                totalRevenue: revenueCount.totalPayment,
                totalPayout: 0
            };
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async getContactUsList(req, res, next) {
        try {
            let payload = req.query;
            payload && payload.limit ? payload.limit = payload.limit : payload.limit = 10;
            let pipeline = [];
            if (payload === null || payload === void 0 ? void 0 : payload.search) {
                pipeline.push({
                    $match: {
                        $or: [
                            { name: { $regex: payload.search, $options: "si" } },
                            { email: { $regex: payload.search, $options: "si" } }
                        ]
                    }
                });
            }
            if (payload.fromDate) {
                pipeline.push({
                    $match: {
                        $and: [
                            { createdAt: { $lte: new Date(payload.toDate) } },
                            { createdAt: { $gte: new Date(payload.fromDate) } }
                        ]
                    }
                });
            }
            pipeline.push({
                $match: {
                    "name": { $exists: true }
                }
            }, {
                "$lookup": {
                    "from": "booking",
                    "let": { "bookingId": "$bookingId" },
                    "pipeline": [
                        {
                            '$match': {
                                $and: [
                                    { $expr: { $eq: ['$_id', '$$bookingId'] } }
                                ]
                            }
                        },
                        { $project: { bookingId: 1, _id: 1 } }
                    ],
                    "as": "bookingData"
                }
            }, {
                '$unwind': {
                    path: '$bookingData',
                    preserveNullAndEmptyArrays: true
                }
            });
            if (payload.sort) {
                pipeline.push({ $sort: { createdAt: payload.sort } });
            }
            else {
                pipeline.push({ $sort: { createdAt: -1 } });
            }
            let data = await _entity_1.ContactV1.paginateAggregate(pipeline, Object.assign(Object.assign({}, payload), { getCount: true }));
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
    async contactUsInfo(req, res, next) {
        try {
            let payload = req.query;
            let pipeline = [
                {
                    $match: {
                        _id: mongoose_1.Types.ObjectId(payload.id)
                    }
                },
                {
                    "$lookup": {
                        "from": "booking",
                        "let": { "bookingId": "$bookingId" },
                        "pipeline": [
                            {
                                '$match': {
                                    $and: [
                                        { $expr: { $eq: ['$_id', '$$bookingId'] } }
                                    ]
                                }
                            },
                            { $project: { bookingId: 1, } }
                        ],
                        "as": "bookingData"
                    }
                },
                {
                    '$unwind': {
                        path: '$bookingData',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        bookingId: 0,
                    }
                }
            ];
            let data = await _entity_1.ContactV1.basicAggregate(pipeline);
            data && data.length ? data = data[0] : data = {};
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
    async updateResolutionStatus(req, res, next) {
        try {
            let payload = req.body;
            await _entity_1.ContactV1.updateEntity({ _id: mongoose_1.Types.ObjectId(payload.contactUsId) }, { resolutionStatus: payload.resolutionStatus });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Admin details",
        path: '/details',
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
], AdminClass.prototype, "singleAdmin", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "Admin update profile",
        path: '/update',
        parameters: {
            body: {
                description: 'Body for admin reset password',
                required: true,
                model: 'ReqAdminUpdateProfile'
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
], AdminClass.prototype, "updateAdmin", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "User Verify Otp",
        path: '/password',
        parameters: {
            body: {
                description: 'Body for admin reset password',
                required: true,
                model: 'ReqAdminChangePassword'
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
], AdminClass.prototype, "changePassword", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "Admin logout",
        path: '/logout',
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
], AdminClass.prototype, "adminLogout", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "admin Gift Card Listing",
        path: '/dashboard',
        parameters: {
            query: {
                fromDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                toDate: {
                    description: '2020-03-01T10:30:49.426Z',
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
], AdminClass.prototype, "getDashBoardCount", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Contact listing",
        path: '/contactUs',
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
], AdminClass.prototype, "getContactUsList", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Contact info",
        path: '/contactUs/info',
        parameters: {
            query: {
                id: {
                    description: '1',
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
], AdminClass.prototype, "contactUsInfo", null);
AdminClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins",
        name: "Admin Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminClass);
exports.AdminController = new AdminClass();
//# sourceMappingURL=admin.controller.js.map