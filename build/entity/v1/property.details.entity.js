"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const properties_model_1 = __importDefault(require("@models/properties.model"));
const _builders_1 = __importDefault(require("@builders"));
const rating_v1_entity_1 = require("./rating.v1.entity");
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const _baseController_1 = require("@baseController");
const userAnalytics_v1_entity_1 = require("./userAnalytics.v1.entity");
const host_promotions_v1_entity_1 = require("./host.promotions.v1.entity");
const partner_v1_entity_1 = require("./partner.v1.entity");
class PropertyDetailEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async postUpdatePropertyDocument(addPropertyResponse) {
        try {
            console.log("error inside here =>>>>>>>>>>>>>>>>>>>>");
            _common_1.DeepLink({ type: 1, shareId: addPropertyResponse._id });
            let url = `${_common_1.BASE.URL}/api/user/deeplink/?shareId=${addPropertyResponse._id.toString()}&type=1`;
            exports.PropertyV1.updateEntity({ _id: addPropertyResponse._id }, { shareUrl: url });
        }
        catch (error) {
            console.error(`we have an error while post update property doc ==> ${error}`);
        }
    }
    async patchHostDetail(hostDetail, payload) {
        var _a, _b, _c, _d, _e, _f;
        try {
            const hostDetailToSave = {
                name: hostDetail.name,
                userId: hostDetail._id,
                image: hostDetail.image,
                email: hostDetail.email,
                fbUrl: hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.fbUrl,
                instaUrl: hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.instaUrl,
                twitterUrl: hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.twitterUrl,
                youtubeUrl: hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.youtubeUrl,
                linkedinUrl: hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.linkedinUrl
            };
            payload['userData'] = hostDetailToSave;
            if ((payload === null || payload === void 0 ? void 0 : payload.addressPrimary) && (payload === null || payload === void 0 ? void 0 : payload.addressSecondary)) {
                payload['address'] = (payload === null || payload === void 0 ? void 0 : payload.addressPrimary) + ', ' + (payload === null || payload === void 0 ? void 0 : payload.addressSecondary) + ', ' + ((_a = payload === null || payload === void 0 ? void 0 : payload.city) === null || _a === void 0 ? void 0 : _a.cityName) + ', ' + ((_b = payload === null || payload === void 0 ? void 0 : payload.state) === null || _b === void 0 ? void 0 : _b.name) + ', ' + ((_c = payload === null || payload === void 0 ? void 0 : payload.country) === null || _c === void 0 ? void 0 : _c.name);
            }
            else {
                payload['address'] = (payload === null || payload === void 0 ? void 0 : payload.addressPrimary) + ', ' + ((_d = payload === null || payload === void 0 ? void 0 : payload.city) === null || _d === void 0 ? void 0 : _d.cityName) + ', ' + ((_e = payload === null || payload === void 0 ? void 0 : payload.state) === null || _e === void 0 ? void 0 : _e.name) + ', ' + ((_f = payload === null || payload === void 0 ? void 0 : payload.country) === null || _f === void 0 ? void 0 : _f.name);
            }
            return payload;
        }
        catch (error) {
            console.error(`we have an error while updating payload in batch ==> ${error}`);
        }
    }
    async saveProperty(payload) {
        try {
            const propertyDetail = await new this.model(payload).save();
            return propertyDetail;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async updateProperty(payload, id) {
        try {
            return await this.updateDocument({ '_id': mongoose_1.Types.ObjectId(id) }, payload);
        }
        catch (error) {
            console.error(`we have an error in update property ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async fetchPropertyDetails(payload) {
        try {
            let pipeline = _builders_1.default.User.UserPropertyBuilder.userPropertyDetails(payload);
            let details = await exports.PropertyV1.basicAggregate(pipeline);
            return details;
        }
        catch (error) {
            console.error(`we have an error while fetching property detail => ${error}`);
            return Promise.reject(error);
        }
    }
    async fetchProperties(payload) {
        try {
            let pipeline = _builders_1.default.User.UserPropertyBuilder.propertyDetails(payload);
            let details = await exports.PropertyV1.basicAggregate(pipeline);
            return details;
        }
        catch (error) {
            console.error(`we have an error while fetching property detail => ${error}`);
            return Promise.reject(error);
        }
    }
    async updateAnalytics(payload, hostId) {
        try {
            await userAnalytics_v1_entity_1.UserAnalyticsV1.updateOne({ userId: mongoose_1.Types.ObjectId(payload.userId), propertyId: mongoose_1.Types.ObjectId(payload.propertyId) }, {
                userId: payload.userId,
                hostId: hostId,
                propertyId: payload.id,
                $inc: { viewCount: 1 }
            }, { upsert: true, new: true });
            await host_promotions_v1_entity_1.PromotionV1.updateAdAnalytics(payload === null || payload === void 0 ? void 0 : payload.propertyId);
        }
        catch (err) {
        }
    }
    async updateAverageRatingAndCount(payload) {
        try {
            let pipeline = _builders_1.default.User.UserPropertyBuilder.propertyAvergeRating(payload);
            let details = await rating_v1_entity_1.RatingV1.basicAggregate(pipeline);
            return details;
        }
        catch (error) {
            console.error(`we have an error while fetching property detail => ${error}`);
            return Promise.reject(error);
        }
    }
    async getPropertyCount(payload) {
        let pipeline = [];
        let matchCriteria = [];
        matchCriteria.push({ 'status': 'active' });
        if (payload.fromDate)
            matchCriteria.push({ createdAt: { $gte: new Date(payload.fromDate) } });
        if (payload.toDate)
            matchCriteria.push({ createdAt: { $lte: new Date(payload.toDate) } });
        pipeline.push({ $match: { $and: matchCriteria } });
        pipeline.push({ $group: { _id: null, count: { $sum: 1 } } }, { $project: { _id: 0 } });
        let details = await exports.PropertyV1.basicAggregate(pipeline);
        details && details.length > 0 ? details = details[0] : details = { count: 0 };
        return details.count;
    }
    async getHolidayList(payload) {
        let pipeline = [];
        let matchCriteria = [];
        matchCriteria.push({ "_id": mongoose_1.Types.ObjectId(payload.propertyId) });
        pipeline.push({
            $match: {
                $and: [
                    { "_id": mongoose_1.Types.ObjectId(payload.propertyId) },
                    {
                        holidays: {
                            $elemMatch: { fromDate: { $lte: _common_1.DATABASE.DATE_CONSTANTS.fromDate(payload.fromDate, payload.offset) } }
                        }
                    },
                    {
                        holidays: {
                            $elemMatch: { toDate: { $gte: _common_1.DATABASE.DATE_CONSTANTS.toDate(payload.fromDate, payload.offset) } }
                        }
                    }
                ]
            }
        });
        pipeline.push({
            $unwind: {
                path: "$holidays",
            }
        }, {
            $project: {
                propertyId: '$_id',
                _id: '$holidays._id',
                name: '$holidays.name',
                createdAt: '$holidays.createdAt',
                fromDate: '$holidays.fromDate',
                toDate: '$holidays.toDate',
            }
        });
        let details = await exports.PropertyV1.basicAggregate(pipeline);
        return details;
    }
    async validateAndUpdateProperty(property, payload, headers, res, next) {
        try {
            if ((property.userId).toString() == (payload.userId).toString()) {
                const propertyData = await this.formatUpdatePropertyPayload(payload, property);
                const updatedPropertyResponse = await exports.PropertyV1.updateProperty(payload, payload.id);
                await this.updateFloorsInPromises(propertyData, updatedPropertyResponse, payload, res, headers, next);
                return _baseController_1.handleEntityResponse.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_UPDATED);
            }
            else
                return _baseController_1.handleEntityResponse.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_AUTHRIZED);
        }
        catch (error) {
            console.error(`we have an error in validateAndUpdateProperty ==> ${error}`);
            next(error);
        }
    }
    async updateFloorsInPromises(propertyData, updatedPropertyResponse, payload, res, headers, next) {
        try {
            await Promise.all([
                _entity_1.PropertySpaceV1.updateFloors(updatedPropertyResponse, payload, res, headers, next),
                _entity_1.BookingCartV1.updateEntity({ "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.id) }, { "propertyData": propertyData }, { multi: true }),
                _entity_1.BookingV1.updateEntity({ "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.id) }, { "propertyData": propertyData }, { multi: true })
            ]);
        }
        catch (error) {
            console.error(`we have an error in updateFloorsInPromises ==> ${error}`);
            next(error);
        }
    }
    async formatUpdatePropertyPayload(payload, property) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        try {
            console.log("==>>>>>>>>>>>>> user data", property.userData);
            let propertyData = {
                status: property.status,
                propertyId: property._id,
                name: property.name,
                address: property === null || property === void 0 ? void 0 : property.address,
                images: property.images,
                autoAcceptUpcomingBooking: property.autoAcceptUpcomingBooking,
                hostName: (_a = property === null || property === void 0 ? void 0 : property.userData) === null || _a === void 0 ? void 0 : _a.name,
                hostImage: (_b = property === null || property === void 0 ? void 0 : property.userData) === null || _b === void 0 ? void 0 : _b.image,
                hostEmail: (_c = property === null || property === void 0 ? void 0 : property.userData) === null || _c === void 0 ? void 0 : _c.email
            };
            console.log(".............============>>>>>>>>>>> property data", propertyData);
            if (payload.images)
                propertyData['images'] = payload.images;
            if ((payload === null || payload === void 0 ? void 0 : payload.addressPrimary) && (payload === null || payload === void 0 ? void 0 : payload.addressSecondary)) {
                payload['address'] = (payload === null || payload === void 0 ? void 0 : payload.addressPrimary) + ', ' + (payload === null || payload === void 0 ? void 0 : payload.addressSecondary) + ', ' + ((_d = payload === null || payload === void 0 ? void 0 : payload.city) === null || _d === void 0 ? void 0 : _d.cityName) + ', ' + ((_e = payload === null || payload === void 0 ? void 0 : payload.state) === null || _e === void 0 ? void 0 : _e.name) + ', ' + ((_f = payload === null || payload === void 0 ? void 0 : payload.country) === null || _f === void 0 ? void 0 : _f.name);
            }
            else {
                payload['address'] = (payload === null || payload === void 0 ? void 0 : payload.addressPrimary) + ', ' + ((_g = payload === null || payload === void 0 ? void 0 : payload.city) === null || _g === void 0 ? void 0 : _g.cityName) + ', ' + ((_h = payload === null || payload === void 0 ? void 0 : payload.state) === null || _h === void 0 ? void 0 : _h.name) + ', ' + ((_j = payload === null || payload === void 0 ? void 0 : payload.country) === null || _j === void 0 ? void 0 : _j.name);
            }
            if (payload.name) {
                propertyData['name'] = payload['name'];
                Promise.all([
                    _entity_1.PropertySpaceV1.updateEntity({ propertyId: mongoose_1.Types.ObjectId(payload.id) }, { propertyName: payload.name }, { multi: true }),
                    partner_v1_entity_1.PartnerV1.updateEntity({ "property._id": mongoose_1.Types.ObjectId(payload.id) }, { "property.name": payload.name }, { multi: true })
                ]);
            }
            return propertyData;
        }
        catch (error) {
            console.error(`we have an error in formatUpdatePropertyPayload ==> ${error}`);
        }
    }
    async handlePayload(payload) {
        var _a, _b, _c, _d, _e;
        try {
            if (!(payload === null || payload === void 0 ? void 0 : payload.name)) {
                delete payload.name;
            }
            ;
            if (!(payload === null || payload === void 0 ? void 0 : payload.addressPrimary)) {
                delete payload.addressPrimary;
            }
            ;
            if (!(payload === null || payload === void 0 ? void 0 : payload.addressSecondary)) {
                delete payload.addressSecondary;
            }
            ;
            if (!(payload === null || payload === void 0 ? void 0 : payload.zipCode)) {
                delete payload.zipCode;
            }
            ;
            if (!(payload === null || payload === void 0 ? void 0 : payload.images)) {
                delete payload.images;
            }
            ;
            if (!(payload === null || payload === void 0 ? void 0 : payload.heading)) {
                delete payload.heading;
            }
            ;
            if (!(payload === null || payload === void 0 ? void 0 : payload.description)) {
                delete payload.description;
            }
            ;
            if (!(payload === null || payload === void 0 ? void 0 : payload.amenities)) {
                delete payload.amenities;
            }
            ;
            if (!(payload === null || payload === void 0 ? void 0 : payload.address)) {
                delete payload.address;
            }
            ;
            if (!((_a = payload === null || payload === void 0 ? void 0 : payload.country) === null || _a === void 0 ? void 0 : _a._id)) {
                delete payload.country;
            }
            ;
            if (!((_b = payload === null || payload === void 0 ? void 0 : payload.state) === null || _b === void 0 ? void 0 : _b._id)) {
                delete payload.state;
            }
            ;
            if (!((_c = payload === null || payload === void 0 ? void 0 : payload.city) === null || _c === void 0 ? void 0 : _c._id)) {
                delete payload.city;
            }
            ;
            if (!((_d = payload === null || payload === void 0 ? void 0 : payload.location) === null || _d === void 0 ? void 0 : _d.coordinates)) {
                delete payload.location;
            }
            ;
            if (!(payload === null || payload === void 0 ? void 0 : payload.propertyType)) {
                delete payload.propertyType;
            }
            ;
            if (!(payload === null || payload === void 0 ? void 0 : payload.termsAndCond)) {
                delete payload.termsAndCond;
            }
            ;
            if (((_e = payload === null || payload === void 0 ? void 0 : payload.floorDetails) === null || _e === void 0 ? void 0 : _e.length) <= 0) {
                delete payload.floorDetails;
            }
            ;
            if (!(payload === null || payload === void 0 ? void 0 : payload.status)) {
                delete payload.status;
            }
            ;
            if (!(payload === null || payload === void 0 ? void 0 : payload.propertyId)) {
                delete payload.propertyId;
            }
            ;
            if (!(payload === null || payload === void 0 ? void 0 : payload.totalUnits)) {
                delete payload.totalUnits;
            }
            ;
            if (payload === null || payload === void 0 ? void 0 : payload.location) {
                payload.location.type = "Point";
            }
            ;
            if (!(payload === null || payload === void 0 ? void 0 : payload.capacity)) {
                payload === null || payload === void 0 ? true : delete payload.capacity;
            }
            ;
            return payload;
        }
        catch (error) {
            console.error(`we have an error in handlePayload ==> ${error}`);
        }
    }
    async fetchPropertyListingForOffline(payload) {
        try {
            let pipeline = [];
            let bookingTypeFilterCondition = {};
            switch (payload.bookingType) {
                case _common_1.ENUM.USER.BOOKING_TYPE.HOURLY:
                    bookingTypeFilterCondition = { $eq: ["$bookingType", _common_1.ENUM.USER.BOOKING_TYPE.HOURLY] };
                    break;
                case _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY:
                    bookingTypeFilterCondition = { $eq: ["$bookingType", _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY] };
                    break;
                case _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM:
                    bookingTypeFilterCondition = { $eq: ["$bookingType", _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM] };
                    break;
            }
            pipeline.push({
                $match: {
                    $and: [{ userId: mongoose_1.Types.ObjectId(payload.userId) },
                        { _id: { $nin: payload.holidayProperties } },
                        { status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE }]
                },
            });
            pipeline.push({
                "$lookup": {
                    "from": "propertySpace",
                    "let": { "propertyId": "$_id" },
                    "pipeline": [
                        {
                            '$match': {
                                $expr: {
                                    $and: [
                                        { $eq: ['$propertyId', '$$propertyId'] },
                                        { $eq: ["$status", 'active'] },
                                        {
                                            '$eq': [
                                                '$isEmployee',
                                                false
                                            ]
                                        },
                                        bookingTypeFilterCondition ? bookingTypeFilterCondition : bookingTypeFilterCondition = {}
                                    ]
                                }
                            }
                        },
                        { $project: { "categoryName": "$category.name", units: 1, pricing: 1, "categoryId": "$category._id", "capacity": "$capacity", "subCategoryName": "$subCategory.name" } }
                    ],
                    "as": "spaceDetails"
                }
            });
            pipeline.push({ $match: { spaceDetails: { $ne: [] } } });
            pipeline.push({
                $project: {
                    _id: 1, address: 1, name: 1
                }
            });
            return await exports.PropertyV1.basicAggregate(pipeline);
        }
        catch (error) {
            console.error(`we have an error while fetching property detail => ${error}`);
            return Promise.reject(error);
        }
    }
}
exports.PropertyV1 = new PropertyDetailEntity(properties_model_1.default);
//# sourceMappingURL=property.details.entity.js.map