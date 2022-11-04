"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _middlewares_1 = __importDefault(require("@middlewares"));
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const celebrate_1 = require("celebrate");
const _common_1 = require("@common");
const admin_giftcard_controller_1 = require("../../controllers/admin/admin.giftcard.controller");
class AdminGiftCardRouteClass extends _baseRoute_1.default {
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
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { fromDate: _common_1.VALIDATION.PROPERTY.fromDate, toDate: _common_1.VALIDATION.PROPERTY.toDate })
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_giftcard_controller_1.AdminGiftCardController.giftCardListing(req, res, next);
        });
        this.router.get('/info', celebrate_1.celebrate({
            query: {
                id: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, async (req, res, next) => {
            try {
                await admin_giftcard_controller_1.AdminGiftCardController.giftCardInfo(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
    }
}
exports.default = new AdminGiftCardRouteClass('/giftcard');
//# sourceMappingURL=admin.giftcard.route.js.map