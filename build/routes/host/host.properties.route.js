"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _common_1 = require("@common");
const _controllers_1 = require("@controllers");
const _middlewares_1 = __importDefault(require("@middlewares"));
class V1HostPropertyRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.post('', celebrate_1.celebrate({
            body: {
                name: _common_1.VALIDATION.PROPERTY.NAME,
                addressPrimary: _common_1.VALIDATION.PROPERTY.ADDRESS_PRIMARY,
                addressSecondary: _common_1.VALIDATION.PROPERTY.ADDRESS_SECONDARY,
                zipCode: _common_1.VALIDATION.PROPERTY.ZIP_CODE,
                images: _common_1.VALIDATION.PROPERTY.IMAGES,
                heading: _common_1.VALIDATION.PROPERTY.HEADING,
                description: _common_1.VALIDATION.PROPERTY.DESCRIPTION,
                amenities: _common_1.VALIDATION.PROPERTY.AMENITIES,
                autoAcceptUpcomingBooking: _common_1.VALIDATION.PROPERTY.AUTO_ACCEPT_BOOKING,
                address: _common_1.VALIDATION.GENERAL.STRING,
                country: _common_1.VALIDATION.PROPERTY.COUNTRY_OBJ,
                state: _common_1.VALIDATION.PROPERTY.STATE_OBJ,
                city: _common_1.VALIDATION.PROPERTY.CITY_OBJ,
                location: _common_1.VALIDATION.PROPERTY.LOCATION,
                propertyType: _common_1.VALIDATION.PROPERTY.PROPERTY_TYPE,
                termsAndCond: _common_1.VALIDATION.GENERAL.STRING,
                floorDetails: _common_1.VALIDATION.PROPERTY.FLOOR_DETAILS,
                status: _common_1.VALIDATION.PROPERTY.PROPERTY_DRAFT_STATUS,
                propertyId: _common_1.VALIDATION.GENERAL.ID,
                totalUnits: _common_1.VALIDATION.GENERAL.NUMBER,
                stepNumber: _common_1.VALIDATION.GENERAL.NUMBER,
                claimedStatus: _common_1.VALIDATION.GENERAL.BOOLEAN.allow(true),
                floorCorners: _common_1.VALIDATION.PROPERTY.floorCorners
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.addProperty(req, res, next);
        });
        this.router.put('', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.GENERAL.ID,
                name: _common_1.VALIDATION.PROPERTY.NAME,
                addressPrimary: _common_1.VALIDATION.PROPERTY.ADDRESS_PRIMARY,
                addressSecondary: _common_1.VALIDATION.PROPERTY.ADDRESS_SECONDARY,
                zipCode: _common_1.VALIDATION.PROPERTY.ZIP_CODE,
                images: _common_1.VALIDATION.PROPERTY.IMAGES,
                heading: _common_1.VALIDATION.PROPERTY.HEADING,
                description: _common_1.VALIDATION.PROPERTY.DESCRIPTION,
                amenities: _common_1.VALIDATION.PROPERTY.AMENITIES,
                autoAcceptUpcomingBooking: _common_1.VALIDATION.PROPERTY.AUTO_ACCEPT_BOOKING,
                address: _common_1.VALIDATION.GENERAL.STRING,
                country: _common_1.VALIDATION.PROPERTY.COUNTRY_OBJ,
                state: _common_1.VALIDATION.PROPERTY.STATE_OBJ,
                city: _common_1.VALIDATION.PROPERTY.CITY_OBJ,
                location: _common_1.VALIDATION.PROPERTY.EDITABLE_LOCATION,
                propertyType: _common_1.VALIDATION.PROPERTY.PROPERTY_TYPE,
                termsAndCond: _common_1.VALIDATION.GENERAL.STRING,
                floorDetails: _common_1.VALIDATION.PROPERTY.EDITABLE_FLOOR_DETAILS,
                totalUnits: _common_1.VALIDATION.GENERAL.NUMBER,
                claimedStatus: _common_1.VALIDATION.GENERAL.BOOLEAN.allow(true),
                floorCorners: _common_1.VALIDATION.PROPERTY.floorCorners
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.updateProperty(req, res, next);
        });
        this.router.post('/validateEmployeeUnits', celebrate_1.celebrate({
            body: {
                spaceId: _common_1.VALIDATION.GENERAL.ID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.validateFloorForEmployeeUnits(req, res, next);
        });
        this.router.post('/validateFloorDetail', celebrate_1.celebrate({
            body: {
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                floorNumber: _common_1.VALIDATION.GENERAL.NUMBER.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.validateFloorForPartners(req, res, next);
        });
        this.router.get('/propertyDetails/:id', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.PROPERTY.ID.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.propertyDetails(req, res, next);
        });
        this.router.put('/demo', celebrate_1.celebrate({
            body: {
                demoId: _common_1.VALIDATION.GENERAL.ID.required(),
                status: _common_1.VALIDATION.GENERAL.NUMBER.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.UserLocationController.updateScheduledDemo(req, res, next);
        });
        this.router.get('/propertySpaceListByCategory', celebrate_1.celebrate({
            query: {
                propertyId: _common_1.VALIDATION.PROPERTY.ID,
                categoryId: _common_1.VALIDATION.PROPERTY.ID,
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.propertySpaceListByCategory(req, res, next);
        });
        this.router.get('/:id/propertySpaceList', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.PROPERTY.ID.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.propertySpaceList(req, res, next);
        });
        this.router.patch('/:id/propertyStatus', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.PROPERTY.ID.required(),
                type: _common_1.VALIDATION.PROPERTY.type
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.activateProperty(req, res, next);
        });
        this.router.get('/amenities-listing', _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.amenitiesListing(req, res, next);
        });
        this.router.get('/parentCategories', (req, res, next) => {
            _controllers_1.HostPropertyController.getParentCategories(req, res, next);
        });
        this.router.get('/childCategories/:parentId', celebrate_1.celebrate({
            params: {
                parentId: _common_1.VALIDATION.USER.ID.required(),
            }
        }), (req, res, next) => {
            _controllers_1.HostPropertyController.getChildCategories(req, res, next);
        });
        this.router.get('', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { categoryIds: _common_1.VALIDATION.PROPERTY.CATEGORY_ID, subCategoryIds: _common_1.VALIDATION.PROPERTY.CATEGORY_ID, autoAcceptUpcomingBooking: celebrate_1.Joi.boolean().valid(true, false), status: _common_1.VALIDATION.PROPERTY.CATEGORY_ID, fromDate: _common_1.VALIDATION.PROPERTY.fromDate, toDate: _common_1.VALIDATION.PROPERTY.toDate, stateId: _common_1.VALIDATION.PROPERTY.STATE_ID, countryId: _common_1.VALIDATION.PROPERTY.STATE_ID, cityId: _common_1.VALIDATION.PROPERTY.CATEGORY_ID })
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.getMyProperties(req, res, next);
        });
        this.router.get('/myArchievedProperties', celebrate_1.celebrate({
            query: Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION)
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.getArchievedProperty(req, res, next);
        });
        this.router.post('/addSpaces', celebrate_1.celebrate({
            body: {
                subCategoryId: _common_1.VALIDATION.PROPERTY_SPACES.SUBCATEGORY_ID,
                categoryId: _common_1.VALIDATION.PROPERTY_SPACES.ID.required(),
                propertyId: _common_1.VALIDATION.PROPERTY_SPACES.ID.required(),
                spaceId: _common_1.VALIDATION.PROPERTY_SPACES.spaceId,
                images: _common_1.VALIDATION.PROPERTY_SPACES.images,
                capacity: _common_1.VALIDATION.PROPERTY_SPACES.capacity,
                units: _common_1.VALIDATION.PROPERTY_SPACES.units,
                dailyPrice: _common_1.VALIDATION.PROPERTY_SPACES.dailyPrice,
                monthlyPrice: _common_1.VALIDATION.PROPERTY_SPACES.monthlyPrice,
                yearlyPrice: _common_1.VALIDATION.PROPERTY_SPACES.yearlyPrice,
                hourlyPrice: _common_1.VALIDATION.PROPERTY_SPACES.hourlyPrice,
                offerPrice: _common_1.VALIDATION.PROPERTY_SPACES.OFFER_PRICE,
                isOfferPrice: _common_1.VALIDATION.PROPERTY_SPACES.IS_OFFER_PRICE,
                include: _common_1.VALIDATION.PROPERTY_SPACES.images,
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.addPropertySpaces(req, res, next);
        });
        this.router.put('/updateSpaces', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.PROPERTY.ID.required(),
                subCategoryId: _common_1.VALIDATION.PROPERTY_SPACES.SUBCATEGORY_ID,
                categoryId: _common_1.VALIDATION.PROPERTY_SPACES.CATEGORY_ID,
                propertyId: _common_1.VALIDATION.PROPERTY_SPACES.CATEGORY_ID,
                images: _common_1.VALIDATION.PROPERTY_SPACES.images,
                capacity: _common_1.VALIDATION.PROPERTY_SPACES.capacity,
                units: _common_1.VALIDATION.PROPERTY_SPACES.units,
                dailyPrice: _common_1.VALIDATION.PROPERTY_SPACES.dailyPrice,
                monthlyPrice: _common_1.VALIDATION.PROPERTY_SPACES.monthlyPrice,
                yearlyPrice: _common_1.VALIDATION.PROPERTY_SPACES.yearlyPrice,
                hourlyPrice: _common_1.VALIDATION.PROPERTY_SPACES.hourlyPrice,
                offerPrice: _common_1.VALIDATION.PROPERTY_SPACES.OFFER_PRICE,
                isOfferPrice: _common_1.VALIDATION.PROPERTY_SPACES.IS_OFFER_PRICE,
                include: _common_1.VALIDATION.PROPERTY_SPACES.images
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.updatePropertySpaces(req, res, next);
        });
        this.router.patch('/autoAcceptBooking', celebrate_1.celebrate({
            body: {
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                autoAcceptUpcomingBooking: _common_1.VALIDATION.GENERAL.BOOLEAN.valid(true, false).required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.updateAutoAcceptBooking(req, res, next);
        });
        this.router.get('/dynamicPriceLabels', _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.getDynamicPriceLabels(req, res, next);
        });
        this.router.get('/propertySpaceDetails', celebrate_1.celebrate({
            query: {
                spaceId: _common_1.VALIDATION.PROPERTY_SPACES.ID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.fetchPropertySpaceDetail(req, res, next);
        });
        this.router.patch('/propertySpaceStatus', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.PROPERTY.ID.required(),
                type: _common_1.VALIDATION.PROPERTY.type
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.activatePropertySpace(req, res, next);
        });
        this.router.get('/booking', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { fromDate: _common_1.VALIDATION.PROPERTY.fromDate, toDate: _common_1.VALIDATION.PROPERTY.toDate, categoryId: _common_1.VALIDATION.PROPERTY.CATEGORY_ID, subCategoryIds: _common_1.VALIDATION.PROPERTY.CATEGORY_ID, propertyIds: _common_1.VALIDATION.PROPERTY.CATEGORY_ID, status: _common_1.VALIDATION.PROPERTY.CATEGORY_ID, mode: _common_1.VALIDATION.PROPERTY.CATEGORY_ID, type: _common_1.VALIDATION.PROPERTY.BOOKING_REQUEST, autoAcceptUpcomingBooking: _common_1.VALIDATION.BOOKING.SORT_KEY, stateId: _common_1.VALIDATION.PROPERTY.STATE_ID, countryId: _common_1.VALIDATION.PROPERTY.STATE_ID, cityId: _common_1.VALIDATION.PROPERTY.CATEGORY_ID })
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.bookingHistory(req, res, next);
        });
        this.router.get('/bookingPolicy?', celebrate_1.celebrate({
            query: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.bookingPolicy(req, res, next);
        });
        this.router.put('/booking', celebrate_1.celebrate({
            body: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required(),
                reason: _common_1.VALIDATION.GENERAL.STRING.required().trim(),
                description: _common_1.VALIDATION.GENERAL.STRING.optional().trim(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.cancelBooking(req, res, next);
        });
        this.router.get('/bookingSummary/:bookingId', celebrate_1.celebrate({
            params: {
                bookingId: _common_1.VALIDATION.GENERAL.ID
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.bookingSummary(req, res, next);
        });
        this.router.get('/subCategories', celebrate_1.celebrate({
            query: {
                categoryIds: _common_1.VALIDATION.PROPERTY.CATEGORY_ID
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.subCategory(req, res, next);
        });
        this.router.patch('/booking/request', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.GENERAL.ID.required(),
                type: _common_1.VALIDATION.PROPERTY.BOOKING_REQUEST_TYPE
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.acceptBooking(req, res, next);
        });
        this.router.get('/listing', celebrate_1.celebrate({
            query: {
                cityId: _common_1.VALIDATION.GENERAL.ID,
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.propertyListing(req, res, next);
        });
        this.router.get('/schedule/calendar', celebrate_1.celebrate({
            query: {
                date: _common_1.VALIDATION.GENERAL.DATE.required(),
                categoryIds: _common_1.VALIDATION.GENERAL.ARRAY_OF_IDS,
                subCategoryIds: _common_1.VALIDATION.GENERAL.ARRAY_OF_IDS,
                bookingMode: _common_1.VALIDATION.GENERAL.NUMBER
                    .valid(_common_1.ENUM.BOOKING_TYPE.TYPE.ONLINE, _common_1.ENUM.BOOKING_TYPE.TYPE.OFFLINE, _common_1.ENUM.BOOKING_TYPE.TYPE.ALL).required(),
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.fetchCalenderData(req, res, next);
        });
        this.router.get('/cron', (req, res, next) => {
            _controllers_1.HostPropertyController.bookingStatus(req, res, next);
        });
        this.router.get('/updateCalendar', (req, res, next) => {
            _controllers_1.HostPropertyController.calendarStatus(req, res, next);
        });
        this.router.put('/autoAccpetStatus', celebrate_1.celebrate({
            body: {
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                autoAcceptUpcomingBooking: celebrate_1.Joi.boolean().required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.autoAccpetStatus(req, res, next);
        });
        this.router.post('/holidays', celebrate_1.celebrate({
            body: {
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                name: _common_1.VALIDATION.GENERAL.STRING.required(),
                toDate: _common_1.VALIDATION.GENERAL.STRING.required(),
                fromDate: _common_1.VALIDATION.GENERAL.STRING.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.addHolidays(req, res, next);
        });
        this.router.put('/holidays', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.GENERAL.ID.required(),
                name: _common_1.VALIDATION.GENERAL.STRING.required(),
                toDate: _common_1.VALIDATION.GENERAL.STRING.required(),
                fromDate: _common_1.VALIDATION.GENERAL.STRING.required(),
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.updateHolidays(req, res, next);
        });
        this.router.delete('/holidays', celebrate_1.celebrate({
            query: {
                id: _common_1.VALIDATION.GENERAL.ID.required(),
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.deleteHolidays(req, res, next);
        });
        this.router.get('/holidays', celebrate_1.celebrate({
            query: Object.assign({ propertyId: _common_1.VALIDATION.GENERAL.ID.required() }, _common_1.VALIDATION.GENERAL.PAGINATION)
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.getHolidays(req, res, next);
        });
        this.router.get('/:propertyId', celebrate_1.celebrate({
            params: {
                propertyId: _common_1.VALIDATION.PROPERTY.ID.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.propertyDetail(req, res, next);
        });
        this.router.get('/floorData/:propertyId/:floorNumber', celebrate_1.celebrate({
            params: {
                propertyId: _common_1.VALIDATION.PROPERTY.ID.required(),
                floorNumber: _common_1.VALIDATION.GENERAL.NUMBER,
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.floorDetail(req, res, next);
        });
        this.router.get('/floorCount/:propertyId', celebrate_1.celebrate({
            params: {
                propertyId: _common_1.VALIDATION.PROPERTY.ID
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.propertyFloorCount(req, res, next);
        });
        this.router.get('/claim/:propertyId', celebrate_1.celebrate({
            params: {
                propertyId: _common_1.VALIDATION.PROPERTY.ID
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.claimPropertyData(req, res, next);
        });
        this.router.post('/claim', celebrate_1.celebrate({
            body: {
                name: _common_1.VALIDATION.PROPERTY.NAME,
                houseNo: _common_1.VALIDATION.PROPERTY.ADDRESS_PRIMARY,
                street: _common_1.VALIDATION.PROPERTY.ADDRESS_SECONDARY,
                zipCode: _common_1.VALIDATION.PROPERTY.ZIP_CODE,
                docs: _common_1.VALIDATION.PROPERTY.DOCS.required(),
                heading: _common_1.VALIDATION.PROPERTY.HEADING,
                message: _common_1.VALIDATION.PROPERTY.DESCRIPTION,
                countryId: _common_1.VALIDATION.PROPERTY.COUNTRY_ID.required(),
                stateId: _common_1.VALIDATION.PROPERTY.STATE_ID.required(),
                cityId: _common_1.VALIDATION.PROPERTY.CITY_ID.required(),
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                administrativeRight: _common_1.VALIDATION.GENERAL.BOOLEAN.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostPropertyController.claimProperty(req, res, next);
        });
    }
}
exports.default = new V1HostPropertyRouteClass('/property');
//# sourceMappingURL=host.properties.route.js.map