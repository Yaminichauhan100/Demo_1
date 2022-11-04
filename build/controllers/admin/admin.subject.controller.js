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
exports.AdminSubjectController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _common_1 = require("@common");
const _entity_1 = require("@entity");
let AdminSubjectClass = class AdminSubjectClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async addSubject(req, res, next) {
        try {
            let payload = req.body;
            await _entity_1.SubjectV1.updateDocument({ name: payload.name, userType: payload.userType }, Object.assign(Object.assign({}, payload), { status: 'active' }), { upsert: true });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            console.error("Error", err);
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Add Subject",
        path: '',
        parameters: {
            body: {
                description: 'Body for add subject',
                required: true,
                model: 'ReqAdminSubjectModel'
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
], AdminSubjectClass.prototype, "addSubject", null);
AdminSubjectClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/subject",
        name: "Admin Subject Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminSubjectClass);
exports.AdminSubjectController = new AdminSubjectClass();
//# sourceMappingURL=admin.subject.controller.js.map