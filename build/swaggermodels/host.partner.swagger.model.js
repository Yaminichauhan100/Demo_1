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
exports.ReqEmployeeStatus = exports.ReqPartnerStatus = exports.ReqAddEmployeeDetail = exports.ReqUpdatePartnerDetail = exports.ReqAddPartnerDetail = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
let ReqAddPartnerDetail = class ReqAddPartnerDetail {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'SuperTech'
    }),
    __metadata("design:type", String)
], ReqAddPartnerDetail.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "floor number completely assigned to partner",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [1, 2]
    }),
    __metadata("design:type", String)
], ReqAddPartnerDetail.prototype, "partnerFloors", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'SuperTech'
    }),
    __metadata("design:type", String)
], ReqAddPartnerDetail.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'SuperTech'
    }),
    __metadata("design:type", String)
], ReqAddPartnerDetail.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "lane of partner",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '9ce'
    }),
    __metadata("design:type", String)
], ReqAddPartnerDetail.prototype, "lane1", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "lane2 of Partner",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'sec 58'
    }),
    __metadata("design:type", String)
], ReqAddPartnerDetail.prototype, "lane2", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "zipcode of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '201301'
    }),
    __metadata("design:type", String)
], ReqAddPartnerDetail.prototype, "zipCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Image",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
    }),
    __metadata("design:type", String)
], ReqAddPartnerDetail.prototype, "image", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "email",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'xxx@yopmail.com'
    }),
    __metadata("design:type", String)
], ReqAddPartnerDetail.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "state id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 35
    }),
    __metadata("design:type", Number)
], ReqAddPartnerDetail.prototype, "stateId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "country Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 101
    }),
    __metadata("design:type", Number)
], ReqAddPartnerDetail.prototype, "countryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "city id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: "5e9585a4ba58cf276f66ddfa"
    }),
    __metadata("design:type", String)
], ReqAddPartnerDetail.prototype, "cityId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "city id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: "5e9585a4ba58cf276f66ddfa"
    }),
    __metadata("design:type", String)
], ReqAddPartnerDetail.prototype, "propertyId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "floorDetails",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: [{
                spaceId: "mongoid"
            }]
    }),
    __metadata("design:type", Object)
], ReqAddPartnerDetail.prototype, "floorDetails", void 0);
ReqAddPartnerDetail = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Add Partner",
        name: "ReqAddPartnerDetail"
    })
], ReqAddPartnerDetail);
exports.ReqAddPartnerDetail = ReqAddPartnerDetail;
let ReqUpdatePartnerDetail = class ReqUpdatePartnerDetail {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'SuperTech'
    }),
    __metadata("design:type", String)
], ReqUpdatePartnerDetail.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'SuperTech'
    }),
    __metadata("design:type", String)
], ReqUpdatePartnerDetail.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'SuperTech'
    }),
    __metadata("design:type", String)
], ReqUpdatePartnerDetail.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "lane of partner",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '9ce'
    }),
    __metadata("design:type", String)
], ReqUpdatePartnerDetail.prototype, "lane1", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "lane2 of Partner",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'sec 58'
    }),
    __metadata("design:type", String)
], ReqUpdatePartnerDetail.prototype, "lane2", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "zipcode of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '201301'
    }),
    __metadata("design:type", String)
], ReqUpdatePartnerDetail.prototype, "zipCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Image",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
    }),
    __metadata("design:type", String)
], ReqUpdatePartnerDetail.prototype, "image", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "email",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'partner mongo id'
    }),
    __metadata("design:type", String)
], ReqUpdatePartnerDetail.prototype, "partnerId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "state id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 35
    }),
    __metadata("design:type", Number)
], ReqUpdatePartnerDetail.prototype, "stateId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "country Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 101
    }),
    __metadata("design:type", Number)
], ReqUpdatePartnerDetail.prototype, "countryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "city id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: "5e9585a4ba58cf276f66ddfa"
    }),
    __metadata("design:type", String)
], ReqUpdatePartnerDetail.prototype, "cityId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "city id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: "5e9585a4ba58cf276f66ddfa"
    }),
    __metadata("design:type", String)
], ReqUpdatePartnerDetail.prototype, "propertyId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "floorDetails",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: [{
                spaceId: "mongoid",
                employeeUnits: 2
            }]
    }),
    __metadata("design:type", Object)
], ReqUpdatePartnerDetail.prototype, "floorDetails", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "floor number completely assigned to partner",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [1, 2]
    }),
    __metadata("design:type", String)
], ReqUpdatePartnerDetail.prototype, "partnerFloors", void 0);
ReqUpdatePartnerDetail = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Update Partner",
        name: "ReqUpdatePartnerDetail"
    })
], ReqUpdatePartnerDetail);
exports.ReqUpdatePartnerDetail = ReqUpdatePartnerDetail;
let ReqAddEmployeeDetail = class ReqAddEmployeeDetail {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'SuperTech'
    }),
    __metadata("design:type", String)
], ReqAddEmployeeDetail.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'SuperTech'
    }),
    __metadata("design:type", String)
], ReqAddEmployeeDetail.prototype, "countryCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'SuperTech'
    }),
    __metadata("design:type", String)
], ReqAddEmployeeDetail.prototype, "phoneNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'SuperTech'
    }),
    __metadata("design:type", String)
], ReqAddEmployeeDetail.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Image",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
    }),
    __metadata("design:type", String)
], ReqAddEmployeeDetail.prototype, "image", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "email",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'partner mongo id'
    }),
    __metadata("design:type", String)
], ReqAddEmployeeDetail.prototype, "partnerId", void 0);
ReqAddEmployeeDetail = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Update Partner",
        name: "ReqAddEmployeeDetail"
    })
], ReqAddEmployeeDetail);
exports.ReqAddEmployeeDetail = ReqAddEmployeeDetail;
let ReqPartnerStatus = class ReqPartnerStatus {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Property space Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'property space Id'
    }),
    __metadata("design:type", String)
], ReqPartnerStatus.prototype, "partnerId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "type",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'active/inactive'
    }),
    __metadata("design:type", String)
], ReqPartnerStatus.prototype, "type", void 0);
ReqPartnerStatus = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Add Property",
        name: "ReqPartnerStatus"
    })
], ReqPartnerStatus);
exports.ReqPartnerStatus = ReqPartnerStatus;
let ReqEmployeeStatus = class ReqEmployeeStatus {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Property space Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'property space Id'
    }),
    __metadata("design:type", String)
], ReqEmployeeStatus.prototype, "employeeId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "type",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'active/inactive'
    }),
    __metadata("design:type", String)
], ReqEmployeeStatus.prototype, "type", void 0);
ReqEmployeeStatus = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Add Property",
        name: "ReqEmployeeStatus"
    })
], ReqEmployeeStatus);
exports.ReqEmployeeStatus = ReqEmployeeStatus;
//# sourceMappingURL=host.partner.swagger.model.js.map