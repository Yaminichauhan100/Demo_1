"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _common_1 = require("@common");
const _middlewares_1 = __importDefault(require("@middlewares"));
const admin_property_controller_1 = require("../../controllers/admin/admin.property.controller");
class AdminCategoryRouteClass extends _baseRoute_1.default {
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
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { regStartDate: _common_1.VALIDATION.ADMIN_PROPERTY_LISTING.REG_START_DATE, regEndDate: _common_1.VALIDATION.ADMIN_PROPERTY_LISTING.REG_END_DATE, minBooking: _common_1.VALIDATION.ADMIN_PROPERTY_LISTING.MIN_BOOKING, maxBooking: _common_1.VALIDATION.ADMIN_PROPERTY_LISTING.MAX_BOOKING, countryId: _common_1.VALIDATION.GENERAL.STRING, stateId: _common_1.VALIDATION.GENERAL.STRING, status: _common_1.VALIDATION.USER.STATUS, claimedStatus: _common_1.VALIDATION.GENERAL.BOOLEAN, sortKey: _common_1.VALIDATION.GENERAL.STRING, hostName: _common_1.VALIDATION.GENERAL.STRING, sortOrder: _common_1.VALIDATION.GENERAL.NUMBER.allow(1, -1) })
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_property_controller_1.AdminPropertyController.getProperty(req, res, next);
        });
        this.router.get('/:id/propertyDetails', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_property_controller_1.AdminPropertyController.propertyDetails(req, res, next);
        });
        this.router.get('/floorData/:propertyId/:floorNumber', celebrate_1.celebrate({
            params: {
                propertyId: _common_1.VALIDATION.PROPERTY.ID.required(),
                floorNumber: _common_1.VALIDATION.GENERAL.NUMBER,
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_property_controller_1.AdminPropertyController.floorDetail(req, res, next);
        });
        this.router.put('/:id/active', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_property_controller_1.AdminPropertyController.activate(req, res, next);
        });
        this.router.put('/:id/inactive', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_property_controller_1.AdminPropertyController.inActivate(req, res, next);
        });
        this.router.put('/:id/archive', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.GENERAL.ID.required()
            },
            query: {
                type: _common_1.VALIDATION.GENERAL.NUMBER
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_property_controller_1.AdminPropertyController.archive(req, res, next);
        });
        this.router.put('/featuredProperty', celebrate_1.celebrate({
            body: {
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                isFeaturedProperty: _common_1.VALIDATION.GENERAL.BOOLEAN.valid(true, false).required()
            }
        }), _middlewares_1.default.VerifyAdminSession, async (req, res, next) => {
            await admin_property_controller_1.AdminPropertyController.updateFeaturedProperty(req, res, next);
        });
    }
}
exports.default = new AdminCategoryRouteClass('/property');
//# sourceMappingURL=admin.property.routes.js.map