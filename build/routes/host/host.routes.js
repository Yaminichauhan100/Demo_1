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
const _services_1 = require("@services");
class V1HostRouteClass extends _baseRoute_1.default {
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
                subscribeEmail: _common_1.VALIDATION.GENERAL.BOOLEAN.allow("", null)
            }
        }), (req, res, next) => {
            _controllers_1.HostController.hostSignUp(req, res, next);
        });
        this.router.put('/resendOtp', celebrate_1.celebrate({
            body: {
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE.required(),
                phoneNo: _common_1.VALIDATION.USER.PHONE.required(),
            }
        }), (req, res, next) => {
            _controllers_1.HostController.hostResendOtp(req, res, next);
        });
        this.router.post('/verifyOtp', celebrate_1.celebrate({
            body: {
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE.required(),
                phoneNo: _common_1.VALIDATION.USER.PHONE.required(),
                otp: _common_1.VALIDATION.USER.OTP.required(),
                device: _common_1.VALIDATION.USER.DEVICE
            },
            headers: _services_1.authorizationHeaderObj
        }), (req, res, next) => {
            _controllers_1.HostController.VerifyOtp(req, res, next);
        });
        this.router.post('/login', celebrate_1.celebrate({
            body: {
                email: _common_1.VALIDATION.USER.EMAIL.required(),
                password: _common_1.VALIDATION.USER.PASSWORD.required(),
                device: _common_1.VALIDATION.USER.DEVICE
            }
        }), (req, res, next) => {
            _controllers_1.HostController.userLogin(req, res, next);
        });
        this.router.patch('/verificationEmailLink/:email', celebrate_1.celebrate({
            params: {
                email: _common_1.VALIDATION.USER.EMAIL.required(),
            }
        }), (req, res, next) => {
            _controllers_1.HostController.verificationEmailLink(req, res, next);
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
            _controllers_1.HostController.hostSocialLogin(req, res, next);
        });
        this.router.get('/verifyEmail/:emailVerificationToken', celebrate_1.celebrate({
            params: {
                emailVerificationToken: _common_1.VALIDATION.USER.RESET_TOKEN.required(),
            }
        }), (req, res, next) => {
            _controllers_1.HostController.verifyEmail(req, res, next);
        });
        this.router.put('/forgetPasswordEmail', celebrate_1.celebrate({
            body: {
                email: _common_1.VALIDATION.USER.EMAIL.required(),
            }
        }), (req, res, next) => {
            _controllers_1.HostController.forgetPasswordEmail(req, res, next);
        });
        this.router.post('/verifyResetOtp', celebrate_1.celebrate({
            body: {
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE.required(),
                phoneNo: _common_1.VALIDATION.USER.PHONE.required(),
                otp: _common_1.VALIDATION.USER.OTP.required()
            }
        }), (req, res, next) => {
            _controllers_1.HostController.VerifyResetOtp(req, res, next);
        });
        this.router.post('/linkedInAuth', celebrate_1.celebrate({
            body: {
                authToken: _common_1.VALIDATION.GENERAL.STRING.required(),
                redirectURI: _common_1.VALIDATION.GENERAL.STRING.required()
            }
        }), (req, res, next) => {
            _controllers_1.HostController.updateLinkedInSignIn(req, res, next);
        });
        this.router.post('/appleAuth', (req, res, next) => {
            _controllers_1.HostController.updateAppleAuth(req, res, next);
        });
        this.router.post('/appleAppAuth', (req, res, next) => {
            _controllers_1.HostController.updateAppleAppAuth(req, res, next);
        });
        this.router.get('/verifyResetToken/:resetPasswordToken', celebrate_1.celebrate({
            params: {
                resetPasswordToken: _common_1.VALIDATION.USER.RESET_TOKEN.required(),
            }
        }), (req, res, next) => {
            _controllers_1.HostController.verifyResetToken(req, res, next);
        });
        this.router.put('/resetPassword', celebrate_1.celebrate({
            body: {
                resetPasswordToken: _common_1.VALIDATION.USER.RESET_TOKEN.required(),
                password: _common_1.VALIDATION.USER.PASSWORD.required()
            }
        }), (req, res, next) => {
            _controllers_1.HostController.resetPassword(req, res, next);
        });
        this.router.get('/myProfile', _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.myProfile(req, res, next);
        });
        this.router.put('/changePassword', celebrate_1.celebrate({
            body: {
                oldPassword: _common_1.VALIDATION.USER.PASSWORD.required(),
                newPassword: _common_1.VALIDATION.USER.PASSWORD.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.changePassword(req, res, next);
        });
        this.router.patch('/logout', _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.logout(req, res, next);
        });
        this.router.post('/companyDetail', celebrate_1.celebrate({
            body: {
                countryCode: _common_1.VALIDATION.HOST_COMPANY_DETAILS.COUNTRY_CODE,
                phoneNo: _common_1.VALIDATION.HOST_COMPANY_DETAILS.PHONE,
                name: _common_1.VALIDATION.HOST_COMPANY_DETAILS.NAME,
                email: _common_1.VALIDATION.HOST_COMPANY_DETAILS.EMAIL,
                houseNo: _common_1.VALIDATION.HOST_COMPANY_DETAILS.HOUSE_NUMBER,
                street: _common_1.VALIDATION.HOST_COMPANY_DETAILS.STREET,
                landmark: _common_1.VALIDATION.HOST_COMPANY_DETAILS.LANDMARK,
                zipCode: _common_1.VALIDATION.HOST_COMPANY_DETAILS.ZIP_CODE,
                taxNo: _common_1.VALIDATION.HOST_COMPANY_DETAILS.TAX_NUMBER,
                regNo: _common_1.VALIDATION.HOST_COMPANY_DETAILS.REGISTRATION_NUMBER,
                documents: _common_1.VALIDATION.HOST_COMPANY_DETAILS.DOCUMENT,
                profilePicture: _common_1.VALIDATION.HOST_COMPANY_DETAILS.PROFILE_PICTURE,
                stateId: _common_1.VALIDATION.HOST_COMPANY_DETAILS.STATE_ID,
                countryId: _common_1.VALIDATION.HOST_COMPANY_DETAILS.COUNTRY_ID,
                address: _common_1.VALIDATION.HOST_COMPANY_DETAILS.STREET,
                cityId: _common_1.VALIDATION.HOST_COMPANY_DETAILS.ID,
                tncAgreed: _common_1.VALIDATION.HOST_COMPANY_DETAILS.tnc
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.hostCompanyDetail(req, res, next);
        });
        this.router.put('/updateProfile', celebrate_1.celebrate({
            body: {
                name: _common_1.VALIDATION.USER.NAME,
                dob: _common_1.VALIDATION.USER.DOB,
                bio: _common_1.VALIDATION.USER.BIO,
                image: _common_1.VALIDATION.USER.IMAGE,
                address: _common_1.VALIDATION.USER.address,
                fbUrl: _common_1.VALIDATION.GENERAL.STRING,
                twitterUrl: _common_1.VALIDATION.GENERAL.STRING,
                linkedinUrl: _common_1.VALIDATION.GENERAL.STRING,
                instaUrl: _common_1.VALIDATION.GENERAL.STRING,
                youtubeUrl: _common_1.VALIDATION.GENERAL.STRING,
                slackUrl: _common_1.VALIDATION.GENERAL.STRING.uri(),
                company: {
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
                    taxNo: _common_1.VALIDATION.HOST_COMPANY_DETAILS.TAX_NUMBER,
                    tncAgreed: _common_1.VALIDATION.HOST_COMPANY_DETAILS.tnc
                }
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.updateHostProfile(req, res, next);
        });
        this.router.get('/companyDetail', _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.getCompanyDetail(req, res, next);
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
                taxNo: _common_1.VALIDATION.HOST_COMPANY_DETAILS.TAX_NUMBER,
                tncAgreed: _common_1.VALIDATION.HOST_COMPANY_DETAILS.tnc
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.hostCompanyDetailUpdate(req, res, next);
        });
        this.router.get('/getCountries', _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.getCountries(req, res, next);
        });
        this.router.get('/getStates/:countryId', celebrate_1.celebrate({
            params: {
                countryId: _common_1.VALIDATION.USER.COUNTRYID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.getStates(req, res, next);
        });
        this.router.get('/addProperty/getStates/:countryId', celebrate_1.celebrate({
            params: {
                countryId: _common_1.VALIDATION.USER.COUNTRYID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.getPropertyStates(req, res, next);
        });
        this.router.get('/getCities/:stateId', celebrate_1.celebrate({
            params: {
                stateId: _common_1.VALIDATION.USER.STATE_ID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.getCities(req, res, next);
        });
        this.router.get('/addProperty/getCities/:stateId', celebrate_1.celebrate({
            params: {
                stateId: _common_1.VALIDATION.USER.STATE_ID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.getPropertyCities(req, res, next);
        });
        this.router.get('/checkEmailExists/:email', celebrate_1.celebrate({
            params: {
                email: _common_1.VALIDATION.USER.EMAIL.required(),
            }
        }), (req, res, next) => {
            _controllers_1.HostController.checkEmailExists(req, res, next);
        });
        this.router.put('/changePhoneNo', celebrate_1.celebrate({
            body: {
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE.required(),
                phoneNo: _common_1.VALIDATION.USER.PHONE.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.changePhoneNo(req, res, next);
        });
        this.router.put('/verifyChangePhoneOtp', celebrate_1.celebrate({
            body: {
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE.required(),
                phoneNo: _common_1.VALIDATION.USER.PHONE.required(),
                otp: _common_1.VALIDATION.USER.OTP.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.VerifyNewPhoneNoOtp(req, res, next);
        });
        this.router.get('/checkPhoneExists/:countryCode/:phoneNo', celebrate_1.celebrate({
            params: {
                countryCode: _common_1.VALIDATION.USER.COUNTRY_CODE.required(),
                phoneNo: _common_1.VALIDATION.USER.PHONE.required(),
            }
        }), (req, res, next) => {
            _controllers_1.HostController.checkPhoneExists(req, res, next);
        });
        this.router.post('/send-otp', _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.HostController.sendOtp(req, res, next);
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
        }), _middlewares_1.default.VerifyHostSession, async (req, res, next) => {
            try {
                await _controllers_1.HostController.deleteAccount(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/getAllCountries', _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.getAllCountries(req, res, next);
        });
        this.router.get('/getAllCities/:stateId', celebrate_1.celebrate({
            params: {
                stateId: _common_1.VALIDATION.USER.STATE_ID.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.getAllCities(req, res, next);
        });
        this.router.get('/getAllStates/:countryId', celebrate_1.celebrate({
            params: {
                countryId: _common_1.VALIDATION.USER.COUNTRYID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.getAllStates(req, res, next);
        });
        this.router.get('/client/listing', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { sortBy: _common_1.VALIDATION.SORT.KEY, minAmount: celebrate_1.Joi.number().min(0).optional(), maxAmount: celebrate_1.Joi.number().min(1).optional(), type: _common_1.VALIDATION.GENERAL.STRING, abondendBooking: _common_1.VALIDATION.PROPERTY.CATEGORY_ID })
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.getClientListing(req, res, next);
        });
        this.router.put('/client/deleted', celebrate_1.celebrate({
            body: {
                userId: _common_1.VALIDATION.GENERAL.ID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.deletedClient(req, res, next);
        });
        this.router.put('/deviceToken', celebrate_1.celebrate({
            body: {
                deviceToken: _common_1.VALIDATION.GENERAL.STRING.allow('').required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.updateDeviceToken(req, res, next);
        });
        this.router.get('/chatRoom', celebrate_1.celebrate({
            query: {
                userId: _common_1.VALIDATION.USER.STATE_ID.required(),
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.checkHostChatRoom(req, res, next);
        });
        this.router.delete('/apps?', celebrate_1.celebrate({
            query: {
                type: _common_1.VALIDATION.GENERAL.NUMBER.valid([
                    _common_1.ENUM.APPS.FACEBOOK,
                    _common_1.ENUM.APPS.INSTAGRAM,
                    _common_1.ENUM.APPS.TWITTER,
                    _common_1.ENUM.APPS.YOUTUBE,
                    _common_1.ENUM.APPS.LINKEDIN
                ]).required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.removeConnectedApps(req, res, next);
        });
        this.router.get('/apps', _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.fetchHostConnectedApps(req, res, next);
        });
        this.router.put('/apps', celebrate_1.celebrate({
            body: {
                type: _common_1.VALIDATION.GENERAL.NUMBER.valid([
                    _common_1.ENUM.APPS.FACEBOOK,
                    _common_1.ENUM.APPS.INSTAGRAM,
                    _common_1.ENUM.APPS.TWITTER,
                    _common_1.ENUM.APPS.YOUTUBE,
                    _common_1.ENUM.APPS.LINKEDIN,
                    _common_1.ENUM.APPS.GOOGLE_CALENDAR,
                    _common_1.ENUM.APPS.OUTLOOK_CALENDAR
                ]).required(),
                url: _common_1.VALIDATION.GENERAL.STRING.trim().required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.updateConnectedApps(req, res, next);
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
            _controllers_1.HostController.completeProfile(req, res, next);
        });
        this.router.put('/deleteAccount', _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.deleteHostAccount(req, res, next);
        });
        this.router.get('/verifyPassword', celebrate_1.celebrate({
            query: {
                password: _common_1.VALIDATION.USER.PASSWORD.required()
            }
        }), _middlewares_1.default.VerifyHostSession, (req, res, next) => {
            _controllers_1.HostController.verifyPassword(req, res, next);
        });
    }
}
exports.default = new V1HostRouteClass('/');
//# sourceMappingURL=host.routes.js.map