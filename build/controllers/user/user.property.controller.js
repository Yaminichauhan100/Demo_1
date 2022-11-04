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
exports.UserLocationController = void 0;
const _baseController_1 = __importDefault(require("@baseController"));
const swagger_express_ts_1 = require("swagger-express-ts");
const _builders_1 = __importDefault(require("@builders"));
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const mongoose_1 = require("mongoose");
const _builders_2 = __importDefault(require("@builders"));
const _services_1 = require("@services");
const htmlHelper_1 = require("../../htmlHelper");
let UserLocationClass = class UserLocationClass extends _baseController_1.default {
    constructor() {
        super();
    }
    async getLocation(req, res, next) {
        try {
            let payload = req.query;
            let keyword = payload.searchKeyword;
            payload.keyword = keyword;
            let pipeline = await _builders_1.default.User.UserPropertyBuilder.LocationList(payload);
            payload.getCount = true;
            let searchCityName = await _entity_1.CityV1.paginateAggregate(pipeline, payload);
            let responseData = [];
            for (let i = 0; i < searchCityName.result.length; i++) {
                let promise = [];
                promise.push(_entity_1.StatesV1.findOne({ id: searchCityName.result[i].stateId }));
                promise.push(_entity_1.CountriesV1.findOne({ id: searchCityName.result[i].countryId }));
                let data = await Promise.all(promise);
                let city = `${searchCityName.result[i].cityName}, ${data[0].name}, ${data[1].name}`;
                responseData.push({ cityId: searchCityName.result[i]._id, name: city });
            }
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, { result: responseData, nextPageStatus: searchCityName.next });
        }
        catch (err) {
            next(err);
        }
    }
    async getCategories(req, res, next) {
        try {
            const response = await _entity_1.CategoryV1.basicAggregate(await _builders_1.default.User.UserPropertyBuilder.categoryList());
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async getProperties(req, res, next) {
        try {
            let payload = req.query;
            let categoryArray = [];
            let amenitiesArray = [];
            let subCategoryArray = [];
            const headers = req.headers;
            payload.offset = parseInt(headers.offset);
            if (payload.cityIds) {
                let cityArray = payload.cityIds.split(",");
                for (let i = 0; i < cityArray.length; i++) {
                    cityArray[i] = cityArray[i];
                }
                payload.cityArray = cityArray;
            }
            if (payload.amenitiesIds) {
                amenitiesArray = payload.amenitiesIds.split(",");
                for (let i = 0; i < amenitiesArray.length; i++) {
                    amenitiesArray[i] = mongoose_1.Types.ObjectId(amenitiesArray[i]);
                }
                payload.amenitiesArray = amenitiesArray;
            }
            if (payload.categoryIds) {
                categoryArray = payload.categoryIds.split(",");
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
                subCategoryArray = await _entity_1.PropertySpaceV1.findMany({ "subCategory._id": { $in: subCategoryArray } }, { _id: 0, propertyId: 1 });
                for (let i = 0; i < subCategoryArray.length; i++) {
                    subCategoryArray[i] = subCategoryArray[i].propertyId;
                }
                if (subCategoryArray.length) {
                    payload.subCategoryArray = subCategoryArray;
                }
            }
            let holidayPipeline = await _builders_1.default.User.UserPropertyBuilder.HolidaysPropertyList(payload);
            payload.holidayProperties = holidayPipeline;
            if (payload === null || payload === void 0 ? void 0 : payload.userId) {
                let userDetails = await _entity_1.UserV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.userId) }, { partnerId: 1 });
                if (userDetails && userDetails.partnerId) {
                    let partnerArray = [];
                    userDetails.partnerId.forEach((element) => {
                        partnerArray.push(mongoose_1.Types.ObjectId(element));
                    });
                    payload.partnerArray = partnerArray;
                }
            }
            let pipeline = await _builders_1.default.User.UserPropertyBuilder.PropertyList(payload);
            payload.getCount = true;
            let propertyList = await _entity_1.PropertyV1.paginateAggregate(pipeline, payload);
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, propertyList);
        }
        catch (err) {
            console.error(`we have an error in user property listing --> ${err}`);
            next(err);
        }
    }
    async fetchNearbyProperties(req, res, next) {
        try {
            let payload = req.query;
            let pipeline = await _builders_1.default.User.UserPropertyBuilder.NearbyPropertyList(payload);
            let propertyList = await _entity_1.PropertyV1.basicAggregate(pipeline);
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, propertyList);
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
    async getAmenities(req, res, next) {
        try {
            const { propertyId } = req.query;
            const pipeline = await _builders_1.default.User.UserPropertyBuilder.amenitiesList(propertyId);
            const response = await _entity_1.AmenitiesV1.basicAggregate(pipeline);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            console.error(`we have an error in getting amenties => ${err}`);
            next(err);
        }
    }
    async cityListing(req, res, next) {
        try {
            let payload = req.query;
            let cityArray = payload.cityIds.split(",");
            for (let i = 0; i < cityArray.length; i++) {
                cityArray[i] = mongoose_1.Types.ObjectId(cityArray[i]);
            }
            ;
            let cityData = await _entity_1.CityV1.findMany({ _id: { $in: cityArray } }, { iconImage: 1, cityName: 1 });
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, cityData);
        }
        catch (err) {
            next(err);
        }
    }
    async fetchRecentSearchList(req, res, next) {
        try {
            let payload = req.query;
            let searchList = await _entity_1.UserV1.fetchSearchList(payload);
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, searchList);
        }
        catch (error) {
            console.error(`we have an error in fetching recent search list ==> ${error}`);
            next(error);
        }
    }
    async fetchZipcode(req, res, next) {
        try {
            let zipCode = req.query.searchKeyword;
            let zipCodeList = await _entity_1.PropertyV1.distinct('zipCode', {
                zipCode: {
                    $regex: zipCode, $options: "si"
                }
            });
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, zipCodeList);
        }
        catch (error) {
            console.error(`we have an error in fetching recent search list ==> ${error}`);
            next(error);
        }
    }
    async propertyDetails(req, res, next) {
        try {
            let payload = req.query;
            let details = await _entity_1.PropertyV1.fetchProperties(payload);
            details[0].floorCount = await _entity_1.PropertySpaceV1.distinct("floorNumber", { "propertyId": mongoose_1.Types.ObjectId(payload.id), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE });
            if (details.length) {
                await _entity_1.UserAnalyticsV1.updateOne({ userId: payload.userId, propertyId: payload.id }, {
                    userId: payload.userId,
                    hostId: details[0].userData.userId,
                    propertyId: payload.id,
                    $inc: { viewCount: 1 }
                }, { upsert: true, new: true });
                await _entity_1.PromotionV1.updateAdAnalytics(payload === null || payload === void 0 ? void 0 : payload.id);
                return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, details[0]);
            }
            else
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_FOUND);
        }
        catch (err) {
            console.error(`we have an error while fetching property details and saving recent search details ==> ${err}`);
            next(err);
        }
    }
    async insertRecentCityList(req, res, next) {
        let payload = req.body;
        const { cityId, userId } = payload;
        const redundancyCheck = await _entity_1.RecentSearchV1.findMany({ userId: mongoose_1.Types.ObjectId(userId), cityId: mongoose_1.Types.ObjectId(cityId) });
        if (redundancyCheck.length > 0) {
            return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).ALREADY_ADDED);
        }
        let response = await _entity_1.RecentSearchV1.updateRecentCityList(payload);
        return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
    }
    async fetchOfferPricing(req, res, next) {
        try {
            const payload = req.query;
            const { spaceId } = req.query;
            const headers = req.headers;
            payload['offset'] = parseInt(headers.offset);
            let response = await _entity_1.UserV1.fetchOfferPricingForUser(payload, spaceId);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`we have an error in user controller ==> ${error}`);
            next(error);
        }
    }
    async markAsFavourite(req, res, next) {
        try {
            const payload = req.body;
            const userId = res.locals.userId;
            let getPropertyData = await _entity_1.PropertyV1.findOne({ _id: payload.propertyId }, { _id: 1, images: 1, address: 1, status: 1, name: 1, startingPrice: 1, rating: 1, city: 1, state: 1, country: 1 });
            if (!getPropertyData)
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).NOT_FOUND);
            if (payload.action == _common_1.CONSTANT.FAV_ACTION.ADD)
                await _entity_1.FavouriteV1.updateDocument({ userId: userId, 'property._id': payload.propertyId }, { userId: userId, property: getPropertyData }, { upsert: true, new: true });
            else
                await _entity_1.FavouriteV1.remove({ userId: userId, 'property._id': payload.propertyId });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (error) {
            console.error(`Mark as favorite ==> ${error}`);
            next(error);
        }
    }
    async getFavouriteList(req, res, next) {
        try {
            let payload = req.query;
            let userId = res.locals.userId;
            if (userId) {
                let userDetails = await _entity_1.UserV1.findOne({ _id: mongoose_1.Types.ObjectId(userId) }, { partnerId: 1 });
                if (userDetails && userDetails.partnerId) {
                    let partnerArray = [];
                    userDetails.partnerId.forEach((element) => {
                        partnerArray.push(mongoose_1.Types.ObjectId(element));
                    });
                    payload.partnerArray = partnerArray;
                }
            }
            let pipeline = await _builders_2.default.User.UserPropertyBuilder.userFavFilter(payload, userId);
            let data = await _entity_1.FavouriteV1.paginateAggregate(pipeline, Object.assign(Object.assign({}, payload), { getCount: true }));
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (error) {
            console.error(`Mark as favourite ==> ${error}`);
            next(error);
        }
    }
    async addtoBookingCart(req, res, next) {
        try {
            const headers = req.headers;
            const offset = parseInt(headers.offset);
            let payload = req.body;
            payload["offset"] = -Number(offset);
            payload["availableUnits"] = 1;
            let checkAvailable = await _builders_1.default.User.UserPropertyBuilder.HolidaysProperty(payload);
            if (checkAvailable.length > 0) {
                payload['availableUnits'] = 0;
                payload['quantity'] = (payload === null || payload === void 0 ? void 0 : payload.quantity) > 1 ? (payload === null || payload === void 0 ? void 0 : payload.quantity) - 1 : payload === null || payload === void 0 ? void 0 : payload.quantity;
            }
            const propertyAndUserDetail = await _entity_1.BookingCartV1.fetchPropertyAndUserDetail(payload, res);
            switch (payload.isEmployee) {
                case true:
                    {
                        const response = await _entity_1.BookingCartV1.addToEmployeeCart(payload, headers, next, propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.userDetail, propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.propertyDetail, propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.spacePrice);
                        return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
                    }
                case false:
                    {
                        if (payload === null || payload === void 0 ? void 0 : payload.userId) {
                            if (!(propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.userDetail))
                                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).USER_NOT_FOUND);
                            const response = await _entity_1.BookingCartV1.addtoBookingCart(propertyAndUserDetail.payload, headers, next, propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.userDetail, propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.propertyDetail, propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.spacePrice, propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.offerPriceOfCategory);
                            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
                        }
                        else {
                            const response = await _entity_1.BookingCartV1.addtoGuestBookingCart(payload, headers, next, propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.propertyDetail, propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.spacePrice, propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.offerPriceOfCategory);
                            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
                        }
                    }
            }
        }
        catch (error) {
            console.error(`we have an error while adding space to cart ==> ${error}`);
            next(error);
        }
    }
    async createProLongBookingCart(req, res, next) {
        try {
            const headers = req.headers;
            const offset = parseInt(headers.offset);
            let payload = req.body;
            payload['userId'] = res.locals.userId;
            payload['offset'] = -Number(offset);
            payload['availableUnits'] = 1;
            const fetchBookingStatus = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.bookingId) }, { bookingStatus: 1 });
            if (!fetchBookingStatus) {
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).INVALID_BOOKING_ID);
            }
            const fetchHolidays = await _builders_1.default.User.UserPropertyBuilder.HolidaysProperty(payload);
            if ((fetchHolidays === null || fetchHolidays === void 0 ? void 0 : fetchHolidays.length) > 0) {
                payload['availableUnits'] = 0;
                payload['quantity'] = (payload === null || payload === void 0 ? void 0 : payload.quantity) > 1 ? (payload === null || payload === void 0 ? void 0 : payload.quantity) - 1 : payload === null || payload === void 0 ? void 0 : payload.quantity;
            }
            const propertyAndUserDetail = await _entity_1.BookingCartV1.fetchPropertyAndUserDetail(payload, res);
            switch (payload.isEmployee) {
                case true:
                    {
                        const response = await _entity_1.BookingCartV1.addToEmployeeProlongedCart(payload, headers, next, propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.userDetail, propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.propertyDetail, propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.spacePrice);
                        return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
                    }
                    break;
                case false:
                    {
                        if (!(propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.userDetail))
                            return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).USER_NOT_FOUND);
                        const response = await _entity_1.BookingCartV1.addToProlongedCart(payload, headers, next, propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.userDetail, propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.propertyDetail, propertyAndUserDetail === null || propertyAndUserDetail === void 0 ? void 0 : propertyAndUserDetail.spacePrice);
                        return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
                        break;
                    }
            }
        }
        catch (error) {
            console.error(`we have an error in createProLongBookingCart ==> ${error}`);
            next(error);
        }
    }
    async fetchSpaceAvailability(req, res, next) {
        try {
            let payload = req.query;
            const headers = req.headers;
            const offset = parseInt(headers.offset);
            payload.quantity = 1;
            let [spaceDetail, bookingDetail] = await Promise.all([
                _entity_1.PropertySpaceV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.spaceId) }, { units: 1 }),
                _entity_1.BookingV1.findMany({
                    "spaceId": mongoose_1.Types.ObjectId(payload.spaceId),
                    bookingStatus: {
                        $nin: [
                            _common_1.ENUM.BOOKING.STATUS.ABANDONED,
                            _common_1.ENUM.BOOKING.STATUS.CANCELLED,
                            _common_1.ENUM.BOOKING.STATUS.REJECTED,
                            _common_1.ENUM.BOOKING.STATUS.COMPLETED,
                            _common_1.ENUM.BOOKING.STATUS.PENDING
                        ]
                    }
                }, { quantity: 1, fromDate: 1, toDate: 1 })
            ]);
            let totalUnitsAvailable = 0;
            for (let i = 0; i < bookingDetail.length; i++) {
                if (_common_1.DATABASE.DATE_CONSTANTS.fromDate(payload.fromDate, offset) >= bookingDetail[i].fromDate &&
                    _common_1.DATABASE.DATE_CONSTANTS.fromDate(payload.fromDate, offset) <= bookingDetail[i].toDate) {
                    totalUnitsAvailable = totalUnitsAvailable + bookingDetail[i].quantity;
                }
            }
            let availableUnits;
            for (let i = 0; i < bookingDetail.length; i++) {
                if (_common_1.DATABASE.DATE_CONSTANTS.fromDate(payload.fromDate, offset) >= bookingDetail[i].fromDate &&
                    _common_1.DATABASE.DATE_CONSTANTS.fromDate(payload.fromDate, offset) <= bookingDetail[i].toDate) {
                    availableUnits = spaceDetail.units - totalUnitsAvailable;
                }
                else {
                    availableUnits = spaceDetail.units;
                }
            }
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, { isAvailable: availableUnits < 1 ? 0 : 1 });
        }
        catch (error) {
            console.error(`we have an error while checking availability of space ==> ${error}`);
            next(error);
        }
    }
    async fetchBookingSummary(req, res, next) {
        try {
            const { propertyId, spaceId, startDate, endDate } = req.query;
            let response = await _entity_1.BookingCartV1.fetchBookingSummary(propertyId, spaceId, startDate, endDate);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`we have an error in user controller ==> ${error}`);
            next(error);
        }
    }
    async bookSpace(req, res, next) {
        try {
            const { cartId, occupancy, prolongBookingId } = req.body;
            let payload = req.body;
            if (!(payload === null || payload === void 0 ? void 0 : payload.extended)) {
                payload['extended'] = false;
            }
            const headers = req.headers;
            const cartData = await _entity_1.BookingCartV1.findOne({ _id: mongoose_1.Types.ObjectId(cartId) }, { __v: 0, createdAt: 0, updatedAt: 0 });
            if (!cartData)
                return this.sendResponse(res, _common_1.RESPONSE.PROPERTY(res.locals.lang).INVALID_CART);
            cartData['occupancy'] = occupancy;
            cartData['prolongBookingId'] = prolongBookingId;
            let response = await _entity_1.BookingV1.userBookSpace(cartData, headers, payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`we have an error in bookSpace controller ==> ${error}`);
            next(error);
        }
    }
    async fetchBookedSpaceDetail(req, res, next) {
        try {
            const { bookingId } = req.params;
            let response = await _entity_1.BookingV1.fetchBookingDetails(bookingId);
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            next(error);
        }
    }
    async bookingSummary(req, res, next) {
        try {
            const headers = req.headers;
            let payload = req.params;
            payload.userId = res.locals.userId;
            payload.offset = parseInt(headers.offset);
            let pipeline = await _builders_1.default.User.UserPropertyBuilder.BookingSummary(payload);
            let data = await _entity_1.BookingV1.basicAggregate(pipeline);
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
    async bookingList(req, res, next) {
        try {
            let payload = req.query;
            payload['userId'] = res.locals.userId;
            let pipeline = await _builders_1.default.User.UserPropertyBuilder.BookingListing(payload);
            payload['getCount'] = true;
            let data = await _entity_1.BookingV1.paginateAggregate(pipeline, payload);
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
            payload.userId = res.locals.userId;
            let data = await _entity_1.BookingV1.updateDocument({
                "userData.userId": mongoose_1.Types.ObjectId(payload.userId),
                _id: mongoose_1.Types.ObjectId(payload.bookingId)
            }, {
                bookingStatus: _common_1.ENUM.BOOKING.STATUS.CANCELLED,
                reason: payload.reason,
                description: payload.description,
                cancelledBy: _common_1.ENUM.USER.TYPE.USER
            });
            let userHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/booking/cancellation.by.user.html", {
                logo: _common_1.CONSTANT.GIFT_CARD_BG,
                bookingId: data === null || data === void 0 ? void 0 : data.bookingId,
                userName: (_a = data === null || data === void 0 ? void 0 : data.userData) === null || _a === void 0 ? void 0 : _a.name,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                igLogo: _common_1.CONSTANT.IG_LOGO,
                propertyName: (_b = data === null || data === void 0 ? void 0 : data.propertyData) === null || _b === void 0 ? void 0 : _b.name,
                redirectionUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/profile/booking/detail/${payload.bookingId}` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/profile/booking/detail/${payload.bookingId}`,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD
            });
            let hostHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/booking/cancellation.host.html", {
                logo: _common_1.CONSTANT.PAM_LOGO,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                igLogo: _common_1.CONSTANT.IG_LOGO,
                bookingId: data === null || data === void 0 ? void 0 : data.bookingId,
                userName: (_c = data === null || data === void 0 ? void 0 : data.userData) === null || _c === void 0 ? void 0 : _c.name,
                hostName: (_d = data === null || data === void 0 ? void 0 : data.propertyData) === null || _d === void 0 ? void 0 : _d.hostName,
                redirectionUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/host/booking/booking-details/${payload.bookingId}` : `${_common_1.WEB_PANELS.HOST_PANEL_PROD}/host/booking/booking-details/${payload.bookingId}`,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : _common_1.WEB_PANELS.HOST_PANEL_PROD,
                CONTACT_US: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_HOST_STAGING : _common_1.WEB_PANELS.CONTACT_US_PAM_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_HOST_STAGING : _common_1.WEB_PANELS.FAQ_PAM_PROD,
            });
            _entity_1.PropertyV1.updateOne({ _id: mongoose_1.Types.ObjectId((_e = data === null || data === void 0 ? void 0 : data.propertyData) === null || _e === void 0 ? void 0 : _e.propertyId) }, { $inc: { totalBookingsCount: -1 } });
            const [hostToken, userToken] = await Promise.all([
                _entity_1.HostV1.fetchHostDeviceToken(data === null || data === void 0 ? void 0 : data.hostId),
                _entity_1.UserV1.fetchUserDeviceToken((_f = data === null || data === void 0 ? void 0 : data.userData) === null || _f === void 0 ? void 0 : _f.userId)
            ]);
            await Promise.all([
                _services_1.PushNotification.sendBookingCancelledHost(hostToken, data),
                _services_1.PushNotification.sendBookingCancelledUser(userToken, data),
                _entity_1.HostV1.initiateRefund(payload.bookingId, data),
                _services_1.emailService.sendBookingCancellationEmailToHost(hostHtml, payload.bookingId, data.propertyData.hostEmail, data.userData.name, "cancelled"),
                _services_1.emailService.sendBookingCancellationEmailByUser(userHtml, payload.bookingId, data.userData.email, data.propertyData.hostName, "cancelled")
            ]);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, data);
        }
        catch (err) {
            console.error(`we have an error in cancelling property api ==> ${err}`);
            next(err);
        }
    }
    async updatePbToken(req, res, next) {
        try {
            const { passbaseToken } = req.body;
            const { userId } = res.locals;
            await _entity_1.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(userId) }, {
                passbaseToken: passbaseToken,
                profileStatus: _common_1.ENUM.USER.PROFILE_STATUS.ADVANCED
            });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, {});
        }
        catch (err) {
            console.error(`we have an error in updating [passBaseToken] api ==> ${err}`);
            next(err);
        }
    }
    async favCityListing(req, res, next) {
        try {
            let userId = res.locals.userId;
            let cityData = await _entity_1.FavouriteV1.findMany({ userId: userId }, { _id: 0, "property.city._id": 1 });
            let cityArray = [];
            for (let i = 0; i < cityData.length; i++)
                cityArray.push(cityData[i].property.city._id);
            let response = await _entity_1.CityV1.findMany({ "stateId": req.params.stateId, _id: { $in: cityArray } });
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async favCityListingCountryWise(req, res, next) {
        try {
            let userId = res.locals.userId;
            let cityData = await _entity_1.FavouriteV1.findMany({ userId: userId }, { _id: 0, "property.city._id": 1 });
            let cityArray = [];
            for (let i = 0; i < cityData.length; i++)
                cityArray.push(cityData[i].property.city._id);
            let response = await _entity_1.CityV1.findMany({ "countryId": req.params.countryId, _id: { $in: cityArray } });
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async favCountryListing(req, res, next) {
        try {
            let userId = res.locals.userId;
            let cityData = await _entity_1.FavouriteV1.findMany({ userId: userId }, { _id: 0, "property.country._id": 1 });
            let cityArray = [];
            for (let i = 0; i < cityData.length; i++)
                cityArray.push(cityData[i].property.country._id);
            let response = await _entity_1.CountriesV1.findMany({ _id: { $in: cityArray } });
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async favStateListing(req, res, next) {
        try {
            let userId = res.locals.userId;
            let cityData = await _entity_1.FavouriteV1.findMany({ userId: userId }, { _id: 0, "property.state._id": 1 });
            let cityArray = [];
            for (let i = 0; i < cityData.length; i++)
                cityArray.push(cityData[i].property.state._id);
            let response = await _entity_1.StatesV1.findMany({ _id: { $in: cityArray } });
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (err) {
            next(err);
        }
    }
    async validateBooking(req, res, next) {
        try {
            let userId = res.locals.userId;
            const { bookingId } = req.params;
            let bookingData = await _entity_1.BookingV1.findOne({
                "userData.userId": mongoose_1.Types.ObjectId(userId),
                _id: mongoose_1.Types.ObjectId(bookingId)
            }, { _id: 1, bookingStatus: 1 });
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, bookingData);
        }
        catch (err) {
            console.error(`we have an error in booking module ${err}`);
            next(err);
        }
    }
    async bookingPolicy(req, res, next) {
        try {
            const { bookingId } = req.query;
            let bookingDetail = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(bookingId) });
            let difference = Math.ceil(Math.abs(Date.now() / (1000 * 60 * 60 * 24) - bookingDetail.fromDate / (1000 * 60 * 60 * 24)));
            if (Math.ceil(Math.abs(bookingDetail.createdAt / (1000 * 60 * 60 * 24) - bookingDetail.fromDate / (1000 * 60 * 60 * 24))) <= 1) {
                if (336 - Math.abs(bookingDetail.createdAt.getTime() - bookingDetail.fromDate.getTime()) / (1000 * 60 * 60) <= 1) {
                    difference = 13.9;
                }
            }
            let criteria = await _entity_1.BookingV1.cancellationCriteria(bookingDetail, difference);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, criteria);
        }
        catch (err) {
            console.error(`we have an error in booking module ${err}`);
            next(err);
        }
    }
    async scheduleDemo(req, res, next) {
        try {
            const payload = req.body;
            payload['userId'] = res.locals.userId;
            const scheduledDemo = await _entity_1.DemoV1.scheduleDemoEntity(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, scheduledDemo);
        }
        catch (err) {
            console.error(`we have an error in scheduling demo ==> ${err}`);
            next(err);
        }
    }
    async updateScheduledDemo(req, res, next) {
        try {
            const payload = req.body;
            const scheduledDemo = await _entity_1.DemoV1.updateScheduledDemoEntity(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, scheduledDemo);
        }
        catch (err) {
            console.error(`we have an error in scheduling demo ==> ${err}`);
            next(err);
        }
    }
    async fetchSimilarProperties(req, res, next) {
        try {
            let payload = req.query;
            if (payload.categoryIds) {
                payload.categoryArray = payload.categoryIds.split(",");
            }
            let searchLatLong = await _entity_1.PropertyV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.propertyId) }, {
                _id: 0,
                location: 1
            });
            payload.long = searchLatLong.location.coordinates[0];
            payload.lat = searchLatLong.location.coordinates[1];
            let pipe = await _builders_1.default.User.UserPropertyBuilder.HolidaysPropertyList(payload);
            pipe.push(mongoose_1.Types.ObjectId(payload.propertyId));
            payload.pipe = pipe;
            let pipeline = await _builders_1.default.User.UserPropertyBuilder.SimilarPropertyList(payload);
            let propertyList = await _entity_1.PropertyV1.basicAggregate(pipeline);
            payload = await _builders_1.default.User.UserPropertyBuilder.partnerArray(payload);
            if (propertyList.length == 0) {
                let pipeline = await _builders_1.default.User.UserPropertyBuilder.SimilarPropertyListByRating(payload);
                let propertyList = await _entity_1.PropertyV1.basicAggregate(pipeline);
                return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, propertyList);
            }
            return await this.sendResponse(res, _common_1.SUCCESS.DEFAULT, propertyList);
        }
        catch (err) {
            console.error(`we have an error ==> ${err}`);
            next(err);
        }
    }
    async fetchFloorData(req, res, next) {
        try {
            let payload = req.params;
            let response = await _entity_1.EmployeeV1.fetchEmployeePropertyDetailsViaPropertySpace(payload);
            return this.sendResponse(res, _common_1.SUCCESS.DEFAULT, response);
        }
        catch (error) {
            console.error(`we have an error in fetchFloorData ==> ${error}`);
            next(error);
        }
    }
    async genrateLink(req, res, next) {
        try {
            let propertyId = req.params.propertyId;
            let shareUrl = `${_common_1.BASE.URL}/api/user/deeplink/?shareId=${propertyId.toString()}&type=2`;
            this.sendResponse(res, _common_1.SUCCESS.DEFAULT, shareUrl);
        }
        catch (err) {
            next(err);
        }
    }
};
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "location",
        path: '/getLocation',
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
                searchKeyword: {
                    description: 'n',
                    required: false
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
], UserLocationClass.prototype, "getLocation", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "category ",
        path: '/category',
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
], UserLocationClass.prototype, "getCategories", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Property listing",
        path: '/list',
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
                lat: { description: "28.6068", required: false },
                long: { description: "77.3597", required: false },
                cityIds: {
                    description: 'String of cityIds',
                    required: false,
                },
                categoryIds: {
                    description: 'String of categoryIds',
                    required: false,
                },
                amenitiesIds: {
                    description: 'String of amenitiesIds',
                    required: false,
                },
                sortKey: {
                    description: 'createdAt/avgRating/price',
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
                minimumFloor: {
                    description: '2',
                    required: false,
                },
                maximumFloor: {
                    description: '2',
                    required: false,
                },
                minimumArea: {
                    description: '2',
                    required: false,
                },
                maximumArea: {
                    description: '2',
                    required: false,
                },
                minCapacity: {
                    description: '2',
                    required: false,
                },
                maxCapacity: {
                    description: '2',
                    required: false,
                },
                minPrice: {
                    description: '2',
                    required: false,
                },
                maxPrice: {
                    description: '2',
                    required: false,
                },
                zipCode: {
                    description: '201301',
                    required: false
                },
                subCategoryIds: {
                    description: 'ids'
                },
                autoAcceptUpcomingBooking: {
                    description: 'Boolean true or false',
                    required: false
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
], UserLocationClass.prototype, "getProperties", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Amenities listing",
        path: '/amenitiesListing',
        parameters: {
            query: {
                propertyId: {
                    description: 'send propertyId in case of amenities listing',
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
], UserLocationClass.prototype, "getAmenities", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "city listing",
        path: '/cityListing',
        parameters: {
            query: {
                cityIds: {
                    description: 'String of cityIds',
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
], UserLocationClass.prototype, "cityListing", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get recent search",
        path: '/recentCityList',
        parameters: {
            query: {
                userId: {
                    description: 'userId of property details api',
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
], UserLocationClass.prototype, "fetchRecentSearchList", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get distinct zipCodes",
        path: '/zipCodes',
        parameters: {
            query: {
                searchKeyword: {
                    description: 'userId of property details api',
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
], UserLocationClass.prototype, "fetchZipcode", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Property Details",
        path: '/propertyDetails',
        parameters: {
            query: {
                id: {
                    description: 'mongoId',
                    required: true,
                },
                userId: {
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
], UserLocationClass.prototype, "propertyDetails", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "User Verify Otp",
        path: '/recentCityList',
        parameters: {
            body: {
                required: true,
                model: 'ReqAddRecentCity'
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
], UserLocationClass.prototype, "insertRecentCityList", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Dynamic pricing for user property",
        path: '/spaceDetailAndPricing',
        parameters: {
            query: {
                fromDate: {
                    description: 'date in ISO format',
                    required: false,
                },
                toDate: {
                    description: 'date in ISO format',
                    required: false,
                },
                propertyId: {
                    description: 'property id type mongoId',
                    required: true,
                },
                spaceId: {
                    description: 'pass space id in case of booking listing',
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
], UserLocationClass.prototype, "fetchOfferPricing", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Mark favorite",
        path: '/favourite',
        parameters: {
            body: {
                description: 'Body for mark favorite',
                required: true,
                model: 'ReqMarkPropertyFavouriteModel'
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
], UserLocationClass.prototype, "markAsFavourite", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get Favourite List",
        path: '/favourite',
        parameters: {
            query: {
                cityId: {
                    description: 'city Id',
                    required: false,
                },
                stateId: {
                    description: 'city Id',
                    required: false,
                },
                countryId: {
                    description: 'city Id',
                    required: false,
                },
                bookingStatus: {
                    description: '0,1',
                    required: false,
                },
                page: {
                    description: '0',
                    required: true,
                },
                limit: {
                    description: '0',
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
], UserLocationClass.prototype, "getFavouriteList", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Add space to book",
        path: '/spaceCart',
        parameters: {
            body: {
                description: 'Body for space booking',
                required: true,
                model: 'ReqSpaceCartModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserLocationClass.prototype, "addtoBookingCart", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Add prolong space to book",
        path: '/prolongBookingCart',
        parameters: {
            body: {
                description: 'Body for prolong space booking',
                required: true,
                model: 'ReqProlongSpaceCartModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserLocationClass.prototype, "createProLongBookingCart", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Space availability check",
        path: '/spaceAvailability',
        parameters: {
            query: {
                fromDate: {
                    description: 'date in ISO format',
                    required: true,
                },
                toDate: {
                    description: 'date in ISO format',
                    required: true,
                },
                propertyId: {
                    description: 'property id type mongoId',
                    required: true,
                },
                spaceId: {
                    description: 'pass space id in case of booking listing',
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
], UserLocationClass.prototype, "fetchSpaceAvailability", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Booking summary",
        path: '/spaceCart',
        parameters: {
            query: {
                propertyId: {
                    description: 'property id type mongoId',
                    required: true,
                },
                spaceId: {
                    description: 'space id type mongoId',
                    required: true,
                },
                startDate: {
                    description: 'date in ISO format',
                    required: true,
                },
                endDate: {
                    description: 'date in ISO format',
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
], UserLocationClass.prototype, "fetchBookingSummary", null);
__decorate([
    swagger_express_ts_1.ApiOperationPost({
        description: "Complete abandoned booking",
        path: '/bookSpace',
        parameters: {
            body: {
                description: 'Body for space booking',
                required: true,
                model: 'ReqSpaceBookingModel'
            }
        },
        responses: {
            200: {
                description: "Success",
                type: "String",
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserLocationClass.prototype, "bookSpace", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Get abandoned booking detail with order id",
        path: '/abandonedSpace',
        parameters: {
            path: {
                bookingId: {
                    description: 'bookingId type mongoId',
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
], UserLocationClass.prototype, "fetchBookedSpaceDetail", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "booking detail",
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
], UserLocationClass.prototype, "bookingSummary", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Activate Property",
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
                fromDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                toDate: {
                    description: '2020-03-01T10:30:49.426Z',
                    required: false,
                },
                categoryId: {
                    description: 'mongo id',
                    required: false
                },
                subCategoryId: {
                    description: 'mongo id',
                    required: false
                },
                cityId: {
                    description: 'mongo id',
                    required: false
                },
                stateId: {
                    description: 'mongo id',
                    required: false
                },
                countryId: {
                    description: 'mongo id',
                    required: false
                },
                bookingStatus: {
                    description: 'refer booking ENUM',
                    required: false
                },
                search: {
                    description: 'search By property name and bookingId',
                    required: false
                },
                sort: {
                    description: 'sort like {createdAt : 1}',
                    required: false
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
], UserLocationClass.prototype, "bookingList", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "Cancel Booking",
        path: '/booking',
        parameters: {
            body: {
                description: 'Body for cancel booking',
                required: true,
                model: 'ReqCancelSpaceBookingModel'
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
], UserLocationClass.prototype, "cancelBooking", null);
__decorate([
    swagger_express_ts_1.ApiOperationPut({
        description: "update pass base verification token",
        path: '/pbVerification',
        parameters: {
            body: {
                description: 'Body for pass base verification api',
                required: true,
                model: 'ReqUpdatepbTokenModel'
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
], UserLocationClass.prototype, "updatePbToken", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "city listing",
        path: '/favCityListing/{stateId}',
        parameters: {
            path: {
                stateId: {
                    description: 'stateId',
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
], UserLocationClass.prototype, "favCityListing", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "city listing",
        path: '/favCity/{countryId}',
        parameters: {
            path: {
                countryId: {
                    description: 'countryId',
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
], UserLocationClass.prototype, "favCityListingCountryWise", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "city listing",
        path: '/favCountryListing',
        parameters: {},
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
], UserLocationClass.prototype, "favCountryListing", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "city listing",
        path: '/favStateListing/{countryId}',
        parameters: {
            path: {
                countryId: {
                    description: 'countryId',
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
], UserLocationClass.prototype, "favStateListing", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "check if a booking is abandoned or not!",
        path: '/validate/{bookingId}',
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
], UserLocationClass.prototype, "validateBooking", null);
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
], UserLocationClass.prototype, "bookingPolicy", null);
__decorate([
    swagger_express_ts_1.ApiOperationGet({
        description: "Property listing",
        path: '/similar',
        parameters: {
            query: {
                categoryIds: {
                    description: 'String of categoryIds',
                    required: false,
                },
                propertyId: {
                    description: 'Property Id',
                    required: false,
                },
                userId: {
                    description: 'User Id',
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
], UserLocationClass.prototype, "fetchSimilarProperties", null);
UserLocationClass = __decorate([
    swagger_express_ts_1.ApiPath({
        path: "/api/user/property",
        name: "User Property Module",
        security: { apiKeyHeader: [] },
    }),
    __metadata("design:paramtypes", [])
], UserLocationClass);
exports.UserLocationController = new UserLocationClass();
//# sourceMappingURL=user.property.controller.js.map