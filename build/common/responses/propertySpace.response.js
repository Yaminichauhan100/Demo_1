"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSG = void 0;
const code_response_1 = __importDefault(require("./code.response"));
exports.MSG = {
    en: { NOT_FOUND: 'Property Space not found' }
};
exports.default = (lang) => ({
    NOT_FOUND: { httpCode: code_response_1.default.NOT_FOUND, statusCode: 404, message: exports.MSG[lang].NOT_FOUND }
});
//# sourceMappingURL=propertySpace.response.js.map