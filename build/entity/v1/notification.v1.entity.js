"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const _common_1 = require("@common");
const notification_model_1 = __importDefault(require("@models/notification.model"));
class NotificationEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async createNotification(payload) {
        try {
            await new this.model(payload).save();
        }
        catch (error) {
            console.error(`we have an error while creating notification ===> ${error}`);
        }
    }
    ;
    async getNotificationListing(_a) {
        var params = __rest(_a, []);
        try {
            let pipeline = [];
            let matchCriteria = { $match: { $and: [] } };
            matchCriteria.$match.$and.push({ 'status': _common_1.CONSTANT.STATUS.ACTIVE });
            matchCriteria.$match.$and.push({ receiverId: mongoose_1.Types.ObjectId(params.userId) });
            pipeline.push(matchCriteria);
            pipeline.push({ $sort: { createdAt: -1 } });
            pipeline.push({
                "$project": {
                    status: 0
                }
            });
            return pipeline;
        }
        catch (error) {
            console.error(`we have an error ===> ${error}`);
        }
    }
}
exports.NotificationV1 = new NotificationEntity(notification_model_1.default);
//# sourceMappingURL=notification.v1.entity.js.map