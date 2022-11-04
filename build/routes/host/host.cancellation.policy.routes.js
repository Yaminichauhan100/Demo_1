"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _middlewares_1 = __importDefault(require("@middlewares"));
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _controllers_1 = require("@controllers");
const celebrate_1 = require("celebrate");
const _common_1 = require("@common");
class UserCancellationPolicyClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.get('/?', celebrate_1.celebrate({
            query: {
                lang: _common_1.VALIDATION.GENERAL.STRING.required(),
                userType: _common_1.VALIDATION.GENERAL.NUMBER.valid(1, 2).required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostCancellationPolicyController.getAllPolicies(req, res, next);
        });
    }
}
exports.default = new UserCancellationPolicyClass('/cancellationPolicy');
//# sourceMappingURL=host.cancellation.policy.routes.js.map