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
class V1UserPaymentRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.post('/proceedPayment', celebrate_1.celebrate({
            body: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            },
            headers: _services_1.authorizationHeaderObj
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserPaymentController.proceedPayment(req, res, next);
        });
        this.router.put('/paymentPlan', celebrate_1.celebrate({
            body: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required(),
                paymentPlan: _common_1.VALIDATION.GENERAL.NUMBER.valid([Object.values(_common_1.ENUM.PAYMENT.PLAN)]).required()
            },
            headers: _services_1.authorizationHeaderObj
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserPaymentController.updatePaymentPlan(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/paymentPlan', celebrate_1.celebrate({
            query: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            },
            headers: _services_1.authorizationHeaderObj
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserPaymentController.fetchPaymentPlanAndPricing(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/invoice?', celebrate_1.celebrate({
            query: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            },
            headers: _services_1.authorizationHeaderObj
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserPaymentController.fetchInvoice(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/viewPlan?', celebrate_1.celebrate({
            query: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            },
            headers: _services_1.authorizationHeaderObj
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserPaymentController.fetchPlan(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
    }
}
exports.default = new V1UserPaymentRouteClass('/payment');
//# sourceMappingURL=user.payment.routes.js.map