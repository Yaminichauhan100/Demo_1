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
exports.CancellationPolicyController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _common_1 = require("@common");
const _entity_1 = require("@entity");
let CancellationPolicyClass = class CancellationPolicyClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async addPolicies(req, res, next) {
        try {
            let payload = req.body;
            await _entity_1.CancellationPolicyV1.create(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            next(err);
        }
    }
    async getPolicies(req, res, next) {
        try {
            let payload = req.params;
            let data = await _entity_1.CancellationPolicyV1.getCancellationPolicy(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
    async getAllPolicies(req, res, next) {
        try {
            let payload = req.query;
            let data = await _entity_1.CancellationPolicyV1.getAllCancellationPolicy(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Add cancellation policies",
        path: '',
        parameters: {
            body: {
                description: 'Body for add cancellation policy',
                required: true,
                model: 'ReqAddCancellationModel'
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
], CancellationPolicyClass.prototype, "addPolicies", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get cancellation policies",
        path: '/{id}/{lang}',
        parameters: {
            path: {
                id: {
                    description: 'mongoId',
                    required: true,
                },
                lang: {
                    description: 'En',
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
], CancellationPolicyClass.prototype, "getPolicies", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get all cancellation policies",
        path: '',
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
], CancellationPolicyClass.prototype, "getAllPolicies", null);
CancellationPolicyClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/cancellationPolicy",
        name: "Admin Cancellation Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], CancellationPolicyClass);
exports.CancellationPolicyController = new CancellationPolicyClass();
//# sourceMappingURL=admin.cancellation.policy.controller.js.map