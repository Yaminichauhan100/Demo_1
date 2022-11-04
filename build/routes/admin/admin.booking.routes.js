"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _middlewares_1 = __importDefault(require("@middlewares"));
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const celebrate_1 = require("celebrate");
const _common_1 = require("@common");
const admin_booking_controller_1 = require("../../controllers/admin/admin.booking.controller");
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
        this.router.get('/list', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { fromDate: _common_1.VALIDATION.PROPERTY.fromDate, toDate: _common_1.VALIDATION.PROPERTY.toDate, categoryId: _common_1.VALIDATION.GENERAL.ID, subCategoryId: _common_1.VALIDATION.GENERAL.ID, type: _common_1.VALIDATION.GENERAL.NUMBER.valid([7, 4, 8, 0, 1, 3, 2]), sortKey: _common_1.VALIDATION.PROPERTY.BOOKING_SORTKEY, minAmount: _common_1.VALIDATION.PROPERTY.FLOOR.min(0), maxAmount: _common_1.VALIDATION.PROPERTY.FLOOR, countryId: _common_1.VALIDATION.PROPERTY.COUNTRY_ID, cityId: _common_1.VALIDATION.PROPERTY.CITY_ID, stateId: _common_1.VALIDATION.PROPERTY.STATE_ID, propertyId: _common_1.VALIDATION.GENERAL.ID, sortOrder: _common_1.VALIDATION.GENERAL.NUMBER.allow(1, -1), bookingType: _common_1.VALIDATION.BOOKING.ADMIN_BOOKING_TYPE })
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_booking_controller_1.AdminBookingController.bookingHistory(req, res, next);
        });
        this.router.get('/booking', celebrate_1.celebrate({
            query: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, async (req, res, next) => {
            try {
                await admin_booking_controller_1.AdminBookingController.fetchBookingDetail(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
    }
}
exports.default = new AdminBookingRouteClass('/booking');
//# sourceMappingURL=admin.booking.routes.js.map