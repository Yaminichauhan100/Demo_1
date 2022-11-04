"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostPropertyController = void 0;
const mongoose_1 = require("mongoose");
const _entity_1 = require("@entity");
const _builders_1 = __importDefault(require("@builders"));
const _baseController_1 = __importDefault(require("@baseController"));
const swagger_express_ts_1 = require("swagger-express-ts");
const _common_1 = require("@common");
const _services_1 = require("@services");
const htmlHelper_1 = require("../../htmlHelper");
const calendar_model_1 = __importDefault(require("@models/calendar.model"));
const booking_model_1 = __importDefault(require("@models/booking.model"));
let HostPropertyClass = class HostPropertyClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async addProperty(req, res, next) {
        var _a;
        try {
            let payload = req === null || req === void 0 ? void 0 : req.body;
            payload['hostId'] = (_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.userId;
            if (payload.location) {
                payload.location.type = "Point";
            }
            ;
            const headers = req.headers;
            (payload === null || payload === void 0 ? void 0 : payload.status) === _common_1.ENUM.PROPERTY.STATUS.ACTIVE ?
                payload['status'] = _common_1.ENUM.PROPERTY.STATUS.ACTIVE :
                payload['status'] = _common_1.ENUM.PROPERTY.STATUS.DRAFT;
            if (payload === null || payload === void 0 ? void 0 : payload.propertyId) {
                await Promise.all([
                    _entity_1.PropertyV1.remove({ _id: mongoose_1.Types.ObjectId(payload.propertyId) }),
                    _entity_1.PropertySpaceV1.removeAll({ propertyId: mongoose_1.Types.ObjectId(payload.propertyId) }),
                    _entity_1.OPriceV1.removeAll({ propertyId: mongoose_1.Types.ObjectId(payload.propertyId) })
                ]);
            }
            payload = await _entity_1.PropertyV1.handlePayload(payload);
            const hostDetail = await _entity_1.HostV1.findOne({ _id: mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.hostId) });
            if ((hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.profileCompleted) == false &&
                (payload === null || payload === void 0 ? void 0 : payload.status) === _common_1.ENUM.PROPERTY.STATUS.ACTIVE) {
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).INCOMPLETE_PROFILE);
            }
            if ((hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.accountStatus) == _common_1.ENUM.USER.ACCOUNT_STATUS.UNVERIFIED &&
                (payload === null || payload === void 0 ? void 0 : payload.status) === _common_1.ENUM.PROPERTY.STATUS.ACTIVE) {
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_ALLOWED);
            }
            payload = await _entity_1.CoHostV1.checkAccessLevels(res, payload);
            payload = await _entity_1.PropertyV1.patchHostDetail(hostDetail, payload);
            if (res.locals.userData.isCohost) {
                payload['coHostId'] = await this.updatePropertyAfterAddition(payload);
            }
            const addPropertyResponse = await _entity_1.PropertyV1.saveProperty(payload);
            await Promise.all([
                _entity_1.PropertySpaceV1.addFloors(addPropertyResponse, payload, res, headers),
                _entity_1.PropertyV1.postUpdatePropertyDocument(addPropertyResponse)
            ]);
            if ((payload === null || payload === void 0 ? void 0 : payload.status) === _common_1.ENUM.PROPERTY.STATUS.ACTIVE) {
                await _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(payload['hostId']) }, { $inc: { propertyCount: 1 } });
            }
            return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_SAVED, {
                propertyId: addPropertyResponse._id,
                status: addPropertyResponse.status
            });
        }
        catch (err) {
            console.error(`we have an error while adding property ==> ${err}`);
            next(err);
        }
    }
    async updatePropertyAfterAddition(payload) {
        payload.cityId = mongoose_1.Types.ObjectId(payload.cityId);
        let mySet = new Set();
        let [countryLevel, stateLevel, cityLevel] = await Promise.all([
            _entity_1.CoHostV1.findMany({ hostId: mongoose_1.Types.ObjectId(payload.userId), "country.id": payload.countryId, accessLevel: 1 }, { cohostId: 1, _id: 0 }),
            _entity_1.CoHostV1.findMany({ hostId: mongoose_1.Types.ObjectId(payload.userId), "country.id": payload.countryId, "state.id": payload.stateId, accessLevel: 2 }, { cohostId: 1, _id: 0 }),
            _entity_1.CoHostV1.findMany({ hostId: mongoose_1.Types.ObjectId(payload.userId), "country.id": payload.countryId, "state.id": payload.stateId, "city._id": payload.cityId, accessLevel: 3 }, { cohostId: 1, _id: 0 })
        ]);
        for (let i = 0; i < countryLevel.length; i++)
            mySet.add(countryLevel[i].cohostId);
        for (let i = 0; i < stateLevel.length; i++)
            mySet.add(stateLevel[i].cohostId);
        for (let i = 0; i < cityLevel.length; i++)
            mySet.add(cityLevel[i].cohostId);
        let array = Array.from(mySet);
        return array;
    }
    async validateFloorForPartners(req, res, next) {
        var _a;
        try {
            let partnerFloorAssociate = await _entity_1.PropertySpaceV1.findMany({ propertyId: mongoose_1.Types.ObjectId((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.propertyId), floorNumber: req.body.floorNumber, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE, partnerId: { $exists: true } });
            if (partnerFloorAssociate.length > 0)
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).BAD_EMPLOYEE_REQUEST);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            console.error(`we have an error while validateFloorForPartners ==> ${err}`);
            next(err);
        }
    }
    async validateFloorForEmployeeUnits(req, res, next) {
        try {
            let partnerFloorAssociate = await _entity_1.PropertySpaceV1.findOne({ _id: mongoose_1.Types.ObjectId(req.body.spaceId), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE, partnerId: { $exists: true } });
            if (partnerFloorAssociate)
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).BAD_EMPLOYEE_REQUEST);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            console.error(`we have an error while validateFloorForEmployeeUnits ==> ${err}`);
            next(err);
        }
    }
    async updateProperty(req, res, next) {
        try {
            let payload = req.body;
            payload['userId'] = mongoose_1.Types.ObjectId(res.locals.userId);
            const headers = req.headers;
            if (payload.location) {
                payload.location.type = "Point";
            }
            ;
            const property = await _entity_1.PropertyV1.findOne({ '_id': mongoose_1.Types.ObjectId(payload.id), userId: payload.userId });
            if (property) {
                await _entity_1.PropertyV1.validateAndUpdateProperty(property, payload, headers, res, next);
            }
            else
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            console.error(`we have an error while updating property ==> ${err}`);
            next(err);
        }
    }
    async propertySpaceList(req, res, next) {
        try {
            let payload = req.params;
            let pipeline = _builders_1.default.User.HostBUilder.propertySpaceDetails(payload.id);
            let details = await _entity_1.PropertySpaceV1.basicAggregate(pipeline);
            if (details)
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, details);
            else
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY_SPACE(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async propertySpaceListByCategory(req, res, next) {
        try {
            let payload = req.query;
            let pipeline = _builders_1.default.User.HostBUilder.propertySpaceDetailsBycategory(payload);
            let details = await _entity_1.PropertySpaceV1.basicAggregate(pipeline);
            if (details)
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, details);
            else
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY_SPACE(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            next(err);
        }
    }
    async propertyFloorCount(req, res, next) {
        try {
            let payload = req.params;
            let details = await _entity_1.PropertySpaceV1.distinct("floorNumber", { propertyId: mongoose_1.Types.ObjectId(payload.propertyId), isEmployee: true, status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, details);
        }
        catch (err) {
            next(err);
        }
    }
    async propertyDetails(req, res, next) {
        try {
            let payload = req.params;
            let pipeline = _builders_1.default.User.UserPropertyBuilder.PropertyDetails(payload.id);
            let details = await _entity_1.PropertyV1.basicAggregate(pipeline);
            if (details)
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, details);
            else
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            console.error(`we have an error in property details ==> ${err}`);
            next(err);
        }
    }
    async activateProperty(req, res, next) {
        try {
            let host;
            switch (req.body.type) {
                case _common_1.PROPERTY_STATUS.ACTIVATE:
                    host = await _entity_1.PropertyV1.updateDocument({ _id: mongoose_1.Types.ObjectId(req.body.id) }, { status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE });
                    await _entity_1.HostV1.update({ _id: mongoose_1.Types.ObjectId(host.userId) }, { $inc: { propertyCount: 1 } });
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_ACTIVATED);
                case _common_1.PROPERTY_STATUS.INACTIVATE:
                    host = await _entity_1.PropertyV1.updateDocument({ _id: mongoose_1.Types.ObjectId(req.body.id) }, { status: _common_1.ENUM.PROPERTY.STATUS.INACTIVE });
                    await _entity_1.HostV1.update({ _id: mongoose_1.Types.ObjectId(host.userId) }, { $inc: { propertyCount: -1 } });
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_DE_ACTIVATED);
                case _common_1.PROPERTY_STATUS.ARCHIVE:
                    host = await _entity_1.PropertyV1.updateDocument({ _id: mongoose_1.Types.ObjectId(req.body.id) }, { status: _common_1.ENUM.PROPERTY.STATUS.ARCHIVE });
                    await _entity_1.HostV1.update({ _id: mongoose_1.Types.ObjectId(host.userId) }, { $inc: { propertyCount: -1 } });
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_DELETED_SUCCESSFULLY);
                case _common_1.PROPERTY_STATUS.ISDELETE:
                    host = await _entity_1.PropertyV1.updateDocument({ _id: mongoose_1.Types.ObjectId(req.body.id) }, { status: _common_1.ENUM.PROPERTY.STATUS.ISDELETE });
                    await _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(host.userId) }, { $inc: { propertyCount: -1 } });
                    return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_DELETED_SUCCESSFULLY);
            }
        }
        catch (err) {
            next(err);
        }
    }
    async amenitiesListing(req, res, next) {
        try {
            let amenities = await _entity_1.AmenitiesV1.basicAggregate([
                { $match: { status: 'active' } },
                {
                    $group: {
                        _id: { type: "$type" },
                        amenitiesData: {
                            $addToSet: {
                                iconImage: "$iconImage",
                                isDelete: "$isDelete",
                                name: "$name",
                                status: "$status",
                                type: "$type",
                                _id: "$_id"
                            }
                        }
                    }
                },
                { $sort: { "_id.type": 1 } }
            ]);
            return this.sendResponse(res, _common_1.RESPONSE.USER(res.locals.lang).AMINTIES_LISTING, amenities);
        }
        catch (err) {
            next(err);
        }
    }
    async getParentCategories(req, res, next) {
        try {
            let categoryList = await _entity_1.CategoryV1.basicAggregate(_builders_1.default.User.UserPropertyBuilder.parentCategories());
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, categoryList);
        }
        catch (err) {
            console.error(`we have an error while getParentCategories ==> ${err}`);
            next(err);
        }
    }
    async getArchievedProperty(req, res, next) {
        try {
            let payload = req.query;
            payload.userId = res.locals.userId;
            payload.userData = res.locals.userData;
            payload.getCount = true;
            let pipeline = await _builders_1.default.User.HostBUilder.archievePropertyList(payload);
            let propertyList = await Promise.all([
                _entity_1.PropertyV1.paginateAggregate(pipeline, payload),
                _entity_1.PropertyV1.count({ userId: mongoose_1.Types.ObjectId(payload.userId), status: { $eq: _common_1.ENUM.PROPERTY.STATUS.ARCHIVE } })
            ]);
            propertyList[0].propertyCount = propertyList[1];
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, propertyList[0]);
        }
        catch (err) {
            next(err);
        }
    }
    async getMyProperties(req, res, next) {
        try {
            let payload = req.query;
            payload.userId = res.locals.userId;
            let categoryArray = [];
            let subCategoryArray = [];
            payload.userData = res.locals.userData;
            if (payload.categoryIds) {
                categoryArray = payload.categoryIds.split(",");
                for (let i = 0; i < categoryArray.length; i++) {
                    categoryArray[i] = mongoose_1.Types.ObjectId(categoryArray[i]);
                }
                categoryArray = await _entity_1.PropertySpaceV1.findMany({ "category._id": { $in: categoryArray } }, { _id: 0, propertyId: 1 });
                for (let i = 0; i < categoryArray.length; i++) {
                    categoryArray[i] = categoryArray[i].propertyId;
                }
                if (categoryArray.length) {
                    payload.categoryArray = categoryArray;
                }
            }
            if (payload.subCategoryIds) {
                subCategoryArray = payload.subCategoryIds.split(",");
                for (let i = 0; i < subCategoryArray.length; i++) {
                    subCategoryArray[i] = mongoose_1.Types.ObjectId(subCategoryArray[i]);
                }
                subCategoryArray = await _entity_1.PropertySpaceV1.findMany({ "subCategory._id": { $in: subCategoryArray } }, { _id: 0, propertyId: 1 });
                for (let i = 0; i < subCategoryArray.length; i++) {
                    subCategoryArray[i] = subCategoryArray[i].propertyId;
                }
                if (subCategoryArray.length) {
                    payload.subCategoryArray = subCategoryArray;
                }
            }
            payload.getCount = true;
            let pipeline = await _builders_1.default.User.HostBUilder.propertyList(payload);
            let propertyList = await _entity_1.PropertyV1.paginateAggregate(pipeline, payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, propertyList);
        }
        catch (err) {
            next(err);
        }
    }
    async getChildCategories(req, res, next) {
        try {
            let childCategories = await _entity_1.CategoryV1.findMany({ status: 'active', parentId: mongoose_1.Types.ObjectId(req.params.parentId) });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, childCategories);
        }
        catch (err) {
            next(err);
        }
    }
    async addPropertySpaces(req, res, next) {
        try {
            let payload = req.body;
            let headers = req.headers;
            let offset = headers.offset;
            payload.userId = mongoose_1.Types.ObjectId(res.locals.userId);
            let result = await _entity_1.HostV1.addPropertySpace(payload);
            if (!result)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).DUPLICATE_SPACE_ID);
            if (payload.offerPrice && payload.offerPrice.length > 0) {
                await _entity_1.OPriceV1.saveMultipleOfferPrice(payload.offerPrice, result._id, result.propertyId, parseInt(offset));
            }
            _entity_1.PropertyV1.updateOne({ _id: mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.propertyId) }, {
                $inc: { totalUnits: parseInt(payload === null || payload === void 0 ? void 0 : payload.units), totalCapacity: payload.capacity }
            });
            return await this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).PROPERTY_SPACE_ADDED);
        }
        catch (err) {
            console.error(`we have an error in host property controller ==> ${err}`);
            next(err);
        }
    }
    async updatePropertySpaces(req, res, next) {
        var _a;
        try {
            let payload = req.body;
            let headers = req.headers;
            let offset = headers.offset;
            let capacityFromDb = await _entity_1.PropertySpaceV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.id) });
            let response = await _entity_1.HostV1.updatePropertySpace(payload, res, next);
            if (!response)
                return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).DUPLICATE_SPACE_ID);
            if (((_a = payload === null || payload === void 0 ? void 0 : payload.offerPrice) === null || _a === void 0 ? void 0 : _a.length) > 0 && (payload === null || payload === void 0 ? void 0 : payload.isOfferPrice)) {
                await _entity_1.OPriceV1.updateMultipleOfferPrice(payload.offerPrice, response._id, response.propertyId, offset);
            }
            let differenceInUnits;
            (response === null || response === void 0 ? void 0 : response.units) > (payload === null || payload === void 0 ? void 0 : payload.units) ? differenceInUnits = response.units - payload.units : differenceInUnits = response.units - payload.units;
            _entity_1.PropertyV1.updateOne({ _id: mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.propertyId) }, {
                $inc: { totalUnits: differenceInUnits }
            });
            if (payload.capacity) {
                let differenceInCapacity;
                if ((capacityFromDb === null || capacityFromDb === void 0 ? void 0 : capacityFromDb.capacity) != (payload === null || payload === void 0 ? void 0 : payload.capacity)) {
                    differenceInCapacity = parseInt(payload.capacity) - parseInt(capacityFromDb.capacity);
                    _entity_1.PropertyV1.updateOne({ _id: mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.propertyId) }, {
                        $inc: { totalCapacity: differenceInCapacity }
                    });
                }
            }
            return this.sendResponse(res, _common_1.RESPONSE.HOST(res.locals.lang).PROPERTY_SPACE_ADDED);
        }
        catch (err) {
            console.error(`we have an error in updatePropertySpaces controller ==> ${err}`);
            next(err);
        }
    }
    async getDynamicPriceLabels(req, res, next) {
        try {
            let result = [
                {
                    discountLabelType: _common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.BOOKING_DURATION,
                    heading: "By Durations",
                    months: 0,
                    days: 0,
                    discountPercentage: 0
                },
                {
                    discountLabelType: _common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.ADVANCE_BOOKING_DURATION,
                    heading: "By Durations",
                    months: 0,
                    days: 0,
                    discountPercentage: 0
                },
                {
                    discountLabelType: _common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.UNITS,
                    heading: "By Units",
                    minUnits: 0,
                    maxUnits: 0,
                    discountPercentage: 0
                },
            ];
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, result);
        }
        catch (err) {
            next(err);
        }
    }
    async fetchPropertySpaceDetail(req, res, next) {
        try {
            const { spaceId } = req.query;
            const response = await _entity_1.HostV1.fetchSpaceDetail(spaceId);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`we have an error in host properties controller ==> {error}`);
            next(error);
        }
    }
    async activatePropertySpace(req, res, next) {
        try {
            let property;
            switch (req.body.type) {
                case _common_1.PROPERTY_STATUS.ACTIVATE:
                    property = await _entity_1.PropertySpaceV1.findOne({ _id: req.body.id });
                    if (property) {
                        if (property.status != _common_1.ENUM.PROPERTY.STATUS.ACTIVE) {
                            await _entity_1.PropertySpaceV1.updateDocument({ _id: property._id }, { status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE });
                            return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_ACTIVATED);
                        }
                        else
                            return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_ALREADY_ACTIVE);
                    }
                    else
                        return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_FOUND);
                case _common_1.PROPERTY_STATUS.INACTIVATE:
                    property = await _entity_1.PropertySpaceV1.findOne({ _id: req.body.id });
                    if (property) {
                        if (property.status != _common_1.ENUM.PROPERTY.STATUS.INACTIVE) {
                            await _entity_1.PropertySpaceV1.updateDocument({ _id: property._id }, { status: _common_1.ENUM.PROPERTY.STATUS.INACTIVE });
                            return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_DE_ACTIVATED);
                        }
                        else
                            return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_ALREADY_DE_ACTIVE);
                    }
                    else
                        return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_FOUND);
                case _common_1.PROPERTY_STATUS.ARCHIVE:
                    property = await _entity_1.PropertySpaceV1.findOne({ _id: req.body.id });
                    if (property) {
                        if (property.status != _common_1.ENUM.PROPERTY.STATUS.INACTIVE) {
                            await _entity_1.PropertySpaceV1.updateDocument({ _id: property._id }, { status: _common_1.ENUM.PROPERTY_SPACE.STATUS.ISDELETE });
                            return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_DELETED_SUCCESSFULLY);
                        }
                        else
                            return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_FOUND);
                    }
                    else
                        return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_FOUND);
            }
        }
        catch (err) {
            next(err);
        }
    }
    async bookingHistory(req, res, next) {
        try {
            let payload = req.query;
            payload.userId = res.locals.userId;
            payload.userData = res.locals.userData;
            let pipeline = await _builders_1.default.User.UserPropertyBuilder.BookingFilter(payload);
            let data = await _entity_1.BookingV1.paginateAggregate(pipeline, Object.assign(Object.assign({}, payload), { getCount: true }));
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
    async cancelBooking(req, res, next) {
        var _a, _b, _c, _d, _e, _f;
        try {
            let payload = req.body;
            payload['hostId'] = res.locals.userId;
            let data = await _entity_1.BookingV1.updateDocument({
                "hostId": mongoose_1.Types.ObjectId(payload.hostId),
                _id: mongoose_1.Types.ObjectId(payload.bookingId)
            }, {
                bookingStatus: _common_1.ENUM.BOOKING.STATUS.CANCELLED,
                reason: payload.reason,
                description: payload.description,
                cancelledBy: _common_1.ENUM.USER.TYPE.HOST
            });
            let hostHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/booking/cancellation.by.host.html", {
                logo: _common_1.CONSTANT.PAM_LOGO,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                igLogo: _common_1.CONSTANT.IG_LOGO,
                bookingId: data === null || data === void 0 ? void 0 : data.bookingId,
                userName: (_a = data === null || data === void 0 ? void 0 : data.userData) === null || _a === void 0 ? void 0 : _a.name,
                hostName: (_b = data === null || data === void 0 ? void 0 : data.propertyData) === null || _b === void 0 ? void 0 : _b.hostName,
                redirectionUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/host/booking/booking-details/${payload.bookingId}` : `${_common_1.WEB_PANELS.HOST_PANEL_PROD}/host/booking/booking-details/${payload.bookingId}`,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : _common_1.WEB_PANELS.HOST_PANEL_PROD,
                CONTACT_US: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_HOST_STAGING : _common_1.WEB_PANELS.CONTACT_US_PAM_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_HOST_STAGING : _common_1.WEB_PANELS.FAQ_PAM_PROD,
            });
            let userHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/booking/cancellation.user.html", {
                logo: _common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                igLogo: _common_1.CONSTANT.IG_LOGO,
                bookingId: data === null || data === void 0 ? void 0 : data.bookingId,
                userName: (_c = data === null || data === void 0 ? void 0 : data.userData) === null || _c === void 0 ? void 0 : _c.name,
                hostName: (_d = data === null || data === void 0 ? void 0 : data.propertyData) === null || _d === void 0 ? void 0 : _d.hostName,
                redirectionUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/profile/booking/detail/${payload.bookingId}` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/profile/booking/detail/${payload.bookingId}`,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD
            });
            _entity_1.PropertyV1.updateOne({ _id: mongoose_1.Types.ObjectId((_e = data === null || data === void 0 ? void 0 : data.propertyData) === null || _e === void 0 ? void 0 : _e.propertyId) }, { $inc: { totalBookingsCount: -1 } });
            let [hostToken, userToken] = await Promise.all([
                _entity_1.HostV1.fetchHostDeviceToken(data.hostId),
                _entity_1.UserV1.fetchUserDeviceToken(data.userData.userId)
            ]);
            await Promise.all([
                _services_1.PushNotification.sendBookingPushCancelledByHost(hostToken, data),
                _services_1.PushNotification.sendBookingCancelledByHostToUser(userToken, data),
                _entity_1.HostV1.initiateRefund(payload === null || payload === void 0 ? void 0 : payload.bookingId, data),
                _services_1.emailService.sendBookingCancellationEmailByHost(hostHtml, payload.bookingId, data.propertyData.hostEmail, (_f = data === null || data === void 0 ? void 0 : data.userData) === null || _f === void 0 ? void 0 : _f.name, "cancelled"),
                _services_1.emailService.sendBookingCancellationEmailToUser(userHtml, payload.bookingId, data.userData.email, data.propertyData.hostName, "cancelled"),
            ]);
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            console.error(`we have an error in cancelling property api ==> ${err}`);
            next(err);
        }
    }
    async bookingSummary(req, res, next) {
        try {
            let payload = req.params;
            let pipeline = await _builders_1.default.User.UserPropertyBuilder.BookingSummaryFilter(payload);
            let data = await _entity_1.BookingV1.basicAggregate(pipeline);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
    async acceptBooking(req, res, next) {
        try {
            let hostId = res.locals.userId;
            let payload = req.body;
            let bookingData = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.id) });
            switch (req.body.type) {
                case _common_1.BOOKING_REQUEST_STATUS.ACCEPT:
                    if (bookingData) {
                        await _entity_1.PayV1.updateStatusAfterPayment(payload, hostId);
                        return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).BOOKING_ACCEPTED);
                    }
                    else
                        return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).BOOKING_NOT_FOUND);
                case _common_1.BOOKING_REQUEST_STATUS.REJECT:
                    if (bookingData) {
                        await _entity_1.PayV1.updateStatusAfterReject(payload, hostId);
                        return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).BOOKING_REJECT);
                    }
                    else
                        return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).BOOKING_NOT_FOUND);
            }
        }
        catch (err) {
            next(err);
        }
    }
    async propertyListing(req, res, next) {
        try {
            let payload = {};
            payload.userId = res.locals.userId;
            payload.userData = res.locals.userData;
            if (req.query.cityId) {
                if (res.locals.userData.isCohost) {
                    let propertyIds = [];
                    let searchCohost = await _entity_1.CoHostV1.findOne({ "city._id": mongoose_1.Types.ObjectId(req.query.cityId), cohostId: res.locals.userId, accessLevel: _common_1.ENUM.COHOST_LEVEL.STATUS.PROPERTY }, { _id: 0, property: 1 });
                    if (!searchCohost) {
                        let propertyListingPipeline = await _builders_1.default.User.HostBUilder.hostDashBoardPropertyList(req.query.cityId, res.locals.userData.hostId);
                        let response = await _entity_1.PropertyV1.basicAggregate(propertyListingPipeline);
                        return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
                    }
                    for (let i = 0; i < searchCohost.property.length; i++) {
                        propertyIds.push(mongoose_1.Types.ObjectId(searchCohost.property[i]._id));
                    }
                    let propertyListingPipeline = await _builders_1.default.User.HostBUilder.hostDashBoardCohostPropertyList(propertyIds, res.locals.userData.hostId);
                    let response = await _entity_1.PropertyV1.basicAggregate(propertyListingPipeline);
                    return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
                }
                let propertyListingPipeline = await _builders_1.default.User.HostBUilder.hostDashBoardPropertyList(req.query.cityId, payload.userId);
                let response = await _entity_1.PropertyV1.basicAggregate(propertyListingPipeline);
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
            }
            let pipeline = await _builders_1.default.User.HostBUilder.propertyLists(payload);
            let propertyData = await _entity_1.PropertyV1.basicAggregate(pipeline);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, propertyData);
        }
        catch (err) {
            console.error(`we have an error while property listing ==> ${err}`);
            next(err);
        }
    }
    async fetchCalenderData(req, res, next) {
        try {
            let payload = req.query;
            payload.userId = res.locals.userId;
            let response = {};
            let pipeline = await _builders_1.default.User.UserPropertyBuilder.calendarPipeline(payload);
            let data = await _entity_1.CalendarV1.basicAggregate(pipeline);
            response['schedule'] = data;
            if (payload && payload.propertyId) {
                payload && payload.page ? payload.page = payload.page : payload.page = 1;
                payload && payload.limit ? payload.limit = payload.limit : payload.limit = 100;
                let pipeline = await _builders_1.default.User.UserPropertyBuilder.holidayListing(payload);
                let result = await _entity_1.PropertyV1.basicAggregate(pipeline);
                response['holiday'] = result;
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async subCategory(req, res, next) {
        try {
            let payload = req.query;
            let categoryArray = [];
            categoryArray = payload.categoryIds.split(",");
            for (let i = 0; i < categoryArray.length; i++) {
                categoryArray[i] = mongoose_1.Types.ObjectId(categoryArray[i]);
            }
            categoryArray = await _entity_1.CategoryV1.findMany({ "parentId": { $in: categoryArray } });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, categoryArray);
        }
        catch (err) {
            next(err);
        }
    }
    async bookingStatus(req, res, next) {
        try {
            let currentDate = new Date();
            let response = await Promise.all([
                _entity_1.BookingV1.updateCronJob({
                    "toDate": { "$lt": currentDate },
                    $and: [
                        { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.ABANDONED } },
                        { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.COMPLETED } },
                        { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.REJECTED } },
                        { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.CANCELLED } },
                        { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.PENDING } }
                    ]
                }, { "bookingStatus": _common_1.ENUM.BOOKING.STATUS.COMPLETED }, { multi: true }),
                _entity_1.BookingV1.updateCronJob({
                    "fromDate": { "$lte": currentDate }, "toDate": { "$gt": currentDate },
                    $and: [
                        { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.ABANDONED } },
                        { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.ONGOING } },
                        { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.REJECTED } },
                        { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.CANCELLED } },
                        { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.PENDING } }
                    ]
                }, { "bookingStatus": _common_1.ENUM.BOOKING.STATUS.ONGOING }, { multi: true }),
                _entity_1.BookingV1.updateCronJob({
                    "fromDate": { "$gt": currentDate },
                    $and: [
                        { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.ABANDONED } },
                        { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.UPCOMING } },
                        { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.REJECTED } },
                        { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.CANCELLED } },
                        { bookingStatus: { $ne: _common_1.ENUM.BOOKING.STATUS.PENDING } }
                    ]
                }, { "bookingStatus": _common_1.ENUM.BOOKING.STATUS.UPCOMING }, { multi: true }),
            ]);
            await _entity_1.CommonLogsV1.createCronLog(_common_1.ENUM.COMMON_LOGS_TYPE.PROPERTY_CRON, response);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (err) {
            console.error(`we have an error`, err);
            next(err);
        }
    }
    async calendarStatus(req, res, next) {
        try {
            const calendarDoc = await calendar_model_1.default.distinct("bookingDetails.bookingId", {
                "bookingDetails.bookingStatus": {
                    $nin: [
                        _common_1.ENUM.BOOKING.STATUS.CANCELLED,
                        _common_1.ENUM.BOOKING.STATUS.REJECTED,
                        _common_1.ENUM.BOOKING.STATUS.COMPLETED
                    ]
                }
            });
            for (let i = 0; i < calendarDoc.length; i++) {
                const bookingId = calendarDoc[i];
                booking_model_1.default.find({ _id: mongoose_1.Types.ObjectId(bookingId) }, { bookingStatus: 1 }).cursor().eachAsync((bookingDoc) => {
                    _entity_1.CalendarV1.update({ "bookingDetails.bookingId": mongoose_1.Types.ObjectId(bookingId) }, { $set: { "bookingDetails.$.bookingStatus": bookingDoc.bookingStatus } });
                });
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async autoAccpetStatus(req, res, next) {
        let payload = req.body;
        await _entity_1.PropertyV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.propertyId) }, { autoAcceptUpcomingBooking: payload.autoAcceptUpcomingBooking }, { new: true });
        return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
    }
    async addHolidays(req, res, next) {
        const headers = req.headers;
        let payload = req.body;
        payload.offset = parseInt(headers.offset);
        let getDuplicateDate = await _entity_1.PropertyV1.getHolidayList(payload);
        if (getDuplicateDate && getDuplicateDate.length > 0)
            return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).DUPLICATE_HOLIDAY_DATE);
        await _entity_1.PropertyV1.update({ _id: payload.propertyId }, {
            $push: {
                holidays: {
                    name: payload.name, createdAt: new Date(),
                    fromDate: _common_1.DATABASE.DATE_CONSTANTS.fromDate(payload.fromDate, payload.offset),
                    toDate: _common_1.DATABASE.DATE_CONSTANTS.toDate(payload.toDate, payload.offset)
                }
            }
        }, { new: true, upsert: true });
        return this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
    }
    async updateHolidays(req, res, next) {
        try {
            const headers = req.headers;
            let payload = req.body;
            payload.offset = parseInt(headers.offset);
            let getDuplicateDate = await _entity_1.PropertyV1.getHolidayList(payload);
            if (getDuplicateDate && getDuplicateDate.length > 0) {
                return await this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).DUPLICATE_HOLIDAY_DATE);
            }
            await _entity_1.PropertyV1.update({ holidays: { $elemMatch: { "_id": payload.id } } }, {
                'holidays.$.name': payload.name,
                'holidays.$.fromDate': _common_1.DATABASE.DATE_CONSTANTS.toDate(payload.fromDate, payload.offset),
                'holidays.$.toDate': _common_1.DATABASE.DATE_CONSTANTS.toDate(payload.toDate, payload.offset)
            }, { new: true });
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async deleteHolidays(req, res, next) {
        try {
            let params = req.query;
            _entity_1.PropertyV1.update({ _id: params.propertyId }, { $pull: { holidays: { "_id": params.id } } }, { multi: true });
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            next(err);
        }
    }
    async getHolidays(req, res, next) {
        try {
            let payload = req.query;
            let pipeline = await _builders_1.default.User.UserPropertyBuilder.holidayListing(payload);
            payload && payload.limit ? payload.limit = payload.limit : payload.limit = 10;
            let data = await _entity_1.PropertyV1.paginateAggregate(pipeline, Object.assign(Object.assign({}, payload), { getCount: true }));
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
    async bookingPolicy(req, res, next) {
        try {
            const { bookingId } = req.query;
            let bookingDetail = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(bookingId) });
            const differenceTime = Math.abs((bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.toDate) - (bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.fromDate));
            const numberOfdays = Math.ceil(differenceTime / (1000 * 60 * 60 * 24));
            let criteria = await _entity_1.BookingV1.cancellationCriteria(bookingDetail, numberOfdays);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, criteria);
        }
        catch (err) {
            console.error(`we have an error in booking module ${err}`);
            next(err);
        }
    }
    async updateAutoAcceptBooking(req, res, next) {
        try {
            const { propertyId, autoAcceptUpcomingBooking } = req.body;
            let propertyDetail = await _entity_1.PropertyV1.updateOne({ _id: mongoose_1.Types.ObjectId(propertyId) }, { autoAcceptUpcomingBooking: autoAcceptUpcomingBooking });
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, propertyDetail);
        }
        catch (err) {
            console.error(`we have an error in booking module ${err}`);
            next(err);
        }
    }
    async propertyDetail(req, res, next) {
        try {
            let payload = req.params;
            let details = await _builders_1.default.User.UserPropertyBuilder.fetchHostpropertyDetails(payload);
            let floorCount = await _entity_1.PropertySpaceV1.distinct("floorNumber", { propertyId: mongoose_1.Types.ObjectId(payload.propertyId), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE });
            details[0].floorCount = floorCount;
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, details[0]);
        }
        catch (err) {
            next(err);
        }
    }
    async floorDetail(req, res, next) {
        try {
            let payload = req.params;
            let pipeline = await _builders_1.default.User.UserPropertyBuilder.floorDetails(payload);
            let data = await _entity_1.PropertySpaceV1.basicAggregate(pipeline);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            next(err);
        }
    }
    async claimProperty(req, res, next) {
        try {
            let payload = req === null || req === void 0 ? void 0 : req.body;
            const searchPropertyClaimedStatus = await _entity_1.PropertyV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.propertyId) }, { claimedStatus: 1, name: 1 });
            if ((searchPropertyClaimedStatus === null || searchPropertyClaimedStatus === void 0 ? void 0 : searchPropertyClaimedStatus.claimedStatus) == true)
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_CLAMIED_ERROR);
            payload.userId = mongoose_1.Types.ObjectId(res.locals.userId);
            if (payload.countryId)
                payload.country = await _entity_1.CountriesV1.findOne({ id: payload.countryId }, { id: 1, sortname: 1, name: 1, countryId: 1, _id: 1 });
            if (payload.stateId)
                payload.state = await _entity_1.AllStatesV1.findOne({ id: payload.stateId }, { name: 1, stateId: 1, id: 1, _id: 1 });
            if (payload.cityId)
                payload.city = await _entity_1.AllCityV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.cityId) }, { name: 1, iconImage: 1, _id: 1 });
            payload.hostId = mongoose_1.Types.ObjectId(res.locals.userId);
            const hostDetail = await _entity_1.HostV1.findOne({ _id: mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.hostId) });
            if ((hostDetail === null || hostDetail === void 0 ? void 0 : hostDetail.accountStatus) == _common_1.ENUM.USER.ACCOUNT_STATUS.UNVERIFIED &&
                (payload === null || payload === void 0 ? void 0 : payload.status) === _common_1.ENUM.PROPERTY.STATUS.ACTIVE) {
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_ALLOWED);
            }
            payload.status = _common_1.ENUM.PROPERTY.CLAIMED_PROPERTY_STATUS.PENDING;
            await _entity_1.UnclaimV1.updateDocument({ propertyId: mongoose_1.Types.ObjectId(payload.propertyId), userId: payload.hostId }, payload, { upsert: true, new: true });
            delete payload.status;
            await Promise.all([
                _entity_1.PropertyV1.updateOne({
                    _id: mongoose_1.Types.ObjectId(payload.propertyId)
                }, {
                    $addToSet: {
                        claimingHosts: payload.hostId
                    }
                }),
                _entity_1.CompanyV1.updateDocument({ userId: mongoose_1.Types.ObjectId(payload.userId) }, payload, { upsert: true, setDefaultsOnInsert: true })
            ]);
            let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + `/src/views/claim property/claim_property.html`, {
                name: hostDetail.name, ASSET_PATH: _common_1.BASE.URL,
                logo: _common_1.CONSTANT.PAM_LOGO,
                propertyName: searchPropertyClaimedStatus === null || searchPropertyClaimedStatus === void 0 ? void 0 : searchPropertyClaimedStatus.name,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                welcome: "Pam",
                redirectionChatUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/host/chat?userId=${res.locals.userId}` : `${_common_1.WEB_PANELS.HOST_PANEL_PROD}/host/chat?userId=${res.locals.userId}`,
                webPanelUrl: _common_1.CONSTANT.EMAILER_URLS.WEB_PANEL,
                contactUsUrl: _common_1.CONSTANT.EMAILER_URLS.CONTACT_US,
                FAQUrl: _common_1.CONSTANT.EMAILER_URLS.FAQUrl,
            });
            _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.CLAIM_PROPETY_REQUEST(hostDetail.email, html));
            return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).PROPERTY_CLAIMED_RQUEST);
        }
        catch (err) {
            console.error(`we have an error while claiming property ==> ${err}`);
            next(err);
        }
    }
    async claimPropertyData(req, res, next) {
        try {
            let payload = req.params;
            let detailsArray = await Promise.all([
                _entity_1.PropertyV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.propertyId) }),
                _entity_1.UnclaimV1.findOne({ propertyId: mongoose_1.Types.ObjectId(payload.propertyId), userId: mongoose_1.Types.ObjectId(res.locals.userId) }, { docs: 1, administrativeRight: 1, status: 1, message: 1, propertyId: 1 }),
                _entity_1.CompanyV1.findOne({ userId: mongoose_1.Types.ObjectId(res.locals.userId) }, { street: 1, houseNo: 1, name: 1, country: 1, state: 1, city: 1, zipCode: 1 }),
                _entity_1.HostV1.findOne({ _id: mongoose_1.Types.ObjectId(res.locals.userId) }, { name: 1, email: 1, address: 1, phoneNo: 1, countryCode: 1 })
            ]);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {
                propertyData: detailsArray[0],
                uncliamData: detailsArray[1] ? detailsArray[1] : {},
                companyData: detailsArray[2] ? detailsArray[2] : {},
                userData: detailsArray[3]
            });
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Add property",
        path: '/',
        parameters: {
            body: {
                description: 'Body for add property ',
                required: true,
                model: 'ReqAddPropertyDetailModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "addProperty", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Validate Floor details",
        path: '/validateFloorDetail',
        parameters: {
            body: {
                description: 'Body for validateFloorDetail',
                required: true,
                model: 'ReqValidateFloorModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "validateFloorForPartners", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Validate emloyee units",
        path: '/validateEmployeeUnits',
        parameters: {
            body: {
                description: 'Body for validateEmployeeUnits  ',
                required: true,
                model: 'ReqValidateEmplyoeeModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "validateFloorForEmployeeUnits", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Host Update Property",
        path: '/update',
        parameters: {
            body: {
                description: 'Body for update property ',
                required: true,
                model: 'ReqUpdateHostPropertyDetail'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "updateProperty", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Property space list",
        path: '/{id}/propertySpaceList',
        parameters: {
            path: {
                id: {
                    description: 'mongoId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "propertySpaceList", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Property Details",
        path: '/propertySpaceListByCategory',
        parameters: {
            query: {
                categoryId: {
                    description: 'mongoId',
                    required: true,
                },
                propertyId: {
                    description: 'mongoId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "propertySpaceListByCategory", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "partner details",
        path: '/floorCount/{propertyId}',
        parameters: {
            path: {
                propertyId: {
                    description: 'mongoId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "propertyFloorCount", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Property Deatils",
        path: '/propertyDetails/{id}',
        parameters: {
            path: {
                id: {
                    description: 'propertyId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "propertyDetails", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "Activate Property",
        path: '/{id}/propertyStatus',
        parameters: {
            body: {
                description: 'Body for update property ',
                required: true,
                model: 'ReqPropertyStatus'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "activateProperty", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Amenities Listing",
        path: '/amenities-listing',
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "amenitiesListing", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Parent Category Lisitng",
        path: '/parentCategories',
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "getParentCategories", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Parent Category Lisitng",
        path: '/myArchievedProperties',
        parameters: {
            query: {
                page: {
                    description: '1',
                    required: false,
                },
                limit: {
                    description: '10',
                    required: false,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "getArchievedProperty", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Parent Category Listing",
        path: '',
        parameters: {
            query: {
                page: {
                    description: '1',
                    required: false,
                },
                limit: {
                    description: '10',
                    required: false,
                },
                search: {
                    description: 'searchkey',
                    required: false,
                },
                fromDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                toDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                categoryIds: {
                    description: 'String of categoryIds',
                    required: false,
                },
                subCategoryIds: {
                    description: 'String of categoryIds',
                    required: false,
                },
                autoAcceptUpcomingBooking: {
                    description: 'Boolean true or false',
                    required: false
                },
                status: {
                    description: 'active/inactive',
                    required: false
                },
                cityId: {
                    description: 'mongo id',
                    required: false,
                },
                stateId: {
                    description: '38',
                    required: false,
                },
                countryId: {
                    description: '102',
                    required: false,
                },
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "getMyProperties", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Child category Listing",
        path: '/childCategories/{parentId}',
        parameters: {
            path: {
                parentId: {
                    description: 'parent category id',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "getChildCategories", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Host Add Property Space",
        path: '/addSpaces',
        parameters: {
            body: {
                description: 'Body for verify otp',
                required: true,
                model: 'ReqAddPropertySpace'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "addPropertySpaces", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Host Company Detail",
        path: '/updateSpaces',
        parameters: {
            body: {
                description: 'Body for verify otp',
                required: true,
                model: 'ReqUpdatePropertySpace'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "updatePropertySpaces", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get Dynamic Price Labels",
        path: '/dynamicPriceLabels',
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "getDynamicPriceLabels", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Fetch Property Detail",
        path: '/propertySpaceDetails',
        parameters: {
            query: {
                spaceId: {
                    description: 'mongo id of space',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "fetchPropertySpaceDetail", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "Activate Property",
        path: '/propertySpaceStatus',
        parameters: {
            body: {
                description: 'Body for update property ',
                required: true,
                model: 'ReqPropertyStatus'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "activatePropertySpace", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Host Reset Password",
        path: '/booking',
        parameters: {
            query: {
                page: {
                    description: '1',
                    required: false,
                },
                limit: {
                    description: '10',
                    required: false,
                },
                search: {
                    description: 'searchkey',
                    required: false,
                },
                fromDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                toDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                categoryId: {
                    description: 'String of categoryIds',
                    required: false,
                },
                subCategoryIds: {
                    description: 'String of categoryIds',
                    required: false,
                },
                propertyIds: {
                    description: ' property ids',
                    required: false,
                },
                status: {
                    description: "ONGOING: 0, COMPLETED: 1, CANCELLED: 2, REJECTED: 4",
                    required: false
                },
                mode: {
                    description: "ONLINE: 0, OFFLINE: 1",
                    required: false
                },
                type: {
                    description: "Request : 0 , History :1 , Rejected : 2, offline : 3",
                    required: false
                },
                autoAcceptUpcomingBooking: {
                    description: 'auto: 0, manual : 1, All : 2',
                    required: false,
                },
                cityId: {
                    description: 'mongo id',
                    required: false,
                },
                stateId: {
                    description: '38',
                    required: false,
                },
                countryId: {
                    description: '102',
                    required: false,
                },
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "bookingHistory", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Cancel Booking",
        path: '/booking',
        parameters: {
            body: {
                description: 'Body for cancel booking',
                required: true,
                model: 'ReqCancelSpaceBookingHostModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "cancelBooking", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Activate Property",
        path: '/bookingSummary/{bookingId}',
        parameters: {
            path: {
                bookingId: {
                    description: 'bookingId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "bookingSummary", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "Accept Booking",
        path: '/booking/request',
        parameters: {
            body: {
                description: 'Body for update property ',
                required: true,
                model: 'ReqBookingStatus'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "acceptBooking", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "booking detail",
        path: '/listing',
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "propertyListing", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Booking Schedule",
        path: '/schedule/calendar',
        parameters: {
            query: {
                date: {
                    description: 'date current day',
                    required: true,
                },
                categoryIds: {
                    description: 'array of category ids of type string',
                    required: false,
                },
                subCategoryIds: {
                    description: 'array of subCategoryIds of type string',
                    required: false,
                },
                bookingMode: {
                    description: 'bookingMode Online{0}|Offline{1}|All{2}',
                    required: true,
                },
                propertyId: {
                    description: 'propertyId of type mongoId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "fetchCalenderData", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Activate Property",
        path: '/subCategories',
        parameters: {
            query: {
                categoryIds: {
                    description: 'bookingId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "subCategory", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "booking detail",
        path: '/cron',
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "bookingStatus", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Host change Password",
        path: '/autoAccpetStatus',
        parameters: {
            body: {
                description: 'Body for reset password',
                required: true,
                model: 'ChangeStatusModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "autoAccpetStatus", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Add Holidays",
        path: '/holidays',
        parameters: {
            body: {
                description: 'Body for add holidays ',
                required: true,
                model: 'AddHolidayModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "addHolidays", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Update Holiday",
        path: '/holidays',
        parameters: {
            body: {
                description: 'Body for update',
                required: true,
                model: 'UpdateHolidayModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "updateHolidays", null);
__decorate([
    swagger_express_ts_1.ApiOperationDelete({
        description: "Delete Holidays",
        path: '/holidays',
        parameters: {
            query: {
                id: {
                    description: 'id',
                    required: true,
                },
                propertyId: {
                    description: 'propertyId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "deleteHolidays", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Delete Holidays",
        path: '/holidays',
        parameters: {
            query: {
                propertyId: {
                    description: 'propertyId',
                    required: true,
                },
                page: {
                    description: 'page',
                    required: true,
                },
                limit: {
                    description: 'limit',
                    required: false,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "getHolidays", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get booking Policy",
        path: '/bookingPolicy?',
        parameters: {
            query: {
                bookingId: {
                    description: 'bookingId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "bookingPolicy", null);
__decorate([
    swagger_express_ts_1.ApiOperationPatch({
        description: "Update AcceptUpcomingBooking",
        path: '/autoAcceptBooking',
        parameters: {
            body: {
                description: 'Body for update',
                required: true,
                model: 'UpdateAutoAcceptPropertyModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "updateAutoAcceptBooking", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "partner details",
        path: '/claim/{propertyId}',
        parameters: {
            path: {
                propertyId: {
                    description: 'mongoId',
                    required: true,
                }
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HostPropertyClass.prototype, "claimPropertyData", null);
HostPropertyClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/host/property",
        name: "Host property Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], HostPropertyClass);
exports.HostPropertyController = new HostPropertyClass();
//# sourceMappingURL=host.properties.controller.js.map