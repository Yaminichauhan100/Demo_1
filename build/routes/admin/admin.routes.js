"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _common_1 = require("@common");
const _middlewares_1 = __importDefault(require("@middlewares"));
const admin_controller_1 = require("../../controllers/admin/admin.controller");
class AdminRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.patch('/password', celebrate_1.celebrate({
            body: {
                oldPassword: _common_1.VALIDATION.ADMIN.PASSWORD.required(),
                newPassword: _common_1.VALIDATION.ADMIN.PASSWORD.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_controller_1.AdminController.changePassword(req, res, next);
        });
        this.router.patch('/update', celebrate_1.celebrate({
            body: {
                profilePhoto: _common_1.VALIDATION.ADMIN.PROFILE_PHOTO,
                name: _common_1.VALIDATION.ADMIN.NAME
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_controller_1.AdminController.updateAdmin(req, res, next);
        });
        this.router.get('/details', _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_controller_1.AdminController.singleAdmin(req, res, next);
        });
        this.router.patch('/logout', _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_controller_1.AdminController.adminLogout(req, res, next);
        });
        this.router.get('/dashboard', celebrate_1.celebrate({
            query: {
                fromDate: _common_1.VALIDATION.PROPERTY.fromDate,
                toDate: _common_1.VALIDATION.PROPERTY.toDate,
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_controller_1.AdminController.getDashBoardCount(req, res, next);
        });
        this.router.get('/contactUs', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { sort: _common_1.VALIDATION.GENERAL.NUMBER.valid(1, -1), fromDate: _common_1.VALIDATION.PROPERTY.fromDate, toDate: _common_1.VALIDATION.PROPERTY.toDate })
        }), (req, res, next) => {
            admin_controller_1.AdminController.getContactUsList(req, res, next);
        });
        this.router.get('/contactUs/info', celebrate_1.celebrate({
            query: {
                id: _common_1.VALIDATION.GENERAL.ID.required(),
            }
        }), (req, res, next) => {
            admin_controller_1.AdminController.contactUsInfo(req, res, next);
        });
        this.router.put('/contactUs/resolutionStatus', celebrate_1.celebrate({
            body: {
                contactUsId: _common_1.VALIDATION.GENERAL.ID.required(),
                resolutionStatus: _common_1.VALIDATION.GENERAL.NUMBER.valid(_common_1.ENUM.RESOLUTION_STATUS.STATUS.RESOLVED, _common_1.ENUM.RESOLUTION_STATUS.STATUS.PENDING)
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_controller_1.AdminController.updateResolutionStatus(req, res, next);
        });
    }
}
exports.default = new AdminRouteClass('/');
//# sourceMappingURL=admin.routes.js.map