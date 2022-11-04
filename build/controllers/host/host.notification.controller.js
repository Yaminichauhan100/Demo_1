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
exports.HostNotificationController = void 0;
const _baseController_1 = __importDefault(require("@baseController"));
const swagger_express_ts_1 = require("swagger-express-ts");
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const mongoose_1 = require("mongoose");
const host_session_model_1 = __importDefault(require("@models/host_session.model"));
let HostNotificationClass = class HostNotificationClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async toggleNotification(req, res, next) {
        try {
            let payload = req.body;
            let userId = res.locals.userId;
            Promise.all([
                _entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(userId) }, { notificationEnabled: parseInt(payload.notificationEnabled) }),
                host_session_model_1.default.updateMany({
                    userId: mongoose_1.Types.ObjectId(userId)
                }, {
                    notificationEnabled: parseInt(payload.notificationEnabled)
                }, { multi: true })
            ]);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async toggleEmailNotification(req, res, next) {
        try {
            let payload = req.body;
            let userId = res.locals.userId;
            Promise.all([
                _entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(userId) }, { mailNotificationEnabled: parseInt(payload.mailNotificationEnabled) }),
                host_session_model_1.default.updateMany({
                    userId: mongoose_1.Types.ObjectId(userId)
                }, {
                    mailNotificationEnabled: parseInt(payload.mailNotificationEnabled)
                }, { multi: true })
            ]);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async userNotificationList(req, res, next) {
        try {
            let query = req.query;
            let userId = res.locals.userId;
            let pipeline = await _entity_1.NotificationV1.getNotificationListing(Object.assign(Object.assign({}, query), { userId }));
            let result = await _entity_1.NotificationV1.paginateAggregate(pipeline, { getCount: true, limit: query && query.limit ? query.limit = parseInt(query.limit) : query.limit = 10, page: query.page });
            let unReadCount = await _entity_1.NotificationV1.count({ receiverId: mongoose_1.Types.ObjectId(userId), isRead: false });
            result['unreadCount'] = unReadCount;
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, result);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async markAsRead(req, res, next) {
        try {
            let payload = req.body;
            let userId = res.locals.userId;
            if (payload && payload.notificationId)
                _entity_1.NotificationV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.notificationId) }, { isRead: true });
            else
                _entity_1.NotificationV1.updateEntity({ receiverId: mongoose_1.Types.ObjectId(userId) }, { isRead: true }, { multi: true });
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async deleteNotification(req, res, next) {
        try {
            let payload = req.query;
            let userId = res.locals.userId;
            if (payload && payload.notificationId)
                await _entity_1.NotificationV1.remove({ _id: mongoose_1.Types.ObjectId(payload.notificationId) });
            else
                await _entity_1.NotificationV1.removeAll({ receiverId: userId });
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Toggle host notification control",
        path: '/toggleNotification',
        parameters: {
            body: {
                description: 'Body for update toggle notification',
                required: true,
                model: 'ReqUpdateNotificationToggle'
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
], HostNotificationClass.prototype, "toggleNotification", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Toggle host notification email control",
        path: '/toggleEmailNotification',
        parameters: {
            body: {
                description: 'Body for update toggle email notification',
                required: true,
                model: 'ReqUpdateNotificationEmailToggle'
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
], HostNotificationClass.prototype, "toggleEmailNotification", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Notification Listing",
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
], HostNotificationClass.prototype, "userNotificationList", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Mark As Read",
        path: '/markRead',
        parameters: {
            body: {
                description: 'Mark Notificationc Read',
                required: false,
                model: 'ReqNotificationModel'
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
], HostNotificationClass.prototype, "markAsRead", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: "Delete Notification",
        path: '',
        parameters: {
            path: {
                notificationId: {
                    description: 'notificationId',
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
], HostNotificationClass.prototype, "deleteNotification", null);
HostNotificationClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/host/notification",
        name: "Host Notification Module",
        security: {
            apiKeyHeader: []
        },
    }),
    __metadata("design:paramtypes", [])
], HostNotificationClass);
exports.HostNotificationController = new HostNotificationClass();
//# sourceMappingURL=host.notification.controller.js.map