"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSG = void 0;
const code_response_1 = __importDefault(require("./code.response"));
exports.MSG = {
    en: {
        NOT_FOUND: 'Category not found',
        CATEGORY_CREATED: 'Category created successfully',
        SUBCATEGORY_CREATED: 'Sub category created successfully',
        CATEGORY_UPDATED: 'Category updated successfully',
        ACTIVATED: 'Category activated',
        ALREADY_ACTIVE: 'Category already active',
        DE_ACTIVATED: 'Category deactivated',
        ALREADY_DE_ACTIVE: 'Category already deactivated',
        DUPLICATE_CATEGORY: 'Duplicate category',
    }
};
exports.default = (lang) => ({
    NOT_FOUND: { httpCode: code_response_1.default.NOT_FOUND, statusCode: 404, message: exports.MSG[lang].NOT_FOUND },
    CATEGORY_CREATED: { httpCode: code_response_1.default.SUCCESS, statusCode: 200, message: exports.MSG[lang].CATEGORY_CREATED },
    SUBCATEGORY_CREATED: { httpCode: code_response_1.default.SUCCESS, statusCode: 200, message: exports.MSG[lang].SUBCATEGORY_CREATED },
    CATEGORY_UPDATED: { httpCode: code_response_1.default.SUCCESS, statusCode: 200, message: exports.MSG[lang].CATEGORY_UPDATED },
    ACTIVATED: { httpCode: code_response_1.default.SUCCESS, statusCode: 200, message: exports.MSG[lang].ACTIVATED },
    ALREADY_ACTIVE: { httpCode: code_response_1.default.BAD_REQUEST, statusCode: 400, message: exports.MSG[lang].ALREADY_ACTIVE },
    DE_ACTIVATED: { httpCode: code_response_1.default.SUCCESS, statusCode: 200, message: exports.MSG[lang].DE_ACTIVATED },
    ALREADY_DE_ACTIVE: { httpCode: code_response_1.default.BAD_REQUEST, statusCode: 400, message: exports.MSG[lang].ALREADY_DE_ACTIVE },
    DUPLICATE_CATEGORY: { httpCode: code_response_1.default.BAD_REQUEST, statusCode: 400, message: exports.MSG[lang].DUPLICATE_CATEGORY }
});
//# sourceMappingURL=category.response.js.map