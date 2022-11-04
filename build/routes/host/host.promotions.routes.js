"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _middlewares_1 = __importDefault(require("@middlewares"));
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _controllers_1 = require("@controllers");
const celebrate_1 = require("celebrate");
const _common_1 = require("@common");
class HostPromotionClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.post('/', celebrate_1.celebrate({
            body: {
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                categoryId: _common_1.VALIDATION.GENERAL.ANY,
                subCategoryId: _common_1.VALIDATION.GENERAL.ANY,
                countryId: _common_1.VALIDATION.GENERAL.ID,
                cityId: _common_1.VALIDATION.GENERAL.ID.required(),
                duration: _common_1.VALIDATION.GENERAL.NUMBER.required(),
                slotType: _common_1.VALIDATION.GENERAL.ANY.required(),
                price: _common_1.VALIDATION.GENERAL.NUMBER.required(),
                taxPercentage: _common_1.VALIDATION.GENERAL.NUMBER.required(),
                dailyPrice: _common_1.VALIDATION.GENERAL.NUMBER.required(),
                tax: _common_1.VALIDATION.GENERAL.NUMBER.required(),
                totalPrice: _common_1.VALIDATION.GENERAL.NUMBER.required(),
                listingType: _common_1.VALIDATION.GENERAL.NUMBER.required(),
                promoId: _common_1.VALIDATION.GENERAL.ID
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPromotionController.createPromotion(req, res, next);
        });
        this.router.get('/price', celebrate_1.celebrate({
            query: {
                propertyId: _common_1.VALIDATION.GENERAL.ID,
                cityId: _common_1.VALIDATION.GENERAL.ID,
                duration: _common_1.VALIDATION.GENERAL.NUMBER
                    .valid(_common_1.ENUM.PROPERTY.PROMOTION.DURATION.DAILY, _common_1.ENUM.PROPERTY.PROMOTION.DURATION.WEEKLY, _common_1.ENUM.PROPERTY.PROMOTION.DURATION.MONTHLY).required(),
                categoryId: _common_1.VALIDATION.GENERAL.ID,
                subCategoryId: _common_1.VALIDATION.GENERAL.ID,
                slotType: _common_1.VALIDATION.GENERAL.NUMBER,
                listingType: _common_1.VALIDATION.GENERAL.NUMBER
                    .valid(_common_1.ENUM.ADVERTISEMENT.ListingPlacement.HOME, _common_1.ENUM.ADVERTISEMENT.ListingPlacement.LISTING).required()
            }
        }), _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                _controllers_1.HostPromotionController.fetchPrice(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/:promoId', celebrate_1.celebrate({
            params: {
                promoId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPromotionController.fetchPromotionDetail(req, res, next);
        });
        this.router.get('/', celebrate_1.celebrate({
            query: {
                page: _common_1.VALIDATION.GENERAL.PAGINATION.page,
                limit: _common_1.VALIDATION.GENERAL.PAGINATION.limit,
                promoStatus: _common_1.VALIDATION.GENERAL.NUMBER,
                categoryId: _common_1.VALIDATION.GENERAL.ID,
                subCategoryIds: _common_1.VALIDATION.GENERAL.ANY,
                paymentStatus: _common_1.VALIDATION.GENERAL.NUMBER,
                search: _common_1.VALIDATION.GENERAL.STRING,
                propertyId: _common_1.VALIDATION.GENERAL.ID
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPromotionController.fetchPromotionListing(req, res, next);
        });
        this.router.get('/city/:id', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPromotionController.checkPricing(req, res, next);
        });
    }
}
exports.default = new HostPromotionClass('/promote');
//# sourceMappingURL=host.promotions.routes.js.map