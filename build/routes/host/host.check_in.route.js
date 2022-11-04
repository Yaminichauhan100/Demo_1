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
class V1UserCheckInUsRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.post('/', celebrate_1.celebrate({
            body: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required(),
                coworkerId: _common_1.VALIDATION.GENERAL.ID.required(),
                date: _common_1.VALIDATION.GENERAL.DATE.required(),
                time: _common_1.VALIDATION.GENERAL.DATE.required(),
                status: _common_1.VALIDATION.GENERAL.NUMBER.required(),
                remark: _common_1.VALIDATION.GENERAL.STRING,
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.UserCheckInController.createCheckInAndOut(req, res, next);
        });
        this.router.get('/', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { country: _common_1.VALIDATION.GENERAL.NUMBER, bookingId: _common_1.VALIDATION.GENERAL.STRING, city: _common_1.VALIDATION.GENERAL.ID, state: _common_1.VALIDATION.GENERAL.NUMBER, fromDate: _common_1.VALIDATION.PROPERTY.fromDate, toDate: _common_1.VALIDATION.PROPERTY.toDate, propertyId: _common_1.VALIDATION.GENERAL.ARRAY_OF_IDS, status: _common_1.VALIDATION.GENERAL.NUMBER })
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.UserCheckInController.checkInActivityLogs(req, res, next);
        });
        this.router.get('/coworkerDetails', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { bookingId: _common_1.VALIDATION.GENERAL.ID, propertyId: _common_1.VALIDATION.GENERAL.ID, status: _common_1.VALIDATION.GENERAL.NUMBER })
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.UserCheckInController.searchCowrker(req, res, next);
        });
        this.router.delete('/', celebrate_1.celebrate({
            query: {
                checkInId: _common_1.VALIDATION.GENERAL.ID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.UserCheckInController.deleteActivityLogs(req, res, next);
        });
        this.router.get('/booking/:bookingId/:propertyId', celebrate_1.celebrate({
            params: {
                bookingId: _common_1.VALIDATION.GENERAL.STRING.required(),
                propertyId: _common_1.VALIDATION.GENERAL.ID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                _controllers_1.UserCheckInController.fetchBookingDetail(req, res, next);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new V1UserCheckInUsRouteClass('/checkIn');
//# sourceMappingURL=host.check_in.route.js.map