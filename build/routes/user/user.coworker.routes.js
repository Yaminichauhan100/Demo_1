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
class V1UserCoworkerRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.get('/checkCoworkerEmailExists', celebrate_1.celebrate({
            query: {
                email: _common_1.VALIDATION.USER.EMAIL.required(),
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserCoworkerController.checkCoworkerEmail(req, res, next);
        });
        this.router.post('/send-invite', celebrate_1.celebrate({
            body: {
                email: _common_1.VALIDATION.USER.COWORKER_EMAILS.required(),
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserCoworkerController.sendInvite(req, res, next);
        });
        this.router.delete('/remove', celebrate_1.celebrate({
            query: {
                email: _common_1.VALIDATION.USER.EMAIL.required(),
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserCoworkerController.removeCoworker(req, res, next);
        });
        this.router.get('/contactList', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { sortBy: _common_1.VALIDATION.GENERAL.STRING.valid("name", "createdAt"), sortOrder: _common_1.VALIDATION.GENERAL.NUMBER.valid(1, -1) })
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserCoworkerController.fetchCoworkersContactList(req, res, next);
        });
        this.router.get('/:bookingId', celebrate_1.celebrate({
            params: {
                bookingId: _common_1.VALIDATION.GENERAL.ID.required(),
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserCoworkerController.coworkersList(req, res, next);
        });
    }
}
exports.default = new V1UserCoworkerRouteClass('/coworker');
//# sourceMappingURL=user.coworker.routes.js.map