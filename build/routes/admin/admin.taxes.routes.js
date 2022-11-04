"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _middlewares_1 = __importDefault(require("@middlewares"));
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const celebrate_1 = require("celebrate");
const _common_1 = require("@common");
const admin_taxes_controller_1 = require("../../controllers/admin/admin.taxes.controller");
class AdminTaxesRouteClass extends _baseRoute_1.default {
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
                countryId: _common_1.VALIDATION.GENERAL.NUMBER,
                tax: _common_1.VALIDATION.GENERAL.NUMBER.min(0),
                level: _common_1.VALIDATION.TAXES.LEVEL.required(),
                state: _common_1.VALIDATION.TAXES.STATE
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_taxes_controller_1.AdminTaxesController.setTaxes(req, res, next);
        });
        this.router.get('/details/:id/:type', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.GENERAL.ID.required(),
                type: _common_1.VALIDATION.TAXES.LEVEL.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_taxes_controller_1.AdminTaxesController.getDetails(req, res, next);
        });
        this.router.get('/getStates/:countryId', celebrate_1.celebrate({
            params: {
                countryId: _common_1.VALIDATION.GENERAL.NUMBER.required(),
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_taxes_controller_1.AdminTaxesController.getStates(req, res, next);
        });
        this.router.get('/getCountries', celebrate_1.celebrate({
            query: Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION)
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_taxes_controller_1.AdminTaxesController.getCountries(req, res, next);
        });
    }
}
exports.default = new AdminTaxesRouteClass('/taxes');
//# sourceMappingURL=admin.taxes.routes.js.map