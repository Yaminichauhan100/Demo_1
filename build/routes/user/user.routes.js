"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _middlewares_1 = __importDefault(require("@middlewares"));
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _common_1 = require("@common");
const _controllers_1 = require("@controllers");
class V1UserRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.post('/signup', celebrate_1.celebrate({
            body: {
                name: _common_1.VALIDATION.USER.NAME.required(),
                email: _common_1.VALIDATION.USER.EMAIL.required(),
                password: _common_1.VALIDATION.USER.PASSWORD.required(),
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE.required(),
                phoneNo: _common_1.VALIDATION.USER.PHONE.required(),
                companyType: _common_1.VALIDATION.USER.COMPANY_TYPE,
                subscribeEmail: _common_1.VALIDATION.GENERAL.BOOLEAN.allow("", null)
            }
        }), (req, res, next) => {
            _controllers_1.UserController.userSignUp(req, res, next);
        });
        this.router.put('/resendOtp', celebrate_1.celebrate({
            body: {
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE.required(),
                phoneNo: _common_1.VALIDATION.USER.PHONE.required(),
            }
        }), (req, res, next) => {
            _controllers_1.UserController.userResendOtp(req, res, next);
        });
        this.router.post('/verifyOtp', celebrate_1.celebrate({
            body: {
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE.required(),
                phoneNo: _common_1.VALIDATION.USER.PHONE.required(),
                otp: _common_1.VALIDATION.USER.OTP.required(),
                device: _common_1.VALIDATION.USER.DEVICE
            }
        }), (req, res, next) => {
            _controllers_1.UserController.VerifyOtp(req, res, next);
        });
        this.router.post('/verifyResetOtp', celebrate_1.celebrate({
            body: {
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE.required(),
                phoneNo: _common_1.VALIDATION.USER.PHONE.required(),
                otp: _common_1.VALIDATION.USER.OTP.required()
            }
        }), (req, res, next) => {
            _controllers_1.UserController.VerifyResetOtp(req, res, next);
        });
        this.router.get('/verifyResetToken/:resetPasswordToken', celebrate_1.celebrate({
            params: {
                resetPasswordToken: _common_1.VALIDATION.USER.RESET_TOKEN.required(),
            }
        }), (req, res, next) => {
            _controllers_1.UserController.verifyResetToken(req, res, next);
        });
        this.router.post('/appleAuth', (req, res, next) => {
            _controllers_1.UserController.updateAppleAuth(req, res, next);
        });
        this.router.post('/appleAppAuth', (req, res, next) => {
            _controllers_1.HostController.updateAppleAppAuth(req, res, next);
        });
        this.router.put('/resetPassword', celebrate_1.celebrate({
            body: {
                resetPasswordToken: _common_1.VALIDATION.USER.RESET_TOKEN.required(),
                password: _common_1.VALIDATION.USER.PASSWORD.required()
            }
        }), (req, res, next) => {
            _controllers_1.UserController.resetPassword(req, res, next);
        });
        this.router.post('/login', celebrate_1.celebrate({
            body: {
                email: _common_1.VALIDATION.USER.EMAIL.required(),
                password: _common_1.VALIDATION.USER.PASSWORD.required(),
                device: _common_1.VALIDATION.USER.DEVICE
            }
        }), (req, res, next) => {
            _controllers_1.UserController.userLogin(req, res, next);
        });
        this.router.post('/linkedInAuth', celebrate_1.celebrate({
            body: {
                authToken: _common_1.VALIDATION.GENERAL.STRING.required(),
                redirectURI: _common_1.VALIDATION.GENERAL.STRING.required()
            }
        }), (req, res, next) => {
            _controllers_1.UserController.updateLinkedInSignIn(req, res, next);
        });
        this.router.post('/pbVerification', (req, res, next) => {
            _controllers_1.UserController.updatePbVerification(req, res, next);
        });
        this.router.post('/slackEvents', (req, res, next) => {
            _controllers_1.UserController.postSlackEvents(req, res, next);
        });
        this.router.get('/verifyEmail/:emailVerificationToken', celebrate_1.celebrate({
            params: {
                emailVerificationToken: _common_1.VALIDATION.USER.RESET_TOKEN.required(),
            }
        }), (req, res, next) => {
            _controllers_1.UserController.verifyEmail(req, res, next);
        });
        this.router.put('/forgetPasswordEmail', celebrate_1.celebrate({
            body: {
                email: _common_1.VALIDATION.USER.EMAIL.required(),
            }
        }), (req, res, next) => {
            _controllers_1.UserController.forgetPasswordEmail(req, res, next);
        });
        this.router.patch('/verificationEmailLink/:email', celebrate_1.celebrate({
            params: {
                email: _common_1.VALIDATION.USER.EMAIL.required(),
            }
        }), (req, res, next) => {
            _controllers_1.UserController.verificationEmailLink(req, res, next);
        });
        this.router.get('/myProfile', _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.myProfile(req, res, next);
        });
        this.router.put('/changePassword', celebrate_1.celebrate({
            body: {
                oldPassword: _common_1.VALIDATION.USER.PASSWORD.required(),
                newPassword: _common_1.VALIDATION.USER.PASSWORD.required(),
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.changePassword(req, res, next);
        });
        this.router.patch('/logout', _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.logout(req, res, next);
        });
        this.router.post('/socialLogin', celebrate_1.celebrate({
            body: {
                socialType: _common_1.VALIDATION.USER.SOCIAL_LOGIN_TYPE,
                socialId: _common_1.VALIDATION.USER.SOCIAL_ID,
                name: _common_1.VALIDATION.USER.NAME,
                email: _common_1.VALIDATION.USER.EMAIL.optional().allow(null, ""),
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE.optional().allow(null, ""),
                phoneNo: _common_1.VALIDATION.USER.PHONE.optional().allow(null, ""),
                image: _common_1.VALIDATION.USER.IMAGE.optional().allow(null, ""),
                device: _common_1.VALIDATION.USER.DEVICE
            }
        }), (req, res, next) => {
            _controllers_1.UserController.userSocialLogin(req, res, next);
        });
        this.router.get('/companyDetail', _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.getCompanyDetail(req, res, next);
        });
        this.router.patch('/companyDetail', celebrate_1.celebrate({
            body: {
                countryCode: _common_1.VALIDATION.HOST_COMPANY_DETAILS.COUNTRY_CODE,
                phoneNo: _common_1.VALIDATION.HOST_COMPANY_DETAILS.PHONE,
                name: _common_1.VALIDATION.HOST_COMPANY_DETAILS.NAME,
                email: _common_1.VALIDATION.HOST_COMPANY_DETAILS.EMAIL,
                houseNo: _common_1.VALIDATION.HOST_COMPANY_DETAILS.HOUSE_NUMBER,
                street: _common_1.VALIDATION.HOST_COMPANY_DETAILS.STREET,
                landmark: _common_1.VALIDATION.HOST_COMPANY_DETAILS.LANDMARK,
                address: _common_1.VALIDATION.HOST_COMPANY_DETAILS.STREET,
                zipCode: _common_1.VALIDATION.HOST_COMPANY_DETAILS.ZIP_CODE,
                regNo: _common_1.VALIDATION.HOST_COMPANY_DETAILS.REGISTRATION_NUMBER,
                documents: _common_1.VALIDATION.HOST_COMPANY_DETAILS.DOCUMENT,
                profilePicture: _common_1.VALIDATION.HOST_COMPANY_DETAILS.PROFILE_PICTURE,
                stateId: _common_1.VALIDATION.HOST_COMPANY_DETAILS.STATE_ID,
                countryId: _common_1.VALIDATION.HOST_COMPANY_DETAILS.COUNTRY_ID,
                cityId: _common_1.VALIDATION.HOST_COMPANY_DETAILS.ID,
                subCompanyType: _common_1.VALIDATION.PROPERTY.FLOOR
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.userCompanyDetailUpdate(req, res, next);
        });
        this.router.get('/getCountries', _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.getCountries(req, res, next);
        });
        this.router.get('/getStates/:countryId', celebrate_1.celebrate({
            params: {
                countryId: _common_1.VALIDATION.USER.COUNTRYID.required(),
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.getStates(req, res, next);
        });
        this.router.get('/getCities/:stateId', celebrate_1.celebrate({
            params: {
                stateId: _common_1.VALIDATION.USER.STATE_ID.required(),
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.getCities(req, res, next);
        });
        this.router.get('/checkEmailExists/:email', celebrate_1.celebrate({
            params: {
                email: _common_1.VALIDATION.USER.EMAIL.required(),
            }
        }), (req, res, next) => {
            _controllers_1.UserController.checkEmailExists(req, res, next);
        });
        this.router.put('/changePhoneNo', celebrate_1.celebrate({
            body: {
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE.required(),
                phoneNo: _common_1.VALIDATION.USER.PHONE.required(),
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.changePhoneNo(req, res, next);
        });
        this.router.put('/verifyChangePhoneOtp', celebrate_1.celebrate({
            body: {
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE.required(),
                phoneNo: _common_1.VALIDATION.USER.PHONE.required(),
                otp: _common_1.VALIDATION.USER.OTP.required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.VerifyNewPhoneNoOtp(req, res, next);
        });
        this.router.get('/checkPhoneExists/:countryCode/:phoneNo', celebrate_1.celebrate({
            params: {
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE.required(),
                phoneNo: _common_1.VALIDATION.USER.PHONE.required(),
            }
        }), (req, res, next) => {
            _controllers_1.UserController.checkPhoneExists(req, res, next);
        });
        this.router.put('/updateProfile', celebrate_1.celebrate({
            body: {
                name: _common_1.VALIDATION.USER.NAME.required(),
                dob: _common_1.VALIDATION.USER.DOB,
                bio: _common_1.VALIDATION.USER.BIO,
                image: _common_1.VALIDATION.USER.IMAGE,
                address: _common_1.VALIDATION.USER.address,
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE,
                phoneNo: _common_1.VALIDATION.USER.PHONE,
                email: _common_1.VALIDATION.USER.EMAIL,
                subCompanyType: _common_1.VALIDATION.GENERAL.NUMBER.valid([
                    _common_1.ENUM.USER.SUB_COMPANY_TYPE.COMPANY,
                    _common_1.ENUM.USER.SUB_COMPANY_TYPE.FREELANCER
                ]),
                company: {
                    countryCode: _common_1.VALIDATION.HOST_COMPANY_DETAILS.COUNTRY_CODE,
                    phoneNo: _common_1.VALIDATION.HOST_COMPANY_DETAILS.PHONE,
                    name: _common_1.VALIDATION.HOST_COMPANY_DETAILS.NAME,
                    email: _common_1.VALIDATION.HOST_COMPANY_DETAILS.EMAIL,
                    houseNo: _common_1.VALIDATION.HOST_COMPANY_DETAILS.HOUSE_NUMBER,
                    street: _common_1.VALIDATION.HOST_COMPANY_DETAILS.STREET,
                    address: _common_1.VALIDATION.HOST_COMPANY_DETAILS.STREET,
                    zipCode: _common_1.VALIDATION.HOST_COMPANY_DETAILS.ZIP_CODE,
                    regNo: _common_1.VALIDATION.HOST_COMPANY_DETAILS.REGISTRATION_NUMBER,
                    documents: _common_1.VALIDATION.HOST_COMPANY_DETAILS.DOCUMENT,
                    profilePicture: _common_1.VALIDATION.HOST_COMPANY_DETAILS.PROFILE_PICTURE,
                    stateId: _common_1.VALIDATION.HOST_COMPANY_DETAILS.STATE_ID,
                    countryId: _common_1.VALIDATION.HOST_COMPANY_DETAILS.COUNTRY_ID,
                    cityId: _common_1.VALIDATION.HOST_COMPANY_DETAILS.ID,
                    taxNo: _common_1.VALIDATION.HOST_COMPANY_DETAILS.TAX_NUMBER
                }
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.updateUserProfile(req, res, next);
        });
        this.router.get('/home', celebrate_1.celebrate({
            query: {
                userId: _common_1.VALIDATION.USER.ID,
            }
        }), async (req, res, next) => {
            try {
                await _controllers_1.UserController.fetchHomeScreen(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.post('/send-otp', _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserController.sendOtp(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.delete('/account/:otp', celebrate_1.celebrate({
            params: {
                otp: _common_1.VALIDATION.USER.OTP.required(),
            }
        }), _middlewares_1.default.VerifyUserSession, async (req, res, next) => {
            try {
                await _controllers_1.UserController.deleteAccount(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/getAllCountries', _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.getAllCountries(req, res, next);
        });
        this.router.put('/deviceToken', celebrate_1.celebrate({
            body: {
                deviceToken: _common_1.VALIDATION.GENERAL.STRING.allow('').required(),
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.updateDeviceToken(req, res, next);
        });
        this.router.get('/getAllCities/:stateId', celebrate_1.celebrate({
            params: {
                stateId: _common_1.VALIDATION.USER.STATE_ID.required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.getAllCities(req, res, next);
        });
        this.router.get('/getAllStates/:countryId', celebrate_1.celebrate({
            params: {
                countryId: _common_1.VALIDATION.USER.COUNTRYID.required(),
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.getAllStates(req, res, next);
        });
        this.router.get('/type', celebrate_1.celebrate({
            query: {
                userId: _common_1.VALIDATION.USER.STATE_ID.required(),
                type: _common_1.VALIDATION.USER.USER_TYPE.required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.checkUserType(req, res, next);
        });
        this.router.get('/chatRoom', celebrate_1.celebrate({
            query: {
                userId: _common_1.VALIDATION.USER.STATE_ID.required(),
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.checkUserChatRoom(req, res, next);
        });
        this.router.get('/deeplink', celebrate_1.celebrate({
            query: {
                type: _common_1.VALIDATION.USER.DEEP_LINK_TYPE.required(),
                shareId: _common_1.VALIDATION.GENERAL.ID,
                name: _common_1.VALIDATION.USER.NAME,
                email: _common_1.VALIDATION.USER.EMAIL,
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE,
                phoneNo: _common_1.VALIDATION.USER.PHONE,
            }
        }), (req, res, next) => {
            _controllers_1.UserController.generateDeepLink(req, res, next);
        });
        this.router.get('/partnerType', celebrate_1.celebrate({
            query: Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION)
        }), (req, res, next) => {
            _controllers_1.UserController.partnerList(req, res, next);
        });
        this.router.put('/completeProfile', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.USER.NAME.required(),
                name: _common_1.VALIDATION.USER.NAME,
                image: _common_1.VALIDATION.USER.IMAGE,
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE,
                phoneNo: _common_1.VALIDATION.USER.PHONE,
                email: _common_1.VALIDATION.USER.EMAIL,
                companyType: _common_1.VALIDATION.USER.COMPANY_TYPE
            }
        }), (req, res, next) => {
            _controllers_1.UserController.completeProfile(req, res, next);
        });
        this.router.get('/generateCalendarUrl', celebrate_1.celebrate({
            query: {
                userType: _common_1.VALIDATION.GENERAL.NUMBER.valid(Object.values(_common_1.ENUM.USER.TYPE)).required(),
            }
        }), (req, res, next) => {
            _controllers_1.UserController.generateGoogleCalendarUrl(req, res, next);
        });
        this.router.put('/calendarSync', celebrate_1.celebrate({
            body: {
                calendarType: _common_1.VALIDATION.GENERAL.NUMBER.valid(Object.values(_common_1.ENUM.USER.CALENDAR_TYPE)).required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.updateCalendarSync(req, res, next);
        });
        this.router.put('/deleteAccount', _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.deleteUserAccount(req, res, next);
        });
        this.router.get('/verifyPassword', celebrate_1.celebrate({
            query: {
                password: _common_1.VALIDATION.USER.PASSWORD.required()
            }
        }), _middlewares_1.default.VerifyUserSession, (req, res, next) => {
            _controllers_1.UserController.verifyPassword(req, res, next);
        });
    }
}
exports.default = new V1UserRouteClass('/');
//# sourceMappingURL=user.routes.js.map