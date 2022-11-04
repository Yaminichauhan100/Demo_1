"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiftV1 = void 0;
const base_entity_1 = __importDefault(require("../base.entity"));
const giftcard_model_1 = __importDefault(require("@models/giftcard.model"));
const _common_1 = require("@common");
const mongoose_1 = require("mongoose");
const _entity_1 = require("@entity");
const _services_1 = require("@services");
class GiftCardEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async insertGiftCard(payload) {
        try {
            let result = new giftcard_model_1.default(payload).save();
            return result;
        }
        catch (error) {
            console.error(">>>>>>>>>>>>2222", error);
            return Promise.reject(error);
        }
    }
    async validateUserAuth(userId, giftCardDetails) {
        try {
            if (giftCardDetails === null || giftCardDetails === void 0 ? void 0 : giftCardDetails.userId.equals(userId)) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            console.error(`error while validation giftCard`, error);
        }
    }
    async giftCardListing(params) {
        try {
            let pipeline = [];
            let matchCriteria = { $match: { $and: [] } };
            matchCriteria.$match.$and.push({
                buyerId: mongoose_1.Types.ObjectId(params.buyerId),
                paymentStatus: _common_1.ENUM.PAYMENT.STATUS.SUCCESS
            });
            if (params.startDate)
                matchCriteria.$match.$and.push({ 'createdAt': { $gte: new Date(params.startDate) } });
            if (params.endDate)
                matchCriteria.$match.$and.push({ 'createdAt': { $lte: new Date(params.endDate) } });
            pipeline.push(matchCriteria);
            pipeline.push({ $sort: { createdAt: -1 } });
            pipeline.push({
                $project: {
                    _id: 1,
                    paymentStatus: 1,
                    amount: "$originalAmount",
                    to: 1,
                    from: 1,
                    message: 1,
                    quantity: 1,
                    giftCardNo: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    redemptionStatus: 1,
                    transactionDetails: { $ifNull: ["$transactionDetails.transactionId", ""] },
                    redemptionDate: { $cond: { if: { $eq: [{ $size: "$redemptionDate" }, 0] }, then: 0, else: 1 } }
                }
            });
            params.getCount = true;
            let details = await exports.GiftV1.paginateAggregate(pipeline, params);
            return details;
        }
        catch (error) {
            console.error(`error while giftCardListing`, error);
            return Promise.reject(error);
        }
    }
    async userGiftCardListing(params) {
        try {
            let pipeline = [];
            let matchCriteria = { $match: { $and: [] } };
            matchCriteria.$match.$and.push({
                userId: mongoose_1.Types.ObjectId(params.userId),
                paymentStatus: _common_1.ENUM.PAYMENT.STATUS.SUCCESS
            });
            if (params.startDate)
                matchCriteria.$match.$and.push({ 'createdAt': { $gte: new Date(params.startDate) } });
            if (params.endDate)
                matchCriteria.$match.$and.push({ 'createdAt': { $lte: new Date(params.endDate) } });
            pipeline.push(matchCriteria);
            pipeline.push({
                '$lookup': {
                    from: 'users',
                    "let": { "userId": "$buyerId" },
                    pipeline: [
                        {
                            '$match': {
                                $and: [
                                    { $expr: { $eq: ['$_id', "$$userId"] } },
                                ]
                            }
                        },
                        {
                            '$project': {
                                name: 1,
                                email: 1,
                            }
                        }
                    ],
                    as: 'userData'
                }
            });
            pipeline.push({ $sort: { createdAt: -1 } });
            pipeline.push({
                $project: {
                    _id: 1,
                    paymentStatus: 1,
                    remainingAmount: "$amount",
                    to: 1,
                    from: 1,
                    message: 1,
                    quantity: 1,
                    giftCardNo: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    redemptionStatus: 1,
                    transactionDetails: { $ifNull: ["$transactionDetails.transactionId", ""] },
                    redemptionDate: { $cond: { if: { $eq: [{ $size: "$redemptionDate" }, 0] }, then: 0, else: 1 } },
                    buyerDetail: { $arrayElemAt: ["$userData", 0] },
                    amount: "$originalAmount",
                    validity: 1
                }
            });
            params.getCount = true;
            let details = await exports.GiftV1.paginateAggregate(pipeline, params);
            return details;
        }
        catch (error) {
            console.error(`we have an error in myGift card listing entity ==> ${error}`);
            throw error;
        }
    }
    async redeemGiftCard(payload, userId, giftCardDetails, bookingDetails) {
        try {
            switch (giftCardDetails.redemptionStatus) {
                case _common_1.ENUM.GIFT_CARD.REDEMPTION_STATUS.NOT_REDEEMED: {
                    if (bookingDetails.totalPayable > giftCardDetails.amount) {
                        let bookingPayload = {
                            giftCardAmount: giftCardDetails.amount,
                            giftCardId: giftCardDetails._id,
                            giftCardStatus: _common_1.ENUM.BOOKING.GIFT_CARD_STATUS.QUEUED,
                            giftCardNo: giftCardDetails.giftCardNo
                        };
                        let bookingData = await _entity_1.BookingV1.updateDocument({
                            _id: mongoose_1.Types.ObjectId(bookingDetails._id)
                        }, bookingPayload, { new: true });
                        return bookingData;
                    }
                    else {
                        let bookingPayload = {
                            giftCardAmount: bookingDetails.totalPayable,
                            giftCardId: giftCardDetails._id,
                            giftCardStatus: _common_1.ENUM.BOOKING.GIFT_CARD_STATUS.QUEUED,
                            giftCardNo: giftCardDetails.giftCardNo
                        };
                        let bookingData = await _entity_1.BookingV1.updateDocument({ _id: mongoose_1.Types.ObjectId(bookingDetails._id) }, bookingPayload, { new: true });
                        return bookingData;
                    }
                }
                case _common_1.ENUM.GIFT_CARD.REDEMPTION_STATUS.PARTIALLY_REDEEMED: {
                    if (bookingDetails.totalPayable > giftCardDetails.amount) {
                        let bookingPayload = {
                            giftCardAmount: giftCardDetails.amount,
                            giftCardId: giftCardDetails._id,
                            giftCardStatus: _common_1.ENUM.BOOKING.GIFT_CARD_STATUS.QUEUED,
                            giftCardNo: giftCardDetails.giftCardNo
                        };
                        let bookingData = await _entity_1.BookingV1.updateDocument({
                            _id: mongoose_1.Types.ObjectId(bookingDetails._id)
                        }, bookingPayload, { new: true });
                        return bookingData;
                    }
                    else {
                        let bookingPayload = {
                            giftCardAmount: bookingDetails.totalPayable,
                            giftCardId: giftCardDetails._id,
                            giftCardStatus: _common_1.ENUM.BOOKING.GIFT_CARD_STATUS.QUEUED,
                            giftCardNo: giftCardDetails.giftCardNo
                        };
                        let bookingData = await _entity_1.BookingV1.updateDocument({ _id: mongoose_1.Types.ObjectId(bookingDetails._id) }, bookingPayload, { new: true });
                        return bookingData;
                    }
                }
            }
        }
        catch (error) {
            console.error(`we have an error while redeeming giftCard ==> ${error}`);
            throw error;
        }
    }
    async updateGiftCardRedemption(payload, bookingDetails) {
        var _a, _b, _c;
        try {
            let giftCardDetails = await exports.GiftV1.findOne({ _id: mongoose_1.Types.ObjectId(bookingDetails.giftCardId) });
            switch (giftCardDetails.redemptionStatus) {
                case _common_1.ENUM.GIFT_CARD.REDEMPTION_STATUS.NOT_REDEEMED: {
                    if (bookingDetails.totalPayable > giftCardDetails.amount) {
                        let totalPayable = bookingDetails.totalPayable - giftCardDetails.amount;
                        if (totalPayable * 1 <= 0.5) {
                            return totalPayable;
                        }
                        let bookingPayload = {
                            giftCardAmount: giftCardDetails.amount,
                            giftCardStatus: _common_1.ENUM.BOOKING.GIFT_CARD_STATUS.APPLIED
                        };
                        await Promise.all([
                            exports.GiftV1.updateOne({
                                _id: mongoose_1.Types.ObjectId(giftCardDetails._id)
                            }, {
                                $set: {
                                    amount: 0,
                                    redemptionStatus: _common_1.ENUM.GIFT_CARD.REDEMPTION_STATUS.FULLY_REDEEMED,
                                    userId: (_a = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.userData) === null || _a === void 0 ? void 0 : _a.userId
                                },
                                $push: {
                                    bookingId: bookingDetails._id,
                                    redemptionDate: new Date()
                                }
                            }),
                            _entity_1.BookingV1.updateDocument({
                                _id: mongoose_1.Types.ObjectId(bookingDetails._id)
                            }, bookingPayload)
                        ]);
                        return await _services_1.roundOffNumbers(totalPayable);
                    }
                    else {
                        let totalPayable = bookingDetails.totalPayable - giftCardDetails.amount < 0 ? 0 : bookingDetails.totalPayable - giftCardDetails.amount;
                        if (totalPayable * 1 <= 0.5) {
                            return totalPayable;
                        }
                        let bookingPayload = {
                            giftCardAmount: bookingDetails.totalPayable,
                            giftCardStatus: _common_1.ENUM.BOOKING.GIFT_CARD_STATUS.APPLIED
                        };
                        await Promise.all([
                            exports.GiftV1.updateOne({
                                _id: mongoose_1.Types.ObjectId(giftCardDetails._id)
                            }, {
                                $set: {
                                    amount: giftCardDetails.amount - bookingDetails.totalPayable,
                                    redemptionStatus: _common_1.ENUM.GIFT_CARD.REDEMPTION_STATUS.PARTIALLY_REDEEMED,
                                    userId: (_b = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.userData) === null || _b === void 0 ? void 0 : _b.userId
                                },
                                $push: {
                                    bookingId: bookingDetails._id,
                                    redemptionDate: new Date()
                                }
                            }),
                            _entity_1.BookingV1.updateDocument({
                                _id: mongoose_1.Types.ObjectId(bookingDetails._id)
                            }, bookingPayload)
                        ]);
                        return totalPayable;
                    }
                }
                case _common_1.ENUM.GIFT_CARD.REDEMPTION_STATUS.PARTIALLY_REDEEMED: {
                    if (bookingDetails.totalPayable > giftCardDetails.amount) {
                        let totalPayable = bookingDetails.totalPayable - giftCardDetails.amount;
                        if (totalPayable * 1 <= 0.5) {
                            return totalPayable;
                        }
                        let bookingPayload = {
                            giftCardAmount: giftCardDetails.amount,
                            giftCardStatus: _common_1.ENUM.BOOKING.GIFT_CARD_STATUS.APPLIED
                        };
                        await Promise.all([
                            exports.GiftV1.updateOne({
                                _id: mongoose_1.Types.ObjectId(giftCardDetails._id)
                            }, {
                                $set: {
                                    amount: 0,
                                    redemptionStatus: _common_1.ENUM.GIFT_CARD.REDEMPTION_STATUS.FULLY_REDEEMED,
                                    userId: (_c = bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.userData) === null || _c === void 0 ? void 0 : _c.userId
                                },
                                $push: {
                                    bookingId: bookingDetails._id,
                                    redemptionDate: new Date()
                                }
                            }),
                            _entity_1.BookingV1.updateDocument({
                                _id: mongoose_1.Types.ObjectId(bookingDetails._id)
                            }, bookingPayload)
                        ]);
                        return totalPayable;
                    }
                }
            }
        }
        catch (error) {
            console.error(`we have an error while redeeming giftCard ==> ${error}`);
            throw error;
        }
    }
    async giftCardCheckout(bookingDetail, giftCardDetail) {
        var _a, _b;
        try {
            if ((bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.prolongedStatus) === _common_1.ENUM.BOOKING.PROLONGED_STATUS.PENDING
                && (bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.prolongBookingId)) {
                await _entity_1.BookingV1.updateOne({ _id: mongoose_1.Types.ObjectId(bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.prolongBookingId) }, {
                    $set: {
                        prolongedStatus: _common_1.ENUM.BOOKING.PROLONGED_STATUS.SUCCESS,
                        prolongBookingId: mongoose_1.Types.ObjectId(bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.prolongBookingId)
                    }
                }, {});
            }
            switch (giftCardDetail.redemptionStatus) {
                case _common_1.ENUM.GIFT_CARD.REDEMPTION_STATUS.NOT_REDEEMED: {
                    if (bookingDetail.totalPayable <= giftCardDetail.amount) {
                        let bookingPayload = {
                            giftCardAmount: bookingDetail.totalPayable,
                            giftCardStatus: _common_1.ENUM.BOOKING.GIFT_CARD_STATUS.APPLIED
                        };
                        await Promise.all([
                            exports.GiftV1.updateOne({
                                _id: mongoose_1.Types.ObjectId(giftCardDetail._id)
                            }, {
                                $set: {
                                    amount: giftCardDetail.amount - bookingDetail.totalPayable,
                                    redemptionStatus: _common_1.ENUM.GIFT_CARD.REDEMPTION_STATUS.PARTIALLY_REDEEMED,
                                    userId: (_a = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.userData) === null || _a === void 0 ? void 0 : _a.userId
                                },
                                $push: {
                                    bookingId: bookingDetail._id,
                                    redemptionDate: new Date()
                                }
                            }),
                            _entity_1.BookingV1.updateDocument({
                                _id: mongoose_1.Types.ObjectId(bookingDetail._id)
                            }, bookingPayload),
                            _entity_1.PayV1.giftCardCheckout(bookingDetail, giftCardDetail),
                            _services_1.Slack.postMessageToSlackUser(bookingDetail.propertyData.hostEmail, bookingDetail),
                        ]);
                        return await _services_1.roundOffNumbers(bookingDetail.totalPayable);
                    }
                    else
                        return;
                }
                case _common_1.ENUM.GIFT_CARD.REDEMPTION_STATUS.PARTIALLY_REDEEMED: {
                    if (bookingDetail.totalPayable <= giftCardDetail.amount) {
                        let bookingPayload = {
                            giftCardAmount: bookingDetail.totalPayable,
                            giftCardStatus: _common_1.ENUM.BOOKING.GIFT_CARD_STATUS.APPLIED
                        };
                        await Promise.all([
                            exports.GiftV1.updateOne({
                                _id: mongoose_1.Types.ObjectId(giftCardDetail._id)
                            }, {
                                $set: {
                                    amount: giftCardDetail.amount - bookingDetail.totalPayable,
                                    redemptionStatus: _common_1.ENUM.GIFT_CARD.REDEMPTION_STATUS.PARTIALLY_REDEEMED,
                                    userId: (_b = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.userData) === null || _b === void 0 ? void 0 : _b.userId
                                },
                                $push: {
                                    bookingId: bookingDetail._id,
                                    redemptionDate: new Date()
                                }
                            }),
                            _entity_1.BookingV1.updateDocument({
                                _id: mongoose_1.Types.ObjectId(bookingDetail._id)
                            }, bookingPayload)
                        ]);
                        return bookingDetail.totalPayable;
                    }
                }
            }
        }
        catch (error) {
            console.error(`we have an error while redeeming giftCard ==> ${error}`);
            throw error;
        }
    }
    async adminGiftCardListing(params) {
        try {
            let pipeline = [];
            let filterConditions = { $match: { $and: [] } };
            filterConditions.$match.$and.push({ buyerId: { $exists: true } });
            if (params && params.fromDate)
                filterConditions.$match.$and.push({ createdAt: { $gte: new Date(params.fromDate) } });
            if (params && params.toDate)
                filterConditions.$match.$and.push({ createdAt: { $lte: new Date(params.toDate) } });
            if (params && params.search)
                filterConditions.$match.$and.push({ $or: [{ 'from': { $regex: params.search, $options: "si" } }, { 'to': { $regex: params.search, $options: "si" } }] });
            pipeline.push(filterConditions);
            pipeline.push({ $sort: { createdAt: -1 } }),
                pipeline.push({
                    '$lookup': {
                        from: 'users',
                        "let": { "userId": "$buyerId" },
                        pipeline: [
                            {
                                '$match': {
                                    $and: [
                                        { $expr: { $eq: ['$_id', "$$userId"] } },
                                    ]
                                }
                            },
                            {
                                '$project': {
                                    name: 1,
                                    email: 1,
                                }
                            }
                        ],
                        as: 'userData'
                    }
                });
            pipeline.push({
                '$lookup': {
                    from: 'booking',
                    "let": { "booking": "$bookingId" },
                    pipeline: [
                        {
                            '$match': {
                                $and: [
                                    { $expr: { $in: ['$_id', "$$booking"] } },
                                ]
                            }
                        },
                        {
                            '$project': {
                                bookingId: 1,
                                fromDate: 1,
                                toDate: 1,
                                createdAt: 1,
                                giftCardAmount: 1,
                                totalPayable: 1,
                                basePrice: 1
                            }
                        }
                    ],
                    as: 'bookingData'
                }
            });
            pipeline.push({
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: false
                }
            });
            return await exports.GiftV1.paginateAggregate(pipeline, { getCount: true, limit: params && params.limit ? params.limit = parseInt(params.limit) : params.limit = 10, page: params.page });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async adminGiftCardDetails(params) {
        try {
            let pipeline = [];
            let filterConditions = { $match: { $and: [] } };
            filterConditions.$match.$and.push({ buyerId: { $exists: true } });
            filterConditions.$match.$and.push({ '_id': mongoose_1.Types.ObjectId(params.id) });
            pipeline.push(filterConditions);
            pipeline.push({
                '$lookup': {
                    from: 'users',
                    "let": { "userId": "$buyerId" },
                    pipeline: [
                        {
                            '$match': {
                                $and: [
                                    { $expr: { $eq: ['$_id', "$$userId"] } },
                                ]
                            }
                        },
                        {
                            '$project': {
                                name: 1,
                                email: 1,
                            }
                        }
                    ],
                    as: 'userData'
                }
            });
            pipeline.push({
                '$lookup': {
                    from: 'booking',
                    "let": { "booking": "$bookingId" },
                    pipeline: [
                        {
                            '$match': {
                                $and: [
                                    { $expr: { $in: ['$_id', "$$booking"] } },
                                ]
                            }
                        },
                        {
                            '$project': {
                                bookingId: 1,
                                fromDate: 1,
                                toDate: 1,
                                createdAt: 1,
                                giftCardAmount: 1,
                                totalPayable: 1,
                                basePrice: 1,
                                userData: 1
                            }
                        }
                    ],
                    as: 'bookingData'
                }
            });
            pipeline.push({
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: false
                }
            });
            return await exports.GiftV1.basicAggregate(pipeline);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }
}
exports.GiftV1 = new GiftCardEntity(giftcard_model_1.default);
//# sourceMappingURL=giftcard.v1.entity.js.map