"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSG = void 0;
const code_response_1 = __importDefault(require("./code.response"));
exports.MSG = {
    en: {
        NOT_FOUND: 'City not found',
        CITY_CREATED: 'City created successfully',
        CITY_UPDATED: 'City updated successfully',
        ACTIVATED: 'City activated',
        ALREADY_ACTIVE: 'City already active',
        DE_ACTIVATED: 'City deactivated',
        ALREADY_DE_ACTIVE: 'City already deactivated'
    }
};
exports.default = (lang) => ({
    NOT_FOUND: { httpCode: code_response_1.default.NOT_FOUND, statusCode: 404, message: exports.MSG[lang].NOT_FOUND },
    CITY_CREATED: { httpCode: code_response_1.default.SUCCESS, statusCode: 200, message: exports.MSG[lang].CITY_CREATED },
    CITY_UPDATED: { httpCode: code_response_1.default.SUCCESS, statusCode: 200, message: exports.MSG[lang].CITY_UPDATED },
    ACTIVATED: { httpCode: code_response_1.default.SUCCESS, statusCode: 200, message: exports.MSG[lang].ACTIVATED },
    ALREADY_ACTIVE: { httpCode: code_response_1.default.BAD_REQUEST, statusCode: 400, message: exports.MSG[lang].ALREADY_ACTIVE },
    DE_ACTIVATED: { httpCode: code_response_1.default.SUCCESS, statusCode: 200, message: exports.MSG[lang].DE_ACTIVATED },
    ALREADY_DE_ACTIVE: { httpCode: code_response_1.default.BAD_REQUEST, statusCode: 400, message: exports.MSG[lang].ALREADY_DE_ACTIVE }
});
//# sourceMappingURL=location.response.js.map