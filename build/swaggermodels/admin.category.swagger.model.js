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
exports.ReqUpdateCommission = exports.ReqUpdateCategoryModel = exports.ReqAddCategoryModel = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
let ReqAddCategoryModel = class ReqAddCategoryModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "parentId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: ''
    }),
    __metadata("design:type", String)
], ReqAddCategoryModel.prototype, "parentId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Category 1'
    }),
    __metadata("design:type", String)
], ReqAddCategoryModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "description",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Description of the category'
    }),
    __metadata("design:type", String)
], ReqAddCategoryModel.prototype, "description", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "image url",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'https://image.flaticon.com/icons/svg/748/748151.svg'
    }),
    __metadata("design:type", String)
], ReqAddCategoryModel.prototype, "iconImage", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "[]",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: ['a', 'b']
    }),
    __metadata("design:type", Array)
], ReqAddCategoryModel.prototype, "options", void 0);
ReqAddCategoryModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Category Add",
        name: "ReqAddCategory"
    })
], ReqAddCategoryModel);
exports.ReqAddCategoryModel = ReqAddCategoryModel;
let ReqUpdateCategoryModel = class ReqUpdateCategoryModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'mongoid'
    }),
    __metadata("design:type", String)
], ReqUpdateCategoryModel.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Category 1'
    }),
    __metadata("design:type", String)
], ReqUpdateCategoryModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "description",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Description of the category'
    }),
    __metadata("design:type", String)
], ReqUpdateCategoryModel.prototype, "description", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "image url",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'https://image.flaticon.com/icons/svg/748/748151.svg'
    }),
    __metadata("design:type", String)
], ReqUpdateCategoryModel.prototype, "iconImage", void 0);
ReqUpdateCategoryModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Amenities Update",
        name: "ReqUpdateCategory"
    })
], ReqUpdateCategoryModel);
exports.ReqUpdateCategoryModel = ReqUpdateCategoryModel;
let ReqUpdateCommission = class ReqUpdateCommission {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "hostId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'mongo id'
    }),
    __metadata("design:type", String)
], ReqUpdateCommission.prototype, "hostId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "commissionAmount",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 10
    }),
    __metadata("design:type", Number)
], ReqUpdateCommission.prototype, "commissionAmount", void 0);
ReqUpdateCommission = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Update commission percentage",
        name: "ReqUpdateCommission"
    })
], ReqUpdateCommission);
exports.ReqUpdateCommission = ReqUpdateCommission;
//# sourceMappingURL=admin.category.swagger.model.js.map