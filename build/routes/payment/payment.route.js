"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _middlewares_1 = __importDefault(require("@middlewares"));
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _controllers_1 = require("@controllers");
const _common_1 = require("@common");
const _services_1 = require("@services");
class V1PaymentRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.post('/add/card', celebrate_1.celebrate({
            body: {
                token: celebrate_1.Joi.string().required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.PaymentController.createCustomer(req, res, next);
        });
        this.router.get('/customer/card/list', _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.PaymentController.getCustomerCardList(req, res, next);
        });
        this.router.post('/host/add/card', celebrate_1.celebrate({
            body: {
                token: celebrate_1.Joi.string().required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PaymentController.createHostCustomer(req, res, next);
        });
        this.router.get('/host/customer/card/list', _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PaymentController.getHostCustomerCardList(req, res, next);
        });
        this.router.delete('/host/card/:cardId', celebrate_1.celebrate({
            params: {
                cardId: _common_1.VALIDATION.GENERAL.STRING
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PaymentController.deleteHostCardFromStripe(req, res, next);
        });
        this.router.get('/setup/intent', _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.PaymentController.getSetupIntent(req, res, next);
        });
        this.router.get('/host/setup/intent', _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PaymentController.getSetupIntent(req, res, next);
        });
        this.router.delete('/card/:cardId', celebrate_1.celebrate({
            params: {
                cardId: _common_1.VALIDATION.GENERAL.STRING
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.PaymentController.deleteCardFromStripe(req, res, next);
        });
        this.router.post('/create/payment', celebrate_1.celebrate({
            body: {
                cardId: celebrate_1.Joi.string().required(),
                bookingId: celebrate_1.Joi.string().required(),
                savedCard: celebrate_1.Joi.boolean(),
                paymentPlan: celebrate_1.Joi.number().required(),
                cardDigit: celebrate_1.Joi.string()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.PaymentController.makePayment(req, res, next);
        });
        this.router.post('/create/3Dpayment', celebrate_1.celebrate({
            body: {
                data: celebrate_1.Joi.any().required(),
                bookingId: celebrate_1.Joi.string().required(),
                savedCard: celebrate_1.Joi.boolean(),
                paymentPlan: celebrate_1.Joi.number().required(),
                cardDigit: celebrate_1.Joi.string()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.PaymentController.make3DPayment(req, res, next);
        });
        this.router.put('/update/card', celebrate_1.celebrate({
            body: {
                name: celebrate_1.Joi.string().optional(),
                exp_month: celebrate_1.Joi.number().optional(),
                exp_year: celebrate_1.Joi.number().optional(),
                cardId: celebrate_1.Joi.string().required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.PaymentController.editCard(req, res, next);
        });
        this.router.get('/listing', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { status: celebrate_1.Joi.any(), fromDate: _common_1.VALIDATION.PROPERTY.fromDate, toDate: _common_1.VALIDATION.PROPERTY.toDate, minAmount: celebrate_1.Joi.number(), maxAmount: celebrate_1.Joi.number(), sortKey: _common_1.VALIDATION.GENERAL.STRING, sortOrder: _common_1.VALIDATION.GENERAL.NUMBER.allow(1, -1) })
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.PaymentController.paymentListing(req, res, next);
        });
        this.router.get('/host/listing', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { status: celebrate_1.Joi.any(), fromDate: _common_1.VALIDATION.PROPERTY.fromDate, toDate: _common_1.VALIDATION.PROPERTY.toDate, countryId: _common_1.VALIDATION.PROPERTY.COUNTRY_ID, stateId: _common_1.VALIDATION.PROPERTY.STATE_ID, cityId: _common_1.VALIDATION.PROPERTY.CITY_ID, sortKey: _common_1.VALIDATION.GENERAL.STRING, sortOrder: _common_1.VALIDATION.GENERAL.NUMBER.allow(1, -1), type: _common_1.VALIDATION.PAYMENT.type, propertyIds: _common_1.VALIDATION.GENERAL.ARRAY_OF_IDS, paymentStatus: _common_1.VALIDATION.GENERAL.PAYMENT_STATUS })
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PaymentController.hostPaymentListing(req, res, next);
        });
        this.router.post('/stripe/token-connection', celebrate_1.celebrate({
            body: {
                code: celebrate_1.Joi.string().required(),
                grant_type: celebrate_1.Joi.string().required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.PaymentController.makeStripeConnection(req, res, next);
        });
        this.router.delete('/stripe/disconnect-account', _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PaymentController.disconnectAccount(req, res, next);
        });
        this.router.get('/cron', (req, res, next) => {
            _controllers_1.PaymentController.updatePayoutListing(req, res, next);
        });
        this.router.post('/create/payout', celebrate_1.celebrate({
            body: {
                amount: celebrate_1.Joi.number().required(),
                currency: celebrate_1.Joi.string().required(),
                userId: _common_1.VALIDATION.USER.ID
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            _controllers_1.PaymentController.createPayout(req, res, next);
        });
        this.router.get('/get/exist-payout', celebrate_1.celebrate({
            params: {
                payoutId: celebrate_1.Joi.string().required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            _controllers_1.PaymentController.getPayoutList(req, res, next);
        });
        this.router.get('/get/payout-listing', _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            _controllers_1.PaymentController.getAllPayoutList(req, res, next);
        });
        this.router.get('/redirect-url', (req, res, next) => {
            _controllers_1.PaymentController.redirectUrl(req, res, next);
        });
        this.router.get('/stripe-connect-success', celebrate_1.celebrate({
            query: {
                id: _common_1.VALIDATION.GENERAL.ANY
            }
        }), (req, res, next) => {
            _controllers_1.PaymentController.stripeConnectSuccess(req, res, next);
        });
        this.router.get('/stripe-connect-account-detail', _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PaymentController.stripeConnectAccountDetail(req, res, next);
        });
        this.router.post('/create/gift-payment', celebrate_1.celebrate({
            body: {
                cardId: celebrate_1.Joi.string().required(),
                giftCardNo: celebrate_1.Joi.string().required(),
                savedCard: celebrate_1.Joi.boolean()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.PaymentController.makeGiftCardPayment(req, res, next);
        });
        this.router.post('/create/promotion-payment', celebrate_1.celebrate({
            body: {
                cardId: celebrate_1.Joi.string().required(),
                promotionId: _common_1.VALIDATION.GENERAL.ID.required(),
                savedCard: celebrate_1.Joi.boolean()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PaymentController.createPromotionPayment(req, res, next);
        });
        this.router.get('/apply-giftCard', celebrate_1.celebrate({
            params: {
                giftCardNo: celebrate_1.Joi.string().required(),
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.PaymentController.appplyGiftCard(req, res, next);
        });
        this.router.get('/host/viewPlan?', celebrate_1.celebrate({
            query: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            },
            headers: _services_1.authorizationHeaderObj
        }), _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.PaymentController.fetchPlan(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/user/initateRecurringPayments', _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.PaymentController.initiateRecurringPayments(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
    }
}
exports.default = new V1PaymentRouteClass('/');
//# sourceMappingURL=payment.route.js.map