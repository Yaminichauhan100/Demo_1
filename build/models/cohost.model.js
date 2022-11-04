"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../common");
const cohostSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId },
    cohostId: { type: mongoose_1.Schema.Types.ObjectId },
    hostId: { type: mongoose_1.Schema.Types.ObjectId },
    accessLevel: { type: mongoose_1.Schema.Types.Number, default: common_1.ENUM.COHOST_LEVEL.STATUS.ALL },
    level: { type: mongoose_1.Schema.Types.Number, default: common_1.ENUM.COHOST_LEVEL.STATUS.ALL },
    createdAt: { type: mongoose_1.Schema.Types.Date },
    state: [{
            _id: 0,
            id: { type: mongoose_1.Schema.Types.Number },
            name: { type: mongoose_1.Schema.Types.String }
        }],
    city: [{
            _id: 0,
            id: { type: mongoose_1.Schema.Types.ObjectId },
            cityName: { type: mongoose_1.Schema.Types.String }
        }],
    property: [{
            _id: 0,
            id: { type: mongoose_1.Schema.Types.ObjectId },
            name: { type: mongoose_1.Schema.Types.String }
        }],
    country: [{
            _id: 0,
            id: { type: mongoose_1.Schema.Types.Number },
            name: { type: mongoose_1.Schema.Types.String }
        }]
}, {
    versionKey: false,
    collection: common_1.ENUM.COL.COHOST,
    timestamps: true
});
exports.default = mongoose_1.model(common_1.ENUM.COL.COHOST, cohostSchema);
//# sourceMappingURL=cohost.model.js.map