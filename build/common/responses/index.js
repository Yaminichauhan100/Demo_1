"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESPONSE = exports.CUSTOM_ERROR = exports.SUCCESS = void 0;
const user_response_1 = __importDefault(require("./user.response"));
const admin_response_1 = __importDefault(require("./admin.response"));
const host_response_1 = __importDefault(require("./host.response"));
const property_response_1 = __importDefault(require("./property.response"));
const amenities_response_1 = __importDefault(require("./amenities.response"));
const category_response_1 = __importDefault(require("./category.response"));
const propertySpace_response_1 = __importDefault(require("./propertySpace.response"));
const location_response_1 = __importDefault(require("./location.response"));
exports.SUCCESS = {
    DEFAULT: {
        httpCode: 200,
        statusCode: 200,
        message: 'Success'
    },
    CAR_EDIT: {
        httpCode: 200,
        statusCode: 200,
        message: 'Car details updated successfully'
    },
    CO_HOST_ADDED: {
        httpCode: 201,
        statusCode: 201,
        message: 'Co-host added successfully'
    }
};
exports.CUSTOM_ERROR = (data, message) => {
    return ({
        httpCode: 400,
        statusCode: 400,
        message: message ? message : "Success",
        data: data ? data : {}
    });
};
exports.RESPONSE = {
    ADMIN: admin_response_1.default,
    USER: user_response_1.default,
    HOST: host_response_1.default,
    PROPERTY: property_response_1.default,
    AMENITIES: amenities_response_1.default,
    CATEGORY: category_response_1.default,
    PROPERTY_SPACE: propertySpace_response_1.default,
    LOCATION: location_response_1.default,
};
//# sourceMappingURL=index.js.map