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
exports.ReqAddPropertyDetailModel = exports.ReqValidateFloorModel = exports.ReqValidateEmplyoeeModel = exports.ReqAddHostTAndCModel = exports.UpdateAutoAcceptPropertyModel = exports.UpdateHolidayModel = exports.AddHolidayModel = exports.ChangeStatusModel = exports.ReqBookingStatus = exports.ReqCancelSpaceBookingHostModel = exports.ReqPropertyStatus = exports.ReqAddRecentCity = exports.ReqUpdateHostPropertyDetailModel = exports.ReqAddHostPropertyDetailModel = exports.ReqUpdatePropertySpaceModel = exports.ReqAddPropertySpaceModel = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
let ReqAddPropertySpaceModel = class ReqAddPropertySpaceModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "0 or 1",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqAddPropertySpaceModel.prototype, "isOfferPrice", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "capacity",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqAddPropertySpaceModel.prototype, "capacity", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "units",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqAddPropertySpaceModel.prototype, "units", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "units",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqAddPropertySpaceModel.prototype, "dailyPrice", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "units",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqAddPropertySpaceModel.prototype, "monthlyPrice", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "units",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqAddPropertySpaceModel.prototype, "yearlyPrice", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "units",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqAddPropertySpaceModel.prototype, "hourlyPrice", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "array of subCategoryIds",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "5e8b27c54e91350fe6ae69da"
    }),
    __metadata("design:type", String)
], ReqAddPropertySpaceModel.prototype, "subCategoryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "array of categoryIds",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "5e8b27c54e91350fe6ae69da"
    }),
    __metadata("design:type", String)
], ReqAddPropertySpaceModel.prototype, "categoryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "spaceId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: "1234"
    }),
    __metadata("design:type", String)
], ReqAddPropertySpaceModel.prototype, "spaceId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "propertyId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: "5e8b27c54e91350fe6ae69da"
    }),
    __metadata("design:type", String)
], ReqAddPropertySpaceModel.prototype, "propertyId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "documents of company",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [
            'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
        ]
    }),
    __metadata("design:type", Array)
], ReqAddPropertySpaceModel.prototype, "images", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "documents of company",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [
            'add coffee machine'
        ]
    }),
    __metadata("design:type", Array)
], ReqAddPropertySpaceModel.prototype, "include", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "offer pricing",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [{
                seasonName: 'Season 1',
                startDate: '2020-04-22T01:20:52.073+05:30',
                endDate: '2020-04-22T01:20:52.073+05:30',
                priceDetails: [
                    {
                        discountLabelType: 'ENUM PROVIDED FOR THIS',
                        days: 0,
                        months: 1,
                        discountPercentage: 20,
                        minUnits: 0,
                        maxUnits: 0
                    }
                ]
            }]
    }),
    __metadata("design:type", Array)
], ReqAddPropertySpaceModel.prototype, "offerPrice", void 0);
ReqAddPropertySpaceModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Host Property space",
        name: "ReqAddPropertySpace"
    })
], ReqAddPropertySpaceModel);
exports.ReqAddPropertySpaceModel = ReqAddPropertySpaceModel;
let ReqUpdatePropertySpaceModel = class ReqUpdatePropertySpaceModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "5e8b27c54e91350fe6ae69da"
    }),
    __metadata("design:type", String)
], ReqUpdatePropertySpaceModel.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "0 or 1",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqUpdatePropertySpaceModel.prototype, "isOfferPrice", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "capacity",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqUpdatePropertySpaceModel.prototype, "capacity", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "units",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqUpdatePropertySpaceModel.prototype, "units", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "units",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqUpdatePropertySpaceModel.prototype, "dailyPrice", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "units",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqUpdatePropertySpaceModel.prototype, "monthlyPrice", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "units",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqUpdatePropertySpaceModel.prototype, "yearlyPrice", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "units",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqUpdatePropertySpaceModel.prototype, "hourlyPrice", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "array of subCategoryIds",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "5e8b27c54e91350fe6ae69da"
    }),
    __metadata("design:type", String)
], ReqUpdatePropertySpaceModel.prototype, "subCategoryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "array of categoryIds",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "5e8b27c54e91350fe6ae69da"
    }),
    __metadata("design:type", String)
], ReqUpdatePropertySpaceModel.prototype, "categoryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "propertyId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: "5e8b27c54e91350fe6ae69da"
    }),
    __metadata("design:type", String)
], ReqUpdatePropertySpaceModel.prototype, "propertyId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "documents of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [
            'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
        ]
    }),
    __metadata("design:type", Array)
], ReqUpdatePropertySpaceModel.prototype, "images", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "documents of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [
            'add coffee machine'
        ]
    }),
    __metadata("design:type", Array)
], ReqUpdatePropertySpaceModel.prototype, "include", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "offer pricing",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [{
                seasonName: 'Season 1',
                startDate: '2020-04-22T01:20:52.073+05:30',
                endDate: '2020-04-22T01:20:52.073+05:30',
                priceDetails: [{
                        discountLabelType: 'Discounts for booking duration',
                        maxLabel: 'Min day',
                        min: 0,
                        minLabel: 'Min day',
                        max: 0,
                        discountLabel: 'Discount',
                        discount: 0
                    }]
            }]
    }),
    __metadata("design:type", Array)
], ReqUpdatePropertySpaceModel.prototype, "offerPrice", void 0);
ReqUpdatePropertySpaceModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Host Property space",
        name: "ReqUpdatePropertySpace"
    })
], ReqUpdatePropertySpaceModel);
exports.ReqUpdatePropertySpaceModel = ReqUpdatePropertySpaceModel;
let ReqAddHostPropertyDetailModel = class ReqAddHostPropertyDetailModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Property",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'SuperTech'
    }),
    __metadata("design:type", String)
], ReqAddHostPropertyDetailModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Property",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'SuperTech'
    }),
    __metadata("design:type", String)
], ReqAddHostPropertyDetailModel.prototype, "termsAndCond", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "addressPrimary of Property i.e address line 1",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '9c'
    }),
    __metadata("design:type", String)
], ReqAddHostPropertyDetailModel.prototype, "addressPrimary", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "addressSecondary of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'sec 58'
    }),
    __metadata("design:type", String)
], ReqAddHostPropertyDetailModel.prototype, "addressSecondary", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "zipcode of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '201301'
    }),
    __metadata("design:type", String)
], ReqAddHostPropertyDetailModel.prototype, "zipCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "images of property",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [
            'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
        ]
    }),
    __metadata("design:type", Array)
], ReqAddHostPropertyDetailModel.prototype, "images", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "add tags",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [
            'abcd'
        ]
    }),
    __metadata("design:type", Array)
], ReqAddHostPropertyDetailModel.prototype, "tags", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "heading",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '2bhk'
    }),
    __metadata("design:type", String)
], ReqAddHostPropertyDetailModel.prototype, "heading", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "description og the property",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'It is a well furnishek 2bhk property'
    }),
    __metadata("design:type", String)
], ReqAddHostPropertyDetailModel.prototype, "description", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "floor",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 2
    }),
    __metadata("design:type", Number)
], ReqAddHostPropertyDetailModel.prototype, "floor", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "built up area",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 150
    }),
    __metadata("design:type", Number)
], ReqAddHostPropertyDetailModel.prototype, "builtUpArea", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "upcoming booking",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "true/false"
    }),
    __metadata("design:type", Boolean)
], ReqAddHostPropertyDetailModel.prototype, "autoAcceptUpcomingBooking", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "images of property",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: ["5e8d93806a853d3506f7cf09"]
    }),
    __metadata("design:type", Array)
], ReqAddHostPropertyDetailModel.prototype, "amenities", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "address",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Noida'
    }),
    __metadata("design:type", Number)
], ReqAddHostPropertyDetailModel.prototype, "address", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "state id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 35
    }),
    __metadata("design:type", Number)
], ReqAddHostPropertyDetailModel.prototype, "stateId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "country Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 101
    }),
    __metadata("design:type", Number)
], ReqAddHostPropertyDetailModel.prototype, "countryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "starting price",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 15000
    }),
    __metadata("design:type", Number)
], ReqAddHostPropertyDetailModel.prototype, "startingPrice", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "city id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: "5e9585a4ba58cf276f66ddfa"
    }),
    __metadata("design:type", String)
], ReqAddHostPropertyDetailModel.prototype, "cityId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "location",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: { coordinates: [28.5355, 77.3910] }
    }),
    __metadata("design:type", Object)
], ReqAddHostPropertyDetailModel.prototype, "location", void 0);
ReqAddHostPropertyDetailModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Add Property",
        name: "ReqAddHostPropertyDetail"
    })
], ReqAddHostPropertyDetailModel);
exports.ReqAddHostPropertyDetailModel = ReqAddHostPropertyDetailModel;
let ReqUpdateHostPropertyDetailModel = class ReqUpdateHostPropertyDetailModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Property Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'propertyId'
    }),
    __metadata("design:type", String)
], ReqUpdateHostPropertyDetailModel.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Property Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'propertyId'
    }),
    __metadata("design:type", String)
], ReqUpdateHostPropertyDetailModel.prototype, "termsAndCond", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "add tags",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [
            'abcd'
        ]
    }),
    __metadata("design:type", Array)
], ReqUpdateHostPropertyDetailModel.prototype, "tags", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Property",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'SuperTech'
    }),
    __metadata("design:type", String)
], ReqUpdateHostPropertyDetailModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "house no of Property",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '9c'
    }),
    __metadata("design:type", String)
], ReqUpdateHostPropertyDetailModel.prototype, "houseNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "street of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'sec 58'
    }),
    __metadata("design:type", String)
], ReqUpdateHostPropertyDetailModel.prototype, "street", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "landmark of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'near thosom reuters'
    }),
    __metadata("design:type", String)
], ReqUpdateHostPropertyDetailModel.prototype, "landmark", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "zipcode of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '201301'
    }),
    __metadata("design:type", String)
], ReqUpdateHostPropertyDetailModel.prototype, "zipCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "images of property",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [
            'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
        ]
    }),
    __metadata("design:type", Array)
], ReqUpdateHostPropertyDetailModel.prototype, "images", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "heading",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '2bhk'
    }),
    __metadata("design:type", String)
], ReqUpdateHostPropertyDetailModel.prototype, "heading", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "description og the property",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'It is a well furnishek 2bhk property'
    }),
    __metadata("design:type", String)
], ReqUpdateHostPropertyDetailModel.prototype, "description", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "floor",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 2
    }),
    __metadata("design:type", Number)
], ReqUpdateHostPropertyDetailModel.prototype, "floor", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "built up area",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 150
    }),
    __metadata("design:type", Number)
], ReqUpdateHostPropertyDetailModel.prototype, "builtUpArea", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "upcoming booking",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "true/false"
    }),
    __metadata("design:type", Boolean)
], ReqUpdateHostPropertyDetailModel.prototype, "autoAcceptUpcomingBooking", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "images of property",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: ["5e8d93806a853d3506f7cf09"]
    }),
    __metadata("design:type", Array)
], ReqUpdateHostPropertyDetailModel.prototype, "amenities", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "address",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Noida'
    }),
    __metadata("design:type", String)
], ReqUpdateHostPropertyDetailModel.prototype, "address", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "state id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 35
    }),
    __metadata("design:type", Number)
], ReqUpdateHostPropertyDetailModel.prototype, "stateId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "country Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 101
    }),
    __metadata("design:type", Number)
], ReqUpdateHostPropertyDetailModel.prototype, "countryId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "city id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: "5e95596572304740458cde7a"
    }),
    __metadata("design:type", String)
], ReqUpdateHostPropertyDetailModel.prototype, "cityId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "location",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: { coordinates: [28.5355, 77.3910] }
    }),
    __metadata("design:type", Object)
], ReqUpdateHostPropertyDetailModel.prototype, "location", void 0);
ReqUpdateHostPropertyDetailModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Add Property",
        name: "ReqUpdateHostPropertyDetail"
    })
], ReqUpdateHostPropertyDetailModel);
exports.ReqUpdateHostPropertyDetailModel = ReqUpdateHostPropertyDetailModel;
let ReqAddRecentCity = class ReqAddRecentCity {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "user id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 1
    }),
    __metadata("design:type", String)
], ReqAddRecentCity.prototype, "userId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "city name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 1
    }),
    __metadata("design:type", String)
], ReqAddRecentCity.prototype, "cityName", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "city id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 1
    }),
    __metadata("design:type", String)
], ReqAddRecentCity.prototype, "cityId", void 0);
ReqAddRecentCity = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Host Property space",
        name: "ReqAddRecentCity"
    })
], ReqAddRecentCity);
exports.ReqAddRecentCity = ReqAddRecentCity;
let ReqPropertyStatus = class ReqPropertyStatus {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Property space Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'property space Id'
    }),
    __metadata("design:type", String)
], ReqPropertyStatus.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "type",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'active/inactive/archive'
    }),
    __metadata("design:type", String)
], ReqPropertyStatus.prototype, "type", void 0);
ReqPropertyStatus = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Add Property",
        name: "ReqPropertyStatus"
    })
], ReqPropertyStatus);
exports.ReqPropertyStatus = ReqPropertyStatus;
class ReqCancelSpaceBookingHostModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "booking Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'bookingId'
    }),
    __metadata("design:type", String)
], ReqCancelSpaceBookingHostModel.prototype, "bookingId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "description",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqCancelSpaceBookingHostModel.prototype, "description", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "reason",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
    }),
    __metadata("design:type", String)
], ReqCancelSpaceBookingHostModel.prototype, "reason", void 0);
exports.ReqCancelSpaceBookingHostModel = ReqCancelSpaceBookingHostModel;
class ReqBookingStatus {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Property space Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'property space Id'
    }),
    __metadata("design:type", String)
], ReqBookingStatus.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "type",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '0/1'
    }),
    __metadata("design:type", String)
], ReqBookingStatus.prototype, "type", void 0);
exports.ReqBookingStatus = ReqBookingStatus;
let ChangeStatusModel = class ChangeStatusModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "oldPassword",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", String)
], ChangeStatusModel.prototype, "propertyId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "newPassword",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '12345678'
    }),
    __metadata("design:type", Boolean)
], ChangeStatusModel.prototype, "autoAcceptUpcomingBooking", void 0);
ChangeStatusModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Change user password",
        name: "ChangeStatusModel"
    })
], ChangeStatusModel);
exports.ChangeStatusModel = ChangeStatusModel;
class AddHolidayModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "propertyId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'propertyId'
    }),
    __metadata("design:type", String)
], AddHolidayModel.prototype, "propertyId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'name'
    }),
    __metadata("design:type", String)
], AddHolidayModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "toDate",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'toDate'
    }),
    __metadata("design:type", String)
], AddHolidayModel.prototype, "toDate", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "fromDate",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'fromDate'
    }),
    __metadata("design:type", String)
], AddHolidayModel.prototype, "fromDate", void 0);
exports.AddHolidayModel = AddHolidayModel;
class UpdateHolidayModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'id'
    }),
    __metadata("design:type", String)
], UpdateHolidayModel.prototype, "id", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'name'
    }),
    __metadata("design:type", String)
], UpdateHolidayModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "toDate",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'toDate'
    }),
    __metadata("design:type", String)
], UpdateHolidayModel.prototype, "toDate", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "fromDate",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'fromDate'
    }),
    __metadata("design:type", String)
], UpdateHolidayModel.prototype, "fromDate", void 0);
exports.UpdateHolidayModel = UpdateHolidayModel;
class UpdateAutoAcceptPropertyModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "propertyId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'id'
    }),
    __metadata("design:type", String)
], UpdateAutoAcceptPropertyModel.prototype, "propertyId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "true/false",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'name'
    }),
    __metadata("design:type", Boolean)
], UpdateAutoAcceptPropertyModel.prototype, "autoAcceptUpcomingBooking", void 0);
exports.UpdateAutoAcceptPropertyModel = UpdateAutoAcceptPropertyModel;
let ReqAddHostTAndCModel = class ReqAddHostTAndCModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "type",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '1,2,3'
    }),
    __metadata("design:type", Number)
], ReqAddHostTAndCModel.prototype, "type", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "answer",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: 'HTML CONTENT OBJECT'
    }),
    __metadata("design:type", Object)
], ReqAddHostTAndCModel.prototype, "content", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "lang",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'EN'
    }),
    __metadata("design:type", String)
], ReqAddHostTAndCModel.prototype, "propertyId", void 0);
ReqAddHostTAndCModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "FAQ ADD",
        name: "ReqAddHostTAndCModel"
    })
], ReqAddHostTAndCModel);
exports.ReqAddHostTAndCModel = ReqAddHostTAndCModel;
let ReqValidateEmplyoeeModel = class ReqValidateEmplyoeeModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "floorDetail",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: {
            spaceId: "mongoId"
        }
    }),
    __metadata("design:type", String)
], ReqValidateEmplyoeeModel.prototype, "spaceId", void 0);
ReqValidateEmplyoeeModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Add Property",
        name: "ReqValidateEmplyoeeModel"
    })
], ReqValidateEmplyoeeModel);
exports.ReqValidateEmplyoeeModel = ReqValidateEmplyoeeModel;
let ReqValidateFloorModel = class ReqValidateFloorModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "floorDetails",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: [{
                units: {
                    hourly: "Number",
                    monthly: "Number",
                    custom: "Number",
                    employee: "Number",
                },
                floorId: "mongoId"
            }]
    }),
    __metadata("design:type", Object)
], ReqValidateFloorModel.prototype, "floorDetails", void 0);
ReqValidateFloorModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Add Property",
        name: "ReqValidateFloorModel"
    })
], ReqValidateFloorModel);
exports.ReqValidateFloorModel = ReqValidateFloorModel;
let ReqAddPropertyDetailModel = class ReqAddPropertyDetailModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Property",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'SuperTech'
    }),
    __metadata("design:type", String)
], ReqAddPropertyDetailModel.prototype, "name", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Name of Property",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'SuperTech'
    }),
    __metadata("design:type", String)
], ReqAddPropertyDetailModel.prototype, "termsAndCond", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "addressPrimary of Property i.e address line 1",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '9c'
    }),
    __metadata("design:type", String)
], ReqAddPropertyDetailModel.prototype, "addressPrimary", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "addressSecondary of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'sec 58'
    }),
    __metadata("design:type", String)
], ReqAddPropertyDetailModel.prototype, "addressSecondary", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "zipcode of comapny",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '201301'
    }),
    __metadata("design:type", String)
], ReqAddPropertyDetailModel.prototype, "zipCode", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "images of property",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.ARRAY,
        example: [
            'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
        ]
    }),
    __metadata("design:type", Array)
], ReqAddPropertyDetailModel.prototype, "images", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "heading",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '2bhk'
    }),
    __metadata("design:type", String)
], ReqAddPropertyDetailModel.prototype, "heading", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "description og the property",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'It is a well furnishek 2bhk property'
    }),
    __metadata("design:type", String)
], ReqAddPropertyDetailModel.prototype, "description", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "upcoming booking",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: "true/false"
    }),
    __metadata("design:type", Boolean)
], ReqAddPropertyDetailModel.prototype, "autoAcceptUpcomingBooking", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "amentites",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: {
            name: "string",
            iconImage: "string",
            amenityId: "_id",
            status: "string",
            type: "string",
            isFeatured: "number",
        }
    }),
    __metadata("design:type", Object)
], ReqAddPropertyDetailModel.prototype, "amenities", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "address",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Noida'
    }),
    __metadata("design:type", Number)
], ReqAddPropertyDetailModel.prototype, "address", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "address",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 'number'
    }),
    __metadata("design:type", Number)
], ReqAddPropertyDetailModel.prototype, "propertyType", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "state ",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: {
            name: "string",
            _id: "_id",
            id: "number",
        }
    }),
    __metadata("design:type", Object)
], ReqAddPropertyDetailModel.prototype, "state", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "country Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: {
            name: "string",
            sortname: "string",
            tax: "number",
            _id: "_id",
            id: "number",
        }
    }),
    __metadata("design:type", Object)
], ReqAddPropertyDetailModel.prototype, "country", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "city id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: {
            cityName: "string",
            iconImage: "string",
            isFeatured: "boolean",
            _id: "_id"
        }
    }),
    __metadata("design:type", Object)
], ReqAddPropertyDetailModel.prototype, "city", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "location",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: { coordinates: [28.5355, 77.3910] }
    }),
    __metadata("design:type", Object)
], ReqAddPropertyDetailModel.prototype, "location", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "floorDetails",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: [{
                subCategoryId: "_id",
                categoryId: "_id",
                floorNumber: "Number",
                capacity: "Number",
                units: {
                    hourly: "Number",
                    monthly: "Number",
                    custom: "Number",
                    employee: "Number",
                },
                dailyPrice: "Number",
                monthlyPrice: "Number",
                hourlyPrice: "Number",
                offerPrice: [{
                        selectedMaxValue: "Number",
                        selectedMinValue: "Number",
                        seasonName: "string",
                        startDate: "Date",
                        endDate: "Date",
                        priceDetails: [{
                                discountLabelType: "Number",
                                months: "Number",
                                days: "Number",
                                discountPercentage: "Number",
                                minUnits: "Number",
                                maxUnits: "Number",
                            }],
                        priceRange: {
                            dailyPrice: {
                                min: "Number",
                                max: "Number",
                            },
                            monthlyPrice: {
                                min: "Number",
                                max: "Number",
                            },
                            yearlyPrice: {
                                min: "Number",
                                max: "Number",
                            }
                        }
                    }],
                isOfferPrice: "Number"
            }]
    }),
    __metadata("design:type", Object)
], ReqAddPropertyDetailModel.prototype, "floorDetails", void 0);
ReqAddPropertyDetailModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Add Property",
        name: "ReqAddPropertyDetailModel"
    })
], ReqAddPropertyDetailModel);
exports.ReqAddPropertyDetailModel = ReqAddPropertyDetailModel;
//# sourceMappingURL=host.property.swagger.model.js.map