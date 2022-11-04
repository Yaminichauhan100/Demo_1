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
const _services_1 = require("@services");
class V1UserPropertyRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.get('/getLocation', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { searchKeyword: _common_1.VALIDATION.USER.KEYWORD.required() })
        }), (req, res, next) => {
            _controllers_1.UserLocationController.getLocation(req, res, next);
        });
        this.router.get('/category', (req, res, next) => {
            _controllers_1.UserLocationController.getCategories(req, res, next);
        });
        this.router.get('/list', celebrate_1.celebrate({
            query: {
                page: celebrate_1.Joi.number().min(1).required(),
                limit: celebrate_1.Joi.number().min(3).max(100).default(20).optional(),
                search: celebrate_1.Joi.string().trim().optional(),
                cityIds: _common_1.VALIDATION.PROPERTY.CITY_ID,
                lat: _common_1.VALIDATION.PROPERTY.FLOOR,
                long: _common_1.VALIDATION.PROPERTY.FLOOR,
                categoryIds: _common_1.VALIDATION.PROPERTY.CATEGORY_ID,
                subCategoryIds: _common_1.VALIDATION.PROPERTY.CATEGORY_ID,
                amenitiesIds: _common_1.VALIDATION.PROPERTY.AMENITIES_ID,
                sortKey: _common_1.VALIDATION.SORT.ADMIN_HOST_LISTING,
                sortOrder: _common_1.VALIDATION.GENERAL.NUMBER.valid(1, -1),
                fromDate: _common_1.VALIDATION.PROPERTY.fromDate,
                toDate: _common_1.VALIDATION.PROPERTY.toDate,
                minimumFloor: _common_1.VALIDATION.PROPERTY.FLOOR.min(0),
                maximumFloor: _common_1.VALIDATION.PROPERTY.FLOOR.min(0),
                minimumArea: _common_1.VALIDATION.PROPERTY.BUILT_UP_AREA.min(0),
                maximumArea: _common_1.VALIDATION.PROPERTY.BUILT_UP_AREA.min(0),
                minPrice: _common_1.VALIDATION.PROPERTY.FLOOR.min(0),
                maxPrice: _common_1.VALIDATION.PROPERTY.FLOOR.min(0),
                minCapacity: _common_1.VALIDATION.PROPERTY.FLOOR.min(0),
                maxCapacity: _common_1.VALIDATION.PROPERTY.FLOOR.min(0),
                userId: _common_1.VALIDATION.GENERAL.ID,
                zipCode: _common_1.VALIDATION.GENERAL.STRING,
                autoAcceptUpcomingBooking: _common_1.VALIDATION.GENERAL.BOOLEAN,
                zoomLevel: _common_1.VALIDATION.GENERAL.NUMBER,
                bookingType: _common_1.VALIDATION.GENERAL.NUMBER.valid(..._common_1.ENUM_ARRAY.USER_BOOKING_TYPE.BOOKING_TYPE),
                totalHours: _common_1.VALIDATION.GENERAL.NUMBER.min(0).max(56)
            }
        }), (req, res, next) => {
            _controllers_1.UserLocationController.getProperties(req, res, next);
        });
        this.router.get('/nearby', celebrate_1.celebrate({
            query: {
                lat: _common_1.VALIDATION.PROPERTY.FLOOR.min(0).required(),
                long: _common_1.VALIDATION.PROPERTY.FLOOR.min(0).required(),
                userId: _common_1.VALIDATION.GENERAL.ID
            }
        }), (req, res, next) => {
            _controllers_1.UserLocationController.fetchNearbyProperties(req, res, next);
        });
        this.router.get('/recentCityList', celebrate_1.celebrate({
            query: {
                userId: _common_1.VALIDATION.PROPERTY.PROPERTYID,
            }
        }), (req, res, next) => {
            _controllers_1.UserLocationController.fetchRecentSearchList(req, res, next);
        });
        this.router.get('/zipCodes', celebrate_1.celebrate({
            query: {
                searchKeyword: _common_1.VALIDATION.GENERAL.STRING,
            }
        }), (req, res, next) => {
            _controllers_1.UserLocationController.fetchZipcode(req, res, next);
        });
        this.router.get('/amenitiesListing', celebrate_1.celebrate({
            query: {
                propertyId: _common_1.VALIDATION.GENERAL_MONGO_ID
            }
        }), (req, res, next) => {
            _controllers_1.UserLocationController.getAmenities(req, res, next);
        });
        this.router.get('/cityListing', celebrate_1.celebrate({
            query: {
                cityIds: _common_1.VALIDATION.PROPERTY.CITY_ID.required(),
            }
        }), (req, res, next) => {
            _controllers_1.UserLocationController.cityListing(req, res, next);
        });
        this.router.get('/propertyDetails', celebrate_1.celebrate({
            query: {
                id: _common_1.VALIDATION.GENERAL.ID.required(),
                userId: _common_1.VALIDATION.GENERAL.ID
            }
        }), (req, res, next) => {
            _controllers_1.UserLocationController.propertyDetails(req, res, next);
        });
        this.router.post('/recentCityList', celebrate_1.celebrate({
            body: {
                userId: _common_1.VALIDATION.GENERAL.ID.required(),
                cityId: _common_1.VALIDATION.GENERAL.ID.required(),
                cityName: _common_1.VALIDATION.GENERAL.STRING.required(),
            }
        }), (req, res, next) => {
            _controllers_1.UserLocationController.insertRecentCityList(req, res, next);
        });
        this.router.post('/favourite', celebrate_1.celebrate({
            body: {
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                action: _common_1.VALIDATION.PROPERTY.FAVOURITE_ACTION.required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserLocationController.markAsFavourite(req, res, next);
        });
        this.router.get('/favourite', celebrate_1.celebrate({
            query: {
                cityId: _common_1.VALIDATION.GENERAL.ID,
                stateId: _common_1.VALIDATION.GENERAL.STRING,
                countryId: _common_1.VALIDATION.GENERAL.STRING,
                bookingStatus: _common_1.VALIDATION.PROPERTY.FAV_BOOKING_STATUS,
                page: _common_1.VALIDATION.GENERAL.PAGINATION.page.required(),
                limit: _common_1.VALIDATION.GENERAL.PAGINATION.limit
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserLocationController.getFavouriteList(req, res, next);
        });
        this.router.get('/spaceDetailAndPricing', celebrate_1.celebrate({
            query: {
                fromDate: celebrate_1.Joi.date(),
                toDate: celebrate_1.Joi.date().greater(celebrate_1.Joi.ref('fromDate')),
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                spaceId: _common_1.VALIDATION.GENERAL.ID
            }
        }), async (req, res, next) => {
            try {
                await _controllers_1.UserLocationController.fetchOfferPricing(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.post('/spaceCart', celebrate_1.celebrate({
            body: {
                fromDate: celebrate_1.Joi.date().required(),
                toDate: celebrate_1.Joi.date().required(),
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                spaceId: _common_1.VALIDATION.GENERAL.ANY.required(),
                quantity: celebrate_1.Joi.number().min(1).required(),
                userId: _common_1.VALIDATION.GENERAL.ID,
                isEmployee: _common_1.VALIDATION.GENERAL.BOOLEAN.valid([true, false]).required(),
                bookingType: _common_1.VALIDATION.BOOKING.BOOKING_TYPE,
                totalHours: _common_1.VALIDATION.GENERAL.NUMBER.min(1).max(168).when('bookingType', {
                    is: _common_1.ENUM.USER.BOOKING_TYPE.HOURLY,
                    then: celebrate_1.Joi.required().label(`In case of hourly booking please pass totalHours.`)
                }),
                totalMonths: _common_1.VALIDATION.GENERAL.NUMBER.min(1).max(12).when('bookingType', {
                    is: _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY,
                    then: celebrate_1.Joi.required().label(`In case of monthly booking please pass totalMonths.`)
                }),
                partnerId: _common_1.VALIDATION.GENERAL.ID,
            },
            headers: _services_1.authorizationHeaderObj
        }), async (req, res, next) => {
            try {
                await _controllers_1.UserLocationController.addtoBookingCart(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.post('/prolongBookingCart', celebrate_1.celebrate({
            body: {
                fromDate: celebrate_1.Joi.date().required(),
                toDate: celebrate_1.Joi.date().required(),
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                spaceId: _common_1.VALIDATION.GENERAL.ANY.required(),
                quantity: celebrate_1.Joi.number().min(1).required(),
                isEmployee: _common_1.VALIDATION.GENERAL.BOOLEAN.valid([true, false]).required(),
                bookingType: _common_1.VALIDATION.GENERAL.NUMBER.valid(_common_1.ENUM.USER.BOOKING_TYPE.MONTHLY).required(),
                totalMonths: _common_1.VALIDATION.GENERAL.NUMBER.min(1).max(12).when('bookingType', {
                    is: _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY,
                    then: celebrate_1.Joi.required().label(`In case of monthly booking please pass totalMonths.`)
                }),
                partnerId: _common_1.VALIDATION.GENERAL.ID.when('isEmployee', {
                    is: true,
                    then: celebrate_1.Joi.required().label(`In case of employee booking please pass partnerId!`)
                }),
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            },
            headers: _services_1.authorizationHeaderObj
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserLocationController.createProLongBookingCart(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/spaceAvailability', celebrate_1.celebrate({
            query: {
                fromDate: celebrate_1.Joi.date().required(),
                toDate: celebrate_1.Joi.date().required(),
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                spaceId: _common_1.VALIDATION.GENERAL.ID.required()
            },
            headers: _services_1.authorizationHeaderObj
        }), async (req, res, next) => {
            try {
                await _controllers_1.UserLocationController.fetchSpaceAvailability(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/spaceCart', celebrate_1.celebrate({
            query: {
                fromDate: celebrate_1.Joi.date().required(),
                toDate: celebrate_1.Joi.date().greater(celebrate_1.Joi.ref('fromDate')).required(),
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                spaceId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), async (req, res, next) => {
            try {
                await _controllers_1.UserLocationController.fetchBookingSummary(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/validateBooking/:bookingId', celebrate_1.celebrate({
            params: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            },
            headers: _services_1.authorizationHeaderObj
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserLocationController.validateBooking(req, res, next);
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
                extended: _common_1.VALIDATION.GENERAL.BOOLEAN.valid(true),
                prolongBookingId: _common_1.VALIDATION.GENERAL.ID.when('extended', {
                    is: true,
                    then: celebrate_1.Joi.required().label(`In case of extended booking please pass old bookingId.`)
                })
            },
            headers: _services_1.authorizationHeaderObj
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserLocationController.bookSpace(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.put('/pbVerification', celebrate_1.celebrate({
            body: {
                passbaseToken: _common_1.VALIDATION.GENERAL.STRING.required()
            },
            headers: _services_1.authorizationHeaderObj
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserLocationController.updatePbToken(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/abandonedSpace/:bookingId', celebrate_1.celebrate({
            params: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            },
            headers: _services_1.authorizationHeaderObj
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserLocationController.fetchBookedSpaceDetail(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/bookingSummary/:bookingId', celebrate_1.celebrate({
            params: {
                bookingId: _common_1.VALIDATION.GENERAL.ID
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserLocationController.bookingSummary(req, res, next);
        });
        this.router.get('/booking', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { fromDate: _common_1.VALIDATION.PROPERTY.fromDate, toDate: _common_1.VALIDATION.PROPERTY.toDate, categoryId: _common_1.VALIDATION.PROPERTY.CATEGORY_ID, subCategoryId: _common_1.VALIDATION.PROPERTY.CATEGORY_ID, cityId: _common_1.VALIDATION.GENERAL.ID, stateId: _common_1.VALIDATION.GENERAL.STRING, countryId: _common_1.VALIDATION.GENERAL.STRING, bookingStatus: _common_1.VALIDATION.GENERAL.NUMBER.valid([Object.values(_common_1.ENUM.BOOKING.STATUS)]), search: _common_1.VALIDATION.GENERAL.STRING.trim().lowercase(), sort: _common_1.VALIDATION.GENERAL.OBJECT })
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserLocationController.bookingList(req, res, next);
        });
        this.router.put('/booking', celebrate_1.celebrate({
            body: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required(),
                reason: _common_1.VALIDATION.GENERAL.STRING.required().trim(),
                description: _common_1.VALIDATION.GENERAL.STRING.optional().trim(),
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserLocationController.cancelBooking(req, res, next);
        });
        this.router.get('/bookingPolicy?', celebrate_1.celebrate({
            query: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserLocationController.bookingPolicy(req, res, next);
        });
        this.router.get('/favCityListing/:stateId', celebrate_1.celebrate({
            params: {
                stateId: _common_1.VALIDATION.USER.STATE_ID.required(),
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserLocationController.favCityListing(req, res, next);
        });
        this.router.get('/favCity/:countryId', celebrate_1.celebrate({
            params: {
                countryId: _common_1.VALIDATION.USER.STATE_ID.required(),
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserLocationController.favCityListingCountryWise(req, res, next);
        });
        this.router.get('/favCountryListing', _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserLocationController.favCountryListing(req, res, next);
        });
        this.router.get('/favStateListing/:countryId', celebrate_1.celebrate({
            params: {
                countryId: _common_1.VALIDATION.USER.COUNTRYID.required(),
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserLocationController.favStateListing(req, res, next);
        });
        this.router.post('/demo', celebrate_1.celebrate({
            body: {
                demoDate: _common_1.VALIDATION.USER.fromDate.required(),
                demoTime: _common_1.VALIDATION.GENERAL.STRING.required(),
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                remark: _common_1.VALIDATION.GENERAL.STRING.allow('').optional()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserLocationController.scheduleDemo(req, res, next);
        });
        this.router.get('/genrateLink/:propertyId', _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserLocationController.genrateLink(req, res, next);
        });
        this.router.get('/similar', celebrate_1.celebrate({
            query: {
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                categoryIds: _common_1.VALIDATION.PROPERTY.CATEGORY_ID.required(),
                userId: _common_1.VALIDATION.GENERAL.ID,
                fromDate: _common_1.VALIDATION.PROPERTY.fromDate,
                toDate: _common_1.VALIDATION.PROPERTY.toDate,
            }
        }), (req, res, next) => {
            _controllers_1.UserLocationController.fetchSimilarProperties(req, res, next);
        });
    }
}
exports.default = new V1UserPropertyRouteClass('/property');
//# sourceMappingURL=user.property.routes.js.map