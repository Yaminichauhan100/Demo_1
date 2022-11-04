"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _middlewares_1 = __importDefault(require("@middlewares"));
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const celebrate_1 = require("celebrate");
const _controllers_1 = require("@controllers");
const multer_1 = __importDefault(require("multer"));
const _common_1 = require("@common");
const upload = multer_1.default({ dest: './uploads' });
class AdminClaimedPropertyRouteClass extends _baseRoute_1.default {
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
            _controllers_1.AdminClaimPropertyController.getCountries(req, res, next);
        });
        this.router.get('/getStates/:countryId', celebrate_1.celebrate({
            params: {
                countryId: _common_1.VALIDATION.USER.COUNTRYID.required(),
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            _controllers_1.AdminClaimPropertyController.getPropertyStates(req, res, next);
        });
        this.router.get('/getCities/:stateId', celebrate_1.celebrate({
            params: {
                stateId: _common_1.VALIDATION.USER.STATE_ID.required(),
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            _controllers_1.AdminClaimPropertyController.getPropertyCities(req, res, next);
        });
        this.router.get('/amenities', _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            _controllers_1.AdminClaimPropertyController.amenitiesListing(req, res, next);
        });
        this.router.get('/sample', _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            _controllers_1.AdminClaimPropertyController.fetchSampleSheet(req, res, next);
        });
        this.router.post('/', upload.single('sheet'), celebrate_1.celebrate({
            body: {
                state: celebrate_1.Joi.any(),
                country: celebrate_1.Joi.any(),
                city: celebrate_1.Joi.any()
            }
        }), _middlewares_1.default.VerifyAdminSession, async (req, res, next) => {
            try {
                await _controllers_1.AdminClaimPropertyController.insertClaimedProperty(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { fromDate: _common_1.VALIDATION.GENERAL.DATE, toDate: _common_1.VALIDATION.GENERAL.DATE, countryId: _common_1.VALIDATION.GENERAL.ANY, cityId: _common_1.VALIDATION.GENERAL.ANY, stateId: _common_1.VALIDATION.GENERAL.ANY, claimedStatus: _common_1.VALIDATION.GENERAL.BOOLEAN })
        }), _middlewares_1.default.VerifyAdminSession, async (req, res, next) => {
            try {
                await _controllers_1.AdminClaimPropertyController.fetchClaimedProperties(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/:propertyId', celebrate_1.celebrate({
            params: {
                propertyId: _common_1.VALIDATION.GENERAL.ID,
            },
            query: {
                hostId: _common_1.VALIDATION.GENERAL.ID
            }
        }), _middlewares_1.default.VerifyAdminSession, async (req, res, next) => {
            try {
                await _controllers_1.AdminClaimPropertyController.fetchClaimedPropertyDetail(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.put('/', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.GENERAL.ID.required(),
                name: _common_1.VALIDATION.PROPERTY.NAME,
                addressPrimary: _common_1.VALIDATION.PROPERTY.ADDRESS_PRIMARY,
                addressSecondary: _common_1.VALIDATION.PROPERTY.ADDRESS_SECONDARY,
                zipCode: _common_1.VALIDATION.PROPERTY.ZIP_CODE,
                images: _common_1.VALIDATION.PROPERTY.IMAGES,
                description: _common_1.VALIDATION.PROPERTY.DESCRIPTION,
                amenities: _common_1.VALIDATION.PROPERTY.AMENITIES,
                country: _common_1.VALIDATION.PROPERTY.COUNTRY_OBJ,
                state: _common_1.VALIDATION.PROPERTY.STATE_OBJ,
                city: _common_1.VALIDATION.PROPERTY.CITY_OBJ,
                location: _common_1.VALIDATION.GENERAL.ARRAY_OF_NUMBERS,
                propertyType: _common_1.VALIDATION.PROPERTY.PROPERTY_TYPE,
                startingPrice: _common_1.VALIDATION.GENERAL.NUMBER.min(0)
            }
        }), _middlewares_1.default.VerifyAdminSession, async (req, res, next) => {
            try {
                await _controllers_1.AdminClaimPropertyController.updateClaimedProperty(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.put('/request', celebrate_1.celebrate({
            body: {
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                status: _common_1.VALIDATION.GENERAL.NUMBER.valid(Object.values(_common_1.ENUM.PROPERTY.CLAIMED_PROPERTY_STATUS)).required(),
                hostId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, async (req, res, next) => {
            try {
                await _controllers_1.AdminClaimPropertyController.updateClaimedPropertyStatus(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
    }
}
exports.default = new AdminClaimedPropertyRouteClass('/property/claim');
//# sourceMappingURL=admin.property.claim.route.js.map