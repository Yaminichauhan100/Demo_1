"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _controllers_1 = require("@controllers");
const celebrate_1 = require("celebrate");
const _common_1 = require("@common");
const _middlewares_1 = __importDefault(require("@middlewares"));
const _services_1 = require("@services");
class V1UserNotificationRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.put('/toggleNotification', celebrate_1.celebrate({
            body: {
                notificationEnabled: _common_1.VALIDATION.GENERAL.NUMBER.valid(_common_1.ENUM_ARRAY.NOTIFICATION.ENABLE, _common_1.ENUM_ARRAY.NOTIFICATION.DISABLE).required()
            },
            headers: _services_1.authorizationHeaderObj
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserNotificationController.toggleNotification(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.put('/toggleEmailNotification', celebrate_1.celebrate({
            body: {
                mailNotificationEnabled: _common_1.VALIDATION.GENERAL.NUMBER.valid(_common_1.ENUM_ARRAY.NOTIFICATION.ENABLE, _common_1.ENUM_ARRAY.NOTIFICATION.DISABLE).required()
            },
            headers: _services_1.authorizationHeaderObj
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserNotificationController.toggleEmailNotification(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/', celebrate_1.celebrate({
            query: {
                page: _common_1.VALIDATION.GENERAL.PAGINATION.page,
                limit: _common_1.VALIDATION.GENERAL.PAGINATION.limit,
            },
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserNotificationController.userNotificationList(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.put('/markRead', celebrate_1.celebrate({
            body: {
                notificationId: _common_1.VALIDATION.GENERAL.ID
            },
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserNotificationController.markAsRead(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.delete('/', celebrate_1.celebrate({
            query: {
                notificationId: _common_1.VALIDATION.GENERAL.ID
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserNotificationController.deleteNotification(req, res, next);
        });
    }
}
exports.default = new V1UserNotificationRouteClass('/notification');
//# sourceMappingURL=user.notification.routes.js.map