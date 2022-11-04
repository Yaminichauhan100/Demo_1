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
exports.HostController = void 0;
var validUrl = require('valid-url');
const mongoose_1 = require("mongoose");
const _builders_1 = __importDefault(require("@builders"));
const _entity_1 = require("@entity");
const _baseController_1 = __importDefault(require("@baseController"));
const swagger_express_ts_1 = require("swagger-express-ts");
const _common_1 = require("@common");
const constant_common_1 = require("../../common/constant.common");
const helper_service_1 = require("../../services/helper.service");
const sns_aws_service_1 = require("../../services/aws/sns.aws.service");
const _services_1 = require("@services");
const htmlHelper_1 = require("../../htmlHelper");
const _builders_2 = __importDefault(require("@builders"));
const code_response_1 = __importDefault(require("../../common/responses/code.response"));
const axios = require('axios');
const querystring_1 = require("querystring");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let HostClass = class HostClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async hostSignUp(req, res, next) {
        try {
            let payload = req.body;
            (payload === null || payload === void 0 ? void 0 : payload.subscribeEmail) ? payload['subscribeEmail'] = payload['subscribeEmail'] : payload['subscribeEmail'] = false;
            let existingUser = await _entity_1.HostV1.checkHostAlreadyExists(payload);
            if (existingUser.length) {
                if (existingUser[0].email == payload.email)
                    return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).EMAIL_ALREADY_EXISTS);
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).PHONE_ALREADY_EXISTS);
            }
            payload.otp = await helper_service_1.Helper.generateOtp();
            if (payload.subscribeEmail == null)
                payload.subscribeEmail = false;
            let metaToken = await helper_service_1.Helper.generateMetaToken();
            payload.emailVerificationToken = metaToken.value;
            payload.type = _common_1.ENUM.USER.TYPE.HOST;
            let response = await _entity_1.HostV1.createUser(payload);
            await _entity_1.OtpV1.saveOtp({ countryCode: payload.countryCode, phoneNo: payload.phoneNo, otp: payload.otp, otpTimeStamp: new Date().getTime(), userId: response._id, type: payload.type });
            sns_aws_service_1.SnsService.sendSms(`${payload.countryCode}${payload.phoneNo}`, payload.otp);
            await Promise.all([
                _services_1.redisDOA.insertKeyInRedis(metaToken.value, response._id.toString()),
                _services_1.redisDOA.expireKey(metaToken.value, constant_common_1.DATABASE.REDIS.RESET_TOKEN_EMAIL)
            ]);
            let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(`${constant_common_1.CONSTANT.EMAIL_TEMPLATES}` + `otp.html`, {
                name: payload.name, ASSET_PATH: _common_1.BASE.URL, url: `${_common_1.BASE.HOST_EMAIL_URL}/verifyEmail/${metaToken.value}`,
                logo: constant_common_1.CONSTANT.PAM_LOGO,
                facebookLogo: constant_common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                igLogo: constant_common_1.CONSTANT.INSTAGRAM_LOGO,
                twitterLogo: constant_common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: constant_common_1.CONSTANT.LINKEDIN_LOGO,
                welcome: "Pam",
                fbUrl: _common_1.WEB_PANELS.PAM_FB_URL,
                instaUrl: _common_1.WEB_PANELS.PAM_INSTA_URL,
                twitterUrl: _common_1.WEB_PANELS.PAM_TWITTER_URL,
                linkedinUrl: _common_1.WEB_PANELS.PAM_LINKEDIN_URL
            });
            _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.NEW_HOST_SIGNUP_EMAIL(payload.email, html));
            return await this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).SIGNUP_SUCCESSFULLY, response);
        }
        catch (err) {
            console.error("Error while host signup ==>", err);
            next(err);
        }
    }
    async hostResendOtp(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.HOST;
            let existingUser = await _entity_1.HostV1.checkHostAlreadyExists(payload);
            if (!existingUser.length)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).NOT_FOUND);
            let blockHandler = await _entity_1.UserV1.otpExhaustBlockHandling(payload);
            if (blockHandler.minutesLeft && blockHandler.secondsLeft) {
                return this.sendResponse(res, { httpCode: code_response_1.default.BAD_REQUEST, statusCode: 414, message: `OTP limit exhausted,kindly try after ${blockHandler.minutesLeft}:${blockHandler.secondsLeft}` });
            }
            payload.otp = await helper_service_1.Helper.generateOtp();
            if (!existingUser[0].otpCount || existingUser[0].otpCount <= 3) {
                await Promise.all([
                    _entity_1.HostV1.update({ _id: mongoose_1.Types.ObjectId(existingUser[0]._id) }, { $inc: { otpCount: 1 } }),
                    _entity_1.OtpV1.saveOtp({ otp: payload.otp, phoneNo: payload.phoneNo, countryCode: payload.countryCode, otpTimeStamp: new Date().getTime(), type: payload.type })
                ]);
            }
            else {
                await Promise.all([
                    _entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(existingUser[0]._id) }, { otpCount: 0 }),
                    _entity_1.OtpV1.saveOtpFinalCount({ otp: payload.otp, phoneNo: payload.phoneNo, countryCode: payload.countryCode, otpTimeStamp: new Date().getTime(), type: payload.type })
                ]);
            }
            sns_aws_service_1.SnsService.sendSms(payload.countryCode + payload.phoneNo, payload.otp);
            return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).OTP_SENT_SUCCESSFULLY);
        }
        catch (err) {
            console.error('......................... host resend otp', err);
            return Promise.reject(err);
        }
    }
    async VerifyOtp(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.HOST;
            let existingUser = await _entity_1.HostV1.checkHostAlreadyExists(payload);
            if (!existingUser.length)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).NOT_FOUND);
            payload.userId = existingUser[0]._id;
            let getOtpFromDb = await _entity_1.OtpV1.getUserOtpFromDb(payload);
            if (getOtpFromDb == null && (payload.otp)) {
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_EXPIRED);
            }
            else if (getOtpFromDb != null && getOtpFromDb != payload.otp) {
                let response = await _entity_1.UserV1.otpExhaustLimit(payload);
                if (response.attemptCountLeft < 1) {
                    _entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(existingUser[0]._id) }, { otpCount: 0 }),
                        _entity_1.OtpV1.saveOtpFinalCount({ otp: 1, phoneNo: payload.phoneNo, countryCode: payload.countryCode, otpTimeStamp: new Date().getTime(), type: 2 });
                    this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_LIMIT_EXHAUSTED, response);
                }
                else {
                    this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_INVALID, response);
                }
            }
            else {
                const keyName = `${payload.countryCode}_${payload.phoneNo}_${payload.type}`;
                const keyExist = await _services_1.redisDOA.getFromKey(keyName);
                keyExist ? await _services_1.redisDOA.deleteKey(keyName) : "";
                _entity_1.HostV1.verifyUserPhone(existingUser[0]._id);
                let sessionPayload = { email: existingUser[0].email, userId: existingUser[0]._id };
                let sessionData = await _entity_1.HostV1.createNewSession(sessionPayload);
                existingUser[0].authToken = await _services_1.Auth.generateUserJWT(sessionData._id);
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_VERIFIED, await _entity_1.HostV1.formatUserResponse(constant_common_1.DATABASE.FORMATED_RESPONSE_TYPE.VERIFY_OTP, existingUser[0]));
            }
        }
        catch (err) {
            next(err);
        }
    }
    async userLogin(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.HOST;
            let existingUser = await _entity_1.HostV1.checkHostAlreadyExists(payload);
            if (!existingUser.length)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).NOT_FOUND);
            else if (existingUser[0].status == _common_1.ENUM.USER.STATUS.BLOCK)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).ACCOUNT_BLOCKED);
            else if (existingUser[0].emailVerified == false)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).Email_NOT_VERIFIED);
            else if (existingUser[0].password == _services_1.Auth.hashData(payload.password, constant_common_1.CONSTANT.PASSWORD_HASH_SALT)) {
                let sessionPayload = {
                    email: existingUser[0].email,
                    userId: existingUser[0]._id,
                    device: payload.device
                };
                let sessionData = await _entity_1.HostV1.createNewSession(sessionPayload);
                existingUser[0].authToken = await _services_1.Auth.generateUserJWT(sessionData._id);
                let responseData = await _entity_1.HostV1.findOne({ _id: existingUser[0]._id }, _builders_2.default.User.Projections.UserList.userLogin);
                responseData.authToken = existingUser[0].authToken;
                if (responseData.isCohost) {
                    let findData = await _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(responseData._id) }, { accessLevel: 1 });
                    if (findData.length == 1 && findData[0].accessLevel == _common_1.ENUM.COHOST_LEVEL.PROPERTY)
                        responseData.isPropertyLevel = 1;
                }
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).LOGIN_SUCCESSFULLY, responseData);
            }
            else
                this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).INCORRECT_PASSWORD);
        }
        catch (err) {
            next(err);
        }
    }
    async hostSocialLogin(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.HOST;
            let existingUser = await _entity_1.HostV1.checkSocialIdExists(payload);
            let newUser = await _entity_1.HostV1.createHostFromSocialId(payload, existingUser);
            let data = {
                userId: newUser._id,
                device: payload.device
            };
            let sessionData = await _entity_1.HostV1.createNewSession(data);
            newUser.authToken = await _services_1.Auth.generateUserJWT(sessionData._id);
            newUser.isNew = true;
            let responseData = await _entity_1.HostV1.findOne({ _id: newUser._id }, _builders_2.default.User.Projections.UserList.userProfile);
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
    async verificationEmailLink(req, res, next) {
        try {
            let payload = { email: req.params.email, type: _common_1.ENUM.USER.TYPE.HOST };
            let existingUser = await _entity_1.HostV1.checkHostAlreadyExists(payload);
            if (!existingUser.length)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
            else if (existingUser[0].status == _common_1.ENUM.USER.STATUS.BLOCK)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).ACCOUNT_BLOCKED);
            let metaToken = await helper_service_1.Helper.generateMetaToken();
            await Promise.all([_services_1.redisDOA.insertKeyInRedis(metaToken.value, existingUser[0]._id), _services_1.redisDOA.expireKey(metaToken.value, constant_common_1.DATABASE.REDIS.RESET_TOKEN_EMAIL)]);
            let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(`${constant_common_1.CONSTANT.EMAIL_TEMPLATES}` + `otp.html`, {
                name: existingUser[0].name, ASSET_PATH: _common_1.BASE.URL, url: `${_common_1.BASE.HOST_EMAIL_URL}/verifyEmail/${metaToken.value}`,
                logo: constant_common_1.CONSTANT.PAM_LOGO,
                facebookLogo: constant_common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                igLogo: constant_common_1.CONSTANT.INSTAGRAM_LOGO,
                twitterLogo: constant_common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: constant_common_1.CONSTANT.LINKEDIN_LOGO,
                welcome: "Pam",
                fbUrl: _common_1.WEB_PANELS.PAM_FB_URL,
                instaUrl: _common_1.WEB_PANELS.PAM_INSTA_URL,
                twitterUrl: _common_1.WEB_PANELS.PAM_TWITTER_URL,
                linkedinUrl: _common_1.WEB_PANELS.PAM_LINKEDIN_URL,
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
            let getTokenFromRedis = await _services_1.redisDOA.getFromKey(payload.emailVerificationToken);
            if (!getTokenFromRedis) {
                let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(`${constant_common_1.CONSTANT.VERIFICATION_TEMPLATES_HOST}emailVerificationFalse.html`, {
                    background: `${constant_common_1.CONSTANT.VERIFY_EMAIL_BG}`,
                    logo: `${constant_common_1.CONSTANT.PAM_LOGO}`,
                    url: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : "${WEB_PANELS.HOST_PANEL_PROD}/account/login"
                });
                return res.send(html);
            }
            else
                await _entity_1.HostV1.updateWithDeleteDocument({ _id: getTokenFromRedis }, { emailVerified: true }, { emailVerificationToken: "" });
            let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(`${constant_common_1.CONSTANT.VERIFICATION_TEMPLATES_HOST}emailVerificationTrue.html`, {
                background: `${constant_common_1.CONSTANT.VERIFY_EMAIL_BG}`,
                logo: `${constant_common_1.CONSTANT.PAM_LOGO}`,
                url: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : "${WEB_PANELS.HOST_PANEL_PROD}/account/login"
            });
            return res.send(html);
        }
        catch (err) {
            console.error(`we have an error in verifyEmail ==> ${err}`);
            next(err);
            throw err;
        }
    }
    async forgetPasswordEmail(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.HOST;
            let existingUser = await _entity_1.HostV1.checkHostAlreadyExists(payload);
            if (!existingUser.length)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
            else if (existingUser[0].status == _common_1.ENUM.USER.STATUS.BLOCK)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).ACCOUNT_BLOCKED);
            payload.otp = await helper_service_1.Helper.generateOtp();
            await _entity_1.OtpV1.saveOtp({ countryCode: existingUser[0].countryCode, phoneNo: existingUser[0].phoneNo, otp: payload.otp, type: payload.type });
            sns_aws_service_1.SnsService.sendSms(existingUser[0].countryCode + existingUser[0].phoneNo, payload.otp);
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_SENT_SUCCESSFULLY, { countryCode: existingUser[0].countryCode, phone: existingUser[0].phoneNo });
        }
        catch (err) {
            next(err);
        }
    }
    async VerifyResetOtp(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.HOST;
            let existingUser = await _entity_1.HostV1.checkHostAlreadyExists(payload);
            if (!existingUser.length)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
            payload.userId = existingUser[0]._id;
            let getOtpFromDb = await _entity_1.OtpV1.getUserOtpFromDb(payload);
            if (getOtpFromDb == null && (payload.otp && payload.otp != constant_common_1.CONSTANT.BY_PASS_OTP))
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_EXPIRED);
            else if (getOtpFromDb != null && getOtpFromDb != payload.otp && payload.otp != constant_common_1.CONSTANT.BY_PASS_OTP) {
                let response = await _entity_1.UserV1.otpExhaustLimitforgotPassword(payload);
                response.attemptCountLeft < 1 ? this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_LIMIT_EXHAUSTED, response) : this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_INVALID, response);
            }
            else {
                const keyName = `otpForgot_${payload.phoneNo}_${payload.type}`;
                const keyExist = await _services_1.redisDOA.getFromKey(keyName);
                keyExist ? await _services_1.redisDOA.deleteKey(keyName) : "";
                let resetPasswordToken = await _services_1.Auth.generateToken({ email: existingUser[0].email });
                await _entity_1.HostV1.updateDocument({ _id: existingUser[0]._id }, { resetPasswordToken });
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
            let user = await _entity_1.HostV1.findOne({ 'resetPasswordToken': resetPasswordToken });
            if (user)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).VALID_RESET_TOKEN);
            else
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).INVALID_RESET_TOKEN);
        }
        catch (err) {
            next(err);
        }
    }
    async resetPassword(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.HOST;
            const verToken = await _services_1.Auth.verifyToken(payload.resetPasswordToken);
            payload.email = verToken.data.email;
            let existingUser = await _entity_1.HostV1.checkHostAlreadyExists(payload);
            if (!existingUser.length)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).TOKEN_EXPIRED);
            else if (existingUser[0].status == _common_1.ENUM.USER.STATUS.BLOCK)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).ACCOUNT_BLOCKED);
            else {
                await _entity_1.HostV1.updateWithDeleteDocument({ _id: existingUser[0]._id }, { password: _services_1.Auth.hashData(payload.password, constant_common_1.CONSTANT.PASSWORD_HASH_SALT) }, { resetPasswordToken: "" });
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).PASSWORD_CHANGED_SUCCESSFULLY);
            }
        }
        catch (err) {
            next(err);
        }
    }
    async myProfile(req, res, next) {
        try {
            let hostId = res.locals.userId;
            let existingUser = await _entity_1.HostV1.fectchHostProfileDetails(hostId);
            if (existingUser.isCohost) {
                let findData = await _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(existingUser._id) }, { accessLevel: 1 });
                if (findData && findData.length) {
                    let proeprtyLevelCOunt = findData.filter((list) => list.accessLevel === _common_1.ENUM.COHOST_LEVEL.STATUS.PROPERTY);
                    if (proeprtyLevelCOunt.length == findData.length)
                        existingUser.isPropertyLevel = 1;
                }
            }
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).USER_FOUND_SUCCESSFULLY, existingUser);
        }
        catch (err) {
            console.error(`we have an error in getting profile ==> ${err}`);
            next(err);
        }
    }
    async changePassword(req, res, next) {
        try {
            let payload = req.body;
            let existingUser = await _entity_1.HostV1.checkHostAlreadyExists(res.locals);
            if (!existingUser.length)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
            else if (existingUser[0].password == _services_1.Auth.hashData(payload.oldPassword, constant_common_1.CONSTANT.PASSWORD_HASH_SALT)) {
                {
                    let passwordUpdation = await _entity_1.HostV1.updateDocument({ _id: existingUser[0]._id }, { password: _services_1.Auth.hashData(payload.newPassword, constant_common_1.CONSTANT.PASSWORD_HASH_SALT) });
                    await _entity_1.HostV1.removePreviousSession(res.locals.userSessionId, false);
                    if (passwordUpdation)
                        return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).PASSWORD_CHANGED_SUCCESSFULLY);
                }
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).PASSWORD_CHANGED_SUCCESSFULLY);
            }
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).INCORRECT_OLD_PASSWORD);
        }
        catch (err) {
            next(err);
        }
    }
    async logout(req, res, next) {
        try {
            let userId = res.locals.userId, userSessionId = res.locals.userSessionId;
            if (userId) {
                await _entity_1.HostV1.removePreviousSession(userSessionId, false);
                this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).LOGGED_OUT_SUCCESSFULLY);
            }
            else
                this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async hostCompanyDetail(req, res, next) {
        try {
            let payload = req.body;
            payload.userId = mongoose_1.Types.ObjectId(res.locals.userId);
            let userCompany = await _entity_1.CompanyV1.findOne({ userId: payload.userId });
            if (userCompany)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).COMPANY_ALREADY_EXISTS);
            if (payload.countryId)
                payload.country = await _entity_1.CountriesV1.findOne({ id: payload.countryId }, { id: 1, sortname: 1, name: 1, countryId: 1, _id: 1 });
            if (payload.stateId)
                payload.state = await _entity_1.AllStatesV1.findOne({ id: payload.stateId }, { name: 1, stateId: 1, id: 1, _id: 1 });
            if (payload.cityId)
                payload.city = await _entity_1.AllCityV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.cityId) }, { name: 1, iconImage: 1, _id: 1 });
            await _entity_1.CompanyV1.hostCompanyDetails(payload);
            return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).COMPANY_DETAILS_SAVED);
        }
        catch (err) {
            next(err);
        }
    }
    async updateHostProfile(req, res, next) {
        try {
            let payload = req.body;
            let finalResponse;
            payload.userId = res.locals.userId;
            payload.userData = res.locals.userData;
            if (payload.fbUrl && !validUrl.isHttpsUri(payload.fbUrl))
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).URL_INVALID);
            if (payload.twitterUrl && !validUrl.isHttpsUri(payload.twitterUrl))
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).URL_INVALID);
            if (payload.linkedinUrl && !validUrl.isHttpsUri(payload.linkedinUrl))
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).URL_INVALID);
            if (payload.instaUrl && !validUrl.isHttpsUri(payload.instaUrl))
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).URL_INVALID);
            if (payload.youtubeUrl && !validUrl.isHttpsUri(payload.youtubeUrl))
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).URL_INVALID);
            if (payload.slackUrl && !validUrl.isHttpsUri(payload.slackUrl))
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).URL_INVALID);
            const promise = await _builders_1.default.User.HostCompanyBuilder.EditHostProfileAndCompany(payload);
            let response = await Promise.all(promise);
            if (response.length > 2) {
                finalResponse = response[2];
                finalResponse.userComapnyDetails = {};
            }
            if (payload.company) {
                finalResponse.userComapnyDetails = response[0];
            }
            return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).PROFILE_UPDATED, finalResponse);
        }
        catch (err) {
            next(err);
        }
    }
    async getCompanyDetail(req, res, next) {
        try {
            let payload = req.body;
            payload.userId = mongoose_1.Types.ObjectId(res.locals.userId);
            let pipeline1 = _builders_1.default.User.HostBUilder.companyDetails(payload.userId);
            let company = await _entity_1.CompanyV1.basicAggregate(pipeline1);
            if (company.length) {
                return await this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).COMPANY_DETAILS, company[0]);
            }
            else {
                return await this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).COMPANY_NOT_FOUND, {});
            }
        }
        catch (err) {
            next(err);
        }
    }
    async hostCompanyDetailUpdate(req, res, next) {
        try {
            let payload = req.body;
            payload.userId = mongoose_1.Types.ObjectId(res.locals.userId);
            if (payload.countryId)
                payload.country = await _entity_1.CountriesV1.findOne({ id: payload.countryId }, { id: 1, sortname: 1, name: 1, countryId: 1, _id: 1 });
            if (payload.stateId)
                payload.state = await _entity_1.AllStatesV1.findOne({ id: payload.stateId }, { name: 1, stateId: 1, id: 1, _id: 1 });
            if (payload.cityId)
                payload.city = await _entity_1.AllCityV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.cityId) }, { name: 1, iconImage: 1, _id: 1 });
            await _entity_1.CompanyV1.updateDocument({ userId: mongoose_1.Types.ObjectId(payload.userId) }, payload, { upsert: true, setDefaultsOnInsert: true });
            await _entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.userId) }, { profileCompleted: true });
            return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).COMPANY_DETAILS_UPDATED);
        }
        catch (err) {
            next(err);
        }
    }
    async getCountries(req, res, next) {
        try {
            let countryData;
            if (res.locals.userData.isCohost && res.locals.userData.accessLevel != _common_1.ENUM.COHOST_LEVEL.STATUS.ALL) {
                let countrId = [];
                let cohost = await _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId) }, { country: 1 });
                for (let i = 0; i < cohost.length; i++) {
                    countrId.push(cohost[i].country[0].id);
                }
                let pipeline1 = _builders_1.default.User.HostBUilder.countryListing(countrId);
                countryData = await _entity_1.CountriesV1.basicAggregate(pipeline1);
            }
            else {
                let data = await _entity_1.CityV1.findMany({ isDelete: false, status: "active" });
                let payload = [];
                for (let i = 0; i < data.length; i++) {
                    payload.push(data[i].countryId);
                }
                let pipeline1 = _builders_1.default.User.HostBUilder.countryListing(payload);
                countryData = await _entity_1.CountriesV1.basicAggregate(pipeline1);
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, countryData);
        }
        catch (err) {
            next(err);
        }
    }
    async getStates(req, res, next) {
        try {
            let stateData;
            if (res.locals.userData.isCohost && res.locals.userData.accessLevel != _common_1.ENUM.COHOST_LEVEL.STATUS.ALL) {
                let countrId = [];
                let cohost = await _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId), "country.id": parseInt(req.params.countryId) }, { _id: 0, state: 1, accessLevel: 1 });
                if (cohost.length == 1 && cohost[0].accessLevel == _common_1.ENUM.COHOST_LEVEL.STATUS.COUNTRY) {
                    let data = await _entity_1.CityV1.findMany({ countryId: req.params.countryId, isDelete: false, status: "active" });
                    let payload = [];
                    for (let i = 0; i < data.length; i++) {
                        payload.push(data[i].stateId);
                    }
                    let pipeline1 = _builders_1.default.User.HostBUilder.countryListing(payload);
                    stateData = await _entity_1.StatesV1.basicAggregate(pipeline1);
                    return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, stateData);
                }
                for (let i = 0; i < cohost.length; i++) {
                    {
                        for (let j = 0; j < cohost[i].state.length; j++) {
                            countrId.push(cohost[i].state[j].id);
                        }
                    }
                }
                let pipeline1 = _builders_1.default.User.HostBUilder.countryListing(countrId);
                stateData = await _entity_1.StatesV1.basicAggregate(pipeline1);
            }
            else {
                let data = await _entity_1.CityV1.findMany({ countryId: req.params.countryId, isDelete: false, status: "active" });
                let payload = [];
                for (let i = 0; i < data.length; i++) {
                    payload.push(data[i].stateId);
                }
                let pipeline1 = _builders_1.default.User.HostBUilder.countryListing(payload);
                stateData = await _entity_1.StatesV1.basicAggregate(pipeline1);
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, stateData);
        }
        catch (err) {
            next(err);
        }
    }
    async getPropertyStates(req, res, next) {
        try {
            let stateData;
            if (res.locals.userData.isCohost && res.locals.userData.accessLevel != _common_1.ENUM.COHOST_LEVEL.STATUS.ALL) {
                let countrId = [];
                let cohost = await _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId), "country.id": parseInt(req.params.countryId), accessLevel: { $ne: 4 } }, { state: 1 });
                for (let i = 0; i < cohost.length; i++) {
                    {
                        for (let j = 0; j < cohost[i].state.length; j++) {
                            countrId.push(cohost[i].state[j].id);
                        }
                    }
                }
                let pipeline1 = _builders_1.default.User.HostBUilder.countryListing(countrId);
                stateData = await _entity_1.StatesV1.basicAggregate(pipeline1);
            }
            else {
                let data = await _entity_1.CityV1.findMany({ countryId: req.params.countryId, isDelete: false, status: "active" });
                let payload = [];
                for (let i = 0; i < data.length; i++) {
                    payload.push(data[i].stateId);
                }
                let pipeline1 = _builders_1.default.User.HostBUilder.countryListing(payload);
                stateData = await _entity_1.StatesV1.basicAggregate(pipeline1);
            }
            if (stateData.length == 0)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).NO_STATE_DATA, []);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, stateData);
        }
        catch (err) {
            next(err);
        }
    }
    async getPropertyCities(req, res, next) {
        try {
            let cityData;
            let cityIds = [];
            if (res.locals.userData.isCohost && res.locals.userData.accessLevel != _common_1.ENUM.COHOST_LEVEL.STATUS.ALL) {
                let [state, city] = await Promise.all([
                    _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId), "state.id": parseInt(req.params.stateId), accessLevel: 2 }, { "state": 1 }),
                    _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId), "state.id": parseInt(req.params.stateId), accessLevel: 3 }, { city: 1 })
                ]);
                if (city.length > 0) {
                    for (let i = 0; i < city.length; i++) {
                        for (let j = 0; j < city[i].city.length; j++)
                            cityIds.push(mongoose_1.Types.ObjectId(city[i].city[j]._id));
                    }
                    cityData = await _entity_1.CityV1.findMany({ _id: { $in: cityIds } });
                }
                else if (state.length > 0) {
                    let pipeline1 = _builders_1.default.User.HostBUilder.cityListing(req.params);
                    cityData = await _entity_1.CityV1.basicAggregate(pipeline1);
                }
            }
            else {
                let pipeline1 = _builders_1.default.User.HostBUilder.cityListing(req.params);
                cityData = await _entity_1.CityV1.basicAggregate(pipeline1);
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, cityData);
        }
        catch (err) {
            next(err);
        }
    }
    async getCities(req, res, next) {
        try {
            let cityData;
            let cityIds = [];
            if (res.locals.userData.isCohost && res.locals.userData.accessLevel != _common_1.ENUM.COHOST_LEVEL.STATUS.ALL) {
                let response = await _entity_1.CoHostV1.findOne({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId), "state.id": parseInt(req.params.stateId), }, { "state": 1, "accessLevel": 1 });
                if (!response) {
                    let pipeline1 = _builders_1.default.User.HostBUilder.cityListing(req.params);
                    cityData = await _entity_1.CityV1.basicAggregate(pipeline1);
                    return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, cityData);
                }
                let [state, city, level3] = await Promise.all([
                    _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId), "state.id": parseInt(req.params.stateId), accessLevel: 2 }, { "state": 1 }),
                    _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId), "state.id": parseInt(req.params.stateId), accessLevel: _common_1.ENUM.COHOST_LEVEL.STATUS.PROPERTY }, { city: 1 }),
                    _entity_1.CoHostV1.findMany({ cohostId: mongoose_1.Types.ObjectId(res.locals.userId), "state.id": parseInt(req.params.stateId), accessLevel: _common_1.ENUM.COHOST_LEVEL.STATUS.CITY }, { city: 1 }),
                ]);
                if (city.length > 0) {
                    for (let i = 0; i < city.length; i++) {
                        for (let j = 0; j < city[i].city.length; j++)
                            cityIds.push(mongoose_1.Types.ObjectId(city[i].city[j]._id));
                    }
                    cityData = await _entity_1.CityV1.findMany({ _id: { $in: cityIds } });
                }
                if (level3.length > 0) {
                    for (let i = 0; i < level3.length; i++) {
                        for (let j = 0; j < level3[i].city.length; j++)
                            cityIds.push(mongoose_1.Types.ObjectId(level3[i].city[j]._id));
                    }
                    cityData = await _entity_1.CityV1.findMany({ _id: { $in: cityIds } });
                }
                else if (state.length > 0) {
                    let pipeline1 = _builders_1.default.User.HostBUilder.cityListing(req.params);
                    cityData = await _entity_1.CityV1.basicAggregate(pipeline1);
                }
            }
            else {
                let pipeline1 = _builders_1.default.User.HostBUilder.cityListing(req.params);
                cityData = await _entity_1.CityV1.basicAggregate(pipeline1);
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, cityData);
        }
        catch (err) {
            next(err);
        }
    }
    async checkEmailExists(req, res, next) {
        try {
            let payload = { email: req.params.email, status: _common_1.ENUM.USER.STATUS.ACTIVE };
            let existingUser = await _entity_1.HostV1.findOne(payload);
            if (existingUser && existingUser.status == _common_1.ENUM.USER.STATUS.ACTIVE)
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
            else if (existingUser && existingUser.status == _common_1.ENUM.USER.STATUS.BLOCK)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).ALREADY_BLOCKED);
            else if (existingUser && existingUser.isCohost == 1 && existingUser.status == _common_1.ENUM.USER.STATUS.INACTIVE)
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).ALREADY_BLOCKED);
            else
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).NOT_EXISTS);
        }
        catch (err) {
            next(err);
        }
    }
    async changePhoneNo(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.HOST;
            let promise = [];
            promise.push(_entity_1.HostV1.findOne({ _id: res.locals.userId }));
            promise.push(_entity_1.HostV1.findOne({ phoneNo: payload.phoneNo, countryCode: payload.countryCode }));
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
                await _entity_1.HostV1.updateDocument({ _id: existingUser[0]._id }, { tempPhoneNo: payload.phoneNo, tempCountryCode: payload.countryCode });
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
            payload.type - _common_1.ENUM.USER.TYPE.HOST;
            let existingUser = await _entity_1.HostV1.findOne({ _id: res.locals.userId, tempPhoneNo: payload.phoneNo, tempCountryCode: payload.countryCode });
            if (!existingUser)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).NOT_FOUND);
            let otpData = await _entity_1.OtpV1.findOne({ otp: payload.otp });
            if (!otpData) {
                let response = await _entity_1.UserV1.otpExhaustLimitVerifyNewPhoneNo(payload);
                response.attemptCountLeft < 1 ? this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_LIMIT_EXHAUSTED, response) : this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).OTP_INVALID, response);
            }
            else if (otpData && otpData.otp == payload.otp && existingUser.otpExpiry < new Date())
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).OTP_EXPIRED);
            else {
                const keyName = `otpNewPhone_${payload.phoneNo}_${payload.type}`;
                const keyExist = await _services_1.redisDOA.getFromKey(keyName);
                keyExist ? await _services_1.redisDOA.deleteKey(keyName) : "";
                await _entity_1.HostV1.updateWithDeleteDocument({ _id: existingUser._id }, { phoneNo: payload.phoneNo, countryCode: payload.countryCode, phoneVerified: true, otp: null }, { tempCountryCode: 1, tempPhoneNo: 1 });
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).PHONE_UPDATED);
            }
        }
        catch (err) {
            next(err);
        }
    }
    async checkPhoneExists(req, res, next) {
        try {
            let payload = { countryCode: req.params.countryCode, phoneNo: req.params.phoneNo, type: _common_1.ENUM.USER.TYPE.HOST };
            let blockHandler = await _entity_1.UserV1.otpExhaustBlockHandling(payload);
            if (blockHandler.minutesLeft && blockHandler.secondsLeft) {
                return this.sendResponse(res, { httpCode: code_response_1.default.BAD_REQUEST, statusCode: 412, message: `OTP limit exhausted,kindly try after ${blockHandler.minutesLeft}:${blockHandler.secondsLeft}` });
            }
            let existingUser = await _entity_1.HostV1.findOne(payload);
            if (existingUser && existingUser.status == _common_1.ENUM.USER.STATUS.ACTIVE && existingUser.phoneVerified == true && existingUser.type == _common_1.ENUM.USER.TYPE.HOST)
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
    async sendOtp(req, res, next) {
        try {
            let userId = res.locals.userId;
            let payload = await _entity_1.HostV1.findOne({ _id: mongoose_1.Types.ObjectId(userId) });
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
            let existingUser = await _entity_1.HostV1.findOne({ _id: mongoose_1.Types.ObjectId(userId) });
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
                const keyExist = await _services_1.redisDOA.getFromKey(keyName);
                keyExist ? await _services_1.redisDOA.deleteKey(keyName) : "";
                await Promise.all([
                    _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(userId) }, { status: _common_1.ENUM.USER.STATUS.ISDELETE }),
                    _entity_1.HostV1.removePreviousSession(res.locals.userSessionId, false),
                    _entity_1.PropertyV1.updateEntity({ userId: mongoose_1.Types.ObjectId(userId) }, { status: _common_1.ENUM.PROPERTY.STATUS.ISDELETE }, { multi: true })
                ]);
                return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).ACCOUNT_DELETED);
            }
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async getAllCountries(req, res, next) {
        try {
            let countryData = await _entity_1.CountriesV1.findMany({ "isDelete": false }, { name: 1, sortname: 1, id: 1, tax: 1 }, { name: 1 });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, countryData);
        }
        catch (err) {
            next(err);
        }
    }
    async getAllCities(req, res, next) {
        try {
            let data = await _entity_1.AllCityV1.findMany({ "state_id": parseInt(req.params.stateId) }, { _id: 1, name: 1, iconImage: 1, isFeatured: 1 }, { name: 1 });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
    async getAllStates(req, res, next) {
        try {
            let data = await _entity_1.AllStatesV1.findMany({ "country_id": parseInt(req.params.countryId) }, { id: 1, name: 1 }, { name: 1 });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
    async getClientListing(req, res, next) {
        try {
            let payload = req.query;
            let deletedClient;
            payload.userData = res.locals.userData;
            payload.userId = res.locals.userId;
            if (res.locals.userData.isCohost) {
                deletedClient = await _entity_1.HostV1.findOne({ _id: mongoose_1.Types.ObjectId(res.locals.userData.hostId) }, { _id: 0, deletedClient: 1, dob: 1, bio: 1 });
                payload.propertyId = await this.Permission(res.locals.userId);
            }
            else
                deletedClient = await _entity_1.HostV1.findOne({ _id: mongoose_1.Types.ObjectId(res.locals.userId) }, {
                    dob: 1,
                    _id: 0, deletedClient: 1, bio: 1
                });
            if (deletedClient && deletedClient.deletedClient && deletedClient.deletedClient.length > 0) {
                payload.deletedClient = deletedClient.deletedClient;
            }
            let pipeline = await _builders_1.default.User.UserPropertyBuilder.clientListing(payload);
            let bookingDetails = await _entity_1.BookingV1.paginateAggregate(pipeline, Object.assign(Object.assign({}, payload), { getCount: true }));
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, bookingDetails);
        }
        catch (err) {
            next(err);
        }
    }
    async Permission(userData) {
        let propertyId = await _entity_1.PropertyV1.findMany({ coHostId: mongoose_1.Types.ObjectId(userData) });
        let response = [];
        for (let i = 0; i < propertyId.length; i++) {
            response.push(propertyId[0]._id);
        }
        return response;
    }
    async deletedClient(req, res, next) {
        try {
            await _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(res.locals.userId) }, { $push: { deletedClient: mongoose_1.Types.ObjectId(req.body.userId) } });
            return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).USER_DELETED_SUCCESSFULLY);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async updateDeviceToken(req, res, next) {
        try {
            let { deviceToken } = req.body;
            let hostId = res.locals.userId;
            await _entity_1.HostV1.updateHostToken(hostId, deviceToken);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            console.error(`we have an error ==>`, err);
        }
    }
    async checkHostChatRoom(req, res, next) {
        try {
            let params = req.query;
            let userId = res.locals.userId;
            let checkChatRoom = await Promise.all([
                _entity_1.UserV1.findOne({ _id: mongoose_1.Types.ObjectId(params.userId) }, {}),
                _entity_1.HostV1.findOne({
                    coHost: { $in: [mongoose_1.Types.ObjectId(params.userId)] },
                    _id: mongoose_1.Types.ObjectId(userId)
                })
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
    async fetchHostConnectedApps(req, res, next) {
        try {
            let userId = res.locals.userId;
            let userConnectedApps = await _entity_1.HostV1.findOne({ _id: mongoose_1.Types.ObjectId(userId) }, {
                fbUrl: 1,
                twitterUrl: 1,
                linkedinUrl: 1,
                instaUrl: 1,
                youtubeUrl: 1,
                slackUrl: 1,
                stripeAccountId: 1,
                googleCalendarSyncStatus: 1,
                outlookCalendarSyncStatus: 1
            });
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, userConnectedApps);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async updateConnectedApps(req, res, next) {
        try {
            let hostId = res.locals.userId;
            let payload = req.body;
            switch (payload.type) {
                case _common_1.ENUM.APPS.FACEBOOK:
                    await Promise.all([
                        _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(hostId) }, { $set: { fbUrl: payload.url } }),
                        _entity_1.PropertyV1.updateEntity({ userId: mongoose_1.Types.ObjectId(hostId) }, { "userData.fbUrl": payload.url }, { multi: true })
                    ]);
                    break;
                case _common_1.ENUM.APPS.INSTAGRAM:
                    await Promise.all([
                        _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(hostId) }, { $set: { instaUrl: payload.url } }),
                        _entity_1.PropertyV1.updateEntity({ userId: mongoose_1.Types.ObjectId(hostId) }, { "userData.instaUrl": payload.url }, { multi: true })
                    ]);
                    break;
                case _common_1.ENUM.APPS.TWITTER:
                    await Promise.all([
                        _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(hostId) }, { $set: { twitterUrl: payload.url } }),
                        _entity_1.PropertyV1.updateEntity({ userId: mongoose_1.Types.ObjectId(hostId) }, { "userData.twitterUrl": payload.url }, { multi: true })
                    ]);
                    break;
                case _common_1.ENUM.APPS.YOUTUBE:
                    await Promise.all([
                        _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(hostId) }, { $set: { youtubeUrl: payload.url } }),
                        _entity_1.PropertyV1.updateEntity({ userId: mongoose_1.Types.ObjectId(hostId) }, { "userData.youtubeUrl": payload.url }, { multi: true })
                    ]);
                    break;
                case _common_1.ENUM.APPS.LINKEDIN:
                    await Promise.all([
                        _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(hostId) }, { $set: { linkedinUrl: payload.url } }),
                        _entity_1.PropertyV1.updateEntity({ userId: mongoose_1.Types.ObjectId(hostId) }, { "userData.linkedinUrl": payload.url }, { multi: true })
                    ]);
                    break;
                case _common_1.ENUM.APPS.GOOGLE_CALENDAR:
                    await _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(hostId) }, { $set: { googleCalendarSyncStatus: false } });
                    break;
                case _common_1.ENUM.APPS.OUTLOOK_CALENDAR:
                    await _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(hostId) }, { $set: { outlookCalendarSyncStatus: false } });
                    break;
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
    async removeConnectedApps(req, res, next) {
        try {
            let hostId = res.locals.userId;
            let payload = req.query;
            switch (payload.type) {
                case _common_1.ENUM.APPS.FACEBOOK:
                    await Promise.all([
                        _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(hostId) }, { $unset: { fbUrl: "" } }),
                        _entity_1.PropertyV1.removeMultipleFields({ "userData.userId": mongoose_1.Types.ObjectId(hostId) }, { $unset: { "userData.fbUrl": "" } }, { multi: true })
                    ]);
                    break;
                case _common_1.ENUM.APPS.INSTAGRAM:
                    await Promise.all([
                        _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(hostId) }, { $unset: { instaUrl: "" } }),
                        _entity_1.PropertyV1.removeMultipleFields({ "userData.userId": mongoose_1.Types.ObjectId(hostId) }, { $unset: { "userData.instaUrl": "" } }, { multi: true }),
                    ]);
                    break;
                case _common_1.ENUM.APPS.TWITTER:
                    await Promise.all([
                        _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(hostId) }, { $unset: { twitterUrl: "" } }),
                        _entity_1.PropertyV1.removeMultipleFields({ "userData.userId": mongoose_1.Types.ObjectId(hostId) }, { $unset: { "userData.twitterUrl": "" } }, { multi: true })
                    ]);
                    break;
                case _common_1.ENUM.APPS.YOUTUBE:
                    await Promise.all([
                        _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(hostId) }, { $unset: { youtubeUrl: "" } }),
                        _entity_1.PropertyV1.removeMultipleFields({ "userData.userId": mongoose_1.Types.ObjectId(hostId) }, { $unset: { "userData.youtubeUrl": "" } }, { multi: true })
                    ]);
                    break;
                case _common_1.ENUM.APPS.LINKEDIN:
                    await Promise.all([
                        _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(hostId) }, { $unset: { linkedinUrl: "" } }),
                        _entity_1.PropertyV1.removeMultipleFields({ "userData.userId": mongoose_1.Types.ObjectId(hostId) }, { $unset: { "userData.linkedinUrl": "" } }, { multi: true })
                    ]);
                    break;
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
    async completeProfile(req, res, next) {
        try {
            let payload = req.body;
            payload.type = _common_1.ENUM.USER.TYPE.HOST;
            let dataToSave = {};
            if (payload && payload.name)
                dataToSave['name'] = payload.name;
            if (payload && payload.image)
                dataToSave['image'] = payload.image;
            if (payload && payload.countryCode && payload.phoneNo) {
                const existingNumberCheck = await _entity_1.HostV1.findOne({
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
                let existingUser = await _entity_1.HostV1.checkHostAlreadyExists({ email: payload.email });
                if (existingUser && existingUser.length > 0) {
                    if (existingUser[0].email == payload.email && existingUser[0]._id != payload.id)
                        return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).EMAIL_ALREADY_EXISTS);
                }
                dataToSave['email'] = payload.email;
            }
            if (payload && payload.companyType)
                dataToSave['companyType'] = payload.companyType;
            await _entity_1.HostV1.updateEntity({ _id: payload.id }, dataToSave, { new: true });
            return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).PROFILE_UPDATED, {});
        }
        catch (err) {
            next(err);
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
                await _services_1.redisDOA.insertKeyInRedis(parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.email, payload === null || payload === void 0 ? void 0 : payload.user);
            }
            else {
                const encodedUserDetail = jsonwebtoken_1.default.decode(payload === null || payload === void 0 ? void 0 : payload.id_token, { complete: true });
                const userFromRedis = await _services_1.redisDOA.getKeyFromRedis((_f = encodedUserDetail === null || encodedUserDetail === void 0 ? void 0 : encodedUserDetail.payload) === null || _f === void 0 ? void 0 : _f.email);
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
                      window.opener.postMessage(MC_APPLE_SIGNIN_AUTH_VALUES, '${_common_1.WEB_PANELS.HOST_PANEL_PROD}/account/login');
                      window.close();
                        }
            </script>`);
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
    async updateAppleAppAuth(req, res, next) {
        var _a, _b, _c, _d, _e, _f;
        try {
            let payload = req.body;
            let response = {};
            if (payload === null || payload === void 0 ? void 0 : payload.email) {
                const encodedUserDetail = jsonwebtoken_1.default.decode(payload === null || payload === void 0 ? void 0 : payload.identityToken, { complete: true });
                response['fullName'] = (payload === null || payload === void 0 ? void 0 : payload.fullName) ? payload === null || payload === void 0 ? void 0 : payload.fullName : "";
                response['familyName'] = (payload === null || payload === void 0 ? void 0 : payload.familyName) ? payload === null || payload === void 0 ? void 0 : payload.familyName : "";
                response['givenName'] = (payload === null || payload === void 0 ? void 0 : payload.givenName) ? payload === null || payload === void 0 ? void 0 : payload.givenName : "";
                response['email'] = (_a = encodedUserDetail === null || encodedUserDetail === void 0 ? void 0 : encodedUserDetail.payload) === null || _a === void 0 ? void 0 : _a.email;
                response['appleId'] = (_b = encodedUserDetail === null || encodedUserDetail === void 0 ? void 0 : encodedUserDetail.payload) === null || _b === void 0 ? void 0 : _b.sub;
                response['isAppleLogin'] = true;
                await _services_1.redisDOA.insertKeyInRedis((_c = encodedUserDetail === null || encodedUserDetail === void 0 ? void 0 : encodedUserDetail.payload) === null || _c === void 0 ? void 0 : _c.email, JSON.stringify(response));
            }
            else {
                const encodedUserDetail = jsonwebtoken_1.default.decode(payload === null || payload === void 0 ? void 0 : payload.identityToken, { complete: true });
                const userFromRedis = await _services_1.redisDOA.getKeyFromRedis((_d = encodedUserDetail === null || encodedUserDetail === void 0 ? void 0 : encodedUserDetail.payload) === null || _d === void 0 ? void 0 : _d.email);
                if (userFromRedis) {
                    const parsedUserDetail = JSON.parse(userFromRedis);
                    response['fullName'] = (parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.fullName) ? parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.fullName : "";
                    response['familyName'] = (parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.familyName) ? parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.familyName : "";
                    response['givenName'] = (parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.givenName) ? parsedUserDetail === null || parsedUserDetail === void 0 ? void 0 : parsedUserDetail.givenName : "";
                    response['email'] = (_e = encodedUserDetail === null || encodedUserDetail === void 0 ? void 0 : encodedUserDetail.payload) === null || _e === void 0 ? void 0 : _e.email;
                    response['appleId'] = (_f = encodedUserDetail === null || encodedUserDetail === void 0 ? void 0 : encodedUserDetail.payload) === null || _f === void 0 ? void 0 : _f.sub;
                    response['isAppleLogin'] = true;
                }
            }
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
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
                console.info(`userInfo`, response);
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
    async deleteHostAccount(req, res, next) {
        var _a;
        try {
            let userId = mongoose_1.Types.ObjectId(res.locals.userId);
            await Promise.all([
                _entity_1.HostV1.updateOne({ _id: userId }, { status: _common_1.ENUM.USER.STATUS.ISDELETE }),
                _entity_1.HostV1.removePreviousSession(res.locals.userSessionId, false)
            ]);
            let [bookingData] = await Promise.all([
                _entity_1.BookingV1.findMany({
                    hostId: userId,
                    bookingStatus: _common_1.ENUM.BOOKING.STATUS.UPCOMING,
                }),
                _entity_1.BookingV1.updateManyDocument({
                    hostId: userId,
                    bookingStatus: _common_1.ENUM.BOOKING.STATUS.UPCOMING
                }, {
                    bookingStatus: _common_1.ENUM.BOOKING.STATUS.CANCELLED,
                    "propertyData.status": _common_1.ENUM.USER.STATUS.ISDELETE,
                    "propertyData.hostName": "User Deleted",
                    "propertyData.hostImage": "NA",
                    "propertyData.hostEmail": "NA",
                    cancelledBy: _common_1.ENUM.USER.TYPE.HOST,
                    "propertyData.hostStatus": _common_1.ENUM.USER.STATUS.ISDELETE
                }),
                _entity_1.BookingV1.updateManyDocument({
                    hostId: userId,
                    bookingStatus: {
                        $in: [
                            _common_1.ENUM.BOOKING.STATUS.CANCELLED,
                            _common_1.ENUM.BOOKING.STATUS.REJECTED,
                            _common_1.ENUM.BOOKING.STATUS.COMPLETED
                        ]
                    }
                }, {
                    "propertyData.status": _common_1.ENUM.USER.STATUS.ISDELETE,
                    "propertyData.hostName": "User Deleted",
                    "propertyData.hostImage": "NA",
                    "propertyData.hostEmail": "NA",
                    "propertyData.hostStatus": _common_1.ENUM.USER.STATUS.ISDELETE
                }),
                _entity_1.BookingV1.updateManyDocument({
                    hostId: userId,
                    bookingStatus: _common_1.ENUM.BOOKING.STATUS.ONGOING
                }, {
                    "propertyData.hostStatus": _common_1.ENUM.USER.STATUS.ISDELETE
                }),
                _entity_1.PropertyV1.updateManyDocument({ userId: userId }, { status: _common_1.ENUM.PROPERTY.STATUS.ISDELETE })
            ]);
            for (let i = 0; i < (bookingData === null || bookingData === void 0 ? void 0 : bookingData.length); i++) {
                _entity_1.HostV1.initiateRefund((_a = bookingData[i]) === null || _a === void 0 ? void 0 : _a._id, bookingData[i]);
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
            let existingUser = await _entity_1.HostV1.checkHostAlreadyExists(payload);
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
        description: "Host SignUp",
        path: '/signup',
        parameters: {
            body: {
                description: 'Body for signup',
                required: true,
                model: 'ReqAddHost'
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
], HostClass.prototype, "hostSignUp", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Host Resend Otp",
        path: '/resendOtp',
        parameters: {
            body: {
                description: 'Body for resend Otp',
                required: true,
                model: 'ReqHostResendOtp'
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
], HostClass.prototype, "hostResendOtp", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Host Verify Otp",
        path: '/verifyOtp',
        parameters: {
            body: {
                description: 'Body for verify otp',
                required: true,
                model: 'ReqHostVerifyOtp'
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
], HostClass.prototype, "VerifyOtp", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Host Login",
        path: '/login',
        parameters: {
            body: {
                description: 'Body for Host login',
                required: true,
                model: 'HostLogin'
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
], HostClass.prototype, "userLogin", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Host Social Login",
        path: '/socialLogin',
        parameters: {
            body: {
                description: 'Body social login',
                required: true,
                model: 'ReqHostSocialLogin'
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
], HostClass.prototype, "hostSocialLogin", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "Host Reset Password",
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
], HostClass.prototype, "verificationEmailLink", null);
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
], HostClass.prototype, "verifyEmail", null);
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
], HostClass.prototype, "forgetPasswordEmail", null);
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
], HostClass.prototype, "VerifyResetOtp", null);
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
], HostClass.prototype, "verifyResetToken", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "User Reset Password",
        path: '/resetPassword',
        parameters: {
            body: {
                description: 'Body for verify otp',
                required: true,
                model: 'ReqHostResetPassword'
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
], HostClass.prototype, "resetPassword", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Host View Profile",
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
], HostClass.prototype, "myProfile", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Host change Password",
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
], HostClass.prototype, "changePassword", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "Host logout",
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
], HostClass.prototype, "logout", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Host Companty Detail",
        path: '/companyDetail',
        parameters: {
            body: {
                description: 'Body for verify otp',
                required: true,
                model: 'ReqAddHostCompanyDetail'
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
], HostClass.prototype, "hostCompanyDetail", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Host Update Profile",
        path: '/updateProfile',
        parameters: {
            body: {
                description: 'Body for verify otp',
                required: true,
                model: 'ReqUpdaateHostProfile'
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
], HostClass.prototype, "updateHostProfile", null);
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
], HostClass.prototype, "getCompanyDetail", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "Host Companty Detail update",
        path: '/companyDetail',
        parameters: {
            body: {
                description: 'Body for verify otp',
                required: true,
                model: 'ReqUpdateHostCompanyDetailModel'
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
], HostClass.prototype, "hostCompanyDetailUpdate", null);
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
], HostClass.prototype, "getCountries", null);
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
], HostClass.prototype, "getStates", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get states",
        path: '/addProperty/getStates/{countryId}',
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
], HostClass.prototype, "getPropertyStates", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get states",
        path: '/addProperty/getCities/{stateId}',
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
], HostClass.prototype, "getPropertyCities", null);
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
], HostClass.prototype, "getCities", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Host Reset Password",
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
], HostClass.prototype, "checkEmailExists", null);
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
], HostClass.prototype, "changePhoneNo", null);
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
], HostClass.prototype, "VerifyNewPhoneNoOtp", null);
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
], HostClass.prototype, "checkPhoneExists", null);
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
], HostClass.prototype, "sendOtp", null);
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
], HostClass.prototype, "deleteAccount", null);
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
], HostClass.prototype, "getAllCountries", null);
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
], HostClass.prototype, "getAllCities", null);
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
], HostClass.prototype, "getAllStates", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Client listing",
        path: '/client/listing',
        parameters: {
            query: {
                page: {
                    description: '1',
                    required: false,
                },
                limit: {
                    description: '10',
                    required: false,
                },
                search: {
                    description: 'searchkey',
                    required: false,
                },
                sortBy: {
                    description: 'name/booking/cancellation',
                    required: false,
                },
                minAmount: {
                    description: '1',
                    required: false,
                },
                maxAmount: {
                    description: '1',
                    required: false,
                },
                type: {
                    description: 'booking/cancellation',
                    required: false,
                },
                abondendBooking: {
                    description: 'booking/cancellation',
                    required: false,
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
], HostClass.prototype, "getClientListing", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Host Resend Otp",
        path: '/client/deleted',
        parameters: {
            body: {
                description: 'Body for resend Otp',
                required: true,
                model: 'ReqHostDeleteClientModel'
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
], HostClass.prototype, "deletedClient", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Host update device token",
        path: '/deviceToken',
        parameters: {
            body: {
                description: 'Body for device token',
                required: true,
                model: 'ReqUpdateDeviceToken'
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
], HostClass.prototype, "updateDeviceToken", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Host Update Profile",
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
], HostClass.prototype, "completeProfile", null);
HostClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/host",
        name: "Host Onboarding Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], HostClass);
exports.HostController = new HostClass();
//# sourceMappingURL=host.controller.js.map