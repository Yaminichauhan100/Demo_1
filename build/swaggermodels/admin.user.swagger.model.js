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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReqAdminFeatureProperty = exports.ReqAdminUpdateUserModel = exports.ReqAdminAddUserModel = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
let ReqAdminAddUserModel = class ReqAdminAddUserModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "name of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Anil'
    }),
    __metadata("design:type", String)
], ReqAdminAddUserModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "email of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com'
    }),
    __metadata("design:type", String)
], ReqAdminAddUserModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "password",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '123456'
    }),
    __metadata("design:type", String)
], ReqAdminAddUserModel.prototype, "password", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+91'
    }),
    __metadata("design:type", String)
], ReqAdminAddUserModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "city",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'new yourk'
    }),
    __metadata("design:type", String)
], ReqAdminAddUserModel.prototype, "city", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '9990456786'
    }),
    __metadata("design:type", String)
], ReqAdminAddUserModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "image url",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'savhjcvdsc'
    }),
    __metadata("design:type", String)
], ReqAdminAddUserModel.prototype, "image", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "elite/basic",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'basic'
    }),
    __metadata("design:type", String)
], ReqAdminAddUserModel.prototype, "userType", void 0);
ReqAdminAddUserModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "User Add",
        name: "ReqAdminAddUser"
    })
], ReqAdminAddUserModel);
exports.ReqAdminAddUserModel = ReqAdminAddUserModel;
let ReqAdminUpdateUserModel = class ReqAdminUpdateUserModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "name of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Anil'
    }),
    __metadata("design:type", String)
], ReqAdminUpdateUserModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "email of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com'
    }),
    __metadata("design:type", String)
], ReqAdminUpdateUserModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+91'
    }),
    __metadata("design:type", String)
], ReqAdminUpdateUserModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "city",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'new york'
    }),
    __metadata("design:type", String)
], ReqAdminUpdateUserModel.prototype, "city", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '9990456786'
    }),
    __metadata("design:type", String)
], ReqAdminUpdateUserModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "image url",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'savhjcvdsc'
    }),
    __metadata("design:type", String)
], ReqAdminUpdateUserModel.prototype, "image", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "elite/basic",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'basic'
    }),
    __metadata("design:type", String)
], ReqAdminUpdateUserModel.prototype, "userType", void 0);
ReqAdminUpdateUserModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "User Add",
        name: "ReqAdminUpdateUser"
    })
], ReqAdminUpdateUserModel);
exports.ReqAdminUpdateUserModel = ReqAdminUpdateUserModel;
class ReqAdminFeatureProperty {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "isFeatured",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.BOOLEAN,
        example: 'true/false'
    }),
    __metadata("design:type", Boolean)
], ReqAdminFeatureProperty.prototype, "isFeaturedProperty", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "property Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'mongo id'
    }),
    __metadata("design:type", String)
], ReqAdminFeatureProperty.prototype, "propertyId", void 0);
exports.ReqAdminFeatureProperty = ReqAdminFeatureProperty;
//# sourceMappingURL=admin.user.swagger.model.js.map