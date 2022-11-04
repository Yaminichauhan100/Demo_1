"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _common_1 = require("@common");
const _middlewares_1 = __importDefault(require("@middlewares"));
const admin_category_controller_1 = require("../../controllers/admin/admin.category.controller");
class AdminCategoryRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.get('/list', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { parentId: _common_1.VALIDATION.CATEGORY.PARENT_ID.allow(''), status: _common_1.VALIDATION.USER.STATUS, sortKey: _common_1.VALIDATION.SORT.ADMIN_HOST_LISTING, sortOrder: _common_1.VALIDATION.SORT.SORT_ORDER })
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_category_controller_1.AdminCategoryController.getCategory(req, res, next);
        });
        this.router.post('/add', celebrate_1.celebrate({
            body: {
                parentId: _common_1.VALIDATION.CATEGORY.PARENT_ID.allow(''),
                name: _common_1.VALIDATION.CATEGORY.NAME.required(),
                description: _common_1.VALIDATION.GENERAL.STRING.allow(''),
                options: _common_1.VALIDATION.CATEGORY.OPTION.allow([]),
                iconImage: _common_1.VALIDATION.CATEGORY.icon_image,
                colorCode: _common_1.VALIDATION.GENERAL.STRING.optional()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_category_controller_1.AdminCategoryController.addCategory(req, res, next);
        });
        this.router.put('/update', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.CATEGORY.ID.required(),
                name: _common_1.VALIDATION.CATEGORY.NAME.required(),
                description: _common_1.VALIDATION.GENERAL.STRING.allow(''),
                options: _common_1.VALIDATION.CATEGORY.OPTION.allow([]),
                iconImage: _common_1.VALIDATION.CATEGORY.icon_image,
                colorCode: _common_1.VALIDATION.GENERAL.STRING.optional()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_category_controller_1.AdminCategoryController.updateCategory(req, res, next);
        });
        this.router.put('/:id/active', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.USER.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_category_controller_1.AdminCategoryController.activate(req, res, next);
        });
        this.router.put('/:id/inactive', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.USER.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_category_controller_1.AdminCategoryController.inActivate(req, res, next);
        });
        this.router.get('/:id/details', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.USER.ID
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_category_controller_1.AdminCategoryController.details(req, res, next);
        });
    }
}
exports.default = new AdminCategoryRouteClass('/category');
//# sourceMappingURL=admin.category.routes.js.map