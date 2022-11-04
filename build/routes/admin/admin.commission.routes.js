"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _middlewares_1 = __importDefault(require("@middlewares"));
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const celebrate_1 = require("celebrate");
const _common_1 = require("@common");
const admin_commission_controller_1 = require("../../controllers/admin/admin.commission.controller");
class AdminCommissionRouteClass extends _baseRoute_1.default {
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
                hostId: _common_1.VALIDATION.GENERAL.ID.required(),
                commissionAmount: _common_1.VALIDATION.GENERAL.NUMBER.max(100).min(0).required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_commission_controller_1.AdminCommissionController.setCommission(req, res, next);
        });
    }
}
exports.default = new AdminCommissionRouteClass('/commission');
//# sourceMappingURL=admin.commission.routes.js.map