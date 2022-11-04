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
exports.ReqAdd3DPaymentModel = exports.ReqAddGiftPaymentModel = exports.ReqAddPaymentModel = exports.ReqAddCardModel = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
let ReqAddCardModel = class ReqAddCardModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "token",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: ""
    }),
    __metadata("design:type", String)
], ReqAddCardModel.prototype, "token", void 0);
ReqAddCardModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Card Add",
        name: "ReqAddCardModel"
    })
], ReqAddCardModel);
exports.ReqAddCardModel = ReqAddCardModel;
let ReqAddPaymentModel = class ReqAddPaymentModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "card Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: ""
    }),
    __metadata("design:type", String)
], ReqAddPaymentModel.prototype, "cardId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "booking Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: ""
    }),
    __metadata("design:type", String)
], ReqAddPaymentModel.prototype, "bookingId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "booking Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.BOOLEAN,
        example: ""
    }),
    __metadata("design:type", Boolean)
], ReqAddPaymentModel.prototype, "savedCard", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "booking Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqAddPaymentModel.prototype, "paymentPlan", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "booking Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 1
    }),
    __metadata("design:type", String)
], ReqAddPaymentModel.prototype, "cardDigit", void 0);
ReqAddPaymentModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Card Add",
        name: "ReqAddPaymentModel"
    })
], ReqAddPaymentModel);
exports.ReqAddPaymentModel = ReqAddPaymentModel;
let ReqAddGiftPaymentModel = class ReqAddGiftPaymentModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "card Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: ""
    }),
    __metadata("design:type", String)
], ReqAddGiftPaymentModel.prototype, "cardId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "booking Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: ""
    }),
    __metadata("design:type", Number)
], ReqAddGiftPaymentModel.prototype, "giftCardNo", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "booking Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.BOOLEAN,
        example: ""
    }),
    __metadata("design:type", Boolean)
], ReqAddGiftPaymentModel.prototype, "savedCard", void 0);
ReqAddGiftPaymentModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Card Add",
        name: "ReqAddGiftPaymentModel"
    })
], ReqAddGiftPaymentModel);
exports.ReqAddGiftPaymentModel = ReqAddGiftPaymentModel;
let ReqAdd3DPaymentModel = class ReqAdd3DPaymentModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "data",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: ""
    }),
    __metadata("design:type", Object)
], ReqAdd3DPaymentModel.prototype, "data", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "booking Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: ""
    }),
    __metadata("design:type", String)
], ReqAdd3DPaymentModel.prototype, "bookingId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "booking Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.BOOLEAN,
        example: ""
    }),
    __metadata("design:type", Boolean)
], ReqAdd3DPaymentModel.prototype, "savedCard", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "booking Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 1
    }),
    __metadata("design:type", Number)
], ReqAdd3DPaymentModel.prototype, "paymentPlan", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "booking Id",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 1
    }),
    __metadata("design:type", String)
], ReqAdd3DPaymentModel.prototype, "cardDigit", void 0);
ReqAdd3DPaymentModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "Card Add",
        name: "ReqAdd3DPaymentModel"
    })
], ReqAdd3DPaymentModel);
exports.ReqAdd3DPaymentModel = ReqAdd3DPaymentModel;
//# sourceMappingURL=payment.swagger.model.js.map