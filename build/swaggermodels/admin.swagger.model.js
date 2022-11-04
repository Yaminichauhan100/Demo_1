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
exports.ReqAdminConfigUpdateModel = exports.ReqAdminConfigModel = exports.ReqAdminSubjectModel = exports.ReqAdminUpdateProfileModel = exports.ReqAdminChangePasswordModel = exports.ReqAdminAmountConfigModel = exports.ReqAdminResetPasswordModel = exports.ReqAdminForgotPasswordModel = exports.ReqAdminLoginModel = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
let ReqAdminLoginModel = class ReqAdminLoginModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "email",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'desknowadmin@yopmail.com'
    }),
    __metadata("design:type", String)
], ReqAdminLoginModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "password",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Admin@123'
    }),
    __metadata("design:type", String)
], ReqAdminLoginModel.prototype, "password", void 0);
ReqAdminLoginModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Admin Login",
        name: "ReqAdminLogin"
    })
], ReqAdminLoginModel);
exports.ReqAdminLoginModel = ReqAdminLoginModel;
let ReqAdminForgotPasswordModel = class ReqAdminForgotPasswordModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "email",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'desknowadmin@yopmail.com'
    }),
    __metadata("design:type", String)
], ReqAdminForgotPasswordModel.prototype, "email", void 0);
ReqAdminForgotPasswordModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Admin Login",
        name: "ReqAdminForgotPassword"
    })
], ReqAdminForgotPasswordModel);
exports.ReqAdminForgotPasswordModel = ReqAdminForgotPasswordModel;
let ReqAdminResetPasswordModel = class ReqAdminResetPasswordModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "password",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '123456'
    }),
    __metadata("design:type", String)
], ReqAdminResetPasswordModel.prototype, "password", void 0);
ReqAdminResetPasswordModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Admin Reset Password",
        name: "ReqAdminResetPassword"
    })
], ReqAdminResetPasswordModel);
exports.ReqAdminResetPasswordModel = ReqAdminResetPasswordModel;
let ReqAdminAmountConfigModel = class ReqAdminAmountConfigModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Amount array",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: '123456'
    }),
    __metadata("design:type", Array)
], ReqAdminAmountConfigModel.prototype, "amount", void 0);
ReqAdminAmountConfigModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Admin Reset Password",
        name: "ReqAdminAmountConfigModel"
    })
], ReqAdminAmountConfigModel);
exports.ReqAdminAmountConfigModel = ReqAdminAmountConfigModel;
let ReqAdminChangePasswordModel = class ReqAdminChangePasswordModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "oldpassword",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '123456'
    }),
    __metadata("design:type", String)
], ReqAdminChangePasswordModel.prototype, "oldPassword", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "oldpassword",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqAdminChangePasswordModel.prototype, "newPassword", void 0);
ReqAdminChangePasswordModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Admin Change Password",
        name: "ReqAdminChangePassword"
    })
], ReqAdminChangePasswordModel);
exports.ReqAdminChangePasswordModel = ReqAdminChangePasswordModel;
let ReqAdminUpdateProfileModel = class ReqAdminUpdateProfileModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "profile photo",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
    }),
    __metadata("design:type", String)
], ReqAdminUpdateProfileModel.prototype, "profilePhoto", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'rahul'
    }),
    __metadata("design:type", String)
], ReqAdminUpdateProfileModel.prototype, "name", void 0);
ReqAdminUpdateProfileModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Admin Update Profile",
        name: "ReqAdminUpdateProfile"
    })
], ReqAdminUpdateProfileModel);
exports.ReqAdminUpdateProfileModel = ReqAdminUpdateProfileModel;
class ReqAdminSubjectModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'return policy'
    }),
    __metadata("design:type", String)
], ReqAdminSubjectModel.prototype, "name", void 0);
exports.ReqAdminSubjectModel = ReqAdminSubjectModel;
class ReqAdminConfigModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "title",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'title'
    }),
    __metadata("design:type", String)
], ReqAdminConfigModel.prototype, "title", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "image",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'image'
    }),
    __metadata("design:type", String)
], ReqAdminConfigModel.prototype, "image", void 0);
exports.ReqAdminConfigModel = ReqAdminConfigModel;
class ReqAdminConfigUpdateModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'id'
    }),
    __metadata("design:type", String)
], ReqAdminConfigUpdateModel.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "title",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'title'
    }),
    __metadata("design:type", String)
], ReqAdminConfigUpdateModel.prototype, "title", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "image",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'image'
    }),
    __metadata("design:type", String)
], ReqAdminConfigUpdateModel.prototype, "image", void 0);
exports.ReqAdminConfigUpdateModel = ReqAdminConfigUpdateModel;
//# sourceMappingURL=admin.swagger.model.js.map