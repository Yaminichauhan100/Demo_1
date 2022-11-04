"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecentSearchSchema = void 0;
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
exports.RecentSearchSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, index: true, required: true },
    cityId: { type: mongoose_1.Schema.Types.String, required: true },
    cityName: { type: mongoose_1.Schema.Types.String }
}, { timestamps: true, versionKey: false });
exports.RecentSearchSchema.index({ "cityInfo.countryId": 1 });
exports.default = mongoose_1.model(_common_1.ENUM.COL.RECENT_SEARCH, exports.RecentSearchSchema);
//# sourceMappingURL=recent_search.model.js.map