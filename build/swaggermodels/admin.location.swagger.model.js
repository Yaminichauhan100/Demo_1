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
exports.ReqUpdateCityModel = exports.ReqAddCityModel = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
let ReqAddCityModel = class ReqAddCityModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 101
    }),
    __metadata("design:type", Number)
], ReqAddCityModel.prototype, "countryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "stateId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 38
    }),
    __metadata("design:type", Number)
], ReqAddCityModel.prototype, "stateId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "cityName",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Noida'
    }),
    __metadata("design:type", String)
], ReqAddCityModel.prototype, "cityName", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "image url",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'https://image.flaticon.com/icons/svg/748/748151.svg'
    }),
    __metadata("design:type", String)
], ReqAddCityModel.prototype, "iconImage", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "isFeatured",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "true/false"
    }),
    __metadata("design:type", Boolean)
], ReqAddCityModel.prototype, "isFeatured", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "zipCodes",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [
            '201301'
        ]
    }),
    __metadata("design:type", Array)
], ReqAddCityModel.prototype, "zipCodes", void 0);
ReqAddCityModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "City Add",
        name: "ReqAddCity"
    })
], ReqAddCityModel);
exports.ReqAddCityModel = ReqAddCityModel;
let ReqUpdateCityModel = class ReqUpdateCityModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: ''
    }),
    __metadata("design:type", String)
], ReqUpdateCityModel.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "countryId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 101
    }),
    __metadata("design:type", Number)
], ReqUpdateCityModel.prototype, "countryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "stateId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 38
    }),
    __metadata("design:type", Number)
], ReqUpdateCityModel.prototype, "stateId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "cityName",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Noida'
    }),
    __metadata("design:type", String)
], ReqUpdateCityModel.prototype, "cityName", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "image url",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'https://image.flaticon.com/icons/svg/748/748151.svg'
    }),
    __metadata("design:type", String)
], ReqUpdateCityModel.prototype, "iconImage", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "isFeatured",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "true/false"
    }),
    __metadata("design:type", Boolean)
], ReqUpdateCityModel.prototype, "isFeatured", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "zipCodes",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [
            '201301'
        ]
    }),
    __metadata("design:type", Array)
], ReqUpdateCityModel.prototype, "zipCodes", void 0);
ReqUpdateCityModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "City Add",
        name: "ReqUpdateCity"
    })
], ReqUpdateCityModel);
exports.ReqUpdateCityModel = ReqUpdateCityModel;
//# sourceMappingURL=admin.location.swagger.model.js.map