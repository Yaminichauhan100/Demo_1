"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _common_1 = require("@common");
const common_controller_1 = require("../controllers/common.controller");
const multer_1 = __importDefault(require("multer"));
const upload = multer_1.default({ dest: './uploads' }).array('files');
class CommonRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.get('/api/cms', celebrate_1.celebrate({
            body: {
                lang: _common_1.VALIDATION.FAQ.LANG.required(),
                type: _common_1.VALIDATION.TNC.TYPE.required(),
                userType: _common_1.VALIDATION.FAQ.USERTYPE
            }
        }), (req, res, next) => {
            common_controller_1.CommonController.getCmsList(req, res, next);
        });
        this.router.post('/api/contactUs', celebrate_1.celebrate({
            body: {
                name: _common_1.VALIDATION.USER.NAME.required(),
                email: _common_1.VALIDATION.USER.EMAIL,
                companyName: _common_1.VALIDATION.GENERAL.STRING,
                phoneNo: _common_1.VALIDATION.USER.PHONE,
                message: _common_1.VALIDATION.GENERAL.STRING,
                otherMessage: _common_1.VALIDATION.GENERAL.STRING,
                subject: _common_1.VALIDATION.GENERAL.STRING,
                countryCode: _common_1.VALIDATION.GENERAL.STRING
            }
        }), (req, res, next) => {
            common_controller_1.CommonController.createContactUs(req, res, next);
        });
        this.router.get('/api/featuredRating', async (req, res, next) => {
            try {
                await common_controller_1.CommonController.getFeaturedRating(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.post(`/api/uploadFiles`, upload, (req, res, next) => {
            common_controller_1.CommonController.uploadFiles(req, res, next);
        });
        this.router.get('/api/fetchIndex', celebrate_1.celebrate({
            query: {
                userType: _common_1.VALIDATION.GENERAL.NUMBER.valid(Object.values(_common_1.ENUM.USER.TYPE)).required(),
                bookingId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), async (req, res, next) => {
            try {
                await common_controller_1.CommonController.fetchIndexFile(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/api/oAuthSignIn', celebrate_1.celebrate({
            query: {
                userType: _common_1.VALIDATION.GENERAL.NUMBER.valid(Object.values(_common_1.ENUM.USER.TYPE)).required(),
                bookingId: _common_1.VALIDATION.GENERAL.ID.optional()
            }
        }), async (req, res, next) => {
            try {
                await common_controller_1.CommonController.outlookSignIn(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/api/oAuthSignIn/callback', celebrate_1.celebrate({
            query: {
                userType: _common_1.VALIDATION.GENERAL.NUMBER.valid(Object.values(_common_1.ENUM.USER.TYPE)).required(),
                bookingId: _common_1.VALIDATION.GENERAL.ID.optional(),
                code: _common_1.VALIDATION.GENERAL.STRING.required(),
                client_info: _common_1.VALIDATION.GENERAL.STRING.required(),
                userId: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), async (req, res, next) => {
            try {
                await common_controller_1.CommonController.fetchCallbackToken(req, res, next);
            }
            catch (error) {
                console.error(`we have an error ==> ${error}`);
                next(error);
            }
        });
        this.router.get('/api/generateCalendarUrl', celebrate_1.celebrate({
            query: {
                userType: _common_1.VALIDATION.GENERAL.NUMBER.valid(Object.values(_common_1.ENUM.USER.TYPE)).required(),
                bookingId: _common_1.VALIDATION.GENERAL.ID.optional(),
            }
        }), (req, res, next) => {
            common_controller_1.CommonController.generateGoogleCalendarUrl(req, res, next);
        });
        this.router.post('/api/updateProfile', celebrate_1.celebrate({
            body: {
                code: _common_1.VALIDATION.GENERAL.STRING.required(),
                userId: _common_1.VALIDATION.GENERAL.ID.required(),
                type: _common_1.VALIDATION.USER.TYPE.required(),
                bookingId: _common_1.VALIDATION.GENERAL.ID.optional().allow(null)
            }
        }), (req, res, next) => {
            common_controller_1.CommonController.updateProfile(req, res, next);
        });
    }
}
exports.default = new CommonRouteClass('/');
//# sourceMappingURL=common.routes.js.map