"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _middlewares_1 = __importDefault(require("@middlewares"));
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _common_1 = require("@common");
const admin_notification_controller_1 = require("../../controllers/admin/admin.notification.controller");
class AdminNotificationClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.post('/', celebrate_1.celebrate({
            body: {
                title: _common_1.VALIDATION.GENERAL.STRING,
                image: _common_1.VALIDATION.GENERAL.STRING,
                description: _common_1.VALIDATION.GENERAL.STRING,
                recipientType: celebrate_1.Joi.number().valid(_common_1.ENUM_ARRAY.ADMIN.NOTIFICATION.RECIEVER),
                userList: celebrate_1.Joi.any(),
                hostList: celebrate_1.Joi.any()
            }
        }), async (req, res, next) => {
            try {
                admin_notification_controller_1.AdminNotificationController.createNotification(req, res, next);
            }
            catch (error) {
                console.error(`we have an error in admin notification route ==> ${error}`);
            }
        });
        this.router.put('/', celebrate_1.celebrate({
            body: {
                notificationId: _common_1.VALIDATION.GENERAL.ID.required(),
                title: _common_1.VALIDATION.GENERAL.STRING,
                image: _common_1.VALIDATION.GENERAL.STRING,
                description: _common_1.VALIDATION.GENERAL.STRING,
                recipientType: celebrate_1.Joi.number().valid(_common_1.ENUM_ARRAY.ADMIN.NOTIFICATION.RECIEVER),
                otherRecipientIds: celebrate_1.Joi.when('recipientType', { is: 5, then: celebrate_1.Joi.array().items(_common_1.VALIDATION.GENERAL.ID).required() }),
                userList: celebrate_1.Joi.any(),
                hostList: celebrate_1.Joi.any()
            }
        }), _middlewares_1.default.VerifyAdminSession, async (req, res, next) => {
            try {
                admin_notification_controller_1.AdminNotificationController.updateNotification(req, res, next);
            }
            catch (error) {
                console.error(`we have an error in admin notification route ==> ${error}`);
            }
        });
        this.router.get('/', celebrate_1.celebrate({
            query: Object.assign({ sort: _common_1.VALIDATION.GENERAL.STRING, recipientType: celebrate_1.Joi.any() }, _common_1.VALIDATION.GENERAL.PAGINATION)
        }), _middlewares_1.default.VerifyAdminSession, async (req, res, next) => {
            try {
                admin_notification_controller_1.AdminNotificationController.fetchNotification(req, res, next);
            }
            catch (error) {
                console.error(`we have an error in admin notification route ==> ${error}`);
            }
        });
        this.router.get('/lookup', celebrate_1.celebrate({
            query: {
                lookupType: _common_1.VALIDATION.GENERAL.NUMBER.valid([
                    _common_1.ENUM.ADMIN.LOOKUP_TYPE.HOST_CONTACT_NUMBER,
                    _common_1.ENUM.ADMIN.LOOKUP_TYPE.USER_EMAIL_IDS,
                    _common_1.ENUM.ADMIN.LOOKUP_TYPE.HOST_EMAIL_IDS,
                    _common_1.ENUM.ADMIN.LOOKUP_TYPE.USER_CONTACT_NUMBER,
                ]).required(),
                lookupKeys: _common_1.VALIDATION.GENERAL.ANY.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, async (req, res, next) => {
            try {
                admin_notification_controller_1.AdminNotificationController.lookupIds(req, res, next);
            }
            catch (error) {
                console.error(`we have an error in admin notification route ==> ${error}`);
            }
        });
        this.router.get('/:notificationId', celebrate_1.celebrate({
            params: {
                notificationId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, async (req, res, next) => {
            try {
                admin_notification_controller_1.AdminNotificationController.fetchNotificationDetail(req, res, next);
            }
            catch (error) {
                console.error(`we have an error in admin notification route ==> ${error}`);
            }
        });
    }
}
exports.default = new AdminNotificationClass('/notification');
//# sourceMappingURL=admin.notification.routes.js.map