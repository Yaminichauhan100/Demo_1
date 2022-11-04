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
exports.ReqUpdateAmenitiesFeatureModel = exports.ReqUpdateAmenitiesModel = exports.ReqAddAmenitiesModel = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
let ReqAddAmenitiesModel = class ReqAddAmenitiesModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Free Wifi'
    }),
    __metadata("design:type", String)
], ReqAddAmenitiesModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Business Industries'
    }),
    __metadata("design:type", String)
], ReqAddAmenitiesModel.prototype, "type", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "image url",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'https://image.flaticon.com/icons/svg/748/748151.svg'
    }),
    __metadata("design:type", String)
], ReqAddAmenitiesModel.prototype, "iconImage", void 0);
ReqAddAmenitiesModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Amenities Add",
        name: "ReqAddAmenities"
    })
], ReqAddAmenitiesModel);
exports.ReqAddAmenitiesModel = ReqAddAmenitiesModel;
let ReqUpdateAmenitiesModel = class ReqUpdateAmenitiesModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'mongoid'
    }),
    __metadata("design:type", String)
], ReqUpdateAmenitiesModel.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Free Wifi'
    }),
    __metadata("design:type", String)
], ReqUpdateAmenitiesModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Business Industries'
    }),
    __metadata("design:type", String)
], ReqUpdateAmenitiesModel.prototype, "type", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "image url",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'https://image.flaticon.com/icons/svg/748/748151.svg'
    }),
    __metadata("design:type", String)
], ReqUpdateAmenitiesModel.prototype, "iconImage", void 0);
ReqUpdateAmenitiesModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Amenities Update",
        name: "ReqUpdateAmenities"
    })
], ReqUpdateAmenitiesModel);
exports.ReqUpdateAmenitiesModel = ReqUpdateAmenitiesModel;
class ReqUpdateAmenitiesFeatureModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'mongoid'
    }),
    __metadata("design:type", String)
], ReqUpdateAmenitiesFeatureModel.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "featured status",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqUpdateAmenitiesFeatureModel.prototype, "isFeatured", void 0);
exports.ReqUpdateAmenitiesFeatureModel = ReqUpdateAmenitiesFeatureModel;
//# sourceMappingURL=admin.amenities.swagger.model.js.map