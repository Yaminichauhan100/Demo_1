"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminNotifactionV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const admin_notification_model_1 = __importDefault(require("@models/admin.notification.model"));
const _builders_1 = __importDefault(require("@builders"));
const _services_1 = require("@services");
const _common_1 = require("@common");
const host_v1_entity_1 = require("./host.v1.entity");
const user_v1_entity_1 = require("./user.v1.entity");
const user_sessions_model_1 = __importDefault(require("@models/user_sessions.model"));
const host_session_model_1 = __importDefault(require("@models/host_session.model"));
const publisher_1 = require("./../../services/rabbitMQ/publisher");
class AdminNotificationEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async createNotification(payload) {
        try {
            let updatedPayload = await this.fetchSentCount(payload);
            let newNotification = await new this.model(updatedPayload).save();
            await this.fetchDeviceToken(payload, newNotification);
            return newNotification._id;
        }
        catch (error) {
            console.error(`we have an error in admin notification entity ==> ${error}`);
            throw error;
        }
    }
    async fetchDeviceToken(payload, newNotification) {
        try {
            switch (payload.recipientType) {
                case _common_1.ENUM.ADMIN.NOTIFICATION.RECIEVER.USERS:
                    await Promise.all([
                        publisher_1.rabbitMQController.publisherToInsertNotificationToAllUserIndb(payload),
                        publisher_1.rabbitMQController.publisherToSendPushToAllUser(payload)
                    ]);
                    break;
                case _common_1.ENUM.ADMIN.NOTIFICATION.RECIEVER.HOSTS:
                    await Promise.all([
                        publisher_1.rabbitMQController.publisherToInsertNotificationToAllHostIndb(payload),
                        publisher_1.rabbitMQController.publisherToSendPushToAllHost(payload)
                    ]);
                    break;
                case _common_1.ENUM.ADMIN.NOTIFICATION.RECIEVER.ALL:
                    await publisher_1.rabbitMQController.publisherToSendPushToAllHost(payload);
                    await publisher_1.rabbitMQController.publisherToInsertNotificationToAllHostIndb(payload);
                    await publisher_1.rabbitMQController.publisherToSendPushToAllUser(payload);
                    await publisher_1.rabbitMQController.publisherToInsertNotificationToAllUserIndb(payload);
                    break;
                case _common_1.ENUM.ADMIN.NOTIFICATION.RECIEVER.APP:
                    await Promise.all([
                        publisher_1.rabbitMQController.publisherToSendPushToAllHost(payload),
                        publisher_1.rabbitMQController.publisherToInsertNotificationToAllHostIndb(payload),
                        publisher_1.rabbitMQController.publisherToSendPushToAllUser(payload),
                        publisher_1.rabbitMQController.publisherToInsertNotificationToAllUserIndb(payload)
                    ]);
                    break;
                case _common_1.ENUM.ADMIN.NOTIFICATION.RECIEVER.WEB:
                    await Promise.all([
                        publisher_1.rabbitMQController.publisherToSendPushToAllHost(payload),
                        publisher_1.rabbitMQController.publisherToInsertNotificationToAllHostIndb(payload),
                        publisher_1.rabbitMQController.publisherToSendPushToAllUser(payload),
                        publisher_1.rabbitMQController.publisherToInsertNotificationToAllUserIndb(payload)
                    ]);
                    break;
                case _common_1.ENUM.ADMIN.NOTIFICATION.RECIEVER.OTHER:
                    if (payload && (payload === null || payload === void 0 ? void 0 : payload.userList.length) > 0) {
                        publisher_1.rabbitMQController.publisherToSendPushToAllUser(payload);
                        publisher_1.rabbitMQController.publisherToInsertNotificationToAllUserIndb(payload);
                    }
                    if (payload && (payload === null || payload === void 0 ? void 0 : payload.hostList.length) > 0) {
                        publisher_1.rabbitMQController.publisherToSendPushToAllHost(payload);
                        publisher_1.rabbitMQController.publisherToInsertNotificationToAllHostIndb(payload);
                    }
                    break;
            }
        }
        catch (error) {
            console.error(`we have an error ====> ${error}`);
        }
    }
    async fetchNotifications(payload) {
        try {
            payload['recipientTypeArray'] = [];
            let pipeline = await _builders_1.default.Admin.Notification.NotificationList(payload);
            let notificationList = await exports.AdminNotifactionV1.paginateAggregate(pipeline, { limit: payload && payload.limit ? payload.limit = parseInt(payload.limit) : payload.limit = 10, page: payload.page, getCount: true });
            return notificationList;
        }
        catch (error) {
            console.error(`we have an error in admin notification entity ==> ${error}`);
        }
    }
    async fetchSentCount(payload) {
        var _a, _b;
        try {
            switch (payload.recipientType) {
                case _common_1.ENUM.ADMIN.NOTIFICATION.RECIEVER.USERS:
                    payload['sentCount'] = await user_sessions_model_1.default.countDocuments({
                        isActive: true,
                        notificationEnabled: _common_1.ENUM_ARRAY.NOTIFICATION.ENABLE
                    });
                    return payload;
                case _common_1.ENUM.ADMIN.NOTIFICATION.RECIEVER.HOSTS:
                    payload['sentCount'] = await host_session_model_1.default.countDocuments({
                        isActive: true,
                        notificationEnabled: _common_1.ENUM_ARRAY.NOTIFICATION.ENABLE
                    });
                    return payload;
                case _common_1.ENUM.ADMIN.NOTIFICATION.RECIEVER.ALL:
                    let [userCount, hostCount] = await Promise.all([
                        user_sessions_model_1.default.countDocuments({
                            isActive: true,
                            notificationEnabled: _common_1.ENUM_ARRAY.NOTIFICATION.ENABLE
                        }),
                        host_session_model_1.default.countDocuments({
                            isActive: true,
                            notificationEnabled: _common_1.ENUM_ARRAY.NOTIFICATION.ENABLE
                        })
                    ]);
                    payload['sentCount'] = userCount + hostCount;
                    return payload;
                case _common_1.ENUM.ADMIN.NOTIFICATION.RECIEVER.OTHER:
                    const userListCount = (payload === null || payload === void 0 ? void 0 : payload.userList) ? (_a = payload === null || payload === void 0 ? void 0 : payload.userList) === null || _a === void 0 ? void 0 : _a.length : 0;
                    const hostListCount = (payload === null || payload === void 0 ? void 0 : payload.hostList) ? (_b = payload === null || payload === void 0 ? void 0 : payload.hostList) === null || _b === void 0 ? void 0 : _b.length : 0;
                    payload['sentCount'] = userListCount + hostListCount;
                    return payload;
            }
        }
        catch (error) {
            console.error(`we have an error ${error}`);
        }
    }
    async fetchIds(payload) {
        try {
            switch (payload.lookupType) {
                case _common_1.ENUM.ADMIN.LOOKUP_TYPE.HOST_EMAIL_IDS:
                    return await host_v1_entity_1.HostV1.findOne({ email: payload.lookupKeys }, { _id: 1 });
                case _common_1.ENUM.ADMIN.LOOKUP_TYPE.USER_EMAIL_IDS:
                    return await user_v1_entity_1.UserV1.findOne({ email: payload.lookupKeys }, { _id: 1 });
                case _common_1.ENUM.ADMIN.LOOKUP_TYPE.HOST_CONTACT_NUMBER: {
                    const phoneNumber = payload.lookupKeys.split('-');
                    return await host_v1_entity_1.HostV1.findOne({ phoneNo: phoneNumber[1], countryCode: phoneNumber[0] }, { _id: 1 });
                }
                case _common_1.ENUM.ADMIN.LOOKUP_TYPE.USER_CONTACT_NUMBER: {
                    const phoneNumber = payload.lookupKeys.split('-');
                    return await user_v1_entity_1.UserV1.findOne({ phoneNo: phoneNumber[1], countryCode: phoneNumber[0] }, { _id: 1 });
                }
                default:
                    break;
            }
        }
        catch (error) {
            console.error(`we have an error in admin notification entity ==> ${error}`);
        }
    }
    async updateNotificationDetail(payload) {
        try {
            let audienceType = await this.findOne({ _id: mongoose_1.Types.ObjectId(payload.notificationId) });
            let updatedNotificationData = await this.fetchSentCount(audienceType);
            await exports.AdminNotifactionV1.updateOne({ _id: mongoose_1.Types.ObjectId(payload._id) }, {
                $inc: { sentCount: (updatedNotificationData === null || updatedNotificationData === void 0 ? void 0 : updatedNotificationData.sentCount) ? updatedNotificationData === null || updatedNotificationData === void 0 ? void 0 : updatedNotificationData.sentCount : 0 }
            });
            let tokenArray = await this.fetchDeviceToken(audienceType);
            await _services_1.PushNotification.sendAdminPush(tokenArray, audienceType);
        }
        catch (error) {
            console.error(`we have an error in admin notification entity ==> ${error}`);
        }
    }
}
exports.AdminNotifactionV1 = new AdminNotificationEntity(admin_notification_model_1.default);
//# sourceMappingURL=admin.notification.v1.entity.js.map