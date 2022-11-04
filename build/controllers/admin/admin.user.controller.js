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
exports.AdminUserController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _builders_1 = __importDefault(require("@builders"));
const _entity_1 = require("@entity");
const _common_1 = require("@common");
const host_session_model_1 = __importDefault(require("@models/host_session.model"));
const mongoose_1 = require("mongoose");
let AdminUserClass = class AdminUserClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async getUsers(req, res, next) {
        try {
            let payload = req.query;
            let pipeline = await _builders_1.default.Admin.User.UserList(payload);
            let usersList = await _entity_1.UserV1.paginateAggregate(pipeline, Object.assign(Object.assign({}, payload), { getCount: true }));
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, usersList);
        }
        catch (err) {
            next(err);
        }
    }
    async blockUsers(req, res, next) {
        try {
            let user = await _entity_1.UserV1.findOne({ _id: req.params.userId }, { _id: 1 });
            if (!user)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
            await Promise.all([
                _entity_1.UserV1.updateDocument({ _id: user._id }, { status: _common_1.ENUM.USER.STATUS.BLOCK }),
                host_session_model_1.default.deleteMany({ userId: mongoose_1.Types.ObjectId(user._id) })
            ]);
            return await this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).USER_BLOCKED_SUCCESSFULLY);
        }
        catch (err) {
            next(err);
        }
    }
    async unblockUsers(req, res, next) {
        try {
            let user = await _entity_1.UserV1.findOne({ _id: req.params.userId }, { _id: 1, status: 1 });
            if (!user)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
            await _entity_1.UserV1.updateDocument({ _id: user._id }, { status: _common_1.ENUM.USER.STATUS.ACTIVE });
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).USER_UNBLOCKED_SUCCESSFULLY);
        }
        catch (err) {
            next(err);
        }
    }
    async deleteUsers(req, res, next) {
        try {
            let user = await _entity_1.UserV1.findOne({ _id: req.params.userId });
            if (!user)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
            await _entity_1.UserV1.updateDocument({ _id: user._id }, { status: _common_1.ENUM.USER.STATUS.ISDELETE });
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).USER_DELETED_SUCCESSFULLY);
        }
        catch (err) {
            next(err);
        }
    }
    async userDetails(req, res, next) {
        try {
            let payload = req.params;
            let pipeline = _builders_1.default.Admin.User.UserDetails(payload.userId);
            let details = await _entity_1.UserV1.basicAggregate(pipeline);
            if (details)
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, details);
            else
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "User listing",
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
                companyType: {
                    description: 'company/individual',
                    required: false,
                },
                regStartDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                regEndDate: {
                    description: '2021-04-01T10:30:49.426Z',
                    required: false,
                },
                minBooking: {
                    description: '0',
                    required: false,
                },
                maxBooking: {
                    description: '100',
                    required: false,
                },
                sortKey: {
                    description: 'name/noOfBooking/createdAt',
                    required: false,
                },
                sortOrder: {
                    description: '-1/1',
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
], AdminUserClass.prototype, "getUsers", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "User Block",
        path: '/{userId}/block',
        parameters: {
            path: {
                userId: {
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
], AdminUserClass.prototype, "blockUsers", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "User Unblock",
        path: '/{userId}/unblock',
        parameters: {
            path: {
                userId: {
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
], AdminUserClass.prototype, "unblockUsers", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: "User Delete",
        path: '/{userId}/delete',
        parameters: {
            path: {
                userId: {
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
], AdminUserClass.prototype, "deleteUsers", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "User Details",
        path: '/{userId}/details',
        parameters: {
            path: {
                userId: {
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
], AdminUserClass.prototype, "userDetails", null);
AdminUserClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/users",
        name: "Admin User Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminUserClass);
exports.AdminUserController = new AdminUserClass();
//# sourceMappingURL=admin.user.controller.js.map