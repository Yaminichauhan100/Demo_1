"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _common_1 = require("@common");
const _middlewares_1 = __importDefault(require("@middlewares"));
const admin_amenities_controller_1 = require("../../controllers/admin/admin.amenities.controller");
class AdminHostRouteClass extends _baseRoute_1.default {
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
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { status: _common_1.VALIDATION.USER.STATUS, type: _common_1.VALIDATION.GENERAL.STRING, sortKey: _common_1.VALIDATION.SORT.ADMIN_HOST_LISTING, sortOrder: _common_1.VALIDATION.GENERAL.NUMBER.allow(1, -1) })
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_amenities_controller_1.AdminAmenitiesController.getAmenities(req, res, next);
        });
        this.router.post('/add', celebrate_1.celebrate({
            body: {
                name: _common_1.VALIDATION.AMENITIES.NAME.required(),
                type: _common_1.VALIDATION.AMENITIES.TYPE.required(),
                iconImage: _common_1.VALIDATION.AMENITIES.icon_image.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_amenities_controller_1.AdminAmenitiesController.addAmenities(req, res, next);
        });
        this.router.put('/update', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.AMENITIES.ID.required(),
                name: _common_1.VALIDATION.AMENITIES.NAME.required(),
                type: _common_1.VALIDATION.AMENITIES.TYPE.required(),
                iconImage: _common_1.VALIDATION.AMENITIES.icon_image.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_amenities_controller_1.AdminAmenitiesController.updateAmenities(req, res, next);
        });
        this.router.put('/:id/active', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.USER.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_amenities_controller_1.AdminAmenitiesController.activate(req, res, next);
        });
        this.router.put('/:id/inactive', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.USER.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_amenities_controller_1.AdminAmenitiesController.inActivate(req, res, next);
        });
        this.router.get('/:id/details', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.USER.ID
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_amenities_controller_1.AdminAmenitiesController.details(req, res, next);
        });
        this.router.put('/isFeatured', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.AMENITIES.ID.required(),
                isFeatured: _common_1.VALIDATION.GENERAL.NUMBER.required(),
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_amenities_controller_1.AdminAmenitiesController.updateAmenitiesFeatureStatus(req, res, next);
        });
    }
}
exports.default = new AdminHostRouteClass('/amenities');
//# sourceMappingURL=admin.amenities.routes.js.map