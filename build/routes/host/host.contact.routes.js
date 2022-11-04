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
class V1HostContactUsRouteClass extends _baseRoute_1.default {
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
                name: _common_1.VALIDATION.USER.NAME.required(),
                email: _common_1.VALIDATION.USER.EMAIL,
                companyName: _common_1.VALIDATION.GENERAL.STRING,
                phoneNo: _common_1.VALIDATION.USER.PHONE,
                message: _common_1.VALIDATION.GENERAL.STRING,
                otherMessage: _common_1.VALIDATION.GENERAL.STRING,
                subject: _common_1.VALIDATION.GENERAL.STRING,
                countryCode: _common_1.VALIDATION.GENERAL.STRING
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostContactController.createContactUs(req, res, next);
        });
        this.router.post('/contactUsDirect', celebrate_1.celebrate({
            body: {
                name: _common_1.VALIDATION.USER.NAME.required(),
                email: _common_1.VALIDATION.USER.EMAIL.required(),
                companyName: _common_1.VALIDATION.GENERAL.STRING,
                phoneNo: _common_1.VALIDATION.USER.PHONE,
                message: _common_1.VALIDATION.GENERAL.STRING,
                subject: _common_1.VALIDATION.GENERAL.STRING,
                otherMessage: _common_1.VALIDATION.GENERAL.STRING,
                countryCode: _common_1.VALIDATION.GENERAL.STRING,
                directType: _common_1.VALIDATION.GENERAL.BOOLEAN.valid(true).required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostContactController.createContactUsHostWB(req, res, next);
        });
        this.router.get('/subject', celebrate_1.celebrate({
            query: {
                userType: _common_1.VALIDATION.GENERAL.NUMBER
            }
        }), (req, res, next) => {
            _controllers_1.HostContactController.getContactSubject(req, res, next);
        });
    }
}
exports.default = new V1HostContactUsRouteClass('/contactUs');
//# sourceMappingURL=host.contact.routes.js.map