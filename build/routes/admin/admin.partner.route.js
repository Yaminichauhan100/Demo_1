"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _common_1 = require("@common");
const _middlewares_1 = __importDefault(require("@middlewares"));
const admin_partner_controller_1 = require("../../controllers/admin/admin.partner.controller");
class AdminConfigRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.get('/', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { id: _common_1.VALIDATION.GENERAL.ID })
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_partner_controller_1.AdminConfigController.partnerList(req, res, next);
        });
        this.router.post('/', celebrate_1.celebrate({
            body: {
                title: _common_1.VALIDATION.GENERAL.STRING.required(),
                image: _common_1.VALIDATION.GENERAL.STRING.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_partner_controller_1.AdminConfigController.addPartnerType(req, res, next);
        });
        this.router.put('/', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.GENERAL.ID.required(),
                title: _common_1.VALIDATION.GENERAL.STRING.required(),
                image: _common_1.VALIDATION.GENERAL.STRING.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_partner_controller_1.AdminConfigController.updatePartnerType(req, res, next);
        });
        this.router.delete('/:partnerId', celebrate_1.celebrate({
            params: {
                partnerId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_partner_controller_1.AdminConfigController.removePartner(req, res, next);
        });
    }
}
exports.default = new AdminConfigRouteClass('/partner');
//# sourceMappingURL=admin.partner.route.js.map