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
exports.ReqCheckInModel = exports.ReqUpdateCoHostAceessModel = exports.ReqUpdateCoHostModel = exports.ReqEditCoHostTerritoyModel = exports.ReqAddCoHostTerritoyModel = exports.ReqAddCoHostModel = exports.ReqOfflineUser = exports.ReqOfflineBooking = exports.ReqHostRatingModel = exports.ReqHostVerifyNewPhoneOtpModel = exports.ReqUpdateHostCompanyDetailModel = exports.ReqUpdateUserProfileModel = exports.ReqUpdateHostProfileModel = exports.ReqAddHostCompanyDetailModel = exports.ReqHostSocialLoginModel = exports.ReqHostResetPassword = exports.HostLoginModel = exports.ReqUpdateDeviceToken = exports.ReqHostVerifyOtpModel = exports.ReqHostDeleteClientModel = exports.ReqHostResendOtpModel = exports.ReqAddHostModel = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
let ReqAddHostModel = class ReqAddHostModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Touheed'
    }),
    __metadata("design:type", String)
], ReqAddHostModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Email of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com'
    }),
    __metadata("design:type", String)
], ReqAddHostModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "password",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqAddHostModel.prototype, "password", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+1'
    }),
    __metadata("design:type", String)
], ReqAddHostModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqAddHostModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "subscribeEmail",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'true'
    }),
    __metadata("design:type", Boolean)
], ReqAddHostModel.prototype, "subscribeEmail", void 0);
ReqAddHostModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Host Add",
        name: "ReqAddHost"
    })
], ReqAddHostModel);
exports.ReqAddHostModel = ReqAddHostModel;
let ReqHostResendOtpModel = class ReqHostResendOtpModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+1'
    }),
    __metadata("design:type", String)
], ReqHostResendOtpModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqHostResendOtpModel.prototype, "phoneNo", void 0);
ReqHostResendOtpModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "resnd otp",
        name: "ReqHostResendOtp"
    })
], ReqHostResendOtpModel);
exports.ReqHostResendOtpModel = ReqHostResendOtpModel;
let ReqHostDeleteClientModel = class ReqHostDeleteClientModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "userId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'mongo id'
    }),
    __metadata("design:type", String)
], ReqHostDeleteClientModel.prototype, "userId", void 0);
ReqHostDeleteClientModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "resnd otp",
        name: "ReqHostDeleteClientModel"
    })
], ReqHostDeleteClientModel);
exports.ReqHostDeleteClientModel = ReqHostDeleteClientModel;
let ReqHostVerifyOtpModel = class ReqHostVerifyOtpModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+1'
    }),
    __metadata("design:type", String)
], ReqHostVerifyOtpModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqHostVerifyOtpModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "otp",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '1234'
    }),
    __metadata("design:type", String)
], ReqHostVerifyOtpModel.prototype, "otp", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "password",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: { platform: "ios", token: "devicetoken" }
    }),
    __metadata("design:type", Object)
], ReqHostVerifyOtpModel.prototype, "device", void 0);
ReqHostVerifyOtpModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "User Add",
        name: "ReqHostVerifyOtp"
    })
], ReqHostVerifyOtpModel);
exports.ReqHostVerifyOtpModel = ReqHostVerifyOtpModel;
let ReqUpdateDeviceToken = class ReqUpdateDeviceToken {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "deviceToken",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'device token'
    }),
    __metadata("design:type", String)
], ReqUpdateDeviceToken.prototype, "deviceToken", void 0);
ReqUpdateDeviceToken = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "update device token",
        name: "ReqUpdateDeviceToken"
    })
], ReqUpdateDeviceToken);
exports.ReqUpdateDeviceToken = ReqUpdateDeviceToken;
let HostLoginModel = class HostLoginModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "email",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'ank@yopmail.com'
    }),
    __metadata("design:type", String)
], HostLoginModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "password",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], HostLoginModel.prototype, "password", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "device",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: { type: 0, token: "devicetoken" }
    }),
    __metadata("design:type", Object)
], HostLoginModel.prototype, "device", void 0);
HostLoginModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "User Add",
        name: "HostLogin"
    })
], HostLoginModel);
exports.HostLoginModel = HostLoginModel;
let ReqHostResetPassword = class ReqHostResetPassword {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "resetToken",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI1ZThhYzQ2ODA4ZjIzNTJmOTc4ODkwY2QiLCJ0aW1lc3RhbXAiOjE1ODYxNTI1NTMwMzcsImlhdCI6MTU4NjE1MjU1M30.EBHnzc7mierT6esTiyODCCppn4H5v6HORIQ4UXJw2yI'
    }),
    __metadata("design:type", String)
], ReqHostResetPassword.prototype, "resetPasswordToken", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "new password",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqHostResetPassword.prototype, "password", void 0);
ReqHostResetPassword = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "reset password",
        name: "ReqHostResetPassword"
    })
], ReqHostResetPassword);
exports.ReqHostResetPassword = ReqHostResetPassword;
let ReqHostSocialLoginModel = class ReqHostSocialLoginModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "socialType",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'facebook/linkedin'
    }),
    __metadata("design:type", String)
], ReqHostSocialLoginModel.prototype, "socialType", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "socialid",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "scvhdsvchdscs"
    }),
    __metadata("design:type", String)
], ReqHostSocialLoginModel.prototype, "socialId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "Touheed"
    }),
    __metadata("design:type", String)
], ReqHostSocialLoginModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "email",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "asdasdasd@yopmail.com"
    }),
    __metadata("design:type", String)
], ReqHostSocialLoginModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "+1"
    }),
    __metadata("design:type", String)
], ReqHostSocialLoginModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phoneNumber",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "345645645"
    }),
    __metadata("design:type", String)
], ReqHostSocialLoginModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "device",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: { platform: "ios", token: "devicetoken" }
    }),
    __metadata("design:type", Object)
], ReqHostSocialLoginModel.prototype, "device", void 0);
ReqHostSocialLoginModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "social LOgin",
        name: "ReqHostSocialLogin"
    })
], ReqHostSocialLoginModel);
exports.ReqHostSocialLoginModel = ReqHostSocialLoginModel;
let ReqAddHostCompanyDetailModel = class ReqAddHostCompanyDetailModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Company",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Appinventiv'
    }),
    __metadata("design:type", String)
], ReqAddHostCompanyDetailModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "address",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Appinventiv'
    }),
    __metadata("design:type", String)
], ReqAddHostCompanyDetailModel.prototype, "address", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Email of Company",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com'
    }),
    __metadata("design:type", String)
], ReqAddHostCompanyDetailModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+1'
    }),
    __metadata("design:type", String)
], ReqAddHostCompanyDetailModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqAddHostCompanyDetailModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "house no of company",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '9c'
    }),
    __metadata("design:type", String)
], ReqAddHostCompanyDetailModel.prototype, "houseNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "street of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'sec 58'
    }),
    __metadata("design:type", String)
], ReqAddHostCompanyDetailModel.prototype, "street", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "landmark of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'near thosom reuters'
    }),
    __metadata("design:type", String)
], ReqAddHostCompanyDetailModel.prototype, "landmark", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "zipcode of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '201301'
    }),
    __metadata("design:type", String)
], ReqAddHostCompanyDetailModel.prototype, "zipCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "tax number of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqAddHostCompanyDetailModel.prototype, "taxNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "registration number of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqAddHostCompanyDetailModel.prototype, "regNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "profile picture of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg"
    }),
    __metadata("design:type", String)
], ReqAddHostCompanyDetailModel.prototype, "profilePicture", void 0);
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
], ReqAddHostCompanyDetailModel.prototype, "documents", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "state id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 35
    }),
    __metadata("design:type", Number)
], ReqAddHostCompanyDetailModel.prototype, "stateId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "country Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 101
    }),
    __metadata("design:type", Number)
], ReqAddHostCompanyDetailModel.prototype, "countryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "city id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: "5e95596572304740458cde7a"
    }),
    __metadata("design:type", String)
], ReqAddHostCompanyDetailModel.prototype, "cityId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "tnc ",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.BOOLEAN,
        example: true
    }),
    __metadata("design:type", Boolean)
], ReqAddHostCompanyDetailModel.prototype, "tncAgreed", void 0);
ReqAddHostCompanyDetailModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Host Comapny Detail",
        name: "ReqAddHostCompanyDetail"
    })
], ReqAddHostCompanyDetailModel);
exports.ReqAddHostCompanyDetailModel = ReqAddHostCompanyDetailModel;
let ReqUpdateHostProfileModel = class ReqUpdateHostProfileModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Touheed'
    }),
    __metadata("design:type", String)
], ReqUpdateHostProfileModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "address",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'sector 58, noida'
    }),
    __metadata("design:type", String)
], ReqUpdateHostProfileModel.prototype, "address", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "dob",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '1990/10/1'
    }),
    __metadata("design:type", String)
], ReqUpdateHostProfileModel.prototype, "dob", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "bio",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Bio goes here'
    }),
    __metadata("design:type", String)
], ReqUpdateHostProfileModel.prototype, "bio", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "bio",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Bio goes here'
    }),
    __metadata("design:type", String)
], ReqUpdateHostProfileModel.prototype, "fbUrl", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "bio",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Bio goes here'
    }),
    __metadata("design:type", String)
], ReqUpdateHostProfileModel.prototype, "twitterUrl", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "bio",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Bio goes here'
    }),
    __metadata("design:type", String)
], ReqUpdateHostProfileModel.prototype, "linkedinUrl", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "bio",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Bio goes here'
    }),
    __metadata("design:type", String)
], ReqUpdateHostProfileModel.prototype, "youtubeUrl", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "bio",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Bio goes here'
    }),
    __metadata("design:type", String)
], ReqUpdateHostProfileModel.prototype, "instaUrl", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "bio",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Bio goes here'
    }),
    __metadata("design:type", String)
], ReqUpdateHostProfileModel.prototype, "slackUrl", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "image",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
    }),
    __metadata("design:type", String)
], ReqUpdateHostProfileModel.prototype, "image", void 0);
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
            "cityId": "5e95596572304740458cde7a",
            "tncAgreed": true
        }
    }),
    __metadata("design:type", Object)
], ReqUpdateHostProfileModel.prototype, "company", void 0);
ReqUpdateHostProfileModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Host update profile",
        name: "ReqUpdateHostProfile"
    })
], ReqUpdateHostProfileModel);
exports.ReqUpdateHostProfileModel = ReqUpdateHostProfileModel;
let ReqUpdateUserProfileModel = class ReqUpdateUserProfileModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Touheed'
    }),
    __metadata("design:type", String)
], ReqUpdateUserProfileModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "address",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'sector 58, noida'
    }),
    __metadata("design:type", String)
], ReqUpdateUserProfileModel.prototype, "address", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "dob",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '1990/10/1'
    }),
    __metadata("design:type", String)
], ReqUpdateUserProfileModel.prototype, "dob", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "bio",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Bio goes here'
    }),
    __metadata("design:type", String)
], ReqUpdateUserProfileModel.prototype, "bio", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "image",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
    }),
    __metadata("design:type", String)
], ReqUpdateUserProfileModel.prototype, "image", void 0);
ReqUpdateUserProfileModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "User update profile",
        name: "ReqUpdateUserProfile"
    })
], ReqUpdateUserProfileModel);
exports.ReqUpdateUserProfileModel = ReqUpdateUserProfileModel;
let ReqUpdateHostCompanyDetailModel = class ReqUpdateHostCompanyDetailModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Company",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Appinventiv'
    }),
    __metadata("design:type", String)
], ReqUpdateHostCompanyDetailModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Email of Company",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com'
    }),
    __metadata("design:type", String)
], ReqUpdateHostCompanyDetailModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+1'
    }),
    __metadata("design:type", String)
], ReqUpdateHostCompanyDetailModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqUpdateHostCompanyDetailModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "house no of company",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '9c'
    }),
    __metadata("design:type", String)
], ReqUpdateHostCompanyDetailModel.prototype, "houseNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "street of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'sec 58'
    }),
    __metadata("design:type", String)
], ReqUpdateHostCompanyDetailModel.prototype, "street", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "landmark of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'near thosom reuters'
    }),
    __metadata("design:type", String)
], ReqUpdateHostCompanyDetailModel.prototype, "landmark", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "zipcode of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '201301'
    }),
    __metadata("design:type", String)
], ReqUpdateHostCompanyDetailModel.prototype, "zipCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "tax number of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqUpdateHostCompanyDetailModel.prototype, "taxNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "registration number of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqUpdateHostCompanyDetailModel.prototype, "regNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "profile picture of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg"
    }),
    __metadata("design:type", String)
], ReqUpdateHostCompanyDetailModel.prototype, "profilePicture", void 0);
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
], ReqUpdateHostCompanyDetailModel.prototype, "documents", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "state id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 35
    }),
    __metadata("design:type", Number)
], ReqUpdateHostCompanyDetailModel.prototype, "stateId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "country Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 101
    }),
    __metadata("design:type", Number)
], ReqUpdateHostCompanyDetailModel.prototype, "countryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "city id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: "5e95596572304740458cde7a"
    }),
    __metadata("design:type", String)
], ReqUpdateHostCompanyDetailModel.prototype, "cityId", void 0);
ReqUpdateHostCompanyDetailModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Host Comapny Detail",
        name: "ReqUpdateHostCompanyDetailModel"
    })
], ReqUpdateHostCompanyDetailModel);
exports.ReqUpdateHostCompanyDetailModel = ReqUpdateHostCompanyDetailModel;
let ReqHostVerifyNewPhoneOtpModel = class ReqHostVerifyNewPhoneOtpModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+1'
    }),
    __metadata("design:type", String)
], ReqHostVerifyNewPhoneOtpModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqHostVerifyNewPhoneOtpModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "otp",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '1234'
    }),
    __metadata("design:type", String)
], ReqHostVerifyNewPhoneOtpModel.prototype, "otp", void 0);
ReqHostVerifyNewPhoneOtpModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "User Add",
        name: "ReqHostVerifyNewPhoneOtpModel"
    })
], ReqHostVerifyNewPhoneOtpModel);
exports.ReqHostVerifyNewPhoneOtpModel = ReqHostVerifyNewPhoneOtpModel;
class ReqHostRatingModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "reviewId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqHostRatingModel.prototype, "reviewId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "review",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqHostRatingModel.prototype, "review", void 0);
exports.ReqHostRatingModel = ReqHostRatingModel;
class ReqOfflineBooking {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name as string",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'John Doe'
    }),
    __metadata("design:type", String)
], ReqOfflineBooking.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Email as string",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'johndoe@yopmail.com'
    }),
    __metadata("design:type", String)
], ReqOfflineBooking.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Full mobile number",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+91-123456789'
    }),
    __metadata("design:type", String)
], ReqOfflineBooking.prototype, "fullMobileNumber", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Company Name",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "Doe Industries"
    }),
    __metadata("design:type", String)
], ReqOfflineBooking.prototype, "companyName", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Company Email",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'johnny@doe.com'
    }),
    __metadata("design:type", String)
], ReqOfflineBooking.prototype, "companyEmail", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Company Office Number",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+91-123456789'
    }),
    __metadata("design:type", String)
], ReqOfflineBooking.prototype, "companyOfficeNumber", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Company House Number",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: '1234'
    }),
    __metadata("design:type", Number)
], ReqOfflineBooking.prototype, "houseNumber", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Street",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '1st cross street'
    }),
    __metadata("design:type", String)
], ReqOfflineBooking.prototype, "street", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "landmark",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'near john circle'
    }),
    __metadata("design:type", String)
], ReqOfflineBooking.prototype, "landmark", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Country",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'pass country id'
    }),
    __metadata("design:type", String)
], ReqOfflineBooking.prototype, "country", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Zip code",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '021230'
    }),
    __metadata("design:type", String)
], ReqOfflineBooking.prototype, "zipCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "State",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: ''
    }),
    __metadata("design:type", String)
], ReqOfflineBooking.prototype, "state", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "City",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'City id'
    }),
    __metadata("design:type", String)
], ReqOfflineBooking.prototype, "city", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Company Reg no",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '123456789'
    }),
    __metadata("design:type", String)
], ReqOfflineBooking.prototype, "registrationNumber", void 0);
exports.ReqOfflineBooking = ReqOfflineBooking;
class ReqOfflineUser {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "User Id as string",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'userId'
    }),
    __metadata("design:type", String)
], ReqOfflineUser.prototype, "userId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name as string",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'John Doe'
    }),
    __metadata("design:type", String)
], ReqOfflineUser.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Email as string",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'johndoe@yopmail.com'
    }),
    __metadata("design:type", String)
], ReqOfflineUser.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Full mobile number",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+91-123456789'
    }),
    __metadata("design:type", String)
], ReqOfflineUser.prototype, "fullMobileNumber", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Company Name",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "Doe Industries"
    }),
    __metadata("design:type", String)
], ReqOfflineUser.prototype, "companyName", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Company Email",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'johnny@doe.com'
    }),
    __metadata("design:type", String)
], ReqOfflineUser.prototype, "companyEmail", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Company Office Number",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+91-123456789'
    }),
    __metadata("design:type", String)
], ReqOfflineUser.prototype, "companyOfficeNumber", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Company House Number",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: '1234'
    }),
    __metadata("design:type", Number)
], ReqOfflineUser.prototype, "houseNumber", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Street",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '1st cross street'
    }),
    __metadata("design:type", String)
], ReqOfflineUser.prototype, "street", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "landmark",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'near john circle'
    }),
    __metadata("design:type", String)
], ReqOfflineUser.prototype, "landmark", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Country",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'pass country id'
    }),
    __metadata("design:type", String)
], ReqOfflineUser.prototype, "country", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Zip code",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '021230'
    }),
    __metadata("design:type", String)
], ReqOfflineUser.prototype, "zipCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "State",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: ''
    }),
    __metadata("design:type", String)
], ReqOfflineUser.prototype, "state", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "City",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'City id'
    }),
    __metadata("design:type", String)
], ReqOfflineUser.prototype, "city", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Company Reg no",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '123456789'
    }),
    __metadata("design:type", String)
], ReqOfflineUser.prototype, "registrationNumber", void 0);
exports.ReqOfflineUser = ReqOfflineUser;
let ReqAddCoHostModel = class ReqAddCoHostModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Touheed'
    }),
    __metadata("design:type", String)
], ReqAddCoHostModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Email of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com'
    }),
    __metadata("design:type", String)
], ReqAddCoHostModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '+1'
    }),
    __metadata("design:type", String)
], ReqAddCoHostModel.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ReqAddCoHostModel.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "access rights",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [
            0
        ]
    }),
    __metadata("design:type", Array)
], ReqAddCoHostModel.prototype, "permissions", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "territory",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: {
            "propertyId": ["mongoid"],
            "stateId": [35],
            "countryId": [101],
            "cityId": ["mongoid"]
        }
    }),
    __metadata("design:type", Object)
], ReqAddCoHostModel.prototype, "territory", void 0);
ReqAddCoHostModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Host Add",
        name: "ReqAddCoHostModel"
    })
], ReqAddCoHostModel);
exports.ReqAddCoHostModel = ReqAddCoHostModel;
let ReqAddCoHostTerritoyModel = class ReqAddCoHostTerritoyModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "mongoid",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'mongiid'
    }),
    __metadata("design:type", String)
], ReqAddCoHostTerritoyModel.prototype, "cohostId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Email of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: [35]
    }),
    __metadata("design:type", String)
], ReqAddCoHostTerritoyModel.prototype, "stateId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: ["mongoid"]
    }),
    __metadata("design:type", String)
], ReqAddCoHostTerritoyModel.prototype, "cityId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: [101]
    }),
    __metadata("design:type", String)
], ReqAddCoHostTerritoyModel.prototype, "countryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: ["mongoid"]
    }),
    __metadata("design:type", String)
], ReqAddCoHostTerritoyModel.prototype, "propertyId", void 0);
ReqAddCoHostTerritoyModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Host Add",
        name: "ReqAddCoHostTerritoyModel"
    })
], ReqAddCoHostTerritoyModel);
exports.ReqAddCoHostTerritoyModel = ReqAddCoHostTerritoyModel;
let ReqEditCoHostTerritoyModel = class ReqEditCoHostTerritoyModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "mongoid",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'mongiid'
    }),
    __metadata("design:type", String)
], ReqEditCoHostTerritoyModel.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Email of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: [35]
    }),
    __metadata("design:type", String)
], ReqEditCoHostTerritoyModel.prototype, "stateId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryCode",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: ["mongoid"]
    }),
    __metadata("design:type", String)
], ReqEditCoHostTerritoyModel.prototype, "cityId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: [101]
    }),
    __metadata("design:type", String)
], ReqEditCoHostTerritoyModel.prototype, "countryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: ["mongoid"]
    }),
    __metadata("design:type", String)
], ReqEditCoHostTerritoyModel.prototype, "propertyId", void 0);
ReqEditCoHostTerritoyModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Host Add",
        name: "ReqEditCoHostTerritoyModel"
    })
], ReqEditCoHostTerritoyModel);
exports.ReqEditCoHostTerritoyModel = ReqEditCoHostTerritoyModel;
let ReqUpdateCoHostModel = class ReqUpdateCoHostModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Touheed'
    }),
    __metadata("design:type", String)
], ReqUpdateCoHostModel.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Touheed'
    }),
    __metadata("design:type", String)
], ReqUpdateCoHostModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "access rights",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [
            0
        ]
    }),
    __metadata("design:type", Array)
], ReqUpdateCoHostModel.prototype, "permissions", void 0);
ReqUpdateCoHostModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Host Add",
        name: "ReqUpdateCoHostModel"
    })
], ReqUpdateCoHostModel);
exports.ReqUpdateCoHostModel = ReqUpdateCoHostModel;
let ReqUpdateCoHostAceessModel = class ReqUpdateCoHostAceessModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Touheed'
    }),
    __metadata("design:type", String)
], ReqUpdateCoHostAceessModel.prototype, "id", void 0);
ReqUpdateCoHostAceessModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Host Add",
        name: "ReqUpdateCoHostAceessModel"
    })
], ReqUpdateCoHostAceessModel);
exports.ReqUpdateCoHostAceessModel = ReqUpdateCoHostAceessModel;
class ReqCheckInModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "bookingId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'bookingId'
    }),
    __metadata("design:type", String)
], ReqCheckInModel.prototype, "bookingId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "coworkerId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'coworkerId'
    }),
    __metadata("design:type", String)
], ReqCheckInModel.prototype, "coworkerId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "date",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '2020-07-15T21:24:30.195+05:30'
    }),
    __metadata("design:type", String)
], ReqCheckInModel.prototype, "date", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "time",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '2020-07-15T21:24:30.195+05:30'
    }),
    __metadata("design:type", String)
], ReqCheckInModel.prototype, "time", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "status 0 in 1 out",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '0'
    }),
    __metadata("design:type", String)
], ReqCheckInModel.prototype, "status", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "remark",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'remark'
    }),
    __metadata("design:type", String)
], ReqCheckInModel.prototype, "remark", void 0);
exports.ReqCheckInModel = ReqCheckInModel;
//# sourceMappingURL=host.swagger.model.js.map