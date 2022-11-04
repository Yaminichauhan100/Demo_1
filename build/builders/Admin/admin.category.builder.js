"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateCategory = exports.categoryAndSubCategoryDetails = exports.CategoryDeatils = exports.CategoryList = void 0;
const mongoose_1 = require("mongoose");
const _common_1 = require("@common");
exports.CategoryList = (payload) => {
    let pipeline = [];
    let matchconditions = [];
    let filterConditions = [];
    payload && payload.sortOrder ? payload.sortOrder = payload.sortOrder : payload.sortOrder = -1;
    if (payload.search) {
        matchconditions.push({ name: { $regex: payload.search, $options: "si" } });
    }
    if (payload.status) {
        filterConditions.push({ status: payload.status });
    }
    if (payload.parentId && payload.parentId != '') {
        filterConditions.push({ parentId: mongoose_1.Types.ObjectId(payload.parentId) });
    }
    else {
        filterConditions.push({ parentId: { $exists: false } });
    }
    if (matchconditions.length)
        pipeline.push({ $match: { $or: matchconditions } });
    if (filterConditions.length)
        pipeline.push({ $match: { $and: filterConditions } });
    if (payload.sortKey) {
        if (payload.sortKey == "name")
            pipeline.push({ $sort: { name: 1 } });
        if (payload.sortKey == "createdAt")
            pipeline.push({ $sort: { createdAt: payload.sortOrder } });
    }
    else
        pipeline.push({ $sort: { createdAt: payload.sortOrder } });
    return pipeline;
};
exports.CategoryDeatils = (id) => {
    let pipeline = [];
    pipeline.push({ $match: { _id: mongoose_1.Types.ObjectId(id) } }, {
        "$lookup": {
            "from": "propertySpace",
            "let": { "categoryId": "$_id" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$category._id', '$$categoryId'] } }
                        ]
                    }
                },
                {
                    $project: {
                        propertyId: 1
                    }
                }
            ],
            "as": "categoryData"
        },
    }, {
        $unwind: {
            path: "$categoryData",
            preserveNullAndEmptyArrays: true
        }
    }, {
        $group: {
            _id: { propertyId: "$propertyId" },
            categoryId: { '$first': '$_id' },
            propertyAssociated: { $sum: 1 },
            colorCode: { $first: "$colorCode" },
            createdAt: { "$first": "$createdAt" },
            name: { $first: '$name' },
            description: {
                '$first': '$description'
            },
            iconImage: {
                '$first': '$iconImage'
            },
            options: {
                '$first': '$options'
            },
            status: { $first: "$status" }
        }
    });
    return pipeline;
};
exports.categoryAndSubCategoryDetails = () => {
    return [
        [
            {
                $match: {
                    "status": _common_1.CONSTANT.STATUS.ACTIVE,
                    "parentId": { $exists: false }
                }
            },
            {
                $project: {
                    _id: 1,
                    categoryName: '$name'
                }
            },
            {
                "$lookup": {
                    "from": "categories",
                    "let": { "category": "$_id" },
                    "pipeline": [
                        {
                            "$match": {
                                "$expr": {
                                    "$eq": ["$parentId", "$$category"]
                                }
                            }
                        },
                        {
                            "$project": {
                                name: 1,
                                iconImage: { $ifNull: ["$iconImage", " "] }
                            }
                        }
                    ],
                    "as": "subCategoryData"
                }
            }
        ]
    ];
};
exports.duplicateCategory = (name) => {
    return [
        {
            $match: {
                "status": _common_1.CONSTANT.STATUS.ACTIVE,
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
//# sourceMappingURL=admin.category.builder.js.map