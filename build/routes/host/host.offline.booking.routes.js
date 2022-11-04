"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _controllers_1 = require("@controllers");
const _middlewares_1 = __importDefault(require("@middlewares"));
const celebrate_1 = require("celebrate");
const _services_1 = require("@services");
const _common_1 = require("@common");
class V1OfflineBookingRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.post('/user', _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.HostOfflineBookingController.addUserDetail(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.post('/addSpaceCart', celebrate_1.celebrate({
            body: {
                fromDate: celebrate_1.Joi.date().required(),
                toDate: celebrate_1.Joi.date().required(),
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                spaceId: _common_1.VALIDATION.GENERAL.ANY.required(),
                quantity: celebrate_1.Joi.number().min(1).required(),
                userId: _common_1.VALIDATION.GENERAL.ID,
                price: celebrate_1.Joi.number().required(),
                bookingType: _common_1.VALIDATION.BOOKING.BOOKING_TYPE,
                totalHours: _common_1.VALIDATION.GENERAL.NUMBER.min(1).max(168).when('bookingType', {
                    is: _common_1.ENUM.USER.BOOKING_TYPE.HOURLY,
                    then: celebrate_1.Joi.required().label(`In case of hourly booking please pass totalHours.`)
                }),
                totalMonths: _common_1.VALIDATION.GENERAL.NUMBER.min(1).max(12).when('bookingType', {
                    is: _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY,
                    then: celebrate_1.Joi.required().label(`In case of monthly booking please pass totalMonths.`)
                }),
            },
            headers: _services_1.authorizationHeaderObj
        }), _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.HostOfflineBookingController.createBookingCart(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.post('/bookSpace', celebrate_1.celebrate({
            body: {
                cartId: _common_1.VALIDATION.GENERAL.ID.required(),
                occupancy: _common_1.VALIDATION.GENERAL.NUMBER.required()
            },
            headers: _services_1.authorizationHeaderObj
        }), async (req, res, next) => {
            try {
                await _controllers_1.HostOfflineBookingController.bookOfflineSpace(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.put('/bookSpace', celebrate_1.celebrate({
            body: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required(),
                cartId: _common_1.VALIDATION.GENERAL.ID.required(),
                occupancy: _common_1.VALIDATION.GENERAL.NUMBER.required()
            },
            headers: _services_1.authorizationHeaderObj
        }), async (req, res, next) => {
            try {
                await _controllers_1.HostOfflineBookingController.updateOfflineBooking(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/user/:id', celebrate_1.celebrate({
            headers: _services_1.authorizationHeaderObj
        }), async (req, res, next) => {
            try {
                await _controllers_1.HostOfflineBookingController.getOfflineUserDetail(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.put('/user', _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.HostOfflineBookingController.updateOfflineUserDetail(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/listing', celebrate_1.celebrate({
            query: {
                userType: _common_1.VALIDATION.PROPERTY.USER_TYPE.required(),
                bookingType: _common_1.VALIDATION.PROPERTY.PARTNER_BOOKING_TYPE.required(),
                fromDate: celebrate_1.Joi.date().required(),
                toDate: celebrate_1.Joi.date().required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostOfflineBookingController.fetchPropertyDetails(req, res, next);
        });
    }
}
exports.default = new V1OfflineBookingRouteClass('/offline');
//# sourceMappingURL=host.offline.booking.routes.js.map