"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _common_1 = require("@common");
const _middlewares_1 = __importDefault(require("@middlewares"));
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const admin_payout_controller_1 = require("../../controllers/admin/admin.payout.controller");
class AdminPayoutRouteClass extends _baseRoute_1.default {
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
            query: Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION)
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_payout_controller_1.AdminPayoutController.getPayoutListing(req, res, next);
        });
        this.router.put('/:hostId/payOut', celebrate_1.celebrate({
            params: {
                hostId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_payout_controller_1.AdminPayoutController.payOut(req, res, next);
        });
        this.router.post('/bulk', celebrate_1.celebrate({
            body: {
                hostIds: _common_1.VALIDATION.GENERAL.ANY.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_payout_controller_1.AdminPayoutController.bulkPayout(req, res, next);
        });
        this.router.get('/requests', celebrate_1.celebrate({
            query: Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION)
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_payout_controller_1.AdminPayoutController.fetchPayoutRequests(req, res, next);
        });
        this.router.get('/payoutLogs', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { fromDate: _common_1.VALIDATION.PROPERTY.fromDate, toDate: _common_1.VALIDATION.PROPERTY.toDate, sortKey: _common_1.VALIDATION.GENERAL.STRING, minAmount: celebrate_1.Joi.number(), maxAmount: celebrate_1.Joi.number(), sortOrder: _common_1.VALIDATION.GENERAL.NUMBER.allow(1, -1) })
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_payout_controller_1.AdminPayoutController.getPayoutLogs(req, res, next);
        });
    }
}
exports.default = new AdminPayoutRouteClass('/payout');
//# sourceMappingURL=admin.payout.routes.js.map