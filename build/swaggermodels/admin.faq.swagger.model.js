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
exports.ReqUpdateNotificationModel = exports.ReqAddNotificationModel = exports.ReqAddTAndCModel = exports.ReqAddCancellationModel = exports.ReqAddFaqModel = void 0;
const swagger_express_ts_1 = require("swagger-express-ts");
let ReqAddFaqModel = class ReqAddFaqModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "questiion",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'How do u like the app?'
    }),
    __metadata("design:type", String)
], ReqAddFaqModel.prototype, "question", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "answer",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Business Industries'
    }),
    __metadata("design:type", String)
], ReqAddFaqModel.prototype, "answer", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "lang",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'EN'
    }),
    __metadata("design:type", String)
], ReqAddFaqModel.prototype, "lang", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "lang",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'EN'
    }),
    __metadata("design:type", String)
], ReqAddFaqModel.prototype, "userType", void 0);
ReqAddFaqModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "FAQ ADD",
        name: "ReqAddFaqModel"
    })
], ReqAddFaqModel);
exports.ReqAddFaqModel = ReqAddFaqModel;
let ReqAddCancellationModel = class ReqAddCancellationModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "questiion",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'How do u like the app?'
    }),
    __metadata("design:type", String)
], ReqAddCancellationModel.prototype, "reason", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "lang",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'EN'
    }),
    __metadata("design:type", String)
], ReqAddCancellationModel.prototype, "lang", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "lang",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '1'
    }),
    __metadata("design:type", String)
], ReqAddCancellationModel.prototype, "userType", void 0);
ReqAddCancellationModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "ADD CANCELLATION POLICY",
        name: "ReqAddCancellationModel"
    })
], ReqAddCancellationModel);
exports.ReqAddCancellationModel = ReqAddCancellationModel;
let ReqAddTAndCModel = class ReqAddTAndCModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "type",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '1,2,3'
    }),
    __metadata("design:type", Number)
], ReqAddTAndCModel.prototype, "type", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "answer",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.OBJECT,
        example: 'HTML CONTENT OBJECT'
    }),
    __metadata("design:type", Object)
], ReqAddTAndCModel.prototype, "content", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "lang",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'EN'
    }),
    __metadata("design:type", String)
], ReqAddTAndCModel.prototype, "lang", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "lang",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'EN'
    }),
    __metadata("design:type", String)
], ReqAddTAndCModel.prototype, "userType", void 0);
ReqAddTAndCModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "FAQ ADD",
        name: "ReqAddTAndCModel"
    })
], ReqAddTAndCModel);
exports.ReqAddTAndCModel = ReqAddTAndCModel;
let ReqAddNotificationModel = class ReqAddNotificationModel {
};
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "title",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Title for notification'
    }),
    __metadata("design:type", String)
], ReqAddNotificationModel.prototype, "title", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Description",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'description for notification'
    }),
    __metadata("design:type", String)
], ReqAddNotificationModel.prototype, "description", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "image",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Image if any?'
    }),
    __metadata("design:type", String)
], ReqAddNotificationModel.prototype, "image", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "recipientType such as for app 1",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '1 for app'
    }),
    __metadata("design:type", String)
], ReqAddNotificationModel.prototype, "recipientType", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "otherRecipientIds only required when recipientType is others",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '1 for app'
    }),
    __metadata("design:type", String)
], ReqAddNotificationModel.prototype, "otherRecipientIds", void 0);
ReqAddNotificationModel = __decorate([
    swagger_express_ts_1.ApiModel({
        description: "ADD NOTIFICATION FOR BULK PUSH",
        name: "ReqAddNotificationModel"
    })
], ReqAddNotificationModel);
exports.ReqAddNotificationModel = ReqAddNotificationModel;
class ReqUpdateNotificationModel {
}
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "NotificationId",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Notification Id'
    }),
    __metadata("design:type", String)
], ReqUpdateNotificationModel.prototype, "notificationId", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "Description",
        required: true,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'description for notification'
    }),
    __metadata("design:type", String)
], ReqUpdateNotificationModel.prototype, "description", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "title",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Title for notification'
    }),
    __metadata("design:type", String)
], ReqUpdateNotificationModel.prototype, "title", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "image",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: 'Image if any?'
    }),
    __metadata("design:type", String)
], ReqUpdateNotificationModel.prototype, "image", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "recipientType such as for app 1",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '1 for app'
    }),
    __metadata("design:type", String)
], ReqUpdateNotificationModel.prototype, "recipientType", void 0);
__decorate([
    swagger_express_ts_1.ApiModelProperty({
        description: "otherRecipientIds only required when recipientType is others",
        required: false,
        type: swagger_express_ts_1.SwaggerDefinitionConstant.STRING,
        example: '1 for app'
    }),
    __metadata("design:type", String)
], ReqUpdateNotificationModel.prototype, "otherRecipientIds", void 0);
exports.ReqUpdateNotificationModel = ReqUpdateNotificationModel;
//# sourceMappingURL=admin.faq.swagger.model.js.map