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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReqAdminAddTaxesModel = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
let ReqAdminAddTaxesModel = class ReqAdminAddTaxesModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryid",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 101
    }),
    __metadata("design:type", Number)
], ReqAdminAddTaxesModel.prototype, "countryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "number",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 10
    }),
    __metadata("design:type", Number)
], ReqAdminAddTaxesModel.prototype, "tax", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "level",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqAdminAddTaxesModel.prototype, "level", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "state",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: ['mongoid']
    }),
    __metadata("design:type", Array)
], ReqAdminAddTaxesModel.prototype, "state", void 0);
ReqAdminAddTaxesModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Admin Taxes",
        name: "ReqAdminAddTaxesModel"
    })
], ReqAdminAddTaxesModel);
exports.ReqAdminAddTaxesModel = ReqAdminAddTaxesModel;
//# sourceMappingURL=admin.taxes.swagger.model.js.map