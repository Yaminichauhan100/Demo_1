"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _common_1 = require("@common");
const _middlewares_1 = __importDefault(require("@middlewares"));
const admin_host_controller_1 = require("../../controllers/admin/admin.host.controller");
class AdminHostRouteClass extends _baseRoute_1.default {
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
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { status: _common_1.VALIDATION.USER.STATUS, regStartDate: _common_1.VALIDATION.ADMIN_HOST_LISTING.REG_START_DATE, regEndDate: _common_1.VALIDATION.ADMIN_HOST_LISTING.REG_END_DATE, minProperty: _common_1.VALIDATION.ADMIN_HOST_LISTING.MIN_PROPERTY, maxProperty: _common_1.VALIDATION.ADMIN_HOST_LISTING.MAX_PROPERTY, accountStatus: _common_1.VALIDATION.USER.ACCOUNT_STATUS, sortKey: _common_1.VALIDATION.GENERAL.STRING.allow(''), sortOrder: _common_1.VALIDATION.GENERAL.NUMBER.allow(1, -1) })
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_host_controller_1.AdminHostController.getHosts(req, res, next);
        });
        this.router.put('/:userId/block', celebrate_1.celebrate({
            params: {
                userId: _common_1.VALIDATION.USER.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_host_controller_1.AdminHostController.blockHost(req, res, next);
        });
        this.router.get('/:id/propertyDetails', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_host_controller_1.AdminHostController.propertyDetails(req, res, next);
        });
        this.router.put('/:userId/unblock', celebrate_1.celebrate({
            params: {
                userId: _common_1.VALIDATION.USER.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_host_controller_1.AdminHostController.unblockUsers(req, res, next);
        });
        this.router.delete('/:userId/delete', celebrate_1.celebrate({
            params: {
                userId: _common_1.VALIDATION.USER.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_host_controller_1.AdminHostController.deleteUsers(req, res, next);
        });
        this.router.get('/:userId/details', celebrate_1.celebrate({
            params: {
                userId: _common_1.VALIDATION.USER.ID
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_host_controller_1.AdminHostController.userDetails(req, res, next);
        });
        this.router.put('/:userId/verify', celebrate_1.celebrate({
            params: {
                userId: _common_1.VALIDATION.USER.ID
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_host_controller_1.AdminHostController.verifyHost(req, res, next);
        });
    }
}
exports.default = new AdminHostRouteClass('/host');
//# sourceMappingURL=admin.host.routes.js.map