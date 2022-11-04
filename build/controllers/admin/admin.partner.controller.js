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
exports.AdminConfigController = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
const _baseController_1 = __importDefault(require("@baseController"));
const _entity_1 = require("@entity");
const _common_1 = require("@common");
const mongoose_1 = require("mongoose");
let AdminConfigClass = class AdminConfigClass extends _baseController_1.default {
    constructor() {
        super();
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
    async addPartnerType(req, res, next) {
        try {
            let payload = req.body;
            let dataToSave = {};
            dataToSave['data.title'] = payload.title;
            dataToSave['type'] = _common_1.ENUM_ARRAY.CONFIG_TYPE.PARTNER_TYPE;
            dataToSave['data.image'] = payload.image;
            await _entity_1.ConfigV1.createOne(dataToSave);
            return this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).PARTNER_CREATED);
        }
        catch (err) {
            console.error("Error", err);
            next(err);
        }
    }
    async updatePartnerType(req, res, next) {
        try {
            let payload = req.body;
            let dataToSave = {};
            dataToSave['data.title'] = payload.title;
            dataToSave['type'] = _common_1.ENUM_ARRAY.CONFIG_TYPE.PARTNER_TYPE;
            dataToSave['data.image'] = payload.image;
            await _entity_1.ConfigV1.updateEntity({ _id: payload.id }, dataToSave, { new: true });
            return this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).PARTNER_CREATED);
        }
        catch (err) {
            console.error("Error", err);
            next(err);
        }
    }
    async removePartner(req, res, next) {
        try {
            let payload = req.params;
            await _entity_1.ConfigV1.remove({ _id: mongoose_1.Types.ObjectId(payload.partnerId) });
            return this.sendResponse(res, _common_1.RESPONSE.ADMIN(res.locals.lang).PARTNER_CREATED);
        }
        catch (err) {
            console.error("Error", err);
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Amenities listing",
        path: '',
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
                id: {
                    description: 'id',
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
], AdminConfigClass.prototype, "partnerList", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Add Patner type",
        path: '',
        parameters: {
            body: {
                description: 'Body for add parenttype',
                required: true,
                model: 'ReqAdminConfigModel'
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
], AdminConfigClass.prototype, "addPartnerType", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Update Partner Type",
        path: '',
        parameters: {
            body: {
                description: 'Body for add amenities',
                required: true,
                model: 'ReqAdminConfigUpdateModel'
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
], AdminConfigClass.prototype, "updatePartnerType", null);
AdminConfigClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/admins/partner",
        name: "Admin partner Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], AdminConfigClass);
exports.AdminConfigController = new AdminConfigClass();
//# sourceMappingURL=admin.partner.controller.js.map