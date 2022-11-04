"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _middlewares_1 = __importDefault(require("@middlewares"));
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const celebrate_1 = require("celebrate");
const _common_1 = require("@common");
const admin_payment_controller_1 = require("../../controllers/admin/admin.payment.controller");
class AdminPaymentRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.get('/', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { fromDate: _common_1.VALIDATION.PROPERTY.fromDate, toDate: _common_1.VALIDATION.PROPERTY.toDate, minAmount: celebrate_1.Joi.number().min(1), maxAmount: celebrate_1.Joi.number(), transactionStatus: _common_1.VALIDATION.GENERAL.PAYMENT_STATUS, paymentStatus: _common_1.VALIDATION.GENERAL.PAYMENT_STATUS, bookingStatus: _common_1.VALIDATION.GENERAL.BOOKING_STATUS, sortKey: _common_1.VALIDATION.GENERAL.STRING, sortOrder: _common_1.VALIDATION.GENERAL.NUMBER.allow(1, -1) })
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_payment_controller_1.AdminPaymentController.fetchPaymentListing(req, res, next);
        });
    }
}
exports.default = new AdminPaymentRouteClass('/payment');
//# sourceMappingURL=admin.payment.routes.js.map