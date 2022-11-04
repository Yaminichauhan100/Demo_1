"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSG = void 0;
const code_response_1 = __importDefault(require("./code.response"));
exports.MSG = {
    en: {
        NOT_FOUND: 'Amenity not found',
        AMENITIES_CREATED: 'Amenities created successfully',
        AMENITIES_UPDATED: 'Amenities updated successfully',
        ACTIVATED: 'Amenity activated',
        ALREADY_ACTIVE: 'Amenity already active',
        DE_ACTIVATED: 'Amenity deactivated',
        ALREADY_DE_ACTIVE: 'Amenity already deactivated',
        DUPLICATE_AMENITIES: 'Duplicate Amenities',
        FEATURED_AMENTIES_LINIT: 'Featured Amenties limit exceded'
    }
};
exports.default = (lang) => ({
    NOT_FOUND: { httpCode: code_response_1.default.NOT_FOUND, statusCode: 404, message: exports.MSG[lang].NOT_FOUND },
    AMENITIES_CREATED: { httpCode: code_response_1.default.SUCCESS, statusCode: 200, message: exports.MSG[lang].AMENITIES_CREATED },
    AMENITIES_UPDATED: { httpCode: code_response_1.default.SUCCESS, statusCode: 200, message: exports.MSG[lang].AMENITIES_UPDATED },
    ACTIVATED: { httpCode: code_response_1.default.SUCCESS, statusCode: 200, message: exports.MSG[lang].ACTIVATED },
    ALREADY_ACTIVE: { httpCode: code_response_1.default.BAD_REQUEST, statusCode: 400, message: exports.MSG[lang].ALREADY_ACTIVE },
    DE_ACTIVATED: { httpCode: code_response_1.default.SUCCESS, statusCode: 200, message: exports.MSG[lang].DE_ACTIVATED },
    ALREADY_DE_ACTIVE: { httpCode: code_response_1.default.BAD_REQUEST, statusCode: 400, message: exports.MSG[lang].ALREADY_DE_ACTIVE },
    DUPLICATE_AMENITIES: { httpCode: code_response_1.default.BAD_REQUEST, statusCode: 400, message: exports.MSG[lang].DUPLICATE_AMENITIES },
    Featured_AMENITIES_LIMIT: { httpCode: code_response_1.default.BAD_REQUEST, statusCode: 400, message: exports.MSG[lang].FEATURED_AMENTIES_LINIT },
});
//# sourceMappingURL=amenities.response.js.map