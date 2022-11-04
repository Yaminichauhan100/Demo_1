"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _common_1 = require("@common");
const admin_1 = require("../../controllers/admin");
class CommonRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.post('/login', celebrate_1.celebrate({
            body: {
                email: _common_1.VALIDATION.ADMIN.EMAIL.required(),
                password: _common_1.VALIDATION.ADMIN.PASSWORD.required()
            }
        }), (req, res, next) => {
            admin_1.AdminCommonController.adminLogin(req, res, next);
        });
        this.router.post('/password/forgot', celebrate_1.celebrate({ body: { email: _common_1.VALIDATION.ADMIN.EMAIL.required() } }), (req, res, next) => {
            admin_1.AdminCommonController.forgotPassword(req, res, next);
        });
        this.router.get('/password/verify/:metaToken', celebrate_1.celebrate({
            params: { metaToken: _common_1.VALIDATION.ADMIN.META_TOKEN.required() }
        }), (req, res, next) => {
            admin_1.AdminCommonController.verifyMetaToken(req, res, next);
        });
        this.router.get('/getCountries', (req, res, next) => {
            admin_1.AdminCommonController.getCountries(req, res, next);
        });
        this.router.get('/getStates/:countryId', celebrate_1.celebrate({
            params: {
                countryId: _common_1.VALIDATION.GENERAL.NUMBER.required(),
            }
        }), (req, res, next) => {
            admin_1.AdminCommonController.getStates(req, res, next);
        });
        this.router.get('/getCities/:stateId', celebrate_1.celebrate({
            params: {
                stateId: _common_1.VALIDATION.GENERAL.NUMBER.required(),
            }
        }), (req, res, next) => {
            admin_1.AdminCommonController.getCities(req, res, next);
        });
        this.router.get('/categories', (req, res, next) => {
            admin_1.AdminCommonController.fetchAdvHomeData(req, res, next);
        });
        this.router.get('/subCategories', celebrate_1.celebrate({
            query: {
                categoryId: _common_1.VALIDATION.GENERAL.ID.required(),
            }
        }), (req, res, next) => {
            admin_1.AdminCommonController.fetchAdvSubcategoryData(req, res, next);
        });
        this.router.post('/password/reset/:metaToken', celebrate_1.celebrate({
            params: { metaToken: _common_1.VALIDATION.ADMIN.META_TOKEN.required() },
            body: { password: _common_1.VALIDATION.ADMIN.PASSWORD.required() }
        }), (req, res, next) => {
            admin_1.AdminCommonController.resetPassword(req, res, next);
        });
        this.router.post('/giftCardAmount', celebrate_1.celebrate({
            body: { amount: celebrate_1.Joi.array().required() }
        }), (req, res, next) => {
            admin_1.AdminCommonController.giftCardAmount(req, res, next);
        });
    }
}
exports.default = new CommonRouteClass('/');
//# sourceMappingURL=common.admin.routes.js.map