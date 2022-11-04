"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _middlewares_1 = __importDefault(require("@middlewares"));
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _common_1 = require("@common");
const admin_advPrice_controller_1 = require("../../controllers/admin/admin.advPrice.controller");
class AdminAdPriceRouteClass extends _baseRoute_1.default {
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
                cityId: _common_1.VALIDATION.GENERAL.ID,
                stateId: _common_1.VALIDATION.PROPERTY.STATE_ID,
                countryId: _common_1.VALIDATION.PROPERTY.STATE_ID,
                categoryId: _common_1.VALIDATION.GENERAL.ID,
                subCategoryId: _common_1.VALIDATION.GENERAL.ID,
                slotType: {
                    1: {
                        daily: _common_1.VALIDATION.GENERAL.NUMBER,
                        weekly: _common_1.VALIDATION.GENERAL.NUMBER,
                        monthly: _common_1.VALIDATION.GENERAL.NUMBER
                    },
                    2: {
                        daily: _common_1.VALIDATION.GENERAL.NUMBER,
                        weekly: _common_1.VALIDATION.GENERAL.NUMBER,
                        monthly: _common_1.VALIDATION.GENERAL.NUMBER
                    },
                    3: {
                        daily: _common_1.VALIDATION.GENERAL.NUMBER,
                        weekly: _common_1.VALIDATION.GENERAL.NUMBER,
                        monthly: _common_1.VALIDATION.GENERAL.NUMBER
                    },
                },
                listingPlacement: _common_1.VALIDATION.GENERAL.NUMBER
                    .valid(_common_1.ENUM.ADVERTISEMENT.ListingPlacement.HOME, _common_1.ENUM.ADVERTISEMENT.ListingPlacement.LISTING).required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_advPrice_controller_1.AdminAdvPrice.addAdvPrice(req, res, next);
        });
        this.router.patch('/', celebrate_1.celebrate({
            query: {
                id: _common_1.VALIDATION.GENERAL.ID,
                slotType: {
                    1: {
                        daily: _common_1.VALIDATION.GENERAL.NUMBER,
                        weekly: _common_1.VALIDATION.GENERAL.NUMBER,
                        monthly: _common_1.VALIDATION.GENERAL.NUMBER
                    },
                    2: {
                        daily: _common_1.VALIDATION.GENERAL.NUMBER,
                        weekly: _common_1.VALIDATION.GENERAL.NUMBER,
                        monthly: _common_1.VALIDATION.GENERAL.NUMBER
                    },
                    3: {
                        daily: _common_1.VALIDATION.GENERAL.NUMBER,
                        weekly: _common_1.VALIDATION.GENERAL.NUMBER,
                        monthly: _common_1.VALIDATION.GENERAL.NUMBER
                    },
                },
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_advPrice_controller_1.AdminAdvPrice.updateAdvPrice(req, res, next);
        });
        this.router.get('/', celebrate_1.celebrate({
            query: Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION)
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_advPrice_controller_1.AdminAdvPrice.fetchAdvData(req, res, next);
        });
        this.router.get('/home', _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_advPrice_controller_1.AdminAdvPrice.fetchAdvHomeData(req, res, next);
        });
        this.router.get('/:id', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_advPrice_controller_1.AdminAdvPrice.advDetails(req, res, next);
        });
        this.router.delete('/:id', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_advPrice_controller_1.AdminAdvPrice.DeleteAdPrice(req, res, next);
        });
    }
}
exports.default = new AdminAdPriceRouteClass('/advPrice');
//# sourceMappingURL=admin.advprice.routes.js.map