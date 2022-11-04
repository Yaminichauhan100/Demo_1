"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const celebrate_1 = require("celebrate");
const _middlewares_1 = __importDefault(require("@middlewares"));
const _controllers_1 = require("@controllers");
const _common_1 = require("@common");
const _services_1 = require("@services");
class V1UserEmployeeRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.get('/properties', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { cityId: _common_1.VALIDATION.GENERAL.ID, stateId: _common_1.VALIDATION.GENERAL.NUMBER, countryId: _common_1.VALIDATION.GENERAL.NUMBER, sortKey: _common_1.VALIDATION.SORT.ADMIN_HOST_LISTING, sortOrder: _common_1.VALIDATION.GENERAL.NUMBER.valid(1, -1), userId: _common_1.VALIDATION.GENERAL.ID })
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserEmployeeController.fetchEmployeeProperties(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/getCountries', _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserEmployeeController.fetchUniqueAssociatedCountries(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/getStates/:countryId', celebrate_1.celebrate({
            params: {
                countryId: _common_1.VALIDATION.GENERAL.NUMBER
            }
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserEmployeeController.fetchUniqueAssociatedStates(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/getCity/:countryId', celebrate_1.celebrate({
            params: {
                countryId: _common_1.VALIDATION.GENERAL.NUMBER
            }
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserEmployeeController.fetchUniqueAssociatedCity(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/details', celebrate_1.celebrate({
            query: {
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                partnerId: _common_1.VALIDATION.GENERAL.ID,
                userType: _common_1.VALIDATION.PROPERTY.USER_TYPE.required(),
                userId: _common_1.VALIDATION.GENERAL.ID,
                bookingType: _common_1.VALIDATION.PROPERTY.PARTNER_BOOKING_TYPE
            }
        }), async (req, res, next) => {
            try {
                await _controllers_1.UserEmployeeController.fetchPropertyDetails(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/floorData', celebrate_1.celebrate({
            query: {
                partnerId: _common_1.VALIDATION.GENERAL.ID,
                spaceId: _common_1.VALIDATION.GENERAL.ID,
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                floorNumber: _common_1.VALIDATION.GENERAL.NUMBER.required(),
                userType: _common_1.VALIDATION.PROPERTY.USER_TYPE.required(),
                bookingType: _common_1.VALIDATION.PROPERTY.PARTNER_BOOKING_TYPE.required(),
                fromDate: _common_1.VALIDATION.PROPERTY.fromDate,
                toDate: _common_1.VALIDATION.PROPERTY.toDate
            }
        }), async (req, res, next) => {
            try {
                await _controllers_1.UserEmployeeController.fetchFloorData(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.post('/bookSpace', celebrate_1.celebrate({
            body: {
                cartId: _common_1.VALIDATION.GENERAL.ID.required(),
                occupancy: _common_1.VALIDATION.GENERAL.NUMBER.required(),
                isEmployee: _common_1.VALIDATION.GENERAL.BOOLEAN.valid(true).required(),
                extended: _common_1.VALIDATION.GENERAL.BOOLEAN.valid(true),
                prolongBookingId: _common_1.VALIDATION.GENERAL.ID.when('extended', {
                    is: true,
                    then: celebrate_1.Joi.required().label(`In case of extended booking please pass old bookingId.`)
                })
            },
            headers: _services_1.authorizationHeaderObj
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserEmployeeController.bookSpaceForEmployee(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.post('/checkout', celebrate_1.celebrate({
            body: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required(),
                paymentMethod: _common_1.VALIDATION.GENERAL.STRING.valid("partner"),
            },
            headers: _services_1.authorizationHeaderObj
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserEmployeeController.employeeCheckoutProperty(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
    }
}
exports.default = new V1UserEmployeeRouteClass('/employee');
//# sourceMappingURL=user.employee.routes.js.map