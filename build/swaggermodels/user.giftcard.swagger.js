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
exports.ReqSendUserdGiftCardModel = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
let ReqSendUserdGiftCardModel = class ReqSendUserdGiftCardModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Amount",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.NUMBER,
        example: 5550
    }),
    __metadata("design:type", Number)
], ReqSendUserdGiftCardModel.prototype, "email", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Email of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'email id'
    }),
    __metadata("design:type", String)
], ReqSendUserdGiftCardModel.prototype, "to", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "user name",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'name'
    }),
    __metadata("design:type", String)
], ReqSendUserdGiftCardModel.prototype, "from", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Email of user",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'email id'
    }),
    __metadata("design:type", String)
], ReqSendUserdGiftCardModel.prototype, "message", void 0);
ReqSendUserdGiftCardModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: " Add",
        name: "ReqSendUserdGiftCardModel"
    })
], ReqSendUserdGiftCardModel);
exports.ReqSendUserdGiftCardModel = ReqSendUserdGiftCardModel;
//# sourceMappingURL=user.giftcard.swagger.js.map