"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCategoryController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _builders_1 = __importDefault(require("@builders"));
const _entity_1 = require("@entity");
const _common_1 = require("@common");
const _services_1 = require("@services");
let AdminCategoryClass = class AdminCategoryClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async getCategory(req, res, next) {
        try {
            let payload = req.query;
            let pipeline = await _builders_1.default.Admin.Category.CategoryList(payload);
            payload.getCount = true;
            let catList = await _entity_1.CategoryV1.paginateAggregate(pipeline, payload);
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, catList);
        }
        catch (err) {
            next(err);
        }
    }
    async addCategory(req, res, next) {
        try {
            let payload = req.body;
            let checkDuplicateCategory = await _entity_1.CategoryV1.checkDuplicateCategory(payload.name);
            if (checkDuplicateCategory && checkDuplicateCategory.length > 0)
                return this.sendResponse(res, _common_1.RESPONSE.CATEGORY(res.locals.lang).DUPLICATE_CATEGORY);
            await _entity_1.CategoryV1.createCategory(payload);
            let categoryDetails = await _entity_1.CategoryV1.getCategoryAndSubCategory();
            if (categoryDetails && categoryDetails.length > 0)
                _services_1.redisDOA.insertKeyInRedisHash(_common_1.DATABASE.REDIS.KEY_NAMES.CATEGORY_AMENITIES, _common_1.DATABASE.REDIS.KEY_NAMES.CATEGORY_SUBACTEGORIES_HASH, JSON.stringify(categoryDetails));
            if (payload.parentId)
                return this.sendResponse(res, _common_1.RESPONSE.CATEGORY(res.locals.lang).SUBCATEGORY_CREATED);
            return this.sendResponse(res, _common_1.RESPONSE.CATEGORY(res.locals.lang).CATEGORY_CREATED);
        }
        catch (err) {
            console.error("Error", err);
            next(err);
        }
    }
    async updateCategory(req, res, next) {
        try {
            let payload = req.body;
            let category = await _entity_1.CategoryV1.findOne({ _id: payload.id });
            if (!category)
                return this.sendResponse(res, _common_1.RESPONSE.CATEGORY(res.locals.lang).NOT_FOUND);
            if (category['name'] != payload.name && category['name'].toLowerCase != payload.name.toLowerCase) {
                let checkDuplicateCategory = await _entity_1.CategoryV1.checkDuplicateCategory(payload.name);
                if (checkDuplicateCategory && checkDuplicateCategory.length > 0)
                    return this.sendResponse(res, _common_1.RESPONSE.CATEGORY(res.locals.lang).DUPLICATE_CATEGORY);
            }
            await _entity_1.CategoryV1.updateDocument({ _id: payload.id }, { name: payload.name, iconImage: payload.iconImage, description: payload.description, options: payload.options, colorCode: payload.colorCode });
            if (category && category.parentId) {
                await Promise.all([
                    _entity_1.PropertySpaceV1.editEntity({ 'subCategory._id': category._id }, { 'subCategory.name': payload.name, 'subCategory.iconImage': payload.iconImage, 'subCategory.parentId': category.parentId }, { multi: true }),
                    _entity_1.PartnerFloorV1.editEntity({ 'subCategory._id': category._id }, { 'subCategory.name': payload.name, 'subCategory.iconImage': payload.iconImage, 'subCategory.parentId': category.parentId }, { multi: true })
                ]);
            }
            else {
                await Promise.all([
                    _entity_1.PropertySpaceV1.editEntity({ 'subCategory._id': category._id }, { 'subCategory.name': payload.name, 'subCategory.iconImage': payload.iconImage, 'subCategory.parentId': category.parentId }, { multi: true }),
                    _entity_1.PartnerFloorV1.editEntity({ 'subCategory._id': category._id }, { 'subCategory.name': payload.name, 'subCategory.iconImage': payload.iconImage, 'subCategory.parentId': category.parentId }, { multi: true })
                ]);
            }
            let categoryDetails = await _entity_1.CategoryV1.getCategoryAndSubCategory();
            if (categoryDetails && categoryDetails.length > 0)
                _services_1.redisDOA.insertKeyInRedisHash(_common_1.DATABASE.REDIS.KEY_NAMES.CATEGORY_AMENITIES, _common_1.DATABASE.REDIS.KEY_NAMES.CATEGORY_SUBACTEGORIES_HASH, JSON.stringify(categoryDetails));
            return this.sendResponse(res, _common_1.RESPONSE.CATEGORY(res.locals.lang).CATEGORY_UPDATED);
        }
        catch (err) {
            console.error("Error", err);
            next(err);
        }
    }
    async inActivate(req, res, next) {
        try {
            let cat = await _entity_1.CategoryV1.findOne({ _id: req.params.id });
            let promise = [];
            if (cat) {
                if (cat.status != _common_1.ENUM.CATEGORY.STATUS.INACTIVE) {
                    promise.push(_entity_1.CategoryV1.updateDocument({ _id: cat._id }, { status: _common_1.ENUM.CATEGORY.STATUS.INACTIVE }));
                    if (cat && !cat.parentId)
                        promise.push(_entity_1.PropertySpaceV1.updateEntity({ "category._id": cat._id }, { status: _common_1.ENUM.CATEGORY.STATUS.INACTIVE }, { multi: true }));
                    if (cat && cat.parentId)
                        promise.push(_entity_1.PropertySpaceV1.updateEntity({ "subCategory._id": cat._id }, { status: _common_1.ENUM.CATEGORY.STATUS.INACTIVE }, { multi: true }));
                    await Promise.all(promise);
                    return this.sendResponse(res, _common_1.RESPONSE.CATEGORY(res.locals.lang).DE_ACTIVATED);
                }
                else
                    return this.sendResponse(res, _common_1.RESPONSE.CATEGORY(res.locals.lang).ALREADY_DE_ACTIVE);
            }
            else
                return this.sendResponse(res, _common_1.RESPONSE.CATEGORY(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async activate(req, res, next) {
        try {
            let cat = await _entity_1.CategoryV1.findOne({ _id: req.params.id });
            let promise = [];
            if (cat) {
                if (cat.status != _common_1.ENUM.CATEGORY.STATUS.ACTIVE) {
                    promise.push(_entity_1.CategoryV1.updateDocument({ _id: cat._id }, { status: _common_1.ENUM.CATEGORY.STATUS.ACTIVE }));
                    if (cat && !cat.parentId)
                        promise.push(_entity_1.PropertySpaceV1.updateEntity({ "category._id": cat._id }, { status: _common_1.ENUM.CATEGORY.STATUS.ACTIVE }, { multi: true }));
                    if (cat && cat.parentId)
                        promise.push(_entity_1.PropertySpaceV1.updateEntity({ "subCategory._id": cat._id }, { status: _common_1.ENUM.CATEGORY.STATUS.ACTIVE }, { multi: true }));
                    await Promise.all(promise);
                    return this.sendResponse(res, _common_1.RESPONSE.CATEGORY(res.locals.lang).ACTIVATED);
                }
                else
                    return this.sendResponse(res, _common_1.RESPONSE.CATEGORY(res.locals.lang).ALREADY_ACTIVE);
            }
            else
                return this.sendResponse(res, _common_1.RESPONSE.CATEGORY(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async details(req, res, next) {
        try {
            let payload = req.params;
            let pipeline = _builders_1.default.Admin.Category.CategoryDeatils(payload.id);
            let details = await _entity_1.CategoryV1.basicAggregate(pipeline);
            if (details)
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, details);
            else
                return this.sendResponse(res, _common_1.RESPONSE.CATEGORY(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Category listing",
        path: '/list',
        parameters: {
            query: {
                page: {
                    description: '1',
                    required: false,
                },
                limit: {
                    description: '10',
                    required: false,
                },
                parentId: {
                    description: 'parentId',
                    required: false,
                },
                search: {
                    description: 'searchkey',
                    required: false,
                },
                status: {
                    description: 'active/inactive',
                    required: false,
                },
                sortKey: {
                    description: 'name/createdAt',
                    required: false,
                },
                sortOrder: {
                    description: '1 and -1',
                    required: false,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AdminCategoryClass.prototype, "getCategory", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Add Category",
        path: '/add',
        parameters: {
            body: {
                description: 'Body for add category',
                required: true,
                model: 'ReqAddCategory'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AdminCategoryClass.prototype, "addCategory", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Update Category",
        path: '/update',
        parameters: {
            body: {
                description: 'Body for update category',
                required: true,
                model: 'ReqUpdateCategory'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AdminCategoryClass.prototype, "updateCategory", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Inactive",
        path: '/{id}/inactive',
        parameters: {
            path: {
                id: {
                    description: 'mongoId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AdminCategoryClass.prototype, "inActivate", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Activate Category",
        path: '/{id}/active',
        parameters: {
            path: {
                id: {
                    description: 'mongoId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AdminCategoryClass.prototype, "activate", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "User Details",
        path: '/{id}/details',
        parameters: {
            path: {
                id: {
                    description: 'mongoId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], AdminCategoryClass.prototype, "details", null);
AdminCategoryClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/category",
        name: "Admin Category Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminCategoryClass);
exports.AdminCategoryController = new AdminCategoryClass();
//# sourceMappingURL=admin.category.controller.js.map