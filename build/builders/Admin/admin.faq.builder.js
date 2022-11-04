"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityListing = exports.StateListing = exports.CountryLisiting = exports.AdvListing = exports.FaqListing = void 0;
const _common_1 = require("@common");
exports.FaqListing = (payload) => {
    let pipeline = [];
    let matchconditions = [];
    let sortOrder = -1;
    matchconditions.push({ lang: payload.lang, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE, userType: payload.userType });
    if (payload.sortOrder && payload.sortOrder != '') {
        sortOrder = payload.sortOrder;
    }
    if (payload.search)
        matchconditions.push({
            $or: [{ 'answer': { $regex: payload.search, $options: "si" } },
                { "question": { $regex: payload.search, $options: "si" } }]
        });
    if (matchconditions.length)
        pipeline.push({ $match: { $and: matchconditions } });
    if (payload.sortKey) {
        if (payload.sortKey == 'question')
            pipeline.push({ $sort: { question: sortOrder } });
        else if (payload.sortKey == 'answer')
            pipeline.push({ $sort: { answer: sortOrder } });
    }
    else
        pipeline.push({ $sort: { createdAt: sortOrder } });
    return pipeline;
};
exports.AdvListing = (payload) => {
    let pipeline = [];
    let matchconditions = [];
    let sortOrder = -1;
    matchconditions.push({ isDelete: false, listingPlacement: _common_1.ENUM.ADVERTISEMENT.ListingPlacement.LISTING });
    if (matchconditions.length)
        pipeline.push({ $match: { $and: matchconditions } });
    pipeline.push({ $sort: { createdAt: sortOrder } });
    pipeline.push({ $project: { isDelete: 0, updatedAt: 0 } });
    return pipeline;
};
exports.CountryLisiting = () => {
    let pipeline = [];
    let sortOrder = -1;
    pipeline.push({
        $group: {
            _id: '$country._id',
            country: { $first: "$country" }
        }
    }, { $project: { country: 1 } });
    pipeline.push({ $sort: { createdAt: sortOrder } });
    return pipeline;
};
exports.StateListing = (payload) => {
    let pipeline = [];
    let sortOrder = -1;
    pipeline.push({ $match: { "country.id": payload.countryId } }, {
        $group: {
            _id: '$state._id',
            state: { $first: "$state" }
        }
    }, { $project: { state: 1 } });
    pipeline.push({ $sort: { createdAt: sortOrder } });
    return pipeline;
};
exports.CityListing = (payload) => {
    let pipeline = [];
    let sortOrder = -1;
    pipeline.push({ $match: { "state.id": payload.stateId } }, {
        $group: {
            _id: '$city._id',
            city: { $first: "$city" }
        }
    }, { $project: { city: 1 } });
    pipeline.push({ $sort: { createdAt: sortOrder } });
    return pipeline;
};
//# sourceMappingURL=admin.faq.builder.js.map