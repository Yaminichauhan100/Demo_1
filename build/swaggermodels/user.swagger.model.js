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
exports.ReqUpdateProfileCalendarModel = exports.ReqCalendarSyncModel = exports.ReqUpdateUserCompleteProfileModel = exports.ReqGuestUserContactModel = exports.ReqNotificationModel = exports.ReqContactDirectModel = exports.ReqContactModel = exports.ReqRatingModel = exports.ReqProlongSpaceCartModel = exports.ReqSpaceCartModel = exports.ReqProceedPaymentModel = exports.ReqUpdateNotificationEmailToggle = exports.ReqUpdateNotificationToggle = exports.ReqUpdatePaymentPlanModel = exports.ReqUpdatepbTokenModel = exports.ReqCancelSpaceBookingModel = exports.ReqUpdateOfflineBookingModel = exports.ReqSpaceBookingModel = exports.ReqCoworkerInviteModel = exports.ReqUpdateUserProfileAndCompnayModel = exports.ReqMarkPropertyFavouriteModel = exports.ChangePhoneNoModel = exports.ReqUpdateUserCompanyDetailModel = exports.ReqAddUserCompanyDetailModel = exports.ReqUserSocialLoginModel = exports.ChangePasswordModel = exports.ReqUserResetPassword = exports.ForgetPasswordPhoneModel = exports.ForgetPasswordEmailModel = exports.UserLoginModel = exports.verifyOtpModel = exports.ReqVerifyOtpModel = exports.ReqUpdateUserDeviceToken = exports.ReqUserResendOtpModel = exports.ReqAddUserModel = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
let ReqAddUserModel = class ReqAddUserModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Comapny Type",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'company/individual'
    }),
    __metadata("design:type", String)
], ReqAddUserModel.prototype, "companyType", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Touheed'
    }),
    __metadata("design:type", String)
], ReqAddUserModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Email of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com'
    }),
    __metadata("design:type", String)
], ReqAddUserModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "password",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqAddUserModel.prototype, "password", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+1'
    }),
    __metadata("design:type", String)
], ReqAddUserModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqAddUserModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "subscribeEmail",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'true'
    }),
    __metadata("design:type", Boolean)
], ReqAddUserModel.prototype, "subscribeEmail", void 0);
ReqAddUserModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "User Add",
        name: "ReqAddUser"
    })
], ReqAddUserModel);
exports.ReqAddUserModel = ReqAddUserModel;
let ReqUserResendOtpModel = class ReqUserResendOtpModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+1'
    }),
    __metadata("design:type", String)
], ReqUserResendOtpModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqUserResendOtpModel.prototype, "phoneNo", void 0);
ReqUserResendOtpModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "reset password",
        name: "ReqUserResendOtp"
    })
], ReqUserResendOtpModel);
exports.ReqUserResendOtpModel = ReqUserResendOtpModel;
let ReqUpdateUserDeviceToken = class ReqUpdateUserDeviceToken {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "deviceToken",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'device token'
    }),
    __metadata("design:type", String)
], ReqUpdateUserDeviceToken.prototype, "deviceToken", void 0);
ReqUpdateUserDeviceToken = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "update device token",
        name: "ReqUpdateDeviceToken"
    })
], ReqUpdateUserDeviceToken);
exports.ReqUpdateUserDeviceToken = ReqUpdateUserDeviceToken;
let ReqVerifyOtpModel = class ReqVerifyOtpModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+1'
    }),
    __metadata("design:type", String)
], ReqVerifyOtpModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqVerifyOtpModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "otp",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '1234'
    }),
    __metadata("design:type", String)
], ReqVerifyOtpModel.prototype, "otp", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "password",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: { platform: "ios", token: "devicetoken" }
    }),
    __metadata("design:type", Object)
], ReqVerifyOtpModel.prototype, "device", void 0);
ReqVerifyOtpModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "User Add",
        name: "ReqVerifyOtp"
    })
], ReqVerifyOtpModel);
exports.ReqVerifyOtpModel = ReqVerifyOtpModel;
let verifyOtpModel = class verifyOtpModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+1'
    }),
    __metadata("design:type", String)
], verifyOtpModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], verifyOtpModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "otp",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '1234'
    }),
    __metadata("design:type", String)
], verifyOtpModel.prototype, "otp", void 0);
verifyOtpModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "verify otp",
        name: "verifyOtp"
    })
], verifyOtpModel);
exports.verifyOtpModel = verifyOtpModel;
let UserLoginModel = class UserLoginModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "email",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'ank@yopmail.com'
    }),
    __metadata("design:type", String)
], UserLoginModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "password",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], UserLoginModel.prototype, "password", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "device",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: { type: 0, token: "devicetoken" }
    }),
    __metadata("design:type", Object)
], UserLoginModel.prototype, "device", void 0);
UserLoginModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "User Add",
        name: "UserLogin"
    })
], UserLoginModel);
exports.UserLoginModel = UserLoginModel;
let ForgetPasswordEmailModel = class ForgetPasswordEmailModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "email",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'ank@yopmail.com'
    }),
    __metadata("design:type", String)
], ForgetPasswordEmailModel.prototype, "email", void 0);
ForgetPasswordEmailModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "User Add",
        name: "ForgetPasswordEmail"
    })
], ForgetPasswordEmailModel);
exports.ForgetPasswordEmailModel = ForgetPasswordEmailModel;
let ForgetPasswordPhoneModel = class ForgetPasswordPhoneModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+1'
    }),
    __metadata("design:type", String)
], ForgetPasswordPhoneModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ForgetPasswordPhoneModel.prototype, "phoneNo", void 0);
ForgetPasswordPhoneModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Forget Password ",
        name: "ForgetPasswordPhone"
    })
], ForgetPasswordPhoneModel);
exports.ForgetPasswordPhoneModel = ForgetPasswordPhoneModel;
let ReqUserResetPassword = class ReqUserResetPassword {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "resetToken",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI1ZThhYzQ2ODA4ZjIzNTJmOTc4ODkwY2QiLCJ0aW1lc3RhbXAiOjE1ODYxNTI1NTMwMzcsImlhdCI6MTU4NjE1MjU1M30.EBHnzc7mierT6esTiyODCCppn4H5v6HORIQ4UXJw2yI'
    }),
    __metadata("design:type", String)
], ReqUserResetPassword.prototype, "resetPasswordToken", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "new password",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqUserResetPassword.prototype, "password", void 0);
ReqUserResetPassword = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "reset password",
        name: "ReqUserResetPassword"
    })
], ReqUserResetPassword);
exports.ReqUserResetPassword = ReqUserResetPassword;
let ChangePasswordModel = class ChangePasswordModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "oldPassword",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ChangePasswordModel.prototype, "oldPassword", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "newPassword",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ChangePasswordModel.prototype, "newPassword", void 0);
ChangePasswordModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Change user password",
        name: "ChangePassword"
    })
], ChangePasswordModel);
exports.ChangePasswordModel = ChangePasswordModel;
let ReqUserSocialLoginModel = class ReqUserSocialLoginModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "socialType",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'facebook/linkedin'
    }),
    __metadata("design:type", String)
], ReqUserSocialLoginModel.prototype, "socialType", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "socialid",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "scvhdsvchdscs"
    }),
    __metadata("design:type", String)
], ReqUserSocialLoginModel.prototype, "socialId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "Touheed"
    }),
    __metadata("design:type", String)
], ReqUserSocialLoginModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "email",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "asdasdasd@yopmail.com"
    }),
    __metadata("design:type", String)
], ReqUserSocialLoginModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "+1"
    }),
    __metadata("design:type", String)
], ReqUserSocialLoginModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phoneNumber",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "345645645"
    }),
    __metadata("design:type", String)
], ReqUserSocialLoginModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "device",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: { type: "ios", token: "devicetoken" }
    }),
    __metadata("design:type", Object)
], ReqUserSocialLoginModel.prototype, "device", void 0);
ReqUserSocialLoginModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "social LOgin",
        name: "ReqUserSocialLogin"
    })
], ReqUserSocialLoginModel);
exports.ReqUserSocialLoginModel = ReqUserSocialLoginModel;
let ReqAddUserCompanyDetailModel = class ReqAddUserCompanyDetailModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Company",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Appinventiv'
    }),
    __metadata("design:type", String)
], ReqAddUserCompanyDetailModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Email of Company",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com'
    }),
    __metadata("design:type", String)
], ReqAddUserCompanyDetailModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+1'
    }),
    __metadata("design:type", String)
], ReqAddUserCompanyDetailModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqAddUserCompanyDetailModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "house no of company",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '9c'
    }),
    __metadata("design:type", String)
], ReqAddUserCompanyDetailModel.prototype, "houseNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "street of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'sec 58'
    }),
    __metadata("design:type", String)
], ReqAddUserCompanyDetailModel.prototype, "street", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "landmark of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'near thosom reuters'
    }),
    __metadata("design:type", String)
], ReqAddUserCompanyDetailModel.prototype, "landmark", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "country of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'India'
    }),
    __metadata("design:type", String)
], ReqAddUserCompanyDetailModel.prototype, "country", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "state of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'UP'
    }),
    __metadata("design:type", String)
], ReqAddUserCompanyDetailModel.prototype, "state", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "city of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Noida'
    }),
    __metadata("design:type", String)
], ReqAddUserCompanyDetailModel.prototype, "city", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "zipcode of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '201301'
    }),
    __metadata("design:type", String)
], ReqAddUserCompanyDetailModel.prototype, "zipCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "registration number of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqAddUserCompanyDetailModel.prototype, "regNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "profile picture of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg"
    }),
    __metadata("design:type", String)
], ReqAddUserCompanyDetailModel.prototype, "profilePicture", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "documents of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [
            'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
        ]
    }),
    __metadata("design:type", Array)
], ReqAddUserCompanyDetailModel.prototype, "documents", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "state id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 35
    }),
    __metadata("design:type", Number)
], ReqAddUserCompanyDetailModel.prototype, "stateId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "country Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 101
    }),
    __metadata("design:type", Number)
], ReqAddUserCompanyDetailModel.prototype, "countryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "city id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: "5e95596572304740458cde7a"
    }),
    __metadata("design:type", String)
], ReqAddUserCompanyDetailModel.prototype, "cityId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "subCompanyType",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
    }),
    __metadata("design:type", Number)
], ReqAddUserCompanyDetailModel.prototype, "subCompanyType", void 0);
ReqAddUserCompanyDetailModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "User Comapny Detail",
        name: "ReqAddUserCompanyDetail"
    })
], ReqAddUserCompanyDetailModel);
exports.ReqAddUserCompanyDetailModel = ReqAddUserCompanyDetailModel;
let ReqUpdateUserCompanyDetailModel = class ReqUpdateUserCompanyDetailModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Company",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Appinventiv'
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompanyDetailModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Email of Company",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com'
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompanyDetailModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+1'
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompanyDetailModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompanyDetailModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "house no of company",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '9c'
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompanyDetailModel.prototype, "houseNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "street of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'sec 58'
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompanyDetailModel.prototype, "street", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "landmark of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'near thosom reuters'
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompanyDetailModel.prototype, "landmark", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "zipcode of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '201301'
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompanyDetailModel.prototype, "zipCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "address of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '201301'
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompanyDetailModel.prototype, "address", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "registration number of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompanyDetailModel.prototype, "regNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "profile picture of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg"
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompanyDetailModel.prototype, "profilePicture", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "documents of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [
            'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
        ]
    }),
    __metadata("design:type", Array)
], ReqUpdateUserCompanyDetailModel.prototype, "documents", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "state id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 35
    }),
    __metadata("design:type", Number)
], ReqUpdateUserCompanyDetailModel.prototype, "stateId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "country Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 101
    }),
    __metadata("design:type", Number)
], ReqUpdateUserCompanyDetailModel.prototype, "countryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "city id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: "5e95596572304740458cde7a"
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompanyDetailModel.prototype, "cityId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "city id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: "0"
    }),
    __metadata("design:type", Number)
], ReqUpdateUserCompanyDetailModel.prototype, "subCompanyType", void 0);
ReqUpdateUserCompanyDetailModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "User Comapny Detail",
        name: "ReqUpdateUserCompanyDetail"
    })
], ReqUpdateUserCompanyDetailModel);
exports.ReqUpdateUserCompanyDetailModel = ReqUpdateUserCompanyDetailModel;
let ChangePhoneNoModel = class ChangePhoneNoModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+1'
    }),
    __metadata("design:type", String)
], ChangePhoneNoModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ChangePhoneNoModel.prototype, "phoneNo", void 0);
ChangePhoneNoModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Change Phone No",
        name: "ChangePhoneNo"
    })
], ChangePhoneNoModel);
exports.ChangePhoneNoModel = ChangePhoneNoModel;
class ReqMarkPropertyFavouriteModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "propertyId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'PropertyId'
    }),
    __metadata("design:type", String)
], ReqMarkPropertyFavouriteModel.prototype, "propertyId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
    }),
    __metadata("design:type", Number)
], ReqMarkPropertyFavouriteModel.prototype, "action", void 0);
exports.ReqMarkPropertyFavouriteModel = ReqMarkPropertyFavouriteModel;
let ReqUpdateUserProfileAndCompnayModel = class ReqUpdateUserProfileAndCompnayModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Touheed'
    }),
    __metadata("design:type", String)
], ReqUpdateUserProfileAndCompnayModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "address",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'sector 58, noida'
    }),
    __metadata("design:type", String)
], ReqUpdateUserProfileAndCompnayModel.prototype, "address", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "dob",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '1990/10/1'
    }),
    __metadata("design:type", String)
], ReqUpdateUserProfileAndCompnayModel.prototype, "dob", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "bio",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Bio goes here'
    }),
    __metadata("design:type", String)
], ReqUpdateUserProfileAndCompnayModel.prototype, "bio", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Email of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com'
    }),
    __metadata("design:type", String)
], ReqUpdateUserProfileAndCompnayModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+1'
    }),
    __metadata("design:type", String)
], ReqUpdateUserProfileAndCompnayModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqUpdateUserProfileAndCompnayModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "image",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
    }),
    __metadata("design:type", String)
], ReqUpdateUserProfileAndCompnayModel.prototype, "image", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "password",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: {
            "name": "Appinventiv",
            "email": "abc@yopmail.com",
            "address": "sector 58 noida",
            "countryCode": "+1",
            "phoneNo": "12345678",
            "houseNo": "9c",
            "street": "sec 58",
            "landmark": "near thosom reuters",
            "zipCode": "201301",
            "taxNo": "12345678",
            "regNo": "12345678",
            "profilePicture": "https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg",
            "documents": [
                "https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg"
            ],
            "stateId": 35,
            "countryId": 101,
            "cityId": "5e95596572304740458cde7a"
        }
    }),
    __metadata("design:type", Object)
], ReqUpdateUserProfileAndCompnayModel.prototype, "company", void 0);
ReqUpdateUserProfileAndCompnayModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "User update profile",
        name: "ReqUpdateUserProfileAndCompnay"
    })
], ReqUpdateUserProfileAndCompnayModel);
exports.ReqUpdateUserProfileAndCompnayModel = ReqUpdateUserProfileAndCompnayModel;
class ReqCoworkerInviteModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "documents of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [
            'ank@gmail.com'
        ]
    }),
    __metadata("design:type", Array)
], ReqCoworkerInviteModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Email of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'booking id'
    }),
    __metadata("design:type", String)
], ReqCoworkerInviteModel.prototype, "bookingId", void 0);
exports.ReqCoworkerInviteModel = ReqCoworkerInviteModel;
class ReqSpaceBookingModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "cart Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'cartId'
    }),
    __metadata("design:type", String)
], ReqSpaceBookingModel.prototype, "cartId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "occupancy",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
    }),
    __metadata("design:type", Number)
], ReqSpaceBookingModel.prototype, "occupancy", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "extended",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], ReqSpaceBookingModel.prototype, "extended", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "prolongBookingId",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqSpaceBookingModel.prototype, "prolongBookingId", void 0);
exports.ReqSpaceBookingModel = ReqSpaceBookingModel;
class ReqUpdateOfflineBookingModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "cart Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'cartId'
    }),
    __metadata("design:type", String)
], ReqUpdateOfflineBookingModel.prototype, "cartId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "occupancy",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
    }),
    __metadata("design:type", Number)
], ReqUpdateOfflineBookingModel.prototype, "occupancy", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "booking Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'cartId'
    }),
    __metadata("design:type", String)
], ReqUpdateOfflineBookingModel.prototype, "bookingId", void 0);
exports.ReqUpdateOfflineBookingModel = ReqUpdateOfflineBookingModel;
class ReqCancelSpaceBookingModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "booking Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'bookingId'
    }),
    __metadata("design:type", String)
], ReqCancelSpaceBookingModel.prototype, "bookingId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "description",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqCancelSpaceBookingModel.prototype, "description", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "reason",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqCancelSpaceBookingModel.prototype, "reason", void 0);
exports.ReqCancelSpaceBookingModel = ReqCancelSpaceBookingModel;
class ReqUpdatepbTokenModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "passBaseToken",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'asdkalsidqowasdhaluwe'
    }),
    __metadata("design:type", String)
], ReqUpdatepbTokenModel.prototype, "passbaseToken", void 0);
exports.ReqUpdatepbTokenModel = ReqUpdatepbTokenModel;
class ReqUpdatePaymentPlanModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "booking Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'bookingId'
    }),
    __metadata("design:type", String)
], ReqUpdatePaymentPlanModel.prototype, "bookingId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "paymentPlan",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: '1'
    }),
    __metadata("design:type", Number)
], ReqUpdatePaymentPlanModel.prototype, "paymentPlan", void 0);
exports.ReqUpdatePaymentPlanModel = ReqUpdatePaymentPlanModel;
class ReqUpdateNotificationToggle {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "1/0 for enabling/disabling notification",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqUpdateNotificationToggle.prototype, "notificationEnabled", void 0);
exports.ReqUpdateNotificationToggle = ReqUpdateNotificationToggle;
class ReqUpdateNotificationEmailToggle {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "1/0 for enabling/disabling emailnotification",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.BOOLEAN,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqUpdateNotificationEmailToggle.prototype, "mailNotificationEnabled", void 0);
exports.ReqUpdateNotificationEmailToggle = ReqUpdateNotificationEmailToggle;
class ReqProceedPaymentModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "booking Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'bookingId'
    }),
    __metadata("design:type", String)
], ReqProceedPaymentModel.prototype, "bookingId", void 0);
exports.ReqProceedPaymentModel = ReqProceedPaymentModel;
class ReqSpaceCartModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "propertyId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'PropertyId'
    }),
    __metadata("design:type", String)
], ReqSpaceCartModel.prototype, "propertyId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqSpaceCartModel.prototype, "spaceId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
    }),
    __metadata("design:type", String)
], ReqSpaceCartModel.prototype, "quantity", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqSpaceCartModel.prototype, "userId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqSpaceCartModel.prototype, "fromDate", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqSpaceCartModel.prototype, "toDate", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], ReqSpaceCartModel.prototype, "isEmployee", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
    }),
    __metadata("design:type", String)
], ReqSpaceCartModel.prototype, "bookingType", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
    }),
    __metadata("design:type", Number)
], ReqSpaceCartModel.prototype, "totalHours", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
    }),
    __metadata("design:type", Number)
], ReqSpaceCartModel.prototype, "totalMonths", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqSpaceCartModel.prototype, "PartnerId", void 0);
exports.ReqSpaceCartModel = ReqSpaceCartModel;
class ReqProlongSpaceCartModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "propertyId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'PropertyId'
    }),
    __metadata("design:type", String)
], ReqProlongSpaceCartModel.prototype, "propertyId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqProlongSpaceCartModel.prototype, "spaceId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
    }),
    __metadata("design:type", String)
], ReqProlongSpaceCartModel.prototype, "quantity", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqProlongSpaceCartModel.prototype, "userId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqProlongSpaceCartModel.prototype, "fromDate", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqProlongSpaceCartModel.prototype, "toDate", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], ReqProlongSpaceCartModel.prototype, "isEmployee", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
    }),
    __metadata("design:type", String)
], ReqProlongSpaceCartModel.prototype, "bookingType", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
    }),
    __metadata("design:type", Number)
], ReqProlongSpaceCartModel.prototype, "totalMonths", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "action",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqProlongSpaceCartModel.prototype, "PartnerId", void 0);
exports.ReqProlongSpaceCartModel = ReqProlongSpaceCartModel;
class ReqRatingModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "propertyId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'PropertyId'
    }),
    __metadata("design:type", String)
], ReqRatingModel.prototype, "propertyId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "bookingId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'bookingId'
    }),
    __metadata("design:type", String)
], ReqRatingModel.prototype, "bookingId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "hostId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'bookingId'
    }),
    __metadata("design:type", String)
], ReqRatingModel.prototype, "hostId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "rating",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
    }),
    __metadata("design:type", Number)
], ReqRatingModel.prototype, "rating", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "review",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqRatingModel.prototype, "review", void 0);
exports.ReqRatingModel = ReqRatingModel;
class ReqContactModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "bookingId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'bookingId'
    }),
    __metadata("design:type", String)
], ReqContactModel.prototype, "bookingId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqContactModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "email",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqContactModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "companyName",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqContactModel.prototype, "companyName", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phoneNo",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqContactModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "message",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqContactModel.prototype, "message", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqContactModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "subject",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqContactModel.prototype, "subject", void 0);
exports.ReqContactModel = ReqContactModel;
class ReqContactDirectModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqContactDirectModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "email",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqContactDirectModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "companyName",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqContactDirectModel.prototype, "companyName", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phoneNo",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqContactDirectModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "message",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqContactDirectModel.prototype, "message", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqContactDirectModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "subject",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqContactDirectModel.prototype, "subject", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "directType",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", Boolean)
], ReqContactDirectModel.prototype, "directType", void 0);
exports.ReqContactDirectModel = ReqContactDirectModel;
class ReqNotificationModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "notificationId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'notificationId'
    }),
    __metadata("design:type", String)
], ReqNotificationModel.prototype, "notificationId", void 0);
exports.ReqNotificationModel = ReqNotificationModel;
class ReqGuestUserContactModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqGuestUserContactModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "email",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqGuestUserContactModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "companyName",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqGuestUserContactModel.prototype, "companyName", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phoneNo",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqGuestUserContactModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "message",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqGuestUserContactModel.prototype, "message", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqGuestUserContactModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "subject",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqGuestUserContactModel.prototype, "subject", void 0);
exports.ReqGuestUserContactModel = ReqGuestUserContactModel;
class ReqUpdateUserCompleteProfileModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Touheed'
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompleteProfileModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Email of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com'
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompleteProfileModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+1'
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompleteProfileModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompleteProfileModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "image",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompleteProfileModel.prototype, "image", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "companyType",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'companyType'
    }),
    __metadata("design:type", String)
], ReqUpdateUserCompleteProfileModel.prototype, "companyType", void 0);
exports.ReqUpdateUserCompleteProfileModel = ReqUpdateUserCompleteProfileModel;
class ReqCalendarSyncModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqCalendarSyncModel.prototype, "calendarType", void 0);
exports.ReqCalendarSyncModel = ReqCalendarSyncModel;
class ReqUpdateProfileCalendarModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqUpdateProfileCalendarModel.prototype, "type", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 1
    }),
    __metadata("design:type", String)
], ReqUpdateProfileCalendarModel.prototype, "code", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "userId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 1
    }),
    __metadata("design:type", String)
], ReqUpdateProfileCalendarModel.prototype, "userId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 1
    }),
    __metadata("design:type", String)
], ReqUpdateProfileCalendarModel.prototype, "bookingId", void 0);
exports.ReqUpdateProfileCalendarModel = ReqUpdateProfileCalendarModel;
//# sourceMappingURL=user.swagger.model.js.map