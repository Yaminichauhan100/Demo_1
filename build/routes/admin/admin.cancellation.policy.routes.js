"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _middlewares_1 = __importDefault(require("@middlewares"));
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _common_1 = require("@common");
const admin_cancellation_policy_controller_1 = require("../../controllers/admin/admin.cancellation.policy.controller");
class AdminCancellationPolicyClass extends _baseRoute_1.default {
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
                reason: _common_1.VALIDATION.FAQ.QUESTION,
                lang: _common_1.VALIDATION.FAQ.QUESTION,
                userType: _common_1.VALIDATION.FAQ.USERTYPE
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_cancellation_policy_controller_1.CancellationPolicyController.addPolicies(req, res, next);
        });
        this.router.get('/:id/:lang', _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_cancellation_policy_controller_1.CancellationPolicyController.getPolicies(req, res, next);
        });
        this.router.get('/', celebrate_1.celebrate({
            query: {
                lang: _common_1.VALIDATION.FAQ.QUESTION
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_cancellation_policy_controller_1.CancellationPolicyController.getAllPolicies(req, res, next);
        });
    }
}
exports.default = new AdminCancellationPolicyClass('/cancellationPolicy');
//# sourceMappingURL=admin.cancellation.policy.routes.js.map