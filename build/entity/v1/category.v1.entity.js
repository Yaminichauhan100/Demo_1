"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const category_model_1 = __importDefault(require("@models/category.model"));
const _builders_1 = __importDefault(require("@builders"));
const _services_1 = require("@services");
const _common_1 = require("@common");
class CategoryEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async createCategory(payload) {
        if (payload.parentId && payload.parentId != '') {
            payload.parentId = mongoose_1.Types.ObjectId(payload.parentId);
        }
        else {
            delete payload.parentId;
        }
        let category = await new this.model(payload).save();
        return category.toObject();
    }
    async getCategoryAndSubCategory() {
        return await category_model_1.default.aggregate(await _builders_1.default.Admin.Category.categoryAndSubCategoryDetails());
    }
    async checkDuplicateCategory(name) {
        return await category_model_1.default.aggregate(await _builders_1.default.Admin.Category.duplicateCategory(name));
    }
    async getCtegoriesSubCategoriesListFromRedis() {
        return await _services_1.redisDOA.getKeyFromRedisHash(_common_1.DATABASE.REDIS.KEY_NAMES.CATEGORY_AMENITIES, _common_1.DATABASE.REDIS.KEY_NAMES.CATEGORY_SUBACTEGORIES_HASH);
    }
}
exports.CategoryV1 = new CategoryEntity(category_model_1.default);
//# sourceMappingURL=category.v1.entity.js.map