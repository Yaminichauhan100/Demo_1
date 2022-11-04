"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const celebrate_1 = require("celebrate");
const _common_1 = require("@common");
const _middlewares_1 = __importDefault(require("@middlewares"));
const _controllers_1 = require("@controllers");
class V1HostCoHOstRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.post('/add', celebrate_1.celebrate({
            body: {
                name: _common_1.VALIDATION.USER.NAME.required(),
                email: _common_1.VALIDATION.USER.EMAIL.required(),
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE.required(),
                phoneNo: _common_1.VALIDATION.USER.PHONE.required(),
                permissions: celebrate_1.Joi.any(),
                territory: {
                    stateId: _common_1.VALIDATION.PROPERTY.CITY_ID,
                    cityId: _common_1.VALIDATION.PROPERTY.CITY_ID,
                    countryId: _common_1.VALIDATION.PROPERTY.CITY_ID,
                    propertyId: _common_1.VALIDATION.PROPERTY.CITY_ID
                }
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.CoHostController.addCoHost(req, res, next);
        });
        this.router.post('/addTerritory', celebrate_1.celebrate({
            body: {
                cohostId: _common_1.VALIDATION.GENERAL.ID.required(),
                stateId: _common_1.VALIDATION.PROPERTY.CITY_ID,
                cityId: _common_1.VALIDATION.PROPERTY.CITY_ID,
                countryId: _common_1.VALIDATION.PROPERTY.CITY_ID,
                propertyId: _common_1.VALIDATION.PROPERTY.CITY_ID,
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.CoHostController.addCoHostTerritory(req, res, next);
        });
        this.router.post('/editTerritory', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.GENERAL.ID.required(),
                stateId: _common_1.VALIDATION.PROPERTY.CITY_ID,
                cityId: _common_1.VALIDATION.PROPERTY.CITY_ID,
                countryId: _common_1.VALIDATION.PROPERTY.CITY_ID,
                propertyId: _common_1.VALIDATION.PROPERTY.CITY_ID,
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.CoHostController.editCoHostTerritory(req, res, next);
        });
        this.router.get('/', celebrate_1.celebrate({
            query: Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION)
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.CoHostController.getCoHostListing(req, res, next);
        });
        this.router.get('/details/:cohostId/:type', celebrate_1.celebrate({
            params: {
                cohostId: _common_1.VALIDATION.GENERAL.ID.required(),
                type: _common_1.VALIDATION.USER.COHOST_DETAILS_TYPE
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.CoHostController.cohostDetails(req, res, next);
        });
        this.router.get('/getCohostDetails/:id', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.CoHostController.getCohostDetails(req, res, next);
        });
        this.router.get('/getCountries', _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.CoHostController.getAllCountries(req, res, next);
        });
        this.router.get('/getMultipleStates', celebrate_1.celebrate({
            query: {
                countryId: _common_1.VALIDATION.PROPERTY.CATEGORY_ID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.CoHostController.getMulitpleStates(req, res, next);
        });
        this.router.get('/getCities', celebrate_1.celebrate({
            query: {
                stateId: _common_1.VALIDATION.PROPERTY.CATEGORY_ID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.CoHostController.getCities(req, res, next);
        });
        this.router.get('/getProperties', celebrate_1.celebrate({
            query: {
                cityId: _common_1.VALIDATION.PROPERTY.CATEGORY_ID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.CoHostController.getProperties(req, res, next);
        });
        this.router.put('/updateCohostProfile', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.GENERAL.ID.required(),
                name: _common_1.VALIDATION.USER.NAME,
                permissions: celebrate_1.Joi.any(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.CoHostController.updateCoHost(req, res, next);
        });
        this.router.patch('/', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.PROPERTY.ID.required(),
                type: _common_1.VALIDATION.USER.COHOST_TYPE
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.CoHostController.activateProperty(req, res, next);
        });
        this.router.put('/delete-permission', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.CoHostController.deletePermission(req, res, next);
        });
    }
}
exports.default = new V1HostCoHOstRouteClass('/coHost');
//# sourceMappingURL=host.cohost.routes.js.map