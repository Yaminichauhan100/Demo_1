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
exports.AdminNotificationController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const mongoose_1 = require("mongoose");
let AdminNotificationControllerClass = class AdminNotificationControllerClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async createNotification(req, res, next) {
        try {
            let payload = req.body;
            let response = await _entity_1.AdminNotifactionV1.createNotification(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`We have an error in admin notification module ==> ${error}`);
            next(error);
        }
    }
    async updateNotification(req, res, next) {
        try {
            let payload = req.body;
            _entity_1.AdminNotifactionV1.updateNotificationDetail(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (error) {
            console.error(`We have an error in admin notification module ==> ${error}`);
            next(error);
        }
    }
    async fetchNotification(req, res, next) {
        try {
            let payload = req.query;
            let response = await _entity_1.AdminNotifactionV1.fetchNotifications(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`We have an error in admin notification module ==> ${error}`);
            next(error);
        }
    }
    async lookupIds(req, res, next) {
        try {
            let payload = req.query;
            let response = await _entity_1.AdminNotifactionV1.fetchIds(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`We have an error in admin notification module ==> ${error}`);
            throw error;
        }
    }
    async fetchNotificationDetail(req, res, next) {
        try {
            let { notificationId } = req.params;
            let notificationDetail = await _entity_1.AdminNotifactionV1.findOne({ _id: mongoose_1.Types.ObjectId(notificationId) });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, notificationDetail);
        }
        catch (error) {
            console.error(`We have an error in admin notification module ==> ${error}`);
            next(error);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Add admin notification",
        path: '',
        parameters: {
            body: {
                description: 'Body for add notification',
                required: true,
                model: 'ReqAddNotificationModel'
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
], AdminNotificationControllerClass.prototype, "createNotification", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Add admin notification",
        path: '',
        parameters: {
            body: {
                description: 'Body for add notification',
                required: true,
                model: 'ReqUpdateNotificationModel'
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
], AdminNotificationControllerClass.prototype, "updateNotification", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Admin Notification listing",
        path: '',
        parameters: {
            query: {
                page: {
                    description: '1',
                    required: true,
                },
                limit: {
                    description: '10',
                    required: false,
                },
                search: {
                    description: 'searchkey',
                    required: false,
                },
                sort: {
                    description: '-1/1',
                    required: false,
                },
                recipientType: {
                    description: '[1,2,3]  array of number',
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
], AdminNotificationControllerClass.prototype, "fetchNotification", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get user id by email Id",
        path: '/lookup',
        parameters: {
            query: {
                lookupType: {
                    description: 'contactNumber',
                    required: false,
                },
                lookupKeys: {
                    description: 'emailIds or Phone no',
                    required: false,
                }
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
], AdminNotificationControllerClass.prototype, "lookupIds", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get Notification detail by notification Id",
        path: '{notificationId}',
        parameters: {
            path: {
                notificationId: {
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
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AdminNotificationControllerClass.prototype, "fetchNotificationDetail", null);
AdminNotificationControllerClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/notification",
        name: "Admin Bulk Notification Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminNotificationControllerClass);
exports.AdminNotificationController = new AdminNotificationControllerClass();
//# sourceMappingURL=admin.notification.controller.js.map