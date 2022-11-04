"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _middlewares_1 = __importDefault(require("@middlewares"));
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _common_1 = require("@common");
const admin_faqs_controller_1 = require("../../controllers/admin/admin.faqs.controller");
class AdminFaqRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.post('/qna', celebrate_1.celebrate({
            body: {
                question: _common_1.VALIDATION.FAQ.QUESTION,
                answer: _common_1.VALIDATION.FAQ.QUESTION,
                lang: _common_1.VALIDATION.FAQ.QUESTION,
                userType: _common_1.VALIDATION.FAQ.USERTYPE,
                editType: _common_1.VALIDATION.TNC.EDIT_TYPE
            }
        }), (req, res, next) => {
            admin_faqs_controller_1.AdminFaqController.questionAndAnswer(req, res, next);
        });
        this.router.get('/qna', celebrate_1.celebrate({
            query: Object.assign(Object.assign({}, _common_1.VALIDATION.GENERAL.PAGINATION), { lang: _common_1.VALIDATION.FAQ.LANG.required(), sortOrder: _common_1.VALIDATION.GENERAL.NUMBER.allow(1, -1), sortKey: _common_1.VALIDATION.FAQ.SORT_ORDER, userType: _common_1.VALIDATION.FAQ.USERTYPE })
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_faqs_controller_1.AdminFaqController.fetchQuestionAndAnswer(req, res, next);
        });
        this.router.get('/qnaDetails/:id', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_faqs_controller_1.AdminFaqController.questionAndAnswerDetails(req, res, next);
        });
        this.router.patch('/qna', celebrate_1.celebrate({
            body: {
                id: _common_1.VALIDATION.GENERAL.ID,
                lang: _common_1.VALIDATION.FAQ.LANG,
                question: _common_1.VALIDATION.FAQ.QUESTION,
                answer: _common_1.VALIDATION.FAQ.ANSWER,
                editType: _common_1.VALIDATION.TNC.EDIT_TYPE
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_faqs_controller_1.AdminFaqController.EditQuestionAndAnswer(req, res, next);
        });
        this.router.delete('/qna/:id', celebrate_1.celebrate({
            params: {
                id: _common_1.VALIDATION.GENERAL.ID.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_faqs_controller_1.AdminFaqController.DeleteQuestionAndAnswer(req, res, next);
        });
        this.router.post('/cms', celebrate_1.celebrate({
            body: {
                type: _common_1.VALIDATION.TNC.TYPE,
                content: _common_1.VALIDATION.TNC.CONTENT.required(),
                lang: _common_1.VALIDATION.FAQ.QUESTION.required(),
                userType: _common_1.VALIDATION.FAQ.USERTYPE,
                editType: _common_1.VALIDATION.TNC.EDIT_TYPE
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_faqs_controller_1.AdminFaqController.termsAndCondition(req, res, next);
        });
        this.router.get('/cms', celebrate_1.celebrate({
            query: {
                lang: _common_1.VALIDATION.FAQ.LANG.required(),
                type: _common_1.VALIDATION.TNC.TYPE.required(),
                userType: _common_1.VALIDATION.FAQ.USERTYPE,
                editType: _common_1.VALIDATION.TNC.EDIT_TYPE
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_faqs_controller_1.AdminFaqController.fetchTermsAndCondition(req, res, next);
        });
        this.router.get('/cms/list', celebrate_1.celebrate({
            query: {
                page: _common_1.VALIDATION.GENERAL.PAGINATION.page.required(),
                limit: _common_1.VALIDATION.GENERAL.PAGINATION.limit,
                lang: _common_1.VALIDATION.FAQ.LANG.required()
            }
        }), _middlewares_1.default.VerifyAdminSession, (req, res, next) => {
            admin_faqs_controller_1.AdminFaqController.fetchAllTermAndCondition(req, res, next);
        });
    }
}
exports.default = new AdminFaqRouteClass('/faqs');
//# sourceMappingURL=admin.faqs.routes.js.map