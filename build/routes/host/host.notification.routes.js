"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const celebrate_1 = require("celebrate");
const _common_1 = require("@common");
const _middlewares_1 = __importDefault(require("@middlewares"));
const _services_1 = require("@services");
const _controllers_1 = require("@controllers");
class V1HostNotificationRouteClass extends _baseRoute_1.default {
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
        }), _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.HostNotificationController.toggleNotification(req, res, next);
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
        }), _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.HostNotificationController.toggleEmailNotification(req, res, next);
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
        }), _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.HostNotificationController.userNotificationList(req, res, next);
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
        }), _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.HostNotificationController.markAsRead(req, res, next);
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
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostNotificationController.deleteNotification(req, res, next);
        });
    }
}
exports.default = new V1HostNotificationRouteClass('/notification');
//# sourceMappingURL=host.notification.routes.js.map