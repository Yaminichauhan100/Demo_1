"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateListingForTaxes = exports.countryListingForTaxes = exports.cityDetails = exports.CityListing = exports.stateListing = exports.countryListing = void 0;
const mongoose_1 = require("mongoose");
const _services_1 = require("@services");
const _common_1 = require("@common");
exports.countryListing = () => {
    let pipeline = [];
    pipeline.push({ $match: { isDelete: false } });
    pipeline.push({ $sort: { name: 1 } });
    return pipeline;
};
exports.stateListing = (country_id) => {
    let pipeline = [];
    pipeline.push({ $match: { country_id: country_id, isDelete: false } });
    pipeline.push({ $sort: { name: 1 } });
    return pipeline;
};
exports.CityListing = (payload) => {
    let pipeline = [];
    let matchconditions = [];
    let filterConditions = [];
    payload && payload.sortOrder ? payload.sortOrder = payload.sortOrder : payload.sortOrder = -1;
    filterConditions.push({ isDelete: false });
    if (payload.search) {
        matchconditions.push({ cityName: { $regex: payload.search, $options: "si" } });
    }
    if (payload.status) {
        filterConditions.push({ status: payload.status });
    }
    if (payload.countryId && payload.countryId != '') {
        filterConditions.push({ countryId: payload.countryId });
    }
    if (payload.stateId && payload.stateId != '') {
        filterConditions.push({ stateId: payload.stateId });
    }
    if (matchconditions.length)
        pipeline.push({ $match: { $or: matchconditions } });
    if (filterConditions.length)
        pipeline.push({ $match: { $and: filterConditions } });
    if (payload.sortKey) {
        if (payload.sortKey == "cityName")
            pipeline.push({ $sort: { cityName: payload.sortOrder } });
        if (payload.sortKey == "createdAt")
            pipeline.push({ $sort: { createdAt: payload.sortOrder } });
    }
    else
        pipeline.push({ $sort: { createdAt: payload.sortOrder } });
    pipeline.push({ $project: { _id: 1, zipCodes: 1, isFeatured: 1, cityName: 1, status: 1, countryId: 1, stateId: 1, iconImage: 1, countryName: 1, stateName: 1 } });
    return pipeline;
};
exports.cityDetails = (id) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(id) } });
    pipeline.push({ $lookup: _services_1.Helper.lookupGenerator(_common_1.ENUM.COL.COUNTRIES, 'countryId', 'id', 'countryData') }, { $unwind: '$countryData' });
    pipeline.push({ $lookup: _services_1.Helper.lookupGenerator(_common_1.ENUM.COL.STATES, 'stateId', 'id', 'stateData') }, { $unwind: '$stateData' });
    pipeline.push({ $project: { _id: 1, zipCodes: 1, isFeatured: 1, cityName: 1, status: 1, iconImage: 1, countryId: 1, stateId: 1, countryName: '$countryData.name', stateName: '$stateData.name' } });
    return pipeline;
};
exports.countryListingForTaxes = (query) => {
    let pipeline = [];
    pipeline.push({ $match: { isDelete: false } });
    pipeline.push({ $sort: { name: 1 } });
    if (query === null || query === void 0 ? void 0 : query.search)
        pipeline.push({ $match: { name: { $regex: query.search, $options: "si" } } });
    return pipeline;
};
exports.stateListingForTaxes = (country_id) => {
    let pipeline = [];
    pipeline.push({ $match: { id: country_id, isDelete: false } });
    pipeline.push({
        "$lookup": {
            "from": "states",
            "let": { "countryId": "$id" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$country_id', '$$countryId'] } }
                        ]
                    }
                }
            ],
            "as": "stateData"
        }
    });
    pipeline.push({ $sort: { name: 1 } });
    return pipeline;
};
//# sourceMappingURL=admin.location.builder.js.map