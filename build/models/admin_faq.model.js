"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const faqSchema = new mongoose_1.Schema({
    editType: { type: Number },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    lang: {
        type: String,
        required: true
    },
    status: { type: String, default: common_1.ENUM.PROPERTY.STATUS.ACTIVE },
    userType: {
        type: Number,
        required: true
    }
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.FAQ,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.FAQ, faqSchema);
//# sourceMappingURL=admin_faq.model.js.map