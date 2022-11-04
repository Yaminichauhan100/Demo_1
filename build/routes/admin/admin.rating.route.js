"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const celebrate_1 = require("celebrate");
const _common_1 = require("@common");
const admin_rating_controller_1 = require("../../controllers/admin/admin.rating.controller");
const _middlewares_1 = __importDefault(require("@middlewares"));
class AdminBookingRouteClass extends _baseRoute_1.default {
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
            query: {
                rating: _common_1.VALIDATION.GENERAL.STRING,
                search: _common_1.VALIDATION.GENERAL.STRING,
                isFeatured: _common_1.VALIDATION.GENERAL.NUMBER,
                propertyId: _common_1.VALIDATION.GENERAL.STRING,
                startDate: _common_1.VALIDATION.ADMIN_HOST_LISTING.REG_START_DATE,
                endDate: _common_1.VALIDATION.ADMIN_HOST_LISTING.REG_END_DATE,
                page: _common_1.VALIDATION.GENERAL.PAGINATION.page.required(),
                limit: _common_1.VALIDATION.GENERAL.PAGINATION.limit,
                sortBy: _common_1.VALIDATION.SORT.SORT_ORDER,
            }
        }), (req, res, next) => {
            admin_rating_controller_1.AdminRatingController.getRatingList(req, res, next);
        });
        this.router.get('/:ratingId', celebrate_1.celebrate({
            query: {
                ratingId: _common_1.VALIDATION.GENERAL.ID,
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_rating_controller_1.AdminRatingController.getRatingInfo(req, res, next);
        });
        this.router.put('/isFeatured', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.AMENITIES.ID.required(),
                isFeatured: _common_1.VALIDATION.GENERAL.NUMBER.required(),
            }
        }), (req, res, next) => {
            admin_rating_controller_1.AdminRatingController.updateRatingsFeatureStatus(req, res, next);
        });
    }
}
exports.default = new AdminBookingRouteClass('/rating');
//# sourceMappingURL=admin.rating.route.js.map