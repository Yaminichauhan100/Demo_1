"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationList = void 0;
const _services_1 = require("@services");
exports.NotificationList = async (payload) => {
    try {
        let filters = { $match: { $and: [{ 'title': { '$exists': true } }] } };
        let pipeline = [];
        if (payload.search) {
            filters.$match.$and.push({ title: { $regex: payload.search, $options: "si" } });
        }
        if (payload === null || payload === void 0 ? void 0 : payload.recipientType) {
            payload.recipientType = payload.recipientType.split(",");
            filters.$match.$and.push({ 'recipientType': { $in: await _services_1.toNumberString(payload.recipientType) } });
        }
        pipeline.push(filters);
        if (payload.sort) {
            pipeline.push({ $sort: { createdAt: parseInt(payload.sort) } });
        }
        else {
            pipeline.push({ $sort: { updatedAt: -1 } });
        }
        return pipeline;
    }
    catch (error) {
        console.error(`we have an error ==> ${error}`);
    }
};
//# sourceMappingURL=admin.notification.builder.js.map