"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amenitiesList = exports.duplicateAmenities = exports.AmenitiesDeatils = exports.AmenitiesList = void 0;
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
exports.AmenitiesList = (payload) => {
    let pipeline = [];
    let matchconditions = [];
    let filterConditions = [];
    let sortOrder = -1;
    if (payload.sortOrder && payload.sortOrder != '') {
        sortOrder = payload.sortOrder;
    }
    filterConditions.push({ isDelete: false });
    if (payload.search) {
        matchconditions.push({ name: { $regex: payload.search, $options: "si" } });
    }
    if (payload.status) {
        filterConditions.push({ status: payload.status });
    }
    if (payload.type) {
        filterConditions.push({ type: payload.type });
    }
    if (matchconditions.length)
        pipeline.push({ $match: { $or: matchconditions } });
    if (filterConditions.length)
        pipeline.push({ $match: { $and: filterConditions } });
    if (payload.sortKey) {
        if (payload.sortKey == "name")
            pipeline.push({ $sort: { name: sortOrder } });
        if (payload.sortKey == "createdAt")
            pipeline.push({ $sort: { createdAt: sortOrder } });
    }
    else
        pipeline.push({ $sort: { createdAt: sortOrder } });
    return pipeline;
};
exports.AmenitiesDeatils = (id) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(id) } });
    return pipeline;
};
exports.duplicateAmenities = (name) => {
    return [
        {
            $match: {
                "status": _common_1.DATABASE.ACTIVE,
            }
        },
        {
            $project: {
                _id: 1,
                name: { $toLower: "$name" }
            }
        },
        {
            $match: {
                "name": name.toLowerCase(),
            }
        },
    ];
};
exports.amenitiesList = () => {
    let pipeline = [];
    let matchconditions = {};
    matchconditions['status'] = _common_1.DATABASE.ACTIVE;
    pipeline.push({ $match: matchconditions }, {
        $group: {
            _id: '$type',
            amentiesData: {
                $push: {
                    name: '$name',
                    _id: '$_id',
                    iconImage: '$iconImage',
                    isFeatured: 1
                }
            }
        }
    });
    return pipeline;
};
//# sourceMappingURL=admin.amenities.builder.js.map