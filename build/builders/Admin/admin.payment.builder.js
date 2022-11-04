"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPaymentListing = void 0;
exports.fetchPaymentListing = (payload) => {
    let pipeline = [];
    let filterConditions = [];
    let sortOrder = -1;
    if (payload.sortOrder && payload.sortOrder != '') {
        sortOrder = payload.sortOrder;
    }
    pipeline.push({
        "$lookup": {
            "from": "booking",
            "let": { "bookingId": "$bookingId" },
            "pipeline": [
                {
                    '$match': {
                        $and: [
                            { $expr: { $eq: ['$_id', '$$bookingId'] } }
                        ]
                    }
                },
                { $project: { "bookingStatus": 1, "bookingId": 1, "userData.name": 1 } }
            ],
            "as": "bookingData"
        }
    });
    pipeline.push({
        "$unwind": "$bookingData"
    });
    if (payload.search)
        filterConditions.push({
            $or: [{ "bookingData.userData.name": { $regex: payload.search, $options: "si" } },
                { "bookingData.bookingId": { $regex: payload.search, $options: "si" } },
                { "transactionId": { $regex: payload.search, $options: "si" } }]
        });
    if (payload.fromDate)
        filterConditions.push({ "createdAt": { $gte: new Date(payload.fromDate) } });
    if (payload.toDate)
        filterConditions.push({ "createdAt": { $lte: new Date(payload.toDate) } });
    if (payload.minAmount)
        filterConditions.push({ price: { $gte: payload.minAmount } });
    if (payload.maxAmount)
        filterConditions.push({ price: { $lte: payload.maxAmount } });
    if (payload.paymentStatus) {
        filterConditions.push({ status: parseInt(payload.paymentStatus) });
    }
    if (payload.transactionStatus) {
        filterConditions.push({ status: parseInt(payload.transactionStatus) });
    }
    if (payload.bookingStatus) {
        filterConditions.push({ "bookingData.bookingStatus": parseInt(payload.bookingStatus) });
    }
    if (filterConditions.length)
        pipeline.push({ $match: { $and: filterConditions } });
    if (payload.sortKey) {
        if (payload.sortKey == "userName")
            pipeline.push({ $sort: { "userData.name": sortOrder } });
        if (payload.sortKey == "transactionDate")
            pipeline.push({ $sort: { createdAt: sortOrder } });
    }
    else
        pipeline.push({ $sort: { createdAt: sortOrder } });
    pipeline.push({
        $project: {
            bookingId: "$bookingData.bookingId",
            userName: "$bookingData.userData.name",
            bookingStatus: "$bookingData.bookingStatus",
            price: 1,
            transactionId: 1,
            status: 1,
            createdAt: 1
        }
    });
    return pipeline;
};
//# sourceMappingURL=admin.payment.builder.js.map