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
class V1HostRatingRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.put('/reply', celebrate_1.celebrate({
            body: {
                reviewId: _common_1.VALIDATION.GENERAL.ID.required(),
                review: _common_1.VALIDATION.GENERAL.STRING.required(),
            },
        }), _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.HostRatingController.ratingReply(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/', celebrate_1.celebrate({
            query: {
                rating: _common_1.VALIDATION.GENERAL.STRING,
                propertyId: _common_1.VALIDATION.GENERAL.STRING,
                page: _common_1.VALIDATION.GENERAL.PAGINATION.page.required(),
                limit: _common_1.VALIDATION.GENERAL.PAGINATION.limit,
                sortBy: _common_1.VALIDATION.SORT.SORT_ORDER,
                countryId: _common_1.VALIDATION.PROPERTY.COUNTRY_ID,
                stateId: _common_1.VALIDATION.PROPERTY.STATE_ID,
                cityId: _common_1.VALIDATION.PROPERTY.CITY_ID,
            },
        }), _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.HostRatingController.getRatingList(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.delete('/', celebrate_1.celebrate({
            query: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostRatingController.deleteRatingAndReviews(req, res, next);
        });
    }
}
exports.default = new V1HostRatingRouteClass('/rating');
//# sourceMappingURL=host.rating.routes.js.map