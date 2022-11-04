"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payoutLogs = exports.payoutMultipleHostList = exports.payoutHostList = exports.payoutRequestList = exports.payoutList = void 0;
const _common_1 = require("@common");
exports.payoutList = (payload) => {
    try {
        let pipeline = [];
        let today = new Date();
        let search = {};
        today.setHours(today.getHours() - 15 * 24);
        if (payload.search) {
            search = { name: { $regex: payload.search, $options: "si" } };
        }
        pipeline.push({
            $match: {
                status: 1,
                createdAt: { $lte: today },
                $or: [{ payoutStatus: false }, { payoutStatus: { '$exists': false } }],
            }
        });
        pipeline.push({ $group: { _id: "$hostId", total: { $sum: "$payoutPrice" } } });
        pipeline.push({
            "$lookup": {
                "from": "hosts",
                "let": { "hostId": "$_id" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$_id', '$$hostId'] } },
                                search
                            ]
                        }
                    },
                    { $project: { name: 1 } }
                ],
                "as": "hostData"
            }
        });
        pipeline.push({ $unwind: "$hostData" });
        pipeline.push({
            $project: {
                hostName: "$hostData.name",
                total: 1,
                dateBefore: today,
                createdAt: 1,
            }
        });
        return pipeline;
    }
    catch (error) {
        console.error(`we have an error in payoutList api ==> ${error}`);
    }
};
exports.payoutRequestList = (payload) => {
    try {
        let pipeline = [];
        let search = {};
        let filterConditions = [];
        let sortOrder = -1;
        if (payload.sortOrder && payload.sortOrder != '') {
            sortOrder = payload.sortOrder;
        }
        if (payload.search) {
            search = { name: { $regex: payload.search, $options: "si" } };
        }
        if (payload.fromDate)
            filterConditions.push({ "createdAt": { $gte: new Date(payload.fromDate) } });
        if (payload.toDate)
            filterConditions.push({ "createdAt": { $lte: new Date(payload.toDate) } });
        if (payload.minAmount)
            filterConditions.push({ hostAmount: { $gte: payload.minAmount } });
        if (payload.maxAmount)
            filterConditions.push({ hostAmount: { $lte: payload.maxAmount } });
        pipeline.push({ $match: { status: _common_1.ENUM.PAYOUT.STATUS.REQUEST } }, {
            "$lookup": {
                "from": "hosts",
                "let": { "hostId": "$hostId" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$_id', '$$hostId'] } },
                                search
                            ]
                        }
                    },
                    { $project: { name: 1 } }
                ],
                "as": "hostData"
            }
        });
        pipeline.push({ $unwind: "$hostData" });
        if (filterConditions.length)
            pipeline.push({ $match: { $and: filterConditions } });
        if (payload.sortKey) {
            if (payload.sortKey == "hostName")
                pipeline.push({ $sort: { "hostData.name": sortOrder } });
            if (payload.sortKey == "createdAt")
                pipeline.push({ $sort: { createdAt: sortOrder } });
        }
        else
            pipeline.push({ $sort: { createdAt: sortOrder } });
        pipeline.push({
            $project: {
                _id: 1,
                status: 1,
                hostName: "$hostData.name",
                adminCommissionAmount: 1,
                hostAmount: 1,
                createdAt: 1,
            }
        });
        return pipeline;
    }
    catch (error) {
        console.error(`we have an error in payoutRequestList api ==> ${error}`);
    }
};
exports.payoutHostList = (hostId) => {
    try {
        let pipeline = [];
        let today = new Date();
        today.setHours(today.getHours() - 15 * 24);
        pipeline.push({
            $match: {
                hostId: hostId,
                status: 1,
                "paymentMethod": { $ne: "partner" },
                createdAt: { $lte: today },
                $or: [{ payoutStatus: false }, { payoutStatus: { '$exists': false } }],
            }
        });
        pipeline.push({
            $project: {
                bookingId: 1,
                _id: 1,
                hostId: 1,
                price: 1,
                createdAt: 1,
            }
        });
        return pipeline;
    }
    catch (error) {
        console.error(`we have an error in payoutHostList api ==> ${error}`);
    }
};
exports.payoutMultipleHostList = (hostIds) => {
    try {
        let pipeline = [];
        let today = new Date();
        today.setHours(today.getHours() - 15 * 24);
        pipeline.push({
            $match: {
                hostIds,
                status: 1,
                createdAt: { $lte: today },
                $or: [{ payoutStatus: false }, { payoutStatus: { '$exists': false } }],
            }
        });
        pipeline.push({
            $project: {
                _id: 1,
                hostId: 1,
                price: 1,
                bookingId: 1,
                createdAt: 1
            }
        });
        return pipeline;
    }
    catch (error) {
        console.error(`we have an error in payoutMultipleHostList api ==> ${error}`);
    }
};
exports.payoutLogs = (payload) => {
    try {
        let pipeline = [];
        let search = {};
        let filterConditions = [];
        let sortOrder = -1;
        if (payload.sortOrder && payload.sortOrder != '') {
            sortOrder = payload.sortOrder;
        }
        if (payload.search) {
            search = { name: { $regex: payload.search, $options: "si" } };
        }
        if (payload.fromDate)
            filterConditions.push({ "createdAt": { $gte: new Date(payload.fromDate) } });
        if (payload.toDate)
            filterConditions.push({ "createdAt": { $lte: new Date(payload.toDate) } });
        if (payload.minAmount)
            filterConditions.push({ hostAmount: { $gte: payload.minAmount } });
        if (payload.maxAmount)
            filterConditions.push({ hostAmount: { $lte: payload.maxAmount } });
        pipeline.push({
            "$lookup": {
                "from": "hosts",
                "let": { "hostId": "$hostId" },
                "pipeline": [
                    {
                        '$match': {
                            $and: [
                                { $expr: { $eq: ['$_id', '$$hostId'] } },
                                search
                            ]
                        }
                    },
                    { $project: { name: 1 } }
                ],
                "as": "hostData"
            }
        });
        pipeline.push({ $unwind: "$hostData" });
        if (filterConditions.length)
            pipeline.push({ $match: { $and: filterConditions } });
        if (payload.sortKey) {
            if (payload.sortKey == "hostName")
                pipeline.push({ $sort: { "hostData.name": sortOrder } });
            if (payload.sortKey == "createdAt")
                pipeline.push({ $sort: { createdAt: sortOrder } });
        }
        else
            pipeline.push({ $sort: { createdAt: sortOrder } });
        pipeline.push({
            $project: {
                _id: 1,
                status: 1,
                hostName: "$hostData.name",
                adminCommissionAmount: 1,
                hostAmount: 1,
                createdAt: 1,
            }
        });
        return pipeline;
    }
    catch (error) {
        console.error(`we have an error in payoutLogs api ==> ${error}`);
    }
};
//# sourceMappingURL=admin.payout.builder.js.map