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
exports.ReqAddPromotionModel = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
let ReqAddPromotionModel = class ReqAddPromotionModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "propertyId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "mongo id"
    }),
    __metadata("design:type", String)
], ReqAddPromotionModel.prototype, "propertyId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "CategoryId",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "mongo id"
    }),
    __metadata("design:type", String)
], ReqAddPromotionModel.prototype, "categoryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "subCategoryId",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "mongo id"
    }),
    __metadata("design:type", String)
], ReqAddPromotionModel.prototype, "subCategoryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "mongo id"
    }),
    __metadata("design:type", String)
], ReqAddPromotionModel.prototype, "countryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "cityId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "mongo id"
    }),
    __metadata("design:type", String)
], ReqAddPromotionModel.prototype, "cityId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Number",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 10
    }),
    __metadata("design:type", Number)
], ReqAddPromotionModel.prototype, "duration", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "slotType",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqAddPromotionModel.prototype, "slotType", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "price",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 2000
    }),
    __metadata("design:type", Number)
], ReqAddPromotionModel.prototype, "price", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "taxPercentage",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 16
    }),
    __metadata("design:type", Number)
], ReqAddPromotionModel.prototype, "taxPercentage", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "dailyPrice",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 16
    }),
    __metadata("design:type", Number)
], ReqAddPromotionModel.prototype, "dailyPrice", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "tax",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 160
    }),
    __metadata("design:type", Number)
], ReqAddPromotionModel.prototype, "tax", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "totalPrice",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 2500
    }),
    __metadata("design:type", Number)
], ReqAddPromotionModel.prototype, "totalPrice", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "listingType",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqAddPromotionModel.prototype, "listingType", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "promoId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'mongoid'
    }),
    __metadata("design:type", String)
], ReqAddPromotionModel.prototype, "promoId", void 0);
ReqAddPromotionModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: " Add",
        name: "ReqAddPromotionModel"
    })
], ReqAddPromotionModel);
exports.ReqAddPromotionModel = ReqAddPromotionModel;
//# sourceMappingURL=host.promotion.swagger.model.js.map