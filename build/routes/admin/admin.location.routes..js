"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _common_1 = require("@common");
const celebrate_2 = require("celebrate");
const _middlewares_1 = __importDefault(require("@middlewares"));
const admin_location_controller_1 = require("../../controllers/admin/admin.location.controller");
class AdminLocationRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.get('/getCountries', _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_location_controller_1.AdminLocationController.getCountries(req, res, next);
        });
        this.router.get('/:countryId/getStates', celebrate_1.celebrate({
            params: {
                countryId: celebrate_2.Joi.number().required(),
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_location_controller_1.AdminLocationController.getStates(req, res, next);
        });
        this.router.post('/addCity', celebrate_1.celebrate({
            body: {
                countryId: _common_1.VALIDATION.CITY.COUNTRY_ID.required(),
                stateId: _common_1.VALIDATION.CITY.STATE_ID.required(),
                cityName: _common_1.VALIDATION.CITY.CITY_NAME.required(),
                iconImage: _common_1.VALIDATION.CITY.ICONE_IMAGE,
                isFeatured: _common_1.VALIDATION.GENERAL.BOOLEAN.required(),
                zipCodes: _common_1.VALIDATION.CITY.ZIP_CODES
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_location_controller_1.AdminLocationController.addCity(req, res, next);
        });
        this.router.put('/updateCity', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.CITY.ID.required(),
                countryId: _common_1.VALIDATION.CITY.COUNTRY_ID.required(),
                stateId: _common_1.VALIDATION.CITY.STATE_ID.required(),
                cityName: _common_1.VALIDATION.CITY.CITY_NAME.required(),
                iconImage: _common_1.VALIDATION.CITY.ICONE_IMAGE,
                isFeatured: _common_1.VALIDATION.GENERAL.BOOLEAN.required(),
                zipCodes: _common_1.VALIDATION.CITY.ZIP_CODES
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_location_controller_1.AdminLocationController.updateCity(req, res, next);
        });
        this.router.get('/cityList', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { countryId: _common_1.VALIDATION.CITY.COUNTRY_ID.allow(''), stateId: _common_1.VALIDATION.CITY.STATE_ID.allow(''), status: _common_1.VALIDATION.USER.STATUS, sortKey: _common_1.VALIDATION.GENERAL.STRING.allow(''), sortOrder: _common_1.VALIDATION.SORT.SORT_ORDER })
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_location_controller_1.AdminLocationController.cityList(req, res, next);
        });
        this.router.get('/:cityId/cityDetails', celebrate_1.celebrate({
            params: {
                cityId: _common_1.VALIDATION.GENERAL.ID,
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_location_controller_1.AdminLocationController.cityDetails(req, res, next);
        });
        this.router.put('/:cityId/activeCity', celebrate_1.celebrate({
            params: {
                cityId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_location_controller_1.AdminLocationController.activeCity(req, res, next);
        });
        this.router.put('/:cityId/inactiveCity', celebrate_1.celebrate({
            params: {
                cityId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_location_controller_1.AdminLocationController.inactiveCity(req, res, next);
        });
        this.router.get('/cityList/:stateId', celebrate_1.celebrate({
            params: {
                stateId: _common_1.VALIDATION.CITY.STATE_ID.required()
            }
        }), (req, res, next) => {
            admin_location_controller_1.AdminLocationController.cityListAccordingToState(req, res, next);
        });
    }
}
exports.default = new AdminLocationRouteClass('/location');
//# sourceMappingURL=admin.location.routes..js.map