"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _controllers_1 = require("@controllers");
const _middlewares_1 = __importDefault(require("@middlewares"));
const celebrate_1 = require("celebrate");
const _common_1 = require("@common");
class V1HostDashboardRouteClass extends _baseRoute_1.default {
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
                countryId: _common_1.VALIDATION.CITY.COUNTRY_ID,
                stateId: _common_1.VALIDATION.CITY.STATE_ID,
                cityId: _common_1.VALIDATION.CITY.ID,
                propertyId: _common_1.VALIDATION.PROPERTY.ID,
                year: celebrate_1.Joi.number(),
                month: celebrate_1.Joi.number()
            },
        }), _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.HostDashboardController.getBookingStatusList(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/revenue', celebrate_1.celebrate({
            query: {
                countryId: _common_1.VALIDATION.CITY.COUNTRY_ID,
                stateId: _common_1.VALIDATION.CITY.STATE_ID,
                cityId: _common_1.VALIDATION.CITY.ID,
                propertyId: _common_1.VALIDATION.PROPERTY.ID,
                year: celebrate_1.Joi.number(),
                month: celebrate_1.Joi.number(),
                sortOrder: _common_1.VALIDATION.GENERAL.NUMBER.allow(1, -1)
            },
        }), _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.HostDashboardController.getRevenueBasedListing(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/revenue/customer', celebrate_1.celebrate({
            query: {
                countryId: _common_1.VALIDATION.CITY.COUNTRY_ID,
                stateId: _common_1.VALIDATION.CITY.STATE_ID,
                cityId: _common_1.VALIDATION.CITY.ID,
                propertyId: _common_1.VALIDATION.PROPERTY.ID,
                year: celebrate_1.Joi.number(),
                month: celebrate_1.Joi.number()
            },
        }), _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.HostDashboardController.getRevenueCustomerBasedListing(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/property/statistics', celebrate_1.celebrate({
            query: {
                countryId: _common_1.VALIDATION.CITY.COUNTRY_ID,
                stateId: _common_1.VALIDATION.CITY.STATE_ID,
                cityId: _common_1.VALIDATION.CITY.ID,
                propertyId: _common_1.VALIDATION.PROPERTY.ID,
                year: celebrate_1.Joi.number(),
                month: celebrate_1.Joi.number(),
                type: _common_1.VALIDATION.GENERAL.STRING
            },
        }), _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.HostDashboardController.getPropertyAnalyticsData(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/category/performance', celebrate_1.celebrate({
            query: {
                countryId: _common_1.VALIDATION.CITY.COUNTRY_ID,
                stateId: _common_1.VALIDATION.CITY.STATE_ID,
                cityId: _common_1.VALIDATION.CITY.ID,
                propertyId: _common_1.VALIDATION.PROPERTY.ID,
                year: celebrate_1.Joi.number(),
                month: celebrate_1.Joi.number()
            },
        }), _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.HostDashboardController.getCategoryAnalyticsData(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
    }
}
exports.default = new V1HostDashboardRouteClass('/dashboard');
//# sourceMappingURL=host.dashboard.routes.js.map