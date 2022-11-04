"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const _baseRoute_1 = __importDefault(require("@baseRoute"));
const _common_1 = require("@common");
const admin_1 = require("../../controllers/admin");
class SubjectRouteClass extends _baseRoute_1.default {
    constructor(path) {
        super();
        this.path = path;
        this.initRoutes();
    }
    get instance() {
        return this.router;
    }
    initRoutes() {
        this.router.post('/', celebrate_1.celebrate({
            body: {
                name: _common_1.VALIDATION.GENERAL.STRING.required(),
                type: _common_1.VALIDATION.GENERAL.NUMBER.required(),
                userType: _common_1.VALIDATION.GENERAL.NUMBER.required(),
            }
        }), (req, res, next) => {
            admin_1.AdminSubjectController.addSubject(req, res, next);
        });
    }
}
exports.default = new SubjectRouteClass('/subject');
//# sourceMappingURL=admin.subject.routes.js.map