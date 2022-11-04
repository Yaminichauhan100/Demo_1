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
class V1UserContactUsRouteClass extends _baseRoute_1.default {
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
                email: _common_1.VALIDATION.GENERAL.STRING,
                companyName: _common_1.VALIDATION.GENERAL.STRING,
                phoneNo: _common_1.VALIDATION.GENERAL.STRING,
                message: _common_1.VALIDATION.GENERAL.STRING.required(),
                otherMessage: _common_1.VALIDATION.GENERAL.STRING,
                subject: _common_1.VALIDATION.GENERAL.STRING.required(),
                countryCode: _common_1.VALIDATION.GENERAL.STRING
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserContactController.createContactUs(req, res, next);
        });
        this.router.get('/subject', celebrate_1.celebrate({
            query: {
                userType: _common_1.VALIDATION.GENERAL.NUMBER
            }
        }), (req, res, next) => {
            _controllers_1.UserContactController.getContactSubject(req, res, next);
        });
    }
}
exports.default = new V1UserContactUsRouteClass('/contactUs');
//# sourceMappingURL=user.contact.routes.js.map