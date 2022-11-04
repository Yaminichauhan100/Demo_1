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
exports.ReqUpdatePriceModel = exports.ReqAddPriceModel = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
let ReqAddPriceModel = class ReqAddPriceModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "cityId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'cityId'
    }),
    __metadata("design:type", String)
], ReqAddPriceModel.prototype, "cityId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "cityId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'cityId'
    }),
    __metadata("design:type", String)
], ReqAddPriceModel.prototype, "countryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "cityId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'cityId'
    }),
    __metadata("design:type", String)
], ReqAddPriceModel.prototype, "stateId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "cityId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'cityId'
    }),
    __metadata("design:type", String)
], ReqAddPriceModel.prototype, "categoryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "cityId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'cityId'
    }),
    __metadata("design:type", String)
], ReqAddPriceModel.prototype, "subCategoryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "cityId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: {
            1: {
                daily: 100,
                weekly: 100,
                monthly: 100
            },
            2: {
                daily: 100,
                weekly: 100,
                monthly: 100
            },
            3: {
                daily: 100,
                weekly: 100,
                monthly: 100
            },
        }
    }),
    __metadata("design:type", Object)
], ReqAddPriceModel.prototype, "slotType", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "lang",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 50
    }),
    __metadata("design:type", Number)
], ReqAddPriceModel.prototype, "listingPlacement", void 0);
ReqAddPriceModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "FAQ ADD",
        name: "ReqAddPriceModel"
    })
], ReqAddPriceModel);
exports.ReqAddPriceModel = ReqAddPriceModel;
let ReqUpdatePriceModel = class ReqUpdatePriceModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "cityId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'id'
    }),
    __metadata("design:type", String)
], ReqUpdatePriceModel.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "cityId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: {
            1: {
                daily: 100,
                weekly: 100,
                monthly: 100
            },
            2: {
                daily: 100,
                weekly: 100,
                monthly: 100
            },
            3: {
                daily: 100,
                weekly: 100,
                monthly: 100
            },
        }
    }),
    __metadata("design:type", Object)
], ReqUpdatePriceModel.prototype, "slotType", void 0);
ReqUpdatePriceModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "FAQ ADD",
        name: "ReqUpdatePriceModel"
    })
], ReqUpdatePriceModel);
exports.ReqUpdatePriceModel = ReqUpdatePriceModel;
//# sourceMappingURL=admin.advprice.swagger.model.js.map