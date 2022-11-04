"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotification = void 0;
const firebase_admin_1 = require("firebase-admin");
const path_1 = require("path");
const _common_1 = require("@common");
const _entity_1 = require("@entity");
class PushModule {
    constructor() {
        this.app = firebase_admin_1.initializeApp({
            credential: firebase_admin_1.credential.cert(path_1.resolve(process.cwd(), 'bin/firebase.json')),
        });
        this.messaging = this.app.messaging();
    }
    async sendPush(registrationTokens, payload, options = {}) {
        try {
            if (registrationTokens.length <= 0) {
                return;
            }
            let notificationData = await this.messaging.sendToDevice(registrationTokens, payload, options);
            console.log(`send notification results ===>`, notificationData.results);
        }
        catch (error) {
            console.error(`We have an error while triggering push => ${error}`);
        }
    }
    async sendBookingRequestPushNotification(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyData) === null || _a === void 0 ? void 0 : _a.name);
            let notificationData = {
                data: {
                    type: payload.TYPE.BOOKING_REQUEST_USER.toString(),
                    title: payload.TITLE.BOOKING_REQUEST_USER,
                    body: payload.BODY.BOOKING_REQUEST_USER,
                    bookingId: bookingDetails._id.toString(),
                },
                notification: {
                    type: payload.TYPE.BOOKING_REQUEST_USER.toString(),
                    title: payload.TITLE.BOOKING_REQUEST_USER,
                    body: payload.BODY.BOOKING_REQUEST_USER,
                    bookingId: bookingDetails._id.toString(),
                    redirectionUrl: `${_common_1.BASE.URL}/profile/booking/detail/${bookingDetails._id}}`
                }
            };
            let inAppPayload = {
                type: payload.TYPE.BOOKING_REQUEST_USER,
                title: payload.TITLE.BOOKING_REQUEST_USER,
                message: payload.BODY.BOOKING_REQUEST_USER,
                receiverId: bookingDetails.userData.userId,
                bookingId: bookingDetails._id
            };
            await _entity_1.NotificationV1.createNotification(inAppPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async sendUserBookingSuccessPushNotification(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyData) === null || _a === void 0 ? void 0 : _a.name);
            let notificationData = {
                data: {
                    type: payload.TYPE.BOOKING_SUCCESS.toString(),
                    title: payload.TITLE.BOOKING_SUCCESS,
                    body: payload.BODY.BOOKING_SUCCESS,
                    bookingId: bookingDetails._id.toString()
                },
                notification: {
                    bookingId: bookingDetails._id.toString(),
                    type: payload.TYPE.BOOKING_SUCCESS.toString(),
                    title: payload.TITLE.BOOKING_SUCCESS,
                    body: payload.BODY.BOOKING_SUCCESS,
                    redirectionUrl: `${_common_1.BASE.URL}/profile/booking/detail/${bookingDetails._id}}`
                }
            };
            let dbPayload = {
                type: payload.TYPE.BOOKING_SUCCESS,
                title: payload.TITLE.BOOKING_SUCCESS,
                message: payload.BODY.BOOKING_SUCCESS,
                receiverId: bookingDetails.userData.userId,
                bookingId: bookingDetails._id
            };
            await _entity_1.NotificationV1.createNotification(dbPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async bookingSuccessfulHost(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyData) === null || _a === void 0 ? void 0 : _a.name);
            let notificationData = {
                data: {
                    type: payload.TYPE.BOOKING_SUCCESS_HOST.toString(),
                    title: payload.TITLE.BOOKING_SUCCESS_HOST,
                    body: payload.BODY.BOOKING_SUCCESS_HOST,
                    bookingId: bookingDetails._id.toString(),
                },
                notification: {
                    bookingId: bookingDetails._id.toString(),
                    type: payload.TYPE.BOOKING_SUCCESS_HOST.toString(),
                    title: payload.TITLE.BOOKING_SUCCESS_HOST,
                    body: payload.BODY.BOOKING_SUCCESS_HOST,
                    redirectionUrl: `${_common_1.BASE.URL}/host/booking/booking-list/booking-request?page=1&limit=10`
                }
            };
            let inAppPayload = {
                type: payload.TYPE.BOOKING_SUCCESS_HOST,
                title: payload.TITLE.BOOKING_SUCCESS_HOST,
                message: payload.BODY.BOOKING_SUCCESS_HOST,
                receiverId: bookingDetails.hostId,
                bookingId: bookingDetails._id
            };
            await _entity_1.NotificationV1.createNotification(inAppPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async bookingRequestHost(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyData) === null || _a === void 0 ? void 0 : _a.name);
            let notificationData = {
                data: {
                    type: payload.TYPE.BOOKING_REQUEST_HOST.toString(),
                    title: payload.TITLE.BOOKING_REQUEST_HOST,
                    body: payload.BODY.BOOKING_REQUEST_HOST,
                    bookingId: bookingDetails._id.toString()
                },
                notification: {
                    bookingId: bookingDetails._id.toString(),
                    type: payload.TYPE.BOOKING_REQUEST_HOST.toString(),
                    title: payload.TITLE.BOOKING_REQUEST_HOST,
                    body: payload.BODY.BOOKING_REQUEST_HOST,
                    redirectionUrl: `${_common_1.BASE.URL}/host/booking/booking-list/booking-request?page=1&limit=10`
                }
            };
            let inAppPayload = {
                type: payload.TYPE.BOOKING_REQUEST_HOST,
                title: payload.TITLE.BOOKING_REQUEST_HOST,
                message: payload.BODY.BOOKING_REQUEST_HOST,
                receiverId: bookingDetails.hostId,
                bookingId: bookingDetails._id
            };
            await _entity_1.NotificationV1.createNotification(inAppPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async sendBookingCancelledUser(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyData) === null || _a === void 0 ? void 0 : _a.name, bookingDetails.bookingId);
            let notificationData = {
                data: {
                    type: payload.TYPE.BOOKING_CANCELLED_USER.toString(),
                    title: payload.TITLE.BOOKING_CANCELLED_USER,
                    body: payload.BODY.BOOKING_CANCELLED_USER,
                    bookingId: bookingDetails._id.toString()
                },
                notification: {
                    bookingId: bookingDetails._id.toString(),
                    type: payload.TYPE.BOOKING_CANCELLED_USER.toString(),
                    title: payload.TITLE.BOOKING_CANCELLED_USER,
                    body: payload.BODY.BOOKING_CANCELLED_USER,
                    redirectionUrl: `${_common_1.BASE.URL}/profile/booking/detail/${bookingDetails._id}}`
                }
            };
            let dbPayload = {
                type: payload.TYPE.BOOKING_CANCELLED_USER,
                title: payload.TITLE.BOOKING_CANCELLED_USER,
                message: payload.BODY.BOOKING_CANCELLED_USER,
                receiverId: bookingDetails.userData.userId,
                bookingId: bookingDetails._id
            };
            await _entity_1.NotificationV1.createNotification(dbPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async sendBookingCancelledByHostToUser(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyData) === null || _a === void 0 ? void 0 : _a.name, bookingDetails.bookingId);
            let notificationData = {
                data: {
                    type: payload.TYPE.BOOKING_CANCELLED_USER.toString(),
                    title: payload.TITLE.BOOKING_CANCELLED_BY_HOST_TO_USER,
                    body: payload.BODY.BOOKING_CANCELLED_BY_HOST_TO_USER,
                    bookingId: bookingDetails._id.toString()
                },
                notification: {
                    bookingId: bookingDetails._id.toString(),
                    type: payload.TYPE.BOOKING_CANCELLED_USER.toString(),
                    title: payload.TITLE.BOOKING_CANCELLED_BY_HOST_TO_USER,
                    body: payload.BODY.BOOKING_CANCELLED_BY_HOST_TO_USER,
                    redirectionUrl: `${_common_1.BASE.URL}/profile/booking/detail/${bookingDetails._id}}`
                }
            };
            let dbPayload = {
                type: payload.TYPE.BOOKING_CANCELLED_USER,
                title: payload.TITLE.BOOKING_CANCELLED_BY_HOST_TO_USER,
                message: payload.BODY.BOOKING_CANCELLED_BY_HOST_TO_USER,
                receiverId: bookingDetails.userData.userId,
                bookingId: bookingDetails._id
            };
            await _entity_1.NotificationV1.createNotification(dbPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async sendBookingCancelledHost(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyData) === null || _a === void 0 ? void 0 : _a.name, bookingDetails.bookingId);
            let notificationData = {
                data: {
                    type: payload.TYPE.BOOKING_CANCELLED_HOST.toString(),
                    title: payload.TITLE.BOOKING_CANCELLED_HOST,
                    body: payload.BODY.BOOKING_CANCELLED_HOST,
                    bookingId: bookingDetails._id.toString()
                },
                notification: {
                    bookingId: bookingDetails._id.toString(),
                    type: payload.TYPE.BOOKING_CANCELLED_HOST.toString(),
                    title: payload.TITLE.BOOKING_CANCELLED_HOST,
                    body: payload.BODY.BOOKING_CANCELLED_HOST,
                    redirectionUrl: `${_common_1.BASE.URL}/host/booking/booking-list/booking-request?page=1&limit=10`
                }
            };
            let inAppPayload = {
                type: payload.TYPE.BOOKING_CANCELLED_HOST,
                title: payload.TITLE.BOOKING_CANCELLED_HOST,
                message: payload.BODY.BOOKING_CANCELLED_HOST,
                receiverId: bookingDetails.hostId,
                bookingId: bookingDetails._id
            };
            await _entity_1.NotificationV1.createNotification(inAppPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async sendBookingPushCancelledByHost(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyData) === null || _a === void 0 ? void 0 : _a.name, bookingDetails.bookingId);
            let notificationData = {
                data: {
                    type: payload.TYPE.BOOKING_CANCELLED_HOST.toString(),
                    title: payload.TITLE.BOOKING_CANCELLED_BY_HOST,
                    body: payload.BODY.BOOKING_CANCELLED_BY_HOST,
                    bookingId: bookingDetails._id.toString()
                },
                notification: {
                    bookingId: bookingDetails._id.toString(),
                    type: payload.TYPE.BOOKING_CANCELLED_HOST.toString(),
                    title: payload.TITLE.BOOKING_CANCELLED_BY_HOST,
                    body: payload.BODY.BOOKING_CANCELLED_BY_HOST,
                    redirectionUrl: `${_common_1.BASE.URL}/host/booking/booking-list/booking-request?page=1&limit=10`
                }
            };
            let inAppPayload = {
                type: payload.TYPE.BOOKING_CANCELLED_HOST,
                title: payload.TITLE.BOOKING_CANCELLED_BY_HOST,
                message: payload.BODY.BOOKING_CANCELLED_BY_HOST,
                receiverId: bookingDetails.hostId,
                bookingId: bookingDetails._id
            };
            await _entity_1.NotificationV1.createNotification(inAppPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async bookingRequestHostSuccess(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyData) === null || _a === void 0 ? void 0 : _a.name, bookingDetails.bookingId);
            let notificationData = {
                data: {
                    type: payload.TYPE.BOOKING_REQUEST_ACCEPTED_HOST.toString(),
                    title: payload.TITLE.BOOKING_REQUEST_ACCEPTED_HOST,
                    body: payload.BODY.BOOKING_REQUEST_ACCEPTED_HOST,
                    bookingId: bookingDetails._id.toString()
                },
                notification: {
                    bookingId: bookingDetails._id.toString(),
                    type: payload.TYPE.BOOKING_REQUEST_ACCEPTED_HOST.toString(),
                    title: payload.TITLE.BOOKING_REQUEST_ACCEPTED_HOST,
                    body: payload.BODY.BOOKING_REQUEST_ACCEPTED_HOST,
                    redirectionUrl: `${_common_1.BASE.URL}/host/booking/booking-list/booking-request?page=1&limit=10`
                }
            };
            let inAppPayload = {
                type: payload.TYPE.BOOKING_REQUEST_ACCEPTED_HOST,
                title: payload.TITLE.BOOKING_REQUEST_ACCEPTED_HOST,
                message: payload.BODY.BOOKING_REQUEST_ACCEPTED_HOST,
                receiverId: bookingDetails.hostId,
                bookingId: bookingDetails._id
            };
            await _entity_1.NotificationV1.createNotification(inAppPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async bookingRequestHostReject(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyData) === null || _a === void 0 ? void 0 : _a.name, bookingDetails.bookingId);
            let notificationData = {
                data: {
                    type: payload.TYPE.BOOKING_REQUEST_REJECTED_HOST.toString(),
                    title: payload.TITLE.BOOKING_REQUEST_REJECTED_HOST,
                    body: payload.BODY.BOOKING_REQUEST_REJECTED_HOST,
                    bookingId: bookingDetails._id.toString()
                },
                notification: {
                    bookingId: bookingDetails._id.toString(),
                    type: payload.TYPE.BOOKING_REQUEST_REJECTED_HOST.toString(),
                    title: payload.TITLE.BOOKING_REQUEST_REJECTED_HOST,
                    body: payload.BODY.BOOKING_REQUEST_REJECTED_HOST,
                    redirectionUrl: `${_common_1.BASE.URL}/host/booking/booking-list/booking-request?page=1&limit=10`
                }
            };
            let inAppPayload = {
                type: payload.TYPE.BOOKING_REQUEST_REJECTED_HOST,
                title: payload.TITLE.BOOKING_REQUEST_REJECTED_HOST,
                message: payload.BODY.BOOKING_REQUEST_REJECTED_HOST,
                receiverId: bookingDetails.hostId,
                bookingId: bookingDetails._id
            };
            await _entity_1.NotificationV1.createNotification(inAppPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async sendBookingRequestUserSuccess(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyData) === null || _a === void 0 ? void 0 : _a.name, bookingDetails.bookingId);
            let notificationData = {
                data: {
                    type: payload.TYPE.BOOKING_REQUEST_ACCEPTED_USER.toString(),
                    title: payload.TITLE.BOOKING_REQUEST_ACCEPTED_USER,
                    body: payload.BODY.BOOKING_REQUEST_ACCEPTED_USER,
                    bookingId: bookingDetails._id.toString()
                },
                notification: {
                    bookingId: bookingDetails._id.toString(),
                    type: payload.TYPE.BOOKING_REQUEST_ACCEPTED_USER.toString(),
                    title: payload.TITLE.BOOKING_REQUEST_ACCEPTED_USER,
                    body: payload.BODY.BOOKING_REQUEST_ACCEPTED_USER,
                    redirectionUrl: `${_common_1.BASE.URL}/profile/booking/detail/${bookingDetails._id}}`
                }
            };
            let dbPayload = {
                type: payload.TYPE.BOOKING_REQUEST_ACCEPTED_USER,
                title: payload.TITLE.BOOKING_REQUEST_ACCEPTED_USER,
                message: payload.BODY.BOOKING_REQUEST_ACCEPTED_USER,
                receiverId: bookingDetails.userData.userId,
                bookingId: bookingDetails._id
            };
            await _entity_1.NotificationV1.createNotification(dbPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async sendBookingRequestUserRejected(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyData) === null || _a === void 0 ? void 0 : _a.name, bookingDetails.bookingId);
            let notificationData = {
                data: {
                    type: payload.TYPE.BOOKING_REQUEST_REJECTED_USER.toString(),
                    title: payload.TITLE.BOOKING_REQUEST_REJECTED_USER,
                    body: payload.BODY.BOOKING_REQUEST_REJECTED_USER,
                    bookingId: bookingDetails._id.toString()
                },
                notification: {
                    bookingId: bookingDetails._id.toString(),
                    type: payload.TYPE.BOOKING_REQUEST_REJECTED_USER.toString(),
                    title: payload.TITLE.BOOKING_REQUEST_REJECTED_USER,
                    body: payload.BODY.BOOKING_REQUEST_REJECTED_USER,
                    redirectionUrl: `${_common_1.BASE.URL}/profile/booking/detail/${bookingDetails._id}}`
                }
            };
            let dbPayload = {
                type: payload.TYPE.BOOKING_REQUEST_REJECTED_USER,
                title: payload.TITLE.BOOKING_REQUEST_REJECTED_USER,
                message: payload.BODY.BOOKING_REQUEST_REJECTED_USER,
                receiverId: bookingDetails.userData.userId,
                bookingId: bookingDetails._id
            };
            await _entity_1.NotificationV1.createNotification(dbPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async sendPbVerificationSuccessPush(token, verificationDetails) {
        try {
            let payload = await _common_1.notificationPayload(verificationDetails);
            let notificationData = {
                data: {
                    type: payload.TYPE.USER_PB_VERIFICATION_SUCCESS.toString(),
                    title: payload.TITLE.USER_PB_VERIFICATION_SUCCESS,
                    body: payload.BODY.USER_PB_VERIFICATION_SUCCESS,
                },
                notification: {
                    type: payload.TYPE.USER_PB_VERIFICATION_SUCCESS.toString(),
                    title: payload.TITLE.USER_PB_VERIFICATION_SUCCESS,
                    body: payload.BODY.USER_PB_VERIFICATION_SUCCESS
                }
            };
            let dbPayload = {
                type: payload.TYPE.USER_PB_VERIFICATION_SUCCESS,
                title: payload.TITLE.USER_PB_VERIFICATION_SUCCESS,
                message: payload.BODY.USER_PB_VERIFICATION_SUCCESS,
                receiverId: verificationDetails.additional_attributes.customer_user_id,
            };
            await _entity_1.NotificationV1.createNotification(dbPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async sendPbVerificationFailedPush(token, verificationDetails) {
        try {
            let payload = await _common_1.notificationPayload(verificationDetails);
            let notificationData = {
                data: {
                    type: payload.TYPE.USER_PB_VERIFICATION_FALSE.toString(),
                    title: payload.TITLE.USER_PB_VERIFICATION_FALSE,
                    body: payload.BODY.USER_PB_VERIFICATION_FALSE,
                },
                notification: {
                    type: payload.TYPE.USER_PB_VERIFICATION_FALSE.toString(),
                    title: payload.TITLE.USER_PB_VERIFICATION_FALSE,
                    body: payload.BODY.USER_PB_VERIFICATION_FALSE
                }
            };
            let dbPayload = {
                type: payload.TYPE.USER_PB_VERIFICATION_FALSE,
                title: payload.TITLE.USER_PB_VERIFICATION_FALSE,
                message: payload.BODY.USER_PB_VERIFICATION_FALSE,
                receiverId: verificationDetails.additional_attributes.customer_user_id,
            };
            await _entity_1.NotificationV1.createNotification(dbPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async sendAdminPush(token, payload) {
        try {
            console.log(`final payload and token ================>`, payload, token);
            let notificationData = {
                data: {
                    type: _common_1.ENUM.NOTIFICATION_TYPE.ADMIN_BULK.toString(),
                    title: payload.title,
                    body: payload.description,
                    image: payload.image ? payload.image : "image constant"
                },
                notification: {
                    type: _common_1.ENUM.NOTIFICATION_TYPE.ADMIN_BULK.toString(),
                    title: payload.title,
                    body: payload.description,
                    image: payload.image ? payload.image : "image Constant"
                }
            };
            return await this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async sendUserPropertyDemoPush(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyDetail) === null || _a === void 0 ? void 0 : _a.name);
            let notificationData = {
                data: {
                    type: payload.TYPE.USER_SCHEDULED_DEMO.toString(),
                    title: payload.TITLE.USER_SCHEDULED_DEMO,
                    body: payload.BODY.USER_SCHEDULED_DEMO
                },
                notification: {
                    type: payload.TYPE.USER_SCHEDULED_DEMO.toString(),
                    title: payload.TITLE.USER_SCHEDULED_DEMO,
                    body: payload.BODY.USER_SCHEDULED_DEMO
                }
            };
            let inAppPayload = {
                type: payload.TYPE.USER_SCHEDULED_DEMO,
                title: payload.TITLE.USER_SCHEDULED_DEMO,
                message: payload.BODY.USER_SCHEDULED_DEMO,
                receiverId: bookingDetails.userId,
                propertyId: bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyId,
                data: bookingDetails
            };
            await _entity_1.NotificationV1.createNotification(inAppPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async sendHostPropertyDemoPush(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyDetail) === null || _a === void 0 ? void 0 : _a.name);
            let notificationData = {
                data: {
                    type: payload.TYPE.HOST_SCHEDULED_DEMO.toString(),
                    title: payload.TITLE.HOST_SCHEDULED_DEMO,
                    body: payload.BODY.HOST_SCHEDULED_DEMO
                },
                notification: {
                    type: payload.TYPE.HOST_SCHEDULED_DEMO.toString(),
                    title: payload.TITLE.HOST_SCHEDULED_DEMO,
                    body: payload.BODY.HOST_SCHEDULED_DEMO
                }
            };
            let inAppPayload = {
                type: payload.TYPE.HOST_SCHEDULED_DEMO,
                title: payload.TITLE.HOST_SCHEDULED_DEMO,
                message: payload.BODY.HOST_SCHEDULED_DEMO,
                receiverId: bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.hostId,
                data: bookingDetails,
                propertyId: bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyId
            };
            await _entity_1.NotificationV1.createNotification(inAppPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async sendHostPropertyDemoAcceptStatusPush(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyDetail) === null || _a === void 0 ? void 0 : _a.name);
            let notificationData = {
                data: {
                    type: payload.TYPE.HOST_SCHEDULED_DEMO_STATUS_ACCEPT.toString(),
                    title: payload.TITLE.HOST_SCHEDULED_DEMO_STATUS_ACCEPT,
                    body: payload.BODY.HOST_SCHEDULED_DEMO_STATUS_ACCEPT
                },
                notification: {
                    type: payload.TYPE.HOST_SCHEDULED_DEMO_STATUS_ACCEPT.toString(),
                    title: payload.TITLE.HOST_SCHEDULED_DEMO_STATUS_ACCEPT,
                    body: payload.BODY.HOST_SCHEDULED_DEMO_STATUS_ACCEPT
                }
            };
            let inAppPayload = {
                type: payload.TYPE.HOST_SCHEDULED_DEMO_STATUS_ACCEPT,
                title: payload.TITLE.HOST_SCHEDULED_DEMO_STATUS_ACCEPT,
                message: payload.BODY.HOST_SCHEDULED_DEMO_STATUS_ACCEPT,
                receiverId: bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.hostId,
                data: bookingDetails,
            };
            await _entity_1.NotificationV1.createNotification(inAppPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async sendHostPropertyDemoRejectStatusPush(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyDetail) === null || _a === void 0 ? void 0 : _a.name);
            let notificationData = {
                data: {
                    type: payload.TYPE.HOST_SCHEDULED_DEMO_STATUS_REJECT.toString(),
                    title: payload.TITLE.HOST_SCHEDULED_DEMO_STATUS_REJECT,
                    body: payload.BODY.HOST_SCHEDULED_DEMO_STATUS_REJECT
                },
                notification: {
                    type: payload.TYPE.HOST_SCHEDULED_DEMO_STATUS_REJECT.toString(),
                    title: payload.TITLE.HOST_SCHEDULED_DEMO_STATUS_REJECT,
                    body: payload.BODY.HOST_SCHEDULED_DEMO_STATUS_REJECT
                }
            };
            let inAppPayload = {
                type: payload.TYPE.HOST_SCHEDULED_DEMO_STATUS_REJECT,
                title: payload.TITLE.HOST_SCHEDULED_DEMO_STATUS_REJECT,
                message: payload.BODY.HOST_SCHEDULED_DEMO_STATUS_REJECT,
                receiverId: bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.hostId,
                data: bookingDetails
            };
            await _entity_1.NotificationV1.createNotification(inAppPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async sendUserPropertyDemoRejectStatusPush(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyDetail) === null || _a === void 0 ? void 0 : _a.name);
            let notificationData = {
                data: {
                    type: payload.TYPE.USER_SCHEDULED_DEMO_STATUS_REJECT.toString(),
                    title: payload.TITLE.USER_SCHEDULED_DEMO_STATUS_REJECT,
                    body: payload.BODY.USER_SCHEDULED_DEMO_STATUS_REJECT
                },
                notification: {
                    type: payload.TYPE.USER_SCHEDULED_DEMO_STATUS_REJECT.toString(),
                    title: payload.TITLE.USER_SCHEDULED_DEMO_STATUS_REJECT,
                    body: payload.BODY.USER_SCHEDULED_DEMO_STATUS_REJECT
                }
            };
            let inAppPayload = {
                type: payload.TYPE.USER_SCHEDULED_DEMO_STATUS_REJECT,
                title: payload.TITLE.USER_SCHEDULED_DEMO_STATUS_REJECT,
                message: payload.BODY.USER_SCHEDULED_DEMO_STATUS_REJECT,
                receiverId: bookingDetails.userDetail._id,
                data: bookingDetails
            };
            await _entity_1.NotificationV1.createNotification(inAppPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
    async sendUserPropertyDemoAcceptStatusPush(token, bookingDetails) {
        var _a;
        try {
            let payload = await _common_1.notificationPayload((_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyDetail) === null || _a === void 0 ? void 0 : _a.name);
            let notificationData = {
                data: {
                    type: payload.TYPE.USER_SCHEDULED_DEMO_STATUS_ACCEPT.toString(),
                    title: payload.TITLE.USER_SCHEDULED_DEMO_STATUS_ACCEPT,
                    body: payload.BODY.USER_SCHEDULED_DEMO_STATUS_ACCEPT
                },
                notification: {
                    type: payload.TYPE.USER_SCHEDULED_DEMO_STATUS_ACCEPT.toString(),
                    title: payload.TITLE.USER_SCHEDULED_DEMO_STATUS_ACCEPT,
                    body: payload.BODY.USER_SCHEDULED_DEMO_STATUS_ACCEPT
                }
            };
            let inAppPayload = {
                type: payload.TYPE.USER_SCHEDULED_DEMO_STATUS_ACCEPT,
                title: payload.TITLE.USER_SCHEDULED_DEMO_STATUS_ACCEPT,
                message: payload.BODY.USER_SCHEDULED_DEMO_STATUS_ACCEPT,
                receiverId: bookingDetails.userDetail._id,
                data: bookingDetails,
            };
            await _entity_1.NotificationV1.createNotification(inAppPayload);
            return this.sendPush(token, notificationData);
        }
        catch (error) {
            console.error(`We have an error in notification util ==> ${error}`);
        }
    }
}
exports.PushNotification = new PushModule();
//# sourceMappingURL=push.notification.util.js.map