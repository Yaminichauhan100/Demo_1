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
const multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});
let upload = multer({ storage: storage });
class HostPartnerRouteClass extends _baseRoute_1.default {
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
                lane1: _common_1.VALIDATION.PROPERTY.LANE1.required(),
                lane2: _common_1.VALIDATION.GENERAL.STRING.allow(''),
                zipCode: _common_1.VALIDATION.PROPERTY.ZIP_CODE.required(),
                image: _common_1.VALIDATION.USER.IMAGE,
                stateId: _common_1.VALIDATION.PROPERTY.CITY_ID.required(),
                cityId: _common_1.VALIDATION.PROPERTY.CITY_ID.required(),
                countryId: _common_1.VALIDATION.PROPERTY.CITY_ID.required(),
                propertyId: _common_1.VALIDATION.PROPERTY.CITY_ID.required(),
                floorDetails: _common_1.VALIDATION.PROPERTY.PARTNER_FLOOR_DETAILS,
                partnerFloors: _common_1.VALIDATION.GENERAL.ARRAY_OF_NUMBERS
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PartnerController.addPartner(req, res, next);
        });
        this.router.get('/listing', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { sortBy: _common_1.VALIDATION.GENERAL.STRING, fromDate: _common_1.VALIDATION.PROPERTY.fromDate, toDate: _common_1.VALIDATION.PROPERTY.toDate, propertyIds: _common_1.VALIDATION.GENERAL.ARRAY_OF_IDS })
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PartnerController.partnerListing(req, res, next);
        });
        this.router.get('/details/:partnerId', celebrate_1.celebrate({
            params: {
                partnerId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PartnerController.partnerDetails(req, res, next);
        });
        this.router.get('/floorDetails', celebrate_1.celebrate({
            query: {
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
                floorNumber: _common_1.VALIDATION.GENERAL.NUMBER,
                partnerId: _common_1.VALIDATION.GENERAL.ID
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PartnerController.partnerFloorListing(req, res, next);
        });
        this.router.patch('/update', celebrate_1.celebrate({
            body: {
                partnerId: _common_1.VALIDATION.GENERAL.ID.required(),
                name: _common_1.VALIDATION.USER.NAME,
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE,
                phoneNo: _common_1.VALIDATION.USER.PHONE,
                lane1: _common_1.VALIDATION.PROPERTY.LANE1,
                lane2: _common_1.VALIDATION.GENERAL.STRING.allow(''),
                zipCode: _common_1.VALIDATION.PROPERTY.ZIP_CODE,
                image: _common_1.VALIDATION.USER.IMAGE,
                stateId: _common_1.VALIDATION.PROPERTY.CITY_ID,
                cityId: _common_1.VALIDATION.PROPERTY.CITY_ID,
                countryId: _common_1.VALIDATION.PROPERTY.CITY_ID,
                propertyId: _common_1.VALIDATION.PROPERTY.CITY_ID.required(),
                floorDetails: _common_1.VALIDATION.PROPERTY.PARTNER_FLOOR_DETAILS,
                partnerFloors: _common_1.VALIDATION.GENERAL.ARRAY_OF_NUMBERS
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PartnerController.updatePartner(req, res, next);
        });
        this.router.patch('/partnerStatus', celebrate_1.celebrate({
            body: {
                partnerId: _common_1.VALIDATION.GENERAL.ID.required(),
                type: _common_1.VALIDATION.PROPERTY.partnerType
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PartnerController.removePartner(req, res, next);
        });
        this.router.post('/addEmployee', celebrate_1.celebrate({
            body: {
                name: _common_1.VALIDATION.USER.NAME.required(),
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE.required(),
                phoneNo: _common_1.VALIDATION.USER.PHONE.required(),
                email: _common_1.VALIDATION.USER.EMAIL.required(),
                partnerId: _common_1.VALIDATION.GENERAL.ID.required(),
                image: _common_1.VALIDATION.USER.IMAGE
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PartnerController.addEmployee(req, res, next);
        });
        this.router.post('/bulkEmployee', upload.single('sheet'), celebrate_1.celebrate({
            body: {
                partnerId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PartnerController.addBulkEmployee(req, res, next);
        });
        this.router.get('/employee/listing', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { sortBy: _common_1.VALIDATION.GENERAL.STRING, partnerId: _common_1.VALIDATION.GENERAL.ID.required(), fromDate: _common_1.VALIDATION.PROPERTY.fromDate, toDate: _common_1.VALIDATION.PROPERTY.toDate })
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PartnerController.employeeListing(req, res, next);
        });
        this.router.patch('/employee/status', celebrate_1.celebrate({
            body: {
                employeeId: _common_1.VALIDATION.GENERAL.ID.required(),
                type: _common_1.VALIDATION.PROPERTY.partnerType
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PartnerController.updateEmployeeStatus(req, res, next);
        });
        this.router.get('/employee/details/:userId', celebrate_1.celebrate({
            params: {
                userId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PartnerController.employeeDetails(req, res, next);
        });
        this.router.get('/floorData/:partnerId/:propertyId/:floorNumber', celebrate_1.celebrate({
            params: {
                partnerId: _common_1.VALIDATION.PROPERTY.ID.required(),
                propertyId: _common_1.VALIDATION.PROPERTY.ID.required(),
                floorNumber: _common_1.VALIDATION.GENERAL.NUMBER
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PartnerController.floorDetail(req, res, next);
        });
        this.router.get('/calculateUnits/:spaceId', celebrate_1.celebrate({
            params: {
                spaceId: _common_1.VALIDATION.PROPERTY.ID.required()
            },
            query: {
                partnerId: _common_1.VALIDATION.PROPERTY.ID
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PartnerController.calculateEmployeeUnits(req, res, next);
        });
        this.router.get('/floorCount/:partnerId', celebrate_1.celebrate({
            params: {
                partnerId: _common_1.VALIDATION.PROPERTY.ID.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PartnerController.propertyFloorCount(req, res, next);
        });
        this.router.get('/floors/:propertyId', celebrate_1.celebrate({
            params: {
                propertyId: _common_1.VALIDATION.PROPERTY.ID.required(),
            },
            query: {
                partnerId: _common_1.VALIDATION.PROPERTY.ID
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PartnerController.propertyCount(req, res, next);
        });
        this.router.get('/proeprtyListing', _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.PartnerController.propertyListing(req, res, next);
        });
    }
}
exports.default = new HostPartnerRouteClass('/partner');
//# sourceMappingURL=host.partner.route.js.map