"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const celebrate_1 = require("celebrate");
const _middlewares_1 = __importDefault(require("@middlewares"));
const _controllers_1 = require("@controllers");
const _common_1 = require("@common");
class V1UserGiftCardRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.post('/send', celebrate_1.celebrate({
            body: {
                amount: _common_1.VALIDATION.PROPERTY.FLOOR.required(),
                to: _common_1.VALIDATION.GENERAL.STRING.required(),
                from: _common_1.VALIDATION.GENERAL.STRING.required(),
                message: _common_1.VALIDATION.GENERAL.STRING
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserGiftcardController.sendGiftCard(req, res, next);
        });
        this.router.get('/', celebrate_1.celebrate({
            query: {
                startDate: _common_1.VALIDATION.ADMIN_HOST_LISTING.REG_START_DATE,
                endDate: _common_1.VALIDATION.ADMIN_HOST_LISTING.REG_END_DATE,
                page: _common_1.VALIDATION.GENERAL.PAGINATION.page.required(),
                limit: _common_1.VALIDATION.GENERAL.PAGINATION.limit,
            }
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserGiftcardController.listGiftCard(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/myCards', celebrate_1.celebrate({
            query: {
                startDate: _common_1.VALIDATION.ADMIN_HOST_LISTING.REG_START_DATE,
                endDate: _common_1.VALIDATION.ADMIN_HOST_LISTING.REG_END_DATE,
                page: _common_1.VALIDATION.GENERAL.PAGINATION.page.required(),
                limit: _common_1.VALIDATION.GENERAL.PAGINATION.limit,
            }
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserGiftcardController.listMyGiftCard(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/get-amount', _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            _controllers_1.UserGiftcardController.getAmounts(req, res, next);
        });
        this.router.delete('/redeem?', celebrate_1.celebrate({
            query: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserGiftcardController.removeGiftCard(req, res, next);
        });
        this.router.get('/redeem?', celebrate_1.celebrate({
            body: {
                giftCardNumber: _common_1.VALIDATION.GENERAL.STRING.required(),
                bookingId: _common_1.VALIDATION.GENERAL.ID.required(),
                giftCardPin: _common_1.VALIDATION.GENERAL.NUMBER.required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserGiftcardController.fetchGiftCard(req, res, next);
        });
        this.router.post('/redeem', celebrate_1.celebrate({
            body: {
                giftCardId: _common_1.VALIDATION.GENERAL.ID.required(),
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserGiftcardController.redeemGiftCard(req, res, next);
        });
        this.router.post('/checkout', celebrate_1.celebrate({
            body: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required(),
                paymentMethod: _common_1.VALIDATION.GENERAL.STRING.valid("giftCard"),
                giftCardNo: _common_1.VALIDATION.GENERAL.STRING.required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserGiftcardController.checkOutUsingGiftCard(req, res, next);
        });
    }
}
exports.default = new V1UserGiftCardRouteClass('/giftCard');
//# sourceMappingURL=user.giftcard.routes.js.map