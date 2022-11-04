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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const mongoose_1 = require("mongoose");
const _entity_1 = require("@entity");
const _baseController_1 = __importDefault(require("@baseController"));
const swagger_express_ts_1 = require("swagger-express-ts");
const _common_1 = require("@common");
const _services_1 = require("@services");
const constant_common_1 = require("../../common/constant.common");
const helper_service_1 = require("../../services/helper.service");
const sns_aws_service_1 = require("../../services/aws/sns.aws.service");
const htmlHelper_1 = require("../../htmlHelper");
const _builders_1 = __importDefault(require("@builders"));
const _builders_2 = __importDefault(require("@builders"));
const _services_2 = require("@services");
const code_response_1 = __importDefault(require("../../common/responses/code.response"));
const commontemplates_1 = require("../../services/utils/commontemplates");
const axios = require('axios');
const querystring_1 = require("querystring");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let UserClass = class UserClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async userSignUp(req, res, next) {
        try {
            let payload = req.body;
            (payload === null || payload === void 0 ? void 0 : payload.subscribeEmail) ? payload['subscribeEmail'] = payload['subscribeEmail'] : payload['subscribeEmail'] = false;
            let existingUser = await _entity_1.UserV1.checkUserAlreadyExists(payload);
            if (existingUser.length) {
                if (existingUser[0].email == payload.email) {
                    return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).EMAIL_ALREADY_EXISTS);
                }
                else
                    return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).PHONE_ALREADY_EXISTS);
            }
            payload.otp = await helper_service_1.Helper.generateOtp();
            let fullPhoneNo = payload.countryCode + payload.phoneNo;
            let metaToken = await helper_service_1.Helper.generateMetaToken();
            payload.emailVerificationToken = metaToken.value;
            payload.type = _common_1.ENUM.USER.TYPE.USER;
            if (payload.subscribeEmail == null)
                payload.subscribeEmail = false;
            let checkUserExistsAsPartner = await _entity_1.EmployeeV1.findMany({ status: _common_1.ENUM.USER.STATUS.ACTIVE, partnerStatus: _common_1.ENUM.USER.STATUS.ACTIVE, $or: [{ email: payload.email }, { phoneNo: payload.phoneNo, countryCode: payload.countryCode }] }, { partnerId: 1, _id: 0 });
            if (checkUserExistsAsPartner.length > 0) {
                for (let i = 0; i < checkUserExistsAsPartner.length; i++) {
                    let findPartnerHaveActiveFloors = await _entity_1.PartnerFloorV1.findOne({ partnerId: mongoose_1.Types.ObjectId(checkUserExistsAsPartner[i].partnerId), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE });
                    if (findPartnerHaveActiveFloors) {
                        payload.partnerId = [];
                        for (let i = 0; i < checkUserExistsAsPartner.length; i++)
                            payload.partnerId.push(mongoose_1.Types.ObjectId(checkUserExistsAsPartner[i].partnerId));
                    }
                }
            }
            if (payload.companyType == _common_1.ENUM.USER.COMPANY_TYPE.COMPANY)
                payload.subCompanyType = _common_1.ENUM.USER.SUB_COMPANY_TYPE.COMPANY;
            else
                payload.subCompanyType = _common_1.ENUM.USER.SUB_COMPANY_TYPE.FREELANCER;
            let response = await _entity_1.UserV1.createUser(payload);
            await _entity_1.OtpV1.saveOtp({ otp: payload.otp, phoneNo: payload.phoneNo, countryCode: payload.countryCode, otpTimeStamp: new Date().getTime(), userId: response._id, type: payload.type });
            sns_aws_service_1.SnsService.sendSms(fullPhoneNo, payload.otp);
            let coworkerDetails = await _entity_1.CoworkerV1.updateDocument({ email: payload.email }, { name: payload.name, coworkerId: response._id });
            if (coworkerDetails)
                await _entity_1.BookingV1.updateOne({ _id: coworkerDetails.bookingId }, { $addToSet: { coworker: { $each: [response._id] } } });
            await Promise.all([_services_2.redisDOA.insertKeyInRedis(metaToken.value, response._id), _services_2.redisDOA.expireKey(metaToken.value, constant_common_1.DATABASE.REDIS.RESET_TOKEN_EMAIL)]);
            let checkUserExistsAsPartnerButInactive = await _entity_1.EmployeeV1.findMany({ $or: [{ email: payload.email }, { phoneNo: payload.phoneNo, countryCode: payload.countryCode }] }, { partnerId: 1, _id: 0 });
            if (checkUserExistsAsPartnerButInactive.length > 0) {
                await _entity_1.EmployeeV1.updateEntity({ $or: [{ email: payload.email }, { phoneNo: payload.phoneNo, countryCode: payload.countryCode }] }, { userId: mongoose_1.Types.ObjectId(response._id) }, { multi: true });
            }
            let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(`${constant_common_1.CONSTANT.EMAIL_TEMPLATES}` + `otp.html`, {
                name: payload.name, ASSET_PATH: _common_1.BASE.URL, url: `${_common_1.BASE.EMAIL_URL}/verifyEmail/${metaToken.value}`,
                logo: constant_common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                facebookLogo: constant_common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                igLogo: constant_common_1.CONSTANT.INSTAGRAM_LOGO,
                twitterLogo: constant_common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: constant_common_1.CONSTANT.LINKEDIN_LOGO,
                welcome: "DeskNow",
                fbUrl: _common_1.WEB_PANELS.FB_URL,
                instaUrl: _common_1.WEB_PANELS.INSTA_URL,
                twitterUrl: _common_1.WEB_PANELS.TWITTER_URL,
                linkedinUrl: _common_1.WEB_PANELS.LINKEDIN_URL,
            });
            _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.NEW_SIGNUP_EMAIL(payload.email, html));
            this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).SIGNUP_SUCCESSFULLY, response);
        }
        catch (err) {
            console.error("Error", err);
            next(err);
        }
    }
    async userResendOtp(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.USER;
            let existingUser = await _entity_1.UserV1.checkUserAlreadyExists(payload);
            if (!existingUser.length)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
            let blockHandler = await _entity_1.UserV1.otpExhaustBlockHandling(payload);
            if (blockHandler.minutesLeft && blockHandler.secondsLeft) {
                return this.sendResponse(res, { httpCode: code_response_1.default.BAD_REQUEST, statusCode: 414, message: `OTP limit exhausted,kindly try after ${blockHandler.minutesLeft}m ${blockHandler.secondsLeft}s` });
            }
            payload.otp = await helper_service_1.Helper.generateOtp();
            if (!existingUser[0].otpCount || existingUser[0].otpCount <= 3) {
                await Promise.all([
                    _entity_1.UserV1.update({ _id: mongoose_1.Types.ObjectId(existingUser[0]._id) }, { $inc: { otpCount: 1 } }),
                    _entity_1.OtpV1.saveOtp({ otp: payload.otp, phoneNo: payload.phoneNo, countryCode: payload.countryCode, otpTimeStamp: new Date().getTime(), type: payload.type })
                ]);
            }
            else {
                await Promise.all([
                    _entity_1.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(existingUser[0]._id) }, { otpCount: 0 }),
                    _entity_1.OtpV1.saveOtpFinalCount({ otp: payload.otp, phoneNo: payload.phoneNo, countryCode: payload.countryCode, otpTimeStamp: new Date().getTime(), type: payload.type })
                ]);
            }
            sns_aws_service_1.SnsService.sendSms(payload.countryCode + payload.phoneNo, payload.otp);
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_SENT_SUCCESSFULLY);
        }
        catch (err) {
            console.error(`we have an error in resendOtp controller ==> ${err}`);
            next(err);
        }
    }
    async VerifyOtp(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.USER;
            let existingUser = await _entity_1.UserV1.checkUserAlreadyExists(payload);
            if (!existingUser.length)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
            let getOtpFromDb = await _entity_1.OtpV1.getUserOtpFromDb(payload);
            if (getOtpFromDb == null && (payload.otp))
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_EXPIRED);
            else if (getOtpFromDb != null && getOtpFromDb != payload.otp) {
                let response = await _entity_1.UserV1.otpExhaustLimit(payload);
                if (response.attemptCountLeft < 1) {
                    _entity_1.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(existingUser[0]._id) }, { otpCount: 0 }),
                        _entity_1.OtpV1.saveOtpFinalCount({ otp: 1, phoneNo: payload.phoneNo, countryCode: payload.countryCode, otpTimeStamp: new Date().getTime(), type: 1 });
                    this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_LIMIT_EXHAUSTED, response);
                }
                else {
                    this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_INVALID, response);
                }
                ;
            }
            else {
                const keyName = `${payload.countryCode}_${payload.phoneNo}_${payload.type}`;
                const keyExist = await _services_2.redisDOA.getFromKey(keyName);
                keyExist ? await _services_2.redisDOA.deleteKey(keyName) : "";
                _entity_1.UserV1.verifyUserPhone(existingUser[0]._id);
                _entity_1.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(existingUser[0]._id) }, { otpCount: 0 });
                let sessionPayload = { email: existingUser[0].email, userId: existingUser[0]._id, device: payload.device };
                let sessionData = await _entity_1.UserV1.createNewSession(sessionPayload);
                existingUser[0].authToken = await _services_1.Auth.generateUserJWT(sessionData._id);
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_VERIFIED, await _entity_1.UserV1.formatUserResponse(constant_common_1.DATABASE.FORMATED_RESPONSE_TYPE.VERIFY_OTP, existingUser[0]));
            }
        }
        catch (err) {
            next(err);
        }
    }
    async updateDeviceToken(req, res, next) {
        try {
            let { deviceToken } = req.body;
            let userId = res.locals.userId;
            await _entity_1.UserV1.updateUserToken(userId, deviceToken);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            console.error(`we have an error ==>`, err);
        }
    }
    async userLogin(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.USER;
            let existingUser = await _entity_1.UserV1.checkUserAlreadyExists(payload);
            if (!existingUser.length)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
            else if (existingUser[0].status == _common_1.ENUM.USER.STATUS.BLOCK)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).ACCOUNT_BLOCKED);
            else if (existingUser[0].emailVerified == false)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).Email_NOT_VERIFIED);
            else if (existingUser[0].password == _services_1.Auth.hashData(payload.password, constant_common_1.CONSTANT.PASSWORD_HASH_SALT)) {
                let sessionPayload = {
                    email: existingUser[0].email,
                    userId: existingUser[0]._id,
                    device: payload.device
                };
                let sessionData = await _entity_1.UserV1.createNewSession(sessionPayload);
                existingUser[0].authToken = await _services_1.Auth.generateUserJWT(sessionData._id);
                let responseData = await _entity_1.UserV1.findOne({ _id: existingUser[0]._id }, _builders_2.default.User.Projections.UserList.userLogin);
                responseData.authToken = existingUser[0].authToken;
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).LOGIN_SUCCESSFULLY, responseData);
            }
            else
                this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).INCORRECT_PASSWORD);
        }
        catch (err) {
            next(err);
        }
    }
    async forgetPasswordEmail(req, res, next) {
        try {
            let payload = req.body;
            payload['type'] = _common_1.ENUM.USER.TYPE.USER;
            let existingUser = await _entity_1.UserV1.checkUserAlreadyExists(payload);
            if (!existingUser.length)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
            payload['otp'] = await helper_service_1.Helper.generateOtp();
            await _entity_1.OtpV1.saveOtp({ countryCode: existingUser[0].countryCode, phoneNo: existingUser[0].phoneNo, otp: payload.otp, type: payload.type });
            sns_aws_service_1.SnsService.sendSms(existingUser[0].countryCode + existingUser[0].phoneNo, payload.otp);
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_SENT_SUCCESSFULLY, { countryCode: existingUser[0].countryCode, phone: existingUser[0].phoneNo });
        }
        catch (err) {
            next(err);
        }
    }
    async verificationEmailLink(req, res, next) {
        try {
            let payload = { email: req.params.email, type: _common_1.ENUM.USER.TYPE.USER };
            let existingUser = await _entity_1.UserV1.checkUserAlreadyExists(payload);
            if (!existingUser.length)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
            else if (existingUser[0].status == _common_1.ENUM.USER.STATUS.BLOCK)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).ACCOUNT_BLOCKED);
            let metaToken = await helper_service_1.Helper.generateMetaToken();
            await Promise.all([
                _services_2.redisDOA.insertKeyInRedis(metaToken.value, existingUser[0]._id),
                _services_2.redisDOA.expireKey(metaToken.value, constant_common_1.DATABASE.REDIS.RESET_TOKEN_EMAIL)
            ]);
            let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(`${constant_common_1.CONSTANT.EMAIL_TEMPLATES}` + `otp.html`, {
                name: existingUser[0].name,
                ASSET_PATH: _common_1.BASE.URL,
                url: `${_common_1.BASE.EMAIL_URL}/verifyEmail/${metaToken.value}`,
                logo: constant_common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                facebookLogo: constant_common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                igLogo: constant_common_1.CONSTANT.INSTAGRAM_LOGO,
                twitterLogo: constant_common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: constant_common_1.CONSTANT.LINKEDIN_LOGO,
                welcome: "DeskNow",
                fbUrl: _common_1.WEB_PANELS.FB_URL,
                instaUrl: _common_1.WEB_PANELS.INSTA_URL,
                twitterUrl: _common_1.WEB_PANELS.TWITTER_URL,
                linkedinUrl: _common_1.WEB_PANELS.LINKEDIN_URL,
            });
            _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.NEW_SIGNUP_EMAIL(payload.email, html));
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).MAIL_VERIFICATIO_LINK);
        }
        catch (err) {
            next(err);
        }
    }
    async verifyEmail(req, res, next) {
        try {
            let payload = req.params;
            let getTokenFromRedis = await _services_2.redisDOA.getFromKey(payload.emailVerificationToken);
            if (!getTokenFromRedis) {
                let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate("/src/views/emailVerification/emailVerificationFalse.html", {
                    background: `${constant_common_1.CONSTANT.VERIFY_EMAIL_BG}`,
                    logo: `${constant_common_1.CONSTANT.VERIFY_EMAIL_LOGO}`,
                    url: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : "${WEB_PANELS.USER_PANEL_PROD}/account/login"
                });
                return res.send(html);
            }
            else
                await _entity_1.UserV1.updateWithDeleteDocument({ _id: getTokenFromRedis }, { emailVerified: true }, { emailVerificationToken: "" });
            let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(`${constant_common_1.CONSTANT.VERIFICATION_TEMPLATES}` + `emailVerificationTrue.html`, {
                background: `${constant_common_1.CONSTANT.VERIFY_EMAIL_BG}`,
                logo: `${constant_common_1.CONSTANT.VERIFY_EMAIL_LOGO}`,
                url: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : "${WEB_PANELS.USER_PANEL_PROD}/account/login"
            });
            return res.send(html);
        }
        catch (err) {
            next(err);
        }
    }
    async VerifyResetOtp(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.USER;
            let existingUser = await _entity_1.UserV1.checkUserAlreadyExists(payload);
            if (!existingUser.length)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
            let getOtpFromDb = await _entity_1.OtpV1.getUserOtpFromDb(payload);
            if (getOtpFromDb == null && (payload.otp && payload.otp != constant_common_1.CONSTANT.BY_PASS_OTP))
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_EXPIRED);
            else if (getOtpFromDb != null && getOtpFromDb != payload.otp && payload.otp != constant_common_1.CONSTANT.BY_PASS_OTP) {
                let response = await _entity_1.UserV1.otpExhaustLimitforgotPassword(payload);
                response.attemptCountLeft < 1 ? this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_LIMIT_EXHAUSTED, response) : this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_INVALID, response);
            }
            else {
                const keyName = `otpForgot_${payload.phoneNo}_${payload.type}`;
                const keyExist = await _services_2.redisDOA.getFromKey(keyName);
                keyExist ? await _services_2.redisDOA.deleteKey(keyName) : "";
                let resetPasswordToken = await _services_1.Auth.generateToken({ email: existingUser[0].email });
                await _entity_1.UserV1.updateDocument({ _id: existingUser[0]._id }, { resetPasswordToken });
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_VERIFIED, { resetPasswordToken });
            }
        }
        catch (err) {
            next(err);
        }
    }
    async verifyResetToken(req, res, next) {
        try {
            let resetPasswordToken = req.params.resetPasswordToken;
            let user = await _entity_1.UserV1.findOne({ 'resetPasswordToken': resetPasswordToken });
            if (user)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).VALID_RESET_TOKEN);
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).INVALID_RESET_TOKEN);
        }
        catch (err) {
            next(err);
        }
    }
    async resetPassword(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.USER;
            const verToken = await _services_1.Auth.verifyToken(payload.resetPasswordToken);
            payload.email = verToken.data.email;
            let existingUser = await _entity_1.UserV1.checkUserAlreadyExists(payload);
            if (!existingUser.length)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).TOKEN_EXPIRED);
            else if (existingUser[0].status == _common_1.ENUM.USER.STATUS.BLOCK)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).ACCOUNT_BLOCKED);
            else {
                await _entity_1.UserV1.updateWithDeleteDocument({ _id: existingUser[0]._id }, { password: _services_1.Auth.hashData(payload.password, constant_common_1.CONSTANT.PASSWORD_HASH_SALT) }, { resetPasswordToken: "" });
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).PASSWORD_CHANGED_SUCCESSFULLY);
            }
        }
        catch (err) {
            next(err);
        }
    }
    async myProfile(req, res, next) {
        try {
            let payload = res.locals.userId;
            let result = await _entity_1.UserV1.fectchUserProfileDetails(payload);
            if (result.companyType == _common_1.ENUM.USER.COMPANY_TYPE.COMPANY && !result.userComapnyDetails)
                result.userComapnyDetails = {};
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).USER_FOUND_SUCCESSFULLY, result);
        }
        catch (err) {
            next(err);
        }
    }
    async changePassword(req, res, next) {
        try {
            let payload = req.body;
            let existingUser = await _entity_1.UserV1.checkUserAlreadyExists(res.locals);
            if (!existingUser.length)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
            else if (existingUser[0].password == _services_1.Auth.hashData(payload.oldPassword, constant_common_1.CONSTANT.PASSWORD_HASH_SALT)) {
                let passwordUpdation = await _entity_1.UserV1.updateDocument({ _id: existingUser[0]._id }, { password: _services_1.Auth.hashData(payload.newPassword, constant_common_1.CONSTANT.PASSWORD_HASH_SALT) });
                await _entity_1.UserV1.removePreviousSession(res.locals.userSessionId, false);
                if (passwordUpdation)
                    return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).PASSWORD_CHANGED_SUCCESSFULLY);
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).PASSWORD_CHANGED_SUCCESSFULLY);
            }
            else
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).INCORRECT_OLD_PASSWORD);
        }
        catch (err) {
            console.error(`we have an error in user controller ==> ${err}`);
            next(err);
        }
    }
    async logout(req, res, next) {
        try {
            let userId = res.locals.userId, userSessionId = res.locals.userSessionId;
            if (userId) {
                await _entity_1.UserV1.removePreviousSession(userSessionId, false);
                this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).LOGGED_OUT_SUCCESSFULLY);
            }
            else
                this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async userSocialLogin(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.USER;
            let existingUser = await _entity_1.UserV1.checkSocialIdExists(payload);
            let newUser = await _entity_1.UserV1.createUserFromSocialId(payload, existingUser);
            let data = {
                userId: newUser._id,
                device: payload.device
            };
            let sessionData = await _entity_1.UserV1.createNewSession(data);
            newUser.authToken = await _services_1.Auth.generateUserJWT(sessionData._id);
            newUser.isNew = true;
            let responseData = await _entity_1.UserV1.findOne({ _id: newUser._id }, _builders_2.default.User.Projections.UserList.userProfile);
            responseData.authToken = newUser.authToken;
            if (existingUser && existingUser.length == 0) {
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).USER_CREATED_SUCCEFULLY, responseData);
            }
            else {
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).LOGIN_SUCCESSFULL, responseData);
            }
        }
        catch (err) {
            next(err);
        }
    }
    async getCompanyDetail(req, res, next) {
        try {
            let payload = req.body;
            payload.userId = mongoose_1.Types.ObjectId(res.locals.userId);
            let company = await _entity_1.CompanyV1.findOne({ userId: payload.userId }, _builders_2.default.User.Projections.UserList.userCompanyDetails);
            if (!company)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).COMPANY_NOT_FOUND_USER);
            return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).COMPANY_DETAILS, company);
        }
        catch (err) {
            next(err);
        }
    }
    async userCompanyDetailUpdate(req, res, next) {
        try {
            let payload = req.body;
            payload.userId = mongoose_1.Types.ObjectId(res.locals.userId);
            if (payload.countryId)
                payload.country = await _entity_1.CountriesV1.findOne({ id: payload.countryId }, { id: 1, sortname: 1, name: 1, countryId: 1, _id: 1 });
            if (payload.stateId)
                payload.state = await _entity_1.AllStatesV1.findOne({ id: payload.stateId }, { name: 1, stateId: 1, id: 1, _id: 1 });
            if (payload.cityId)
                payload.city = await _entity_1.AllCityV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.cityId) }, { name: 1, iconImage: 1, _id: 1 });
            await Promise.all([
                _entity_1.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.userId) }, { subCompanyType: payload.subCompanyType }),
                _entity_1.CompanyV1.updateDocument({ userId: mongoose_1.Types.ObjectId(payload.userId) }, payload, { upsert: true })
            ]);
            return await this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).COMPANY_DETAILS_UPDATED);
        }
        catch (err) {
            console.error(`we have an error while updating company ==> ${err}`);
            next(err);
        }
    }
    async getCountries(req, res, next) {
        try {
            let data = await _entity_1.CityV1.findMany({ isDelete: false, status: "active" });
            let payload = [];
            for (let i = 0; i < data.length; i++) {
                payload.push(data[i].countryId);
            }
            let pipeline1 = _builders_1.default.User.HostBUilder.countryListing(payload);
            let countryData = await _entity_1.CountriesV1.basicAggregate(pipeline1);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, countryData);
        }
        catch (err) {
            next(err);
        }
    }
    async getAllCountries(req, res, next) {
        try {
            let countryData = await _entity_1.CountriesV1.findMany({ "isDelete": false }, {}, { name: 1 });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, countryData);
        }
        catch (err) {
            next(err);
        }
    }
    async getStates(req, res, next) {
        try {
            let data = await _entity_1.CityV1.findMany({ countryId: req.params.countryId, isDelete: false, status: "active" });
            let payload = [];
            for (let i = 0; i < data.length; i++) {
                payload.push(data[i].stateId);
            }
            let pipeline1 = _builders_1.default.User.HostBUilder.countryListing(payload);
            let stateData = await _entity_1.StatesV1.basicAggregate(pipeline1);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, stateData);
        }
        catch (err) {
            next(err);
        }
    }
    async getAllCities(req, res, next) {
        try {
            let data = await _entity_1.AllCityV1.findMany({ "state_id": parseInt(req.params.stateId) }, {}, { name: 1 });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
    async getAllStates(req, res, next) {
        try {
            let data = await _entity_1.AllStatesV1.findMany({ "country_id": parseInt(req.params.countryId) }, {}, { name: 1 });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
    async getCities(req, res, next) {
        try {
            let pipeline1 = _builders_1.default.User.HostBUilder.cityListing(req.params);
            let cityData = await _entity_1.CityV1.basicAggregate(pipeline1);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, cityData);
        }
        catch (err) {
            next(err);
        }
    }
    async checkEmailExists(req, res, next) {
        try {
            let payload = { email: req.params.email, status: _common_1.ENUM.USER.STATUS.ACTIVE };
            let existingUser = await _entity_1.UserV1.findOne(payload);
            if (existingUser && existingUser.status == _common_1.ENUM.USER.STATUS.ACTIVE)
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
            else if (existingUser && existingUser.status == _common_1.ENUM.USER.STATUS.BLOCK)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).ALREADY_BLOCKED);
            else
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_EXISTS);
        }
        catch (err) {
            console.error(`we have an error in check email exist ==> ${err}`);
            next(err);
        }
    }
    async changePhoneNo(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.USER;
            let promise = [];
            promise.push(_entity_1.UserV1.findOne({ _id: res.locals.userId }));
            promise.push(_entity_1.UserV1.findOne({ phoneNo: payload.phoneNo, countryCode: payload.countryCode }));
            let existingUser = await Promise.all(promise);
            let blockHandler = await _entity_1.UserV1.otpExhaustBlockerOtpNewPhone(payload);
            if (blockHandler.minutesLeft && blockHandler.secondsLeft) {
                return this.sendResponse(res, { httpCode: code_response_1.default.BAD_REQUEST, statusCode: 412, message: `OTP limit exhausted,kindly try after ${blockHandler.minutesLeft}:${blockHandler.secondsLeft}` });
            }
            else if (existingUser[1])
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).PHONE_ALREADY_EXISTS);
            else {
                let OTP = await helper_service_1.Helper.generateOtp();
                payload.otp = OTP;
                await _entity_1.OtpV1.saveOtp({ otp: payload.otp, phoneNo: payload.phoneNo, countryCode: payload.countryCode, otpTimeStamp: new Date().getTime(), type: payload.type });
                sns_aws_service_1.SnsService.sendSms(payload.countryCode + payload.phoneNo, payload.otp);
                await _entity_1.UserV1.updateDocument({ _id: existingUser[0]._id }, { tempPhoneNo: payload.phoneNo, tempCountryCode: payload.countryCode, type: payload.type });
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            next(err);
        }
    }
    async VerifyNewPhoneNoOtp(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.USER;
            let existingUser = await _entity_1.UserV1.findOne({ _id: res.locals.userId, tempPhoneNo: payload.phoneNo, tempCountryCode: payload.countryCode });
            if (!existingUser)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
            let otpData = await _entity_1.OtpV1.findOne({ otp: payload.otp });
            if (!otpData) {
                let response = await _entity_1.UserV1.otpExhaustLimitVerifyNewPhoneNo(payload);
                response.attemptCountLeft < 1 ? this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_LIMIT_EXHAUSTED, response) : this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_INVALID, response);
            }
            else if (otpData && otpData.otp == payload.otp && existingUser.otpExpiry < new Date()) {
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).OTP_EXPIRED);
            }
            else {
                const keyName = `otpNewPhone_${payload.phoneNo}_${payload.type}`;
                const keyExist = await _services_2.redisDOA.getFromKey(keyName);
                keyExist ? await _services_2.redisDOA.deleteKey(keyName) : "";
                await Promise.all([
                    _entity_1.UserV1.updateWithDeleteDocument({ _id: existingUser._id }, { phoneNo: payload.phoneNo, countryCode: payload.countryCode, phoneVerified: true, otp: null }, { tempCountryCode: 1, tempPhoneNo: 1 }),
                    _entity_1.BookingV1.updateEntity({ "userData.userId": existingUser._id }, { "userData.phoneNo": payload.phoneNo, "userData.countryCode": payload.countryCode }, { multi: true })
                ]);
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).PHONE_UPDATED);
            }
        }
        catch (err) {
            console.error(`we have an error in verifyNewPhoneOtp ==> ${err}`);
            next(err);
        }
    }
    async checkPhoneExists(req, res, next) {
        try {
            let payload = { countryCode: req.params.countryCode, phoneNo: req.params.phoneNo, type: _common_1.ENUM.USER.TYPE.USER };
            let blockHandler = await _entity_1.UserV1.otpExhaustBlockHandling(payload);
            if (blockHandler.minutesLeft && blockHandler.secondsLeft) {
                return this.sendResponse(res, { httpCode: code_response_1.default.BAD_REQUEST, statusCode: 412, message: `OTP limit exhausted,kindly try after ${blockHandler.minutesLeft}:${blockHandler.secondsLeft}` });
            }
            let existingUser = await _entity_1.UserV1.findOne(payload);
            if (existingUser && existingUser.status == _common_1.ENUM.USER.STATUS.ACTIVE && existingUser.phoneVerified == true && existingUser.type == _common_1.ENUM.USER.TYPE.USER)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).EXISTS);
            else if (existingUser && existingUser.status == _common_1.ENUM.USER.STATUS.ACTIVE && existingUser.phoneVerified == false)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).PHONE_NOT_VERIFIED);
            else if (existingUser && existingUser.status == _common_1.ENUM.USER.STATUS.BLOCK)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).ALREADY_BLOCKED);
            else
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_EXISTS);
        }
        catch (err) {
            next(err);
        }
    }
    async updateUserProfile(req, res, next) {
        try {
            let payload = req.body;
            payload.userId = res.locals.userId;
            payload.userData = res.locals.userData;
            const promise = await _builders_1.default.User.HostCompanyBuilder.EditUserProfileAndCompany(payload);
            let response = await Promise.all(promise);
            let finalResponse = response[1];
            if (payload.company)
                finalResponse.userComapnyDetails = response[0];
            else
                finalResponse.userComapnyDetails = {};
            let userData = {
                userId: payload.userId,
                status: payload.userData.status,
                name: payload.name,
                image: payload.image,
                email: payload.userData.email,
                phoneNo: payload.userData.phoneNo,
                createdAt: payload.userData.createdAt,
                countryCode: payload.userData.countryCode,
                dob: payload.dob,
                profileStatus: finalResponse.profileStatus,
                bio: payload.bio,
            };
            await Promise.all([
                _entity_1.UserV1.updateUserIndividualBadge(finalResponse, payload),
                _entity_1.UserV1.updateProfileBadges(finalResponse),
                _entity_1.BookingV1.updateEntity({ "userData.userId": mongoose_1.Types.ObjectId(payload.userId) }, { userData: userData }, { multi: true }),
                _entity_1.CoworkerV1.updateEntity({ userId: mongoose_1.Types.ObjectId(payload.userId) }, { userData: userData }, { multi: true }),
                _entity_1.EmployeeV1.updateDocument({ userId: mongoose_1.Types.ObjectId(payload.userId) }, payload)
            ]);
            return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).PROFILE_UPDATED, finalResponse);
        }
        catch (err) {
            next(err);
        }
    }
    async fetchHomeScreen(req, res, next) {
        var _a;
        try {
            let payload = {};
            ((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.userId) ? payload['userId'] = req.query.userId : "";
            let pipe = await _builders_1.default.User.UserPropertyBuilder.HolidaysPropertyList(payload);
            payload['pipe'] = pipe;
            payload = await _builders_1.default.User.UserPropertyBuilder.partnerArray(payload);
            let pipeline1 = _builders_2.default.User.UserPropertyBuilder.featuredPropertyList(payload);
            let adminFeaturedPropertyPipeline = _builders_2.default.User.UserPropertyBuilder.featuredAdminPropertyList(payload);
            let pipeline2 = _builders_2.default.User.UserPropertyBuilder.cityPropertyDetails(payload);
            let featuredPropertyListingData = await _entity_1.PropertyV1.basicAggregate(pipeline1);
            let adminFeaturedPropertyData = await _entity_1.PropertyV1.basicAggregate(adminFeaturedPropertyPipeline);
            if (!(featuredPropertyListingData === null || featuredPropertyListingData === void 0 ? void 0 : featuredPropertyListingData.length)) {
                featuredPropertyListingData = adminFeaturedPropertyData;
            }
            let cityPropertyDetails = await _entity_1.PropertyV1.basicAggregate(pipeline2);
            let [featuredPropertyListing, cityPropertyData] = await Promise.all([featuredPropertyListingData, cityPropertyDetails]);
            let response = { featuredPropertyListing, cityPropertyData };
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async sendOtp(req, res, next) {
        try {
            let userId = res.locals.userId;
            let payload = await _entity_1.UserV1.findOne({ _id: mongoose_1.Types.ObjectId(userId) });
            await _entity_1.OtpV1.remove({ phoneNo: payload.phoneNo, countryCode: payload.countryCode });
            payload.otp = await helper_service_1.Helper.generateOtp();
            let fullPhoneNo = payload.countryCode + payload.phoneNo;
            await _entity_1.OtpV1.saveOtp({ otp: payload.otp, phoneNo: payload.phoneNo, countryCode: payload.countryCode, otpTimeStamp: new Date().getTime() });
            sns_aws_service_1.SnsService.sendSms(fullPhoneNo, payload.otp);
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async deleteAccount(req, res, next) {
        try {
            let userId = res.locals.userId;
            let payload = req.params;
            payload.type = _common_1.ENUM.USER.TYPE.USER;
            let existingUser = await _entity_1.UserV1.findOne({ _id: mongoose_1.Types.ObjectId(userId) });
            payload.countryCode = existingUser.countryCode;
            payload.phoneNo = existingUser.phoneNo;
            let getOtpFromDb = await _entity_1.OtpV1.getUserOtpFromDb(payload);
            if (getOtpFromDb == null && (payload.otp))
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_EXPIRED);
            else if (getOtpFromDb != null && getOtpFromDb != payload.otp) {
                let response = await _entity_1.UserV1.otpExhaustLimitforgotPassword(payload);
                response.attemptCountLeft < 1 ? this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_LIMIT_EXHAUSTED, response) : this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_INVALID, response);
            }
            else {
                const keyName = `otpForgot_${payload.phoneNo}`;
                const keyExist = await _services_2.redisDOA.getFromKey(keyName);
                keyExist ? await _services_2.redisDOA.deleteKey(keyName) : "";
                await Promise.all([
                    _entity_1.UserV1.updateOne({ _id: mongoose_1.Types.ObjectId(userId) }, { status: _common_1.ENUM.USER.STATUS.ISDELETE }),
                    _entity_1.BookingV1.updateOne({ "userData.userId": mongoose_1.Types.ObjectId(userId) }, { status: _common_1.ENUM.USER.STATUS.ISDELETE }),
                    _entity_1.UserV1.removePreviousSession(res.locals.userSessionId, false)
                ]);
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).ACCOUNT_DELETED);
            }
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async checkUserType(req, res, next) {
        try {
            let params = req.query;
            if (params && params.type == _common_1.ENUM.USER.TYPE.USER) {
                let existingUser = await _entity_1.UserV1.findOne({ _id: mongoose_1.Types.ObjectId(params.userId) }, { _id: 1, type: 1, name: 1 });
                existingUser && existingUser._id ? existingUser = existingUser : existingUser = {};
                return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, existingUser);
            }
            else {
                let existingHost = await _entity_1.HostV1.findOne({ _id: mongoose_1.Types.ObjectId(params.userId) }, { _id: 1, type: 1, name: 1 });
                existingHost && existingHost._id ? existingHost = existingHost : existingHost = {};
                return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, existingHost);
            }
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async checkUserChatRoom(req, res, next) {
        try {
            let params = req.query;
            let userId = res.locals.userId;
            let checkChatRoom = await Promise.all([
                _entity_1.CoworkerV1.findOne({ coworkerId: params.userId, userId: userId }, {}),
                _entity_1.HostV1.findOne({ _id: params.userId })
            ]);
            if (checkChatRoom[0] != null || checkChatRoom[1] != null) {
                if (checkChatRoom[0] && checkChatRoom[0]._id || checkChatRoom[1] && checkChatRoom[1]._id)
                    return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, { userExist: true });
            }
            else
                return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, { userExist: false });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async updatePbVerification(req, res, next) {
        try {
            const review_status = req.body.review_status;
            let payload = req.body;
            switch (review_status) {
                case true: {
                    let [updatedProfileStatus, userToken] = await Promise.all([
                        _entity_1.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.additional_attributes.customer_user_id) }, {
                            passbaseToken: payload.authentication_key,
                            profileStatus: _common_1.ENUM.USER.PROFILE_STATUS.ADVANCED,
                            passbaseVerification: 1
                        }),
                        _entity_1.UserV1.fetchUserDeviceToken(payload.additional_attributes.customer_user_id),
                        _entity_1.BookingV1.updateEntity({ "userData.userId": mongoose_1.Types.ObjectId(payload.additional_attributes.customer_user_id) }, { "userData.profileStatus": _common_1.ENUM.USER.PROFILE_STATUS.ADVANCED }, { multi: true })
                    ]);
                    _services_1.PushNotification.sendPbVerificationSuccessPush(userToken, payload);
                    let userHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/pbEmailer/pbSucees.html ", {
                        logo: constant_common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                        icSplashLogo: constant_common_1.CONSTANT.SPLASH_LOGO,
                        demoStatus: `verified`,
                        facebookLogo: constant_common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                        twitterLogo: constant_common_1.CONSTANT.TWITTER_LOGO_NEW,
                        linkedinLogo: constant_common_1.CONSTANT.LINKEDIN_LOGO,
                        igLogo: constant_common_1.CONSTANT.INSTAGRAM_LOGO,
                        webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                        contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                        FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD,
                        profilePicture: updatedProfileStatus === null || updatedProfileStatus === void 0 ? void 0 : updatedProfileStatus.image,
                        userName: updatedProfileStatus === null || updatedProfileStatus === void 0 ? void 0 : updatedProfileStatus.name,
                        userAddress: updatedProfileStatus === null || updatedProfileStatus === void 0 ? void 0 : updatedProfileStatus.address,
                        redirectionUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/profile/detail` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/profile/detail`
                    });
                    _services_1.emailService.sendUserPbStatus(userHtml, payload.additional_attributes.identifier);
                    break;
                }
                case false:
                    {
                        let [updatedProfileStatus, userToken] = await Promise.all([
                            _entity_1.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.additional_attributes.customer_user_id) }, {
                                passbaseToken: payload.authentication_key,
                                passbaseVerification: 0,
                                profileStatus: _common_1.ENUM.USER.PROFILE_STATUS.INTERMEDIATE
                            }),
                            _entity_1.UserV1.fetchUserDeviceToken(payload.additional_attributes.customer_user_id),
                            _entity_1.BookingV1.updateEntity({ "userData.userId": mongoose_1.Types.ObjectId(payload.additional_attributes.customer_user_id) }, { "userData.profileStatus": _common_1.ENUM.USER.PROFILE_STATUS.INTERMEDIATE }, { multi: true })
                        ]);
                        _services_1.PushNotification.sendPbVerificationFailedPush(userToken, payload);
                        let userHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/pbEmailer/pbUnsuccess.html", {
                            logo: constant_common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                            icSplashLogo: constant_common_1.CONSTANT.SPLASH_LOGO,
                            demoStatus: `unverified`,
                            profilePicture: updatedProfileStatus === null || updatedProfileStatus === void 0 ? void 0 : updatedProfileStatus.image,
                            userName: updatedProfileStatus === null || updatedProfileStatus === void 0 ? void 0 : updatedProfileStatus.name,
                            userAddress: updatedProfileStatus === null || updatedProfileStatus === void 0 ? void 0 : updatedProfileStatus.address,
                            facebookLogo: constant_common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                            twitterLogo: constant_common_1.CONSTANT.TWITTER_LOGO_NEW,
                            linkedinLogo: constant_common_1.CONSTANT.LINKEDIN_LOGO,
                            igLogo: constant_common_1.CONSTANT.INSTAGRAM_LOGO,
                            webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                            contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                            FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD,
                            redirectionUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/profile/detail` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/profile/detail`
                        });
                        await _services_1.emailService.sendUserPbStatusUnsuccessfull(userHtml, payload.additional_attributes.identifier);
                        break;
                    }
                default:
                    break;
            }
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async postSlackEvents(req, res, next) {
        try {
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, { challenge: req.body.challenge });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async generateDeepLink(req, res, next) {
        var _a;
        try {
            const params = req.query;
            params['countryCode'] ? params['countryCode'] = (_a = params === null || params === void 0 ? void 0 : params.countryCode) === null || _a === void 0 ? void 0 : _a.replace(" ", "+") : "";
            const response = await _common_1.DeepLink(params);
            const result = await new commontemplates_1.CommonTemplateUtil(process.cwd() + "/src/views/deeplink.html").compileFile(response);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            return res.end(result, 'utf-8');
            ;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async partnerList(req, res, next) {
        try {
            let payload = req.query;
            let usersList = await _entity_1.ConfigV1.partnerTypeList(payload);
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, usersList);
        }
        catch (err) {
            next(err);
        }
    }
    async updateLinkedInSignIn(req, res, next) {
        var _a, _b, _c;
        try {
            let payload = req.body;
            let authUrl = _common_1.CONFIG.LINKEDIN.AUTH_URL;
            let auth = await axios.post(authUrl, querystring_1.stringify({
                grant_type: 'authorization_code',
                code: payload.authToken,
                redirect_uri: payload.redirectURI,
                client_secret: _common_1.CONFIG.LINKEDIN.CLIENT_SECRET,
                client_id: _common_1.CONFIG.LINKEDIN.CLIENT_ID
            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            if ((_a = auth === null || auth === void 0 ? void 0 : auth.data) === null || _a === void 0 ? void 0 : _a.access_token) {
                let userInfoUrl = _common_1.CONFIG.LINKEDIN.USER_INFO_URL;
                let userEmailUrl = _common_1.CONFIG.LINKEDIN.USER_EMAIL_URL;
                let userResponse = await axios.get(userInfoUrl, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": `Bearer ${(_b = auth === null || auth === void 0 ? void 0 : auth.data) === null || _b === void 0 ? void 0 : _b.access_token}`
                    }
                });
                let memberResponse = await axios.get(userEmailUrl, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": `Bearer ${(_c = auth === null || auth === void 0 ? void 0 : auth.data) === null || _c === void 0 ? void 0 : _c.access_token}`
                    }
                });
                const response = {
                    localizedFirstName: userResponse.data.localizedFirstName,
                    localizedLastName: userResponse.data.localizedLastName,
                    id: userResponse.data.id,
                    emailId: memberResponse.data.elements[0]['handle~'].emailAddress
                };
                return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
            }
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            if (err) {
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).LINKEDIN_ERROR);
            }
        }
    }
    async updateAppleAuth(req, res, next) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        try {
            let payload = req.body;
            let response = {};
            if ((payload === null || payload === void 0 ? void 0 : payload.user) && (payload === null || payload === void 0 ? void 0 : payload.code)) {
                const encodedUserDetail = jsonwebtoken_1.default.decode(payload === null || payload === void 0 ? void 0 : payload.id_token, { complete: true });
                const parsedUserDetail = JSON.parse(payload === null || payload === void 0 ? void 0 : payload.user);
                response['firstName'] = ((_a = parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.name) === null || _a === void 0 ? void 0 : _a.firstName) ? (_b = parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.name) === null || _b === void 0 ? void 0 : _b.firstName : "";
                response['lastName'] = ((_c = parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.name) === null || _c === void 0 ? void 0 : _c.lastName) ? (_d = parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.name) === null || _d === void 0 ? void 0 : _d.lastName : "";
                response['email'] = parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.email;
                response['appleId'] = (_e = encodedUserDetail === null || encodedUserDetail === void 0 ? void 0 : encodedUserDetail.payload) === null || _e === void 0 ? void 0 : _e.sub;
                response['isAppleLogin'] = true;
                await _services_2.redisDOA.insertKeyInRedis(parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.email, payload === null || payload === void 0 ? void 0 : payload.user);
            }
            else {
                const encodedUserDetail = jsonwebtoken_1.default.decode(payload === null || payload === void 0 ? void 0 : payload.id_token, { complete: true });
                const userFromRedis = await _services_2.redisDOA.getKeyFromRedis((_f = encodedUserDetail === null || encodedUserDetail === void 0 ? void 0 : encodedUserDetail.payload) === null || _f === void 0 ? void 0 : _f.email);
                if (userFromRedis) {
                    const parsedUserDetail = JSON.parse(userFromRedis);
                    response['firstName'] = ((_g = parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.name) === null || _g === void 0 ? void 0 : _g.firstName) ? (_h = parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.name) === null || _h === void 0 ? void 0 : _h.firstName : "";
                    response['lastName'] = ((_j = parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.name) === null || _j === void 0 ? void 0 : _j.lastName) ? (_k = parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.name) === null || _k === void 0 ? void 0 : _k.lastName : "";
                    response['email'] = parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.email;
                    response['appleId'] = (_l = encodedUserDetail === null || encodedUserDetail === void 0 ? void 0 : encodedUserDetail.payload) === null || _l === void 0 ? void 0 : _l.sub;
                    response['isAppleLogin'] = true;
                }
            }
            res.send(`<script>
                      const MC_APPLE_SIGNIN_AUTH_VALUES = '${JSON.stringify(response)}'
                      if (window.opener) {
                      window.opener.postMessage(MC_APPLE_SIGNIN_AUTH_VALUES, '${_common_1.WEB_PANELS.USER_PANEL_PROD}/account/login');
                      window.close();
                        }
            </script>`);
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
    async completeProfile(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.USER;
            let dataToSave = {};
            if (payload && payload.name)
                dataToSave['name'] = payload.name;
            if (payload && payload.image)
                dataToSave['image'] = payload.image;
            if (payload && payload.countryCode && payload.phoneNo) {
                const existingNumberCheck = await _entity_1.UserV1.findOne({
                    countryCode: payload.countryCode, phoneNo: payload.phoneNo, "phoneVerified": true
                }, { _id: 1 });
                if (existingNumberCheck) {
                    return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).PHONE_ALREADY_EXISTS);
                }
                dataToSave['countryCode'] = payload.countryCode;
                dataToSave['phoneNo'] = payload.phoneNo;
                payload.otp = await helper_service_1.Helper.generateOtp();
                await _entity_1.OtpV1.saveOtp({ otp: payload.otp, phoneNo: payload.phoneNo, countryCode: payload.countryCode, otpTimeStamp: new Date().getTime(), type: payload.type });
                sns_aws_service_1.SnsService.sendSms(payload.countryCode + payload.phoneNo, payload.otp);
            }
            if (payload && payload.email) {
                let existingUser = await _entity_1.UserV1.checkUserAlreadyExists({ email: payload.email });
                if (existingUser && existingUser.length > 0) {
                    if (existingUser[0].email == payload.email && existingUser[0]._id != payload.id)
                        return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).EMAIL_ALREADY_EXISTS);
                }
                dataToSave['email'] = payload.email;
            }
            if (payload && payload.companyType)
                dataToSave['companyType'] = payload.companyType;
            await _entity_1.UserV1.updateEntity({ _id: payload.id }, dataToSave, { new: true });
            return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).PROFILE_UPDATED, {});
        }
        catch (err) {
            next(err);
        }
    }
    async generateGoogleCalendarUrl(req, res, next) {
        try {
            let url = await _services_1.GoogleCalendar.createUserUrl();
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, url);
        }
        catch (err) {
            next(err);
        }
    }
    async updateCalendarSync(req, res, next) {
        try {
            const calendarType = req.body.calendarType;
            const userId = res.locals.userId;
            switch (calendarType) {
                case _common_1.ENUM.USER.CALENDAR_TYPE.GOOGLE:
                    await _entity_1.UserV1.update({ _id: mongoose_1.Types.ObjectId(userId) }, { $set: { googleCalendarSyncStatus: false } });
                    break;
                case _common_1.ENUM.USER.CALENDAR_TYPE.OUTLOOK:
                    await _entity_1.UserV1.update({ _id: mongoose_1.Types.ObjectId(userId) }, { $set: { outlookCalendarSyncStatus: false } });
                    break;
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            console.error(`we have an error while updateCalendarSync ==>`, err);
            next(err);
        }
    }
    async deleteUserAccount(req, res, next) {
        var _a, _b;
        try {
            let userId = res.locals.userId;
            let [bookingData] = await Promise.all([
                _entity_1.BookingV1.findMany({
                    "userData.userId": mongoose_1.Types.ObjectId(userId),
                    bookingStatus: _common_1.ENUM.BOOKING.STATUS.UPCOMING,
                }),
                _entity_1.UserV1.updateOne({ _id: mongoose_1.Types.ObjectId(userId) }, { status: _common_1.ENUM.USER.STATUS.ISDELETE }),
                _entity_1.UserV1.removePreviousSession(res.locals.userSessionId, false)
            ]);
            Promise.all([
                _entity_1.BookingV1.updateManyDocument({
                    "userData.userId": mongoose_1.Types.ObjectId(userId),
                    bookingStatus: _common_1.ENUM.BOOKING.STATUS.UPCOMING
                }, {
                    bookingStatus: _common_1.ENUM.BOOKING.STATUS.CANCELLED,
                    "userData.status": _common_1.ENUM.USER.STATUS.ISDELETE,
                    "userData.name": "User Deleted",
                    "userData.email": "NA",
                    "userData.image": "",
                    "userData.phoneNo": "NA",
                    "userData.countryCode": "NA",
                    cancelledBy: _common_1.ENUM.USER.TYPE.USER
                }),
                _entity_1.BookingV1.updateManyDocument({
                    "userData.userId": mongoose_1.Types.ObjectId(userId),
                    bookingStatus: { $in: [
                            _common_1.ENUM.BOOKING.STATUS.CANCELLED,
                            _common_1.ENUM.BOOKING.STATUS.REJECTED,
                            _common_1.ENUM.BOOKING.STATUS.COMPLETED
                        ] }
                }, {
                    "userData.status": _common_1.ENUM.USER.STATUS.ISDELETE,
                    "userData.name": "User Deleted",
                    "userData.email": "NA",
                    "userData.image": "",
                    "userData.phoneNo": "NA",
                    "userData.countryCode": "NA"
                }),
                _entity_1.BookingV1.updateManyDocument({
                    "userData.userId": mongoose_1.Types.ObjectId(userId),
                    bookingStatus: { $in: [
                            _common_1.ENUM.BOOKING.STATUS.ONGOING
                        ] }
                }, {
                    "userData.status": _common_1.ENUM.USER.STATUS.ISDELETE,
                })
            ]);
            for (let i = 0; i < (bookingData === null || bookingData === void 0 ? void 0 : bookingData.length); i++) {
                _entity_1.PropertyV1.updateOne({ _id: mongoose_1.Types.ObjectId((_b = (_a = bookingData[i]) === null || _a === void 0 ? void 0 : _a.propertyData) === null || _b === void 0 ? void 0 : _b.propertyId) }, { $inc: { totalBookingsCount: -1 } });
                if (bookingData[i].isEmployee == false) {
                    _entity_1.HostV1.initiateRefund(bookingData[i]._id, bookingData[i]);
                }
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            console.error(`we have an error while deleting account ==>`, err);
            next(err);
        }
    }
    async verifyPassword(req, res, next) {
        try {
            let payload = req.query;
            payload.userId = res.locals.userId;
            let existingUser = await _entity_1.UserV1.checkUserAlreadyExists(payload);
            if (!existingUser.length)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
            else if (existingUser[0].status == _common_1.ENUM.USER.STATUS.BLOCK)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).ACCOUNT_BLOCKED);
            else if (existingUser[0].password !== _services_1.Auth.hashData(payload.password, constant_common_1.CONSTANT.PASSWORD_HASH_SALT))
                this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).INCORRECT_PASSWORD);
            else
                this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "User SignUp",
        path: '/signup',
        parameters: {
            body: {
                description: 'Body for signup',
                required: true,
                model: 'ReqAddUser'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "userSignUp", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "User Resnd otp",
        path: '/resendOtp',
        parameters: {
            body: {
                description: 'Body for resend Otp',
                required: true,
                model: 'ReqUserResendOtp'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "userResendOtp", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "User Verify Otp",
        path: '/verifyOtp',
        parameters: {
            body: {
                description: 'Body for verify otp',
                required: true,
                model: 'ReqVerifyOtp'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "VerifyOtp", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Host update device token",
        path: '/deviceToken',
        parameters: {
            body: {
                description: 'Body for device token',
                required: true,
                model: 'ReqUpdateUserDeviceToken'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "updateDeviceToken", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "User Login",
        path: '/login',
        parameters: {
            body: {
                description: 'Body for user login',
                required: true,
                model: 'UserLogin'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "userLogin", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "User Reset Password",
        path: '/forgetPasswordEmail',
        parameters: {
            body: {
                description: 'Body for reset password',
                required: true,
                model: 'ForgetPasswordEmail'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "forgetPasswordEmail", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "User Reset Password",
        path: '/verificationEmailLink/{email}',
        parameters: {
            path: {
                email: {
                    description: 'email',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "verificationEmailLink", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "User Reset Password",
        path: '/verifyEmail/{emailVerificationToken}',
        parameters: {
            path: {
                emailVerificationToken: {
                    description: 'emailVerificationToken',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "verifyEmail", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "verify reset otp",
        path: '/verifyResetOtp',
        parameters: {
            body: {
                description: 'Body for verify otp',
                required: true,
                model: 'verifyOtp'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "VerifyResetOtp", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "User Reset Password",
        path: '/verifyResetToken/{resetPasswordToken}',
        parameters: {
            path: {
                resetPasswordToken: {
                    description: 'resetPasswordToken',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "verifyResetToken", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "User Reset Password",
        path: '/resetPassword',
        parameters: {
            body: {
                description: 'Body for verify otp',
                required: true,
                model: 'ReqUserResetPassword'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "resetPassword", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "User Reset Password",
        path: '/myProfile',
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "myProfile", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "User change Password",
        path: '/changePassword',
        parameters: {
            body: {
                description: 'Body for reset password',
                required: true,
                model: 'ChangePassword'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "changePassword", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "User logout",
        path: '/logout',
        parameters: {},
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "logout", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "User Social Login",
        path: '/socialLogin',
        parameters: {
            body: {
                description: 'Body social login',
                required: true,
                model: 'ReqUserSocialLogin'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "userSocialLogin", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "User Companty Detail",
        path: '/companyDetail',
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "getCompanyDetail", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "Update company if exists else create",
        path: '/companyDetail',
        parameters: {
            body: {
                description: 'Body for company detail',
                required: true,
                model: 'ReqUpdateUserCompanyDetail'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "userCompanyDetailUpdate", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get Countries",
        path: '/getCountries',
        parameters: {},
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "getCountries", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get Countries",
        path: '/getAllCountries',
        parameters: {},
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "getAllCountries", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get states",
        path: '/getStates/{countryId}',
        parameters: {
            path: {
                countryId: {
                    description: 'countryId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "getStates", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get states",
        path: '/getAllCities/{stateId}',
        parameters: {
            path: {
                stateId: {
                    description: 'stateId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "getAllCities", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get states",
        path: '/getAllStates/{countryId}',
        parameters: {
            path: {
                countryId: {
                    description: 'stateId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "getAllStates", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get states",
        path: '/getCities/{stateId}',
        parameters: {
            path: {
                stateId: {
                    description: 'stateId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "getCities", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "user check email",
        path: '/checkEmailExists/{email}',
        parameters: {
            path: {
                email: {
                    description: 'email',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "checkEmailExists", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "User change Phone No",
        path: '/changePhoneNo',
        parameters: {
            body: {
                description: 'Body for reset password',
                required: true,
                model: 'ChangePhoneNo'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "changePhoneNo", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Host Verify Otp",
        path: '/verifyChangePhoneOtp',
        parameters: {
            body: {
                description: 'Body for verify otp',
                required: true,
                model: 'ReqHostVerifyNewPhoneOtpModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "VerifyNewPhoneNoOtp", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Host Reset Password",
        path: '/checkPhoneExists/{countryCode}/{phoneNo}',
        parameters: {
            path: {
                countryCode: {
                    description: 'countryCode',
                    required: true,
                },
                phoneNo: {
                    description: 'phoneNo',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "checkPhoneExists", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "User Update Profile",
        path: '/updateProfile',
        parameters: {
            body: {
                description: 'Body for update user profile',
                required: true,
                model: 'ReqUpdateUserProfileAndCompnay'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "updateUserProfile", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get home screen data",
        path: '/home',
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "fetchHomeScreen", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Get home screen data",
        path: '/send-otp',
        parameters: {},
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "sendOtp", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: "Get home screen data",
        path: '/account/{otp}',
        parameters: {
            path: {
                otp: {
                    description: 'countryCode',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "deleteAccount", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Check User Type",
        path: '/type',
        parameters: {
            query: {
                userId: {
                    description: 'user Id',
                    required: true,
                },
                type: {
                    description: '1 user 2 host',
                    required: true,
                },
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "checkUserType", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Check User Chat Room",
        path: '/chatRoom',
        parameters: {
            query: {
                userId: {
                    description: 'user Id',
                    required: true,
                },
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "checkUserChatRoom", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Deeplink url",
        path: '/deeplink',
        parameters: {
            query: {
                type: {
                    description: 'user Id',
                    required: true,
                },
                shareId: {
                    description: 'user Id',
                    required: true,
                },
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "generateDeepLink", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get partner list",
        path: '/partnerType',
        parameters: {
            query: {
                page: {
                    description: 'page',
                    required: true,
                },
                limit: {
                    description: 'limit',
                    required: false,
                },
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "partnerList", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "User Update Profile",
        path: '/completeProfile',
        parameters: {
            body: {
                description: 'Body for complete user profile',
                required: true,
                model: 'ReqUpdateUserCompleteProfileModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "completeProfile", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Generate Calendar Url",
        path: '/generateCalendarUrl',
        parameters: {
            query: {
                userType: {
                    description: '1 for user',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "generateGoogleCalendarUrl", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "user calendar sync",
        path: '/calendarSync',
        parameters: {
            body: {
                description: 'Body for Calednar sync',
                required: true,
                model: 'ReqCalendarSyncModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "updateCalendarSync", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "user delete account",
        path: '/deleteAccount',
        parameters: {
            body: {}
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "deleteUserAccount", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "User verify Password",
        path: '/verifyPassword',
        parameters: {
            body: {
                description: 'Body for verify password',
                required: true,
                model: 'ReqUserResetPassword'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserClass.prototype, "verifyPassword", null);
UserClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/user",
        name: "User Onboarding Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], UserClass);
exports.UserController = new UserClass();
//# sourceMappingURL=user.controller.js.map