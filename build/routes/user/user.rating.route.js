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
class V1UserRatingRouteClass extends _baseRoute_1.default {
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
                bookingId: _common_1.VALIDATION.GENERAL.ID.required(),
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                hostId: _common_1.VALIDATION.GENERAL.ID.required(),
                rating: celebrate_1.Joi.number().min(1).max(5).required(),
                review: _common_1.VALIDATION.GENERAL.STRING.optional().allow(''),
            },
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserRatingController.addRatingAndReviews(req, res, next);
        });
        this.router.delete('/', celebrate_1.celebrate({
            query: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required(),
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserRatingController.deleteRatingAndReviews(req, res, next);
        });
        this.router.get('/list', celebrate_1.celebrate({
            body: {
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                isFeatured: _common_1.VALIDATION.GENERAL.NUMBER.required(),
                page: _common_1.VALIDATION.GENERAL.PAGINATION.page.required(),
                limit: _common_1.VALIDATION.GENERAL.PAGINATION.limit,
                sortBy: _common_1.VALIDATION.SORT.SORT_ORDER
            },
        }), (req, res, next) => {
            _controllers_1.UserRatingController.getPropertyRatingList(req, res, next);
        });
    }
}
exports.default = new V1UserRatingRouteClass('/rating');
//# sourceMappingURL=user.rating.route.js.map