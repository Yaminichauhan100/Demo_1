"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _common_1 = require("@common");
const _middlewares_1 = __importDefault(require("@middlewares"));
const admin_user_controller_1 = require("../../controllers/admin/admin.user.controller");
class AdminUserRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.get('/list', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { status: _common_1.VALIDATION.USER.STATUS, regStartDate: _common_1.VALIDATION.ADMIN_USER_LISTING.REG_START_DATE, regEndDate: _common_1.VALIDATION.ADMIN_USER_LISTING.REG_END_DATE, minBooking: _common_1.VALIDATION.ADMIN_USER_LISTING.MIN_BOOKING, maxBooking: _common_1.VALIDATION.ADMIN_USER_LISTING.MAX_BOOKING, companyType: _common_1.VALIDATION.ADMIN_USER_LISTING.COMPANY_TYPE.allow(''), sortKey: _common_1.VALIDATION.GENERAL.STRING.allow(''), sortOrder: _common_1.VALIDATION.GENERAL.NUMBER.allow(1, -1) })
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_user_controller_1.AdminUserController.getUsers(req, res, next);
        });
        this.router.put('/:userId/block', celebrate_1.celebrate({
            params: {
                userId: _common_1.VALIDATION.USER.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_user_controller_1.AdminUserController.blockUsers(req, res, next);
        });
        this.router.put('/:userId/unblock', celebrate_1.celebrate({
            params: {
                userId: _common_1.VALIDATION.USER.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_user_controller_1.AdminUserController.unblockUsers(req, res, next);
        });
        this.router.delete('/:userId/delete', celebrate_1.celebrate({
            params: {
                userId: _common_1.VALIDATION.USER.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_user_controller_1.AdminUserController.deleteUsers(req, res, next);
        });
        this.router.get('/:userId/details', celebrate_1.celebrate({
            params: {
                userId: _common_1.VALIDATION.USER.ID
            }
        }), (req, res, next) => {
            admin_user_controller_1.AdminUserController.userDetails(req, res, next);
        });
    }
}
exports.default = new AdminUserRouteClass('/users');
//# sourceMappingURL=admin.user.routes.js.map