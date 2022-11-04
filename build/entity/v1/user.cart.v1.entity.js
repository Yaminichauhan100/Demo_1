"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingCartV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const booking_cart_model_1 = __importDefault(require("@models/booking.cart.model"));
const _services_1 = require("@services");
const _entity_1 = require("@entity");
const _common_1 = require("@common");
const moment_1 = __importDefault(require("moment"));
const host_v1_entity_1 = require("./host.v1.entity");
class UserCartEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async addtoBookingCart(payload, headers, next, userDetail, propertyDetail, spacePrice, offerPriceOfCategory) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        try {
            let deviceId = headers.devicedetails.deviceId;
            payload['deviceId'] = deviceId;
            payload['tax'] = ((_a = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.state) === null || _a === void 0 ? void 0 : _a.tax) ? (_b = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.state) === null || _b === void 0 ? void 0 : _b.tax : (_c = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.country) === null || _c === void 0 ? void 0 : _c.tax;
            let criteriaForDuplicateSpace = {
                "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId),
                "cartInfo.spaceId": { $in: payload.spaceIds },
            };
            let checkDuplicateItems = await exports.BookingCartV1.findOne(criteriaForDuplicateSpace);
            let { endDate, startDate } = _services_1.formattedTime({ fromDate: payload.fromDate, toDate: payload.toDate });
            endDate = moment_1.default(payload.toDate).add(payload.offset, "minute").toDate();
            startDate = moment_1.default(payload.fromDate).add(payload.offset, "minute").toDate();
            let calculatedPrice = await this.fetchCalculatedPrice(spacePrice, payload, payload['tax'], endDate, startDate, payload.quantity, spacePrice.pricing, offerPriceOfCategory);
            let cartInfo = [];
            let totalSpaceCapacity = 0;
            for (let i = 0; i < spacePrice.length; i++) {
                let basePrice = 0;
                switch (payload === null || payload === void 0 ? void 0 : payload.bookingType) {
                    case _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM:
                        basePrice = calculatedPrice.bookingDuration.totalDays * spacePrice[i].pricing.daily;
                        break;
                    case _common_1.ENUM.USER.BOOKING_TYPE.HOURLY:
                        basePrice = payload.totalHours * spacePrice[i].pricing.hourly;
                        break;
                    case _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY:
                        basePrice = payload.totalMonths * spacePrice[i].pricing.monthly;
                        break;
                }
                cartInfo.push({
                    spaceId: (_d = spacePrice[i]) === null || _d === void 0 ? void 0 : _d._id,
                    pricing: spacePrice[i].pricing,
                    basePrice: basePrice,
                    spaceLabel: (_e = spacePrice[i]) === null || _e === void 0 ? void 0 : _e.spaceLabel,
                    position: spacePrice[i].position,
                    gridRow: spacePrice[i].gridRow,
                    gridColumn: spacePrice[i].gridColumn,
                    floorImage: spacePrice[i].floorImage
                });
                totalSpaceCapacity = totalSpaceCapacity + spacePrice[i].capacity;
            }
            let dataToInsert = {
                deviceId: deviceId,
                quantity: payload.quantity,
                cartInfo: cartInfo,
                totalSpaceCapacity: totalSpaceCapacity,
                fromDate: moment_1.default(payload.fromDate).toISOString(),
                toDate: moment_1.default(payload.toDate).toISOString(),
                totalPayable: calculatedPrice.offerPrice ? calculatedPrice.totalPayable - (calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.offerPrice) : calculatedPrice.totalPayable,
                monthlyPayable: calculatedPrice.offerPrice && calculatedPrice.monthlyPricing ?
                    ((calculatedPrice.monthlyPricing * ((_f = calculatedPrice.bookingDuration) === null || _f === void 0 ? void 0 : _f.months)) - (calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.offerPrice)) / ((_g = calculatedPrice.bookingDuration) === null || _g === void 0 ? void 0 : _g.months) :
                    calculatedPrice.monthlyPricing,
                shareUrl: propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.shareUrl,
                offerPrice: (calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.offerPrice) ? calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.offerPrice : 0,
                offerLabelType: (calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.offerPricingObj) ? calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.offerPricingObj : {},
                taxes: calculatedPrice.taxes,
                taxPercentage: payload['tax'],
                userData: {
                    userId: userDetail === null || userDetail === void 0 ? void 0 : userDetail._id,
                    status: userDetail.status,
                    name: userDetail.name,
                    image: userDetail.image ? userDetail === null || userDetail === void 0 ? void 0 : userDetail.image : "",
                    phoneNo: userDetail.phoneNo,
                    countryCode: userDetail.countryCode,
                    createdAt: userDetail.createdAt,
                    email: userDetail.email,
                    profileStatus: userDetail.profileStatus,
                    bio: userDetail.bio,
                },
                propertyData: {
                    propertyId: propertyDetail._id ? propertyDetail._id : "",
                    status: propertyDetail.status ? propertyDetail.status : "",
                    name: propertyDetail.name ? propertyDetail.name : "",
                    images: propertyDetail.images ? propertyDetail.images : "",
                    address: propertyDetail.address ? propertyDetail.address : "",
                    autoAcceptUpcomingBooking: propertyDetail.autoAcceptUpcomingBooking,
                    hostName: propertyDetail.userData.name,
                    hostImage: propertyDetail.userData.image,
                    hostEmail: propertyDetail.userData.email
                },
                hostId: propertyDetail.userData.userId,
                basePrice: calculatedPrice.totalPrice,
                bookingDuration: {
                    year: ((_h = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _h === void 0 ? void 0 : _h.year) ? (_j = calculatedPrice.bookingDuration) === null || _j === void 0 ? void 0 : _j.year : 0,
                    months: ((_k = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _k === void 0 ? void 0 : _k.months) ? (_l = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _l === void 0 ? void 0 : _l.months : 0,
                    days: ((_m = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _m === void 0 ? void 0 : _m.days) ? (_o = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _o === void 0 ? void 0 : _o.days : 0,
                    totalDays: ((_p = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _p === void 0 ? void 0 : _p.totalDays) ? (_q = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _q === void 0 ? void 0 : _q.totalDays : 0,
                    totalHours: ((_r = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _r === void 0 ? void 0 : _r.totalHours) ? (_s = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _s === void 0 ? void 0 : _s.totalHours : 0
                },
                floorDescription: spacePrice[0].floorDescription,
                floorNumber: spacePrice[0].floorNumber,
                floorLabel: spacePrice[0].floorLabel,
                bookingType: payload === null || payload === void 0 ? void 0 : payload.bookingType,
                category: spacePrice[0].category,
                subCategory: spacePrice[0].subCategory,
                adminCommissionAmount: (_t = payload === null || payload === void 0 ? void 0 : payload.adminCommissionAmount) === null || _t === void 0 ? void 0 : _t.commissionAmount,
            };
            console.log("dataToInsert", dataToInsert);
            let bookingData;
            if (checkDuplicateItems) {
                bookingData = await exports.BookingCartV1.updateDocument(criteriaForDuplicateSpace, dataToInsert, { upsert: false, new: true });
            }
            else {
                bookingData = await new this.model(dataToInsert).save();
            }
            let response = await this.spaceCartResponse(spacePrice, payload, calculatedPrice, bookingData, totalSpaceCapacity);
            return response;
        }
        catch (error) {
            console.error(`we have an error in booking cart ==> ${error}`);
            next(error);
        }
    }
    async spaceCartResponse(spacePrice, payload, calculatedPrice, bookingData, totalSpaceCapacity) {
        var _a, _b, _c, _d, _e;
        try {
            let cart = {
                quantity: bookingData === null || bookingData === void 0 ? void 0 : bookingData.quantity,
                _id: bookingData === null || bookingData === void 0 ? void 0 : bookingData._id,
                startDate: bookingData === null || bookingData === void 0 ? void 0 : bookingData.startDate,
                endDate: bookingData === null || bookingData === void 0 ? void 0 : bookingData.endDate,
                deviceId: bookingData === null || bookingData === void 0 ? void 0 : bookingData.deviceId,
                userId: bookingData === null || bookingData === void 0 ? void 0 : bookingData.userId,
                offerPrice: bookingData === null || bookingData === void 0 ? void 0 : bookingData.offerPrice,
                offerLabelType: bookingData === null || bookingData === void 0 ? void 0 : bookingData.offerLabelType,
                taxes: bookingData === null || bookingData === void 0 ? void 0 : bookingData.taxes,
                totalPayable: bookingData === null || bookingData === void 0 ? void 0 : bookingData.totalPayable,
                cartInfo: bookingData === null || bookingData === void 0 ? void 0 : bookingData.cartInfo,
                basePrice: bookingData === null || bookingData === void 0 ? void 0 : bookingData.basePrice,
                pricing: bookingData === null || bookingData === void 0 ? void 0 : bookingData.pricing
            };
            let response = [{
                    _id: spacePrice[0].category._id,
                    data: [{
                            category: spacePrice[0].category,
                            subCategory: spacePrice[0].subCategory,
                            maxQuantity: spacePrice.length,
                            cartDetails: cart,
                            occupancy: totalSpaceCapacity,
                            offerPrice: bookingData.offerPrice,
                            taxPercentage: payload['tax'],
                            bookingDuration: {
                                year: (_a = calculatedPrice.bookingDuration) === null || _a === void 0 ? void 0 : _a.year,
                                months: (_b = calculatedPrice.bookingDuration) === null || _b === void 0 ? void 0 : _b.months,
                                days: (_c = calculatedPrice.bookingDuration) === null || _c === void 0 ? void 0 : _c.days,
                                totalDays: (_d = calculatedPrice.bookingDuration) === null || _d === void 0 ? void 0 : _d.totalDays,
                                totalHours: (_e = calculatedPrice.bookingDuration) === null || _e === void 0 ? void 0 : _e.totalHours
                            },
                            isEmployee: spacePrice[0].isEmployee,
                            spaceAvailability: payload.availableUnits,
                            floorDescription: spacePrice[0].floorDescription,
                            floorNumber: spacePrice[0].floorNumber,
                            floorLabel: spacePrice[0].floorLabel,
                            partnerId: mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.partnerId)
                        }]
                }];
            return response;
        }
        catch (error) {
            console.error(`we have an error in spaceCartResponse ==> ${error}`);
        }
    }
    async addToProlongedCart(payload, headers, next, userDetail, propertyDetail, spacePrice) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        try {
            let deviceId = headers.devicedetails.deviceId;
            payload['deviceId'] = deviceId;
            payload['tax'] = ((_a = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.state) === null || _a === void 0 ? void 0 : _a.tax) ? (_b = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.state) === null || _b === void 0 ? void 0 : _b.tax : (_c = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.country) === null || _c === void 0 ? void 0 : _c.tax;
            let criteriaForDuplicateSpace = {
                "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId),
                "cartInfo.spaceId": { $in: payload.spaceIds }
            };
            let checkDuplicateItems = await exports.BookingCartV1.findOne(criteriaForDuplicateSpace);
            let { endDate, startDate } = _services_1.formattedTime({ fromDate: payload.fromDate, toDate: payload.toDate });
            endDate = moment_1.default(payload.toDate).add(payload.offset, "minute").toDate();
            startDate = moment_1.default(payload.fromDate).add(payload.offset, "minute").toDate();
            let calculatedPrice = await this.fetchCalculatedPrice(spacePrice, payload, payload['tax'], endDate, startDate, payload.quantity, spacePrice.pricing, spacePrice.offerPricingArray);
            let cartInfo = [];
            let totalSpaceCapacity = 0;
            console.log("here to e", calculatedPrice);
            for (let i = 0; i < spacePrice.length; i++) {
                let basePrice = 0;
                switch (payload === null || payload === void 0 ? void 0 : payload.bookingType) {
                    case _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM:
                        basePrice = calculatedPrice.bookingDuration.totalDays * spacePrice[i].pricing.daily;
                        break;
                    case _common_1.ENUM.USER.BOOKING_TYPE.HOURLY:
                        basePrice = payload.totalHours * spacePrice[i].pricing.hourly;
                        break;
                    case _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY:
                        basePrice = payload.totalMonths * spacePrice[i].pricing.monthly;
                        break;
                }
                cartInfo.push({
                    spaceId: spacePrice[i]._id,
                    pricing: spacePrice[i].pricing,
                    basePrice: basePrice,
                    spaceLabel: (_d = spacePrice[i]) === null || _d === void 0 ? void 0 : _d.spaceLabel
                });
                totalSpaceCapacity = totalSpaceCapacity + spacePrice[i].capacity;
            }
            let dataToInsert = {
                deviceId: deviceId,
                quantity: payload.quantity,
                cartInfo: cartInfo,
                totalSpaceCapacity: totalSpaceCapacity,
                fromDate: moment_1.default(payload.fromDate).toISOString(),
                toDate: moment_1.default(payload.toDate).toISOString(),
                totalPayable: calculatedPrice.offerPrice ? calculatedPrice.totalPayable - (calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.offerPrice) : calculatedPrice.totalPayable,
                monthlyPayable: calculatedPrice.offerPrice ?
                    ((calculatedPrice.monthlyPricing * ((_e = calculatedPrice.bookingDuration) === null || _e === void 0 ? void 0 : _e.months)) - (calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.offerPrice)) / ((_f = calculatedPrice.bookingDuration) === null || _f === void 0 ? void 0 : _f.months) :
                    calculatedPrice.monthlyPricing,
                shareUrl: propertyDetail.shareUrl,
                offerPrice: (calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.offerPrice) ? calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.offerPrice : 0,
                offerLabelType: (calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.offerPricingObj) ? calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.offerPricingObj : {},
                taxes: calculatedPrice.taxes,
                taxPercentage: payload['tax'],
                userData: {
                    userId: userDetail._id,
                    status: userDetail.status,
                    name: userDetail.name,
                    image: userDetail.image ? userDetail === null || userDetail === void 0 ? void 0 : userDetail.image : "",
                    phoneNo: userDetail.phoneNo,
                    countryCode: userDetail.countryCode,
                    createdAt: userDetail.createdAt,
                    email: userDetail.email,
                    profileStatus: userDetail.profileStatus
                },
                propertyData: {
                    propertyId: propertyDetail._id ? propertyDetail._id : "",
                    status: propertyDetail.status ? propertyDetail.status : "",
                    name: propertyDetail.name ? propertyDetail.name : "",
                    images: propertyDetail.images ? propertyDetail.images : "",
                    address: propertyDetail.address ? propertyDetail.address : "",
                    autoAcceptUpcomingBooking: propertyDetail.autoAcceptUpcomingBooking,
                    hostName: propertyDetail.userData.name,
                    hostImage: propertyDetail.userData.image,
                    hostEmail: propertyDetail.userData.email
                },
                hostId: propertyDetail.userData.userId,
                basePrice: calculatedPrice.totalPrice,
                bookingDuration: {
                    year: ((_g = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _g === void 0 ? void 0 : _g.year) ? (_h = calculatedPrice.bookingDuration) === null || _h === void 0 ? void 0 : _h.year : 0,
                    months: ((_j = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _j === void 0 ? void 0 : _j.months) ? (_k = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _k === void 0 ? void 0 : _k.months : 0,
                    days: ((_l = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _l === void 0 ? void 0 : _l.days) ? (_m = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _m === void 0 ? void 0 : _m.days : 0,
                    totalDays: ((_o = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _o === void 0 ? void 0 : _o.totalDays) ? (_p = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _p === void 0 ? void 0 : _p.totalDays : 0,
                    totalHours: ((_q = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _q === void 0 ? void 0 : _q.totalHours) ? (_r = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _r === void 0 ? void 0 : _r.totalHours : 0
                },
                floorDescription: spacePrice[0].floorDescription,
                floorNumber: spacePrice[0].floorNumber,
                floorLabel: spacePrice[0].floorLabel,
                bookingType: payload === null || payload === void 0 ? void 0 : payload.bookingType,
                category: spacePrice[0].category,
                subCategory: spacePrice[0].subCategory,
                adminCommissionAmount: (_s = payload === null || payload === void 0 ? void 0 : payload.adminCommissionAmount) === null || _s === void 0 ? void 0 : _s.commissionAmount,
            };
            let bookingData;
            if (checkDuplicateItems) {
                bookingData = await exports.BookingCartV1.updateDocument(criteriaForDuplicateSpace, dataToInsert, { upsert: false });
            }
            else {
                bookingData = await new this.model(dataToInsert).save();
            }
            let response = await this.prolongSpaceCartResponse(spacePrice, payload, calculatedPrice, bookingData, totalSpaceCapacity);
            return response;
        }
        catch (error) {
            console.error(`we have an error in addToProlongedCart ==> ${error}`);
            next(error);
        }
    }
    async fetchCalculatedPrice(spacePrice, payload, tax, endDate, startDate, quantity, pricing, offerPriceOfCategory) {
        try {
            switch (payload === null || payload === void 0 ? void 0 : payload.bookingType) {
                case _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM:
                    return await _services_1.calculateCartPrice(tax, endDate, startDate, quantity, pricing, offerPriceOfCategory, spacePrice);
                case _common_1.ENUM.USER.BOOKING_TYPE.HOURLY:
                    return await this.calculateHourlyCartPrice(payload, endDate, startDate, spacePrice, offerPriceOfCategory);
                case _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY:
                    return await this.calculateMonthlyCartPrice(payload, endDate, startDate, spacePrice, offerPriceOfCategory);
            }
        }
        catch (error) {
            console.error(`we have an error in fetchCalculatedPrice ==> ${error}`);
        }
    }
    async calculateHourlyCartPrice(payload, endDate, startDate, spacePrice, offerPriceOfCategory) {
        var _a, _b, _c, _d;
        try {
            if ((offerPriceOfCategory === null || offerPriceOfCategory === void 0 ? void 0 : offerPriceOfCategory.length) > 0) {
                console.log("insiede");
                let price = 0;
                for (let i = 0; i < spacePrice.length; i++)
                    price = price + ((_b = (_a = spacePrice[i]) === null || _a === void 0 ? void 0 : _a.pricing) === null || _b === void 0 ? void 0 : _b.hourly);
                let pricing = {
                    hourly: payload.totalHours * price
                };
                let calculatedPrice = {
                    totalPrice: pricing.hourly,
                    basePrice: pricing.hourly,
                    hourlyPricing: pricing.hourly,
                    bookingDuration: {
                        totalHours: payload.totalHours
                    }
                };
                await _services_1.calculateBestOfferPrice(calculatedPrice, offerPriceOfCategory, payload.quantity);
                if (Object.keys(calculatedPrice.offerMap).length >= 1) {
                    if (Object.keys(calculatedPrice.offerMap).length == 1) {
                        calculatedPrice['offerMap'] = calculatedPrice.offerMap;
                    }
                    else {
                        calculatedPrice['offerMap'] = Object.keys(calculatedPrice.offerMap).reduce(function (a, b) {
                            return calculatedPrice.offerMap[a] > calculatedPrice.offerMap[b] ?
                                { [a]: calculatedPrice.offerMap[a] } :
                                { [b]: calculatedPrice.offerMap[b] };
                        });
                    }
                }
                else {
                    delete calculatedPrice.offerMap;
                    delete calculatedPrice.offerPricingObj;
                    delete calculatedPrice.priceRange;
                    let taxes = payload.tax ? payload.tax * (calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.totalPrice) / _common_1.CONSTANT.TAXES.DIVISOR : _common_1.CONSTANT.TAXES.BASIC * (calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.totalPrice) / _common_1.CONSTANT.TAXES.DIVISOR;
                    calculatedPrice['hourlyPricing'] = pricing.hourly > 1 ? pricing.hourly + _common_1.CONSTANT.TAXES.BASIC * pricing.hourly / _common_1.CONSTANT.TAXES.DIVISOR : 0;
                    calculatedPrice['totalPayable'] = pricing.hourly + taxes;
                    calculatedPrice['taxes'] = taxes;
                    return calculatedPrice;
                }
                for (let i = calculatedPrice.offerPricingObj.offerPricing.priceDetails.length - 1; i >= 0; --i) {
                    const offerPricingElement = calculatedPrice.offerPricingObj.offerPricing.priceDetails[i];
                    if (offerPricingElement.discountLabelType == Object.keys(calculatedPrice.offerMap)) {
                        calculatedPrice['offerPricingObj'] = offerPricingElement;
                        calculatedPrice['offerPrice'] = Object.values(calculatedPrice.offerMap)[0];
                        break;
                    }
                }
                console.log("calculate price");
                let taxes = payload.tax ? payload.tax * ((calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.totalPrice) - calculatedPrice.offerPrice) / _common_1.CONSTANT.TAXES.DIVISOR : _common_1.CONSTANT.TAXES.BASIC * (calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.totalPrice) / _common_1.CONSTANT.TAXES.DIVISOR;
                calculatedPrice['hourlyPricing'] = pricing.hourly > 1 ? pricing.hourly + _common_1.CONSTANT.TAXES.BASIC * pricing.hourly / _common_1.CONSTANT.TAXES.DIVISOR : 0;
                calculatedPrice['totalPayable'] = pricing.hourly + taxes;
                calculatedPrice['taxes'] = taxes;
                return calculatedPrice;
            }
            else {
                console.log("spacePrice---->", spacePrice);
                let price = 0;
                for (let i = 0; i < spacePrice.length; i++)
                    price = price + ((_d = (_c = spacePrice[i]) === null || _c === void 0 ? void 0 : _c.pricing) === null || _d === void 0 ? void 0 : _d.hourly);
                let pricing = {
                    hourly: payload.totalHours * price
                };
                let calculatedPrice = {
                    totalPrice: pricing.hourly,
                    basePrice: pricing.hourly,
                    hourlyPricing: pricing.hourly,
                    bookingDuration: {
                        totalHours: payload.totalHours
                    }
                };
                let taxes = payload.tax ? payload.tax * (calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.totalPrice) / _common_1.CONSTANT.TAXES.DIVISOR : _common_1.CONSTANT.TAXES.BASIC * (calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.totalPrice) / _common_1.CONSTANT.TAXES.DIVISOR;
                calculatedPrice['hourlyPricing'] = pricing.hourly > 1 ? pricing.hourly + _common_1.CONSTANT.TAXES.BASIC * pricing.hourly / _common_1.CONSTANT.TAXES.DIVISOR : 0;
                calculatedPrice['totalPayable'] = pricing.hourly + taxes;
                calculatedPrice['taxes'] = taxes;
                return calculatedPrice;
            }
        }
        catch (error) {
            console.error(`we have an error in calculateHourlyCartPrice ==> ${error}`);
        }
    }
    async calculateMonthlyCartPrice(payload, endDate, startDate, spacePrice, offerPriceOfCategory) {
        var _a, _b, _c, _d;
        try {
            if ((offerPriceOfCategory === null || offerPriceOfCategory === void 0 ? void 0 : offerPriceOfCategory.length) > 0) {
                let price = 0;
                for (let i = 0; i < spacePrice.length; i++)
                    price = price + ((_b = (_a = spacePrice[i]) === null || _a === void 0 ? void 0 : _a.pricing) === null || _b === void 0 ? void 0 : _b.monthly);
                let pricing = {
                    totalMonthly: payload.totalMonths * price
                };
                let calculatedPrice = {
                    totalPrice: pricing.totalMonthly,
                    basePrice: pricing.totalMonthly,
                    monthlyPricing: pricing.totalMonthly,
                    bookingDuration: {
                        months: payload === null || payload === void 0 ? void 0 : payload.totalMonths
                    }
                };
                await _services_1.calculateBestOfferPrice(calculatedPrice, offerPriceOfCategory, payload === null || payload === void 0 ? void 0 : payload.quantity);
                if (Object.keys(calculatedPrice.offerMap).length >= 1) {
                    if (Object.keys(calculatedPrice.offerMap).length == 1) {
                        calculatedPrice['offerMap'] = calculatedPrice.offerMap;
                    }
                    else {
                        calculatedPrice['offerMap'] = Object.keys(calculatedPrice.offerMap).reduce(function (a, b) {
                            return calculatedPrice.offerMap[a] > calculatedPrice.offerMap[b] ?
                                { [a]: calculatedPrice.offerMap[a] } :
                                { [b]: calculatedPrice.offerMap[b] };
                        });
                    }
                }
                else {
                    delete calculatedPrice.offerMap;
                    delete calculatedPrice.offerPricingObj;
                    delete calculatedPrice.priceRange;
                    let taxes = (payload === null || payload === void 0 ? void 0 : payload.tax) ? (payload === null || payload === void 0 ? void 0 : payload.tax) * (calculatedPrice.totalPrice - calculatedPrice.offerPrice) / _common_1.CONSTANT.TAXES.DIVISOR : _common_1.CONSTANT.TAXES.BASIC * calculatedPrice.totalPrice / _common_1.CONSTANT.TAXES.DIVISOR;
                    calculatedPrice['totalPayable'] = pricing.totalMonthly + taxes;
                    calculatedPrice['taxes'] = taxes;
                    return calculatedPrice;
                }
                for (let i = calculatedPrice.offerPricingObj.offerPricing.priceDetails.length - 1; i >= 0; --i) {
                    const offerPricingElement = calculatedPrice.offerPricingObj.offerPricing.priceDetails[i];
                    if (offerPricingElement.discountLabelType == Object.keys(calculatedPrice.offerMap)) {
                        calculatedPrice['offerPricingObj'] = offerPricingElement;
                        calculatedPrice['offerPrice'] = Object.values(calculatedPrice.offerMap)[0];
                        break;
                    }
                }
                let taxes = (payload === null || payload === void 0 ? void 0 : payload.tax) ? (payload === null || payload === void 0 ? void 0 : payload.tax) * (calculatedPrice.totalPrice - calculatedPrice.offerPrice) / _common_1.CONSTANT.TAXES.DIVISOR : _common_1.CONSTANT.TAXES.BASIC * calculatedPrice.totalPrice / _common_1.CONSTANT.TAXES.DIVISOR;
                calculatedPrice['totalPayable'] = pricing.totalMonthly + taxes;
                calculatedPrice['taxes'] = taxes;
                if (calculatedPrice.bookingDuration.months >= 2) {
                    calculatedPrice['monthlyPricing'] = await _services_1.roundOffNumbers(calculatedPrice.totalPayable / (payload === null || payload === void 0 ? void 0 : payload.totalMonths));
                }
                else {
                    calculatedPrice['monthlyPricing'] = 0;
                }
                return calculatedPrice;
            }
            else {
                let price = 0;
                for (let i = 0; i < spacePrice.length; i++)
                    price = price + ((_d = (_c = spacePrice[i]) === null || _c === void 0 ? void 0 : _c.pricing) === null || _d === void 0 ? void 0 : _d.monthly);
                let pricing = {
                    totalMonthly: payload.totalMonths * price
                };
                let calculatedPrice = {
                    totalPrice: pricing.totalMonthly,
                    basePrice: pricing.totalMonthly,
                    monthlyPricing: pricing.totalMonthly,
                    bookingDuration: {
                        months: payload === null || payload === void 0 ? void 0 : payload.totalMonths,
                    }
                };
                let taxes = (payload === null || payload === void 0 ? void 0 : payload.tax) ? (payload === null || payload === void 0 ? void 0 : payload.tax) * calculatedPrice.totalPrice / _common_1.CONSTANT.TAXES.DIVISOR : _common_1.CONSTANT.TAXES.BASIC * calculatedPrice.totalPrice / _common_1.CONSTANT.TAXES.DIVISOR;
                calculatedPrice['totalPayable'] = pricing.totalMonthly + taxes;
                calculatedPrice['taxes'] = taxes;
                if (calculatedPrice.bookingDuration.months >= 2) {
                    calculatedPrice['monthlyPricing'] = await _services_1.roundOffNumbers(calculatedPrice.totalPayable / (payload === null || payload === void 0 ? void 0 : payload.totalMonths));
                }
                else {
                    calculatedPrice['monthlyPricing'] = 0;
                }
                return calculatedPrice;
            }
        }
        catch (error) {
            console.error(`we have an error in calculateMonthlyCartPrice ==> ${error}`);
        }
    }
    async addtoGuestBookingCart(payload, headers, next, propertyDetail, spacePrice, offerPriceOfCategory) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        try {
            const deviceId = headers.devicedetails.deviceId;
            payload['deviceId'] = deviceId;
            payload['tax'] = ((_a = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.state) === null || _a === void 0 ? void 0 : _a.tax) ? (_b = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.state) === null || _b === void 0 ? void 0 : _b.tax : propertyDetail.country.tax;
            ;
            let criteriaForDuplicateSpace = {
                "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId),
                "cartInfo.spaceId": { $in: payload.spaceIds },
            };
            let checkDuplicateItems = await exports.BookingCartV1.findOne(criteriaForDuplicateSpace);
            let { endDate, startDate } = _services_1.formattedTime({ fromDate: payload.fromDate, toDate: payload.toDate });
            endDate = moment_1.default(payload.toDate).add(payload.offset, "minute").toDate();
            startDate = moment_1.default(payload.fromDate).add(payload.offset, "minute").toDate();
            let calculatedPrice = await this.fetchCalculatedPrice(spacePrice, payload, payload['tax'], endDate, startDate, payload.quantity, spacePrice.pricing, offerPriceOfCategory);
            let cartInfo = [];
            let totalSpaceCapacity = 0;
            console.log("here to e");
            for (let i = 0; i < spacePrice.length; i++) {
                let basePrice = 0;
                switch (payload === null || payload === void 0 ? void 0 : payload.bookingType) {
                    case _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM:
                        basePrice = calculatedPrice.bookingDuration.totalDays * spacePrice[i].pricing.daily;
                        break;
                    case _common_1.ENUM.USER.BOOKING_TYPE.HOURLY:
                        basePrice = payload.totalHours * spacePrice[i].pricing.hourly;
                        break;
                    case _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY:
                        basePrice = payload.totalMonths * spacePrice[i].pricing.monthly;
                        break;
                }
                cartInfo.push({
                    spaceId: spacePrice[i]._id,
                    pricing: spacePrice[i].pricing,
                    basePrice: basePrice,
                    spaceLabel: spacePrice[i].spaceLabel,
                    position: spacePrice[i].position,
                    gridRow: spacePrice[i].gridRow,
                    gridColumn: spacePrice[i].gridColumn,
                    floorImage: spacePrice[i].floorImage
                });
                totalSpaceCapacity = totalSpaceCapacity + spacePrice[i].capacity;
            }
            let dataToInsert = {
                deviceId: deviceId,
                quantity: payload.quantity,
                cartInfo: cartInfo,
                totalSpaceCapacity: totalSpaceCapacity,
                fromDate: moment_1.default(payload.fromDate).toISOString(),
                toDate: moment_1.default(payload.toDate).toISOString(),
                totalPayable: calculatedPrice.offerPrice ? calculatedPrice.totalPayable - (calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.offerPrice) : calculatedPrice.totalPayable,
                shareUrl: propertyDetail.shareUrl,
                propertyData: {
                    propertyId: propertyDetail._id ? propertyDetail._id : "",
                    status: propertyDetail.status ? propertyDetail.status : "",
                    name: propertyDetail.name ? propertyDetail.name : "",
                    images: propertyDetail.images ? propertyDetail.images : "",
                    address: propertyDetail.address ? propertyDetail.address : "",
                    autoAcceptUpcomingBooking: propertyDetail.autoAcceptUpcomingBooking,
                    hostName: propertyDetail.userData.name,
                    hostImage: propertyDetail.userData.image,
                    hostEmail: propertyDetail.userData.email
                },
                hostId: propertyDetail.userData.userId,
                basePrice: calculatedPrice.totalPrice,
                bookingDuration: {
                    year: ((_c = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _c === void 0 ? void 0 : _c.year) ? (_d = calculatedPrice.bookingDuration) === null || _d === void 0 ? void 0 : _d.year : 0,
                    months: ((_e = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _e === void 0 ? void 0 : _e.months) ? (_f = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _f === void 0 ? void 0 : _f.months : 0,
                    days: ((_g = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _g === void 0 ? void 0 : _g.days) ? (_h = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _h === void 0 ? void 0 : _h.days : 0,
                    totalDays: ((_j = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _j === void 0 ? void 0 : _j.totalDays) ? (_k = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _k === void 0 ? void 0 : _k.totalDays : 0,
                    totalHours: ((_l = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _l === void 0 ? void 0 : _l.totalHours) ? (_m = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _m === void 0 ? void 0 : _m.totalHours : 0
                },
                floorDescription: spacePrice[0].floorDescription,
                floorNumber: spacePrice[0].floorNumber,
                floorLabel: spacePrice[0].floorLabel,
                bookingType: payload === null || payload === void 0 ? void 0 : payload.bookingType,
                taxes: calculatedPrice.taxes,
                taxPercentage: payload['tax'],
                offerPrice: (calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.offerPrice) ? calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.offerPrice : 0,
                offerLabelType: (calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.offerPricingObj) ? calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.offerPricingObj : {},
                category: spacePrice[0].category,
                subCategory: spacePrice[0].subCategory,
                adminCommissionAmount: payload === null || payload === void 0 ? void 0 : payload.adminCommissionAmount.commissionAmount,
            };
            let bookingData;
            if (checkDuplicateItems) {
                bookingData = await exports.BookingCartV1.updateDocument(criteriaForDuplicateSpace, dataToInsert, { upsert: false, new: true });
            }
            else
                bookingData = await new this.model(dataToInsert).save();
            let response = await this.spaceCartResponse(spacePrice, payload, calculatedPrice, bookingData, totalSpaceCapacity);
            return response;
        }
        catch (error) {
            console.error(`we have an error in guestBooking cart ==> ${error}`);
        }
    }
    async fetchBookingSummary(propertyId, spaceId, startDate, endDate) {
        try {
            let pipeline = [];
            let matchCondition = {};
            matchCondition['propertyId'] = mongoose_1.Types.ObjectId(propertyId);
            matchCondition['status'] = _common_1.ENUM.PROPERTY.STATUS.ACTIVE;
            spaceId ? matchCondition['_id'] = mongoose_1.Types.ObjectId(spaceId) : "";
            let pipelineMatchCondition = {
                "$expr": {
                    "$and": [
                        { "$eq": ["$spaceId", "$$spaceId"] },
                    ]
                }
            };
            pipeline.push({ '$match': matchCondition }, {
                "$lookup": {
                    "from": "booking_cart",
                    "let": {
                        "spaceId": "$_id"
                    },
                    "pipeline": [
                        {
                            "$match": pipelineMatchCondition
                        },
                        { $project: { quantity: 1, _id: 1, startDate: 1, endDate: 1, deviceId: 1, userId: 1, pricing: 1, taxes: { '$literal': 150 }, offerPrice: { '$literal': 1500 } } }
                    ],
                    "as": "cartInfo"
                }
            }, {
                $group: {
                    _id: '$category._id',
                    data: {
                        $addToSet: {
                            category: '$category',
                            subCategory: '$subCategory',
                            space_Id: '$_id',
                            maxQuantity: '$units',
                            cartDetails: '$cartInfo'
                        }
                    }
                }
            });
            let response = await _entity_1.PropertySpaceV1.basicAggregate(pipeline);
            return response;
        }
        catch (error) {
            console.error(`we have an error in ${error}`);
        }
    }
    async saveOfflineCart(dataToInsert) {
        try {
            return await new this.model(dataToInsert).save();
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async fetchOfferPrice(payload, spaceDetail) {
        try {
            const { propertyId, fromDate, toDate } = payload;
            let pipeline = [];
            let matchCondition = {};
            matchCondition['propertyId'] = mongoose_1.Types.ObjectId(propertyId);
            matchCondition['status'] = _common_1.ENUM.PROPERTY.STATUS.ACTIVE;
            payload.spaceId ? matchCondition['_id'] = mongoose_1.Types.ObjectId(payload.spaceIds[0]) : "";
            let pipelineMatchCondition = {
                "$expr": {
                    "$and": [
                        { "$in": ["$$spaceId", "$spaceId"] },
                    ]
                }
            };
            if (fromDate && toDate) {
                pipelineMatchCondition['$expr']['$and'] =
                    [
                        { "$in": ["$$spaceId", "$spaceId"] },
                        { '$gte': [_common_1.DATABASE.DATE_CONSTANTS.fromDate(fromDate, payload === null || payload === void 0 ? void 0 : payload.offset), '$startDate'] },
                        { '$lte': [_common_1.DATABASE.DATE_CONSTANTS.fromDate(fromDate, payload === null || payload === void 0 ? void 0 : payload.offset), '$endDate'] }
                    ];
            }
            pipeline.push({ '$match': matchCondition }, {
                "$lookup": {
                    "from": "offers",
                    "let": {
                        "spaceId": "$_id"
                    },
                    "pipeline": [
                        {
                            "$match": pipelineMatchCondition
                        },
                        {
                            $project: {
                                priceRange: 1,
                                priceDetails: {
                                    $filter: {
                                        input: "$priceDetails",
                                        as: "elem",
                                        cond: { $ne: ["$$elem.discountPercentage", 0] }
                                    }
                                }
                            }
                        }
                    ],
                    "as": "offerPricing"
                }
            }, {
                $unwind: {
                    path: "$offerPricing"
                }
            }, { $project: { offerPricing: 1 } });
            let response = await _entity_1.PropertySpaceV1.basicAggregate(pipeline);
            return response;
        }
        catch (error) {
            console.error(`we have an error fetching offer price ===> ${error}`);
        }
    }
    async addToEmployeeCart(payload, headers, next, userDetail, propertyDetail, spacePrice) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        try {
            let deviceId = headers.devicedetails.deviceId;
            payload.deviceId = deviceId;
            let criteriaForDuplicateSpace = {
                "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId),
                "cartInfo.spaceId": { $in: payload.spaceIds }
            };
            let checkDuplicateItems = await exports.BookingCartV1.findOne(criteriaForDuplicateSpace);
            let { endDate, startDate } = _services_1.formattedTime({ fromDate: payload.fromDate, toDate: payload.toDate });
            endDate = moment_1.default(payload.toDate).add(payload.offset, "minute").toDate();
            startDate = moment_1.default(payload.fromDate).add(payload.offset, "minute").toDate();
            const calculatedPrice = await _entity_1.PayV1.calculateBookingDuration(endDate, startDate, payload);
            let cartInfo = [];
            let totalSpaceCapacity = 0;
            for (let i = 0; i < spacePrice.length; i++) {
                cartInfo.push({
                    spaceId: spacePrice[i]._id,
                    spaceLabel: spacePrice[i].spaceLabel,
                    position: spacePrice[i].position,
                    gridRow: spacePrice[i].gridRow,
                    gridColumn: spacePrice[i].gridColumn,
                    floorImage: spacePrice[i].floorImage
                });
                totalSpaceCapacity = totalSpaceCapacity + spacePrice[i].capacity;
            }
            let dataToInsert = {
                deviceId: deviceId,
                quantity: payload.quantity,
                cartInfo: cartInfo,
                totalSpaceCapacity: totalSpaceCapacity,
                fromDate: moment_1.default(payload.fromDate).toISOString(),
                toDate: moment_1.default(payload.toDate).toISOString(),
                shareUrl: propertyDetail.shareUrl,
                userData: {
                    userId: userDetail._id,
                    status: userDetail.status,
                    name: userDetail.name,
                    image: userDetail.image ? userDetail === null || userDetail === void 0 ? void 0 : userDetail.image : "",
                    phoneNo: userDetail.phoneNo,
                    countryCode: userDetail.countryCode,
                    createdAt: userDetail.createdAt,
                    email: userDetail.email,
                    profileStatus: userDetail.profileStatus,
                    bio: userDetail.bio,
                },
                propertyData: {
                    propertyId: propertyDetail._id ? propertyDetail._id : "",
                    status: propertyDetail.status ? propertyDetail.status : "",
                    name: propertyDetail.name ? propertyDetail.name : "",
                    images: propertyDetail.images ? propertyDetail.images : "",
                    address: propertyDetail.address ? propertyDetail.address : "",
                    autoAcceptUpcomingBooking: propertyDetail.autoAcceptUpcomingBooking,
                    hostName: propertyDetail.userData.name,
                    hostImage: propertyDetail.userData.image,
                    hostEmail: propertyDetail.userData.email
                },
                hostId: propertyDetail.userData.userId,
                bookingDuration: {
                    year: ((_a = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _a === void 0 ? void 0 : _a.year) ? (_b = calculatedPrice.bookingDuration) === null || _b === void 0 ? void 0 : _b.year : 0,
                    months: ((_c = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _c === void 0 ? void 0 : _c.months) ? (_d = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _d === void 0 ? void 0 : _d.months : 0,
                    days: ((_e = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _e === void 0 ? void 0 : _e.days) ? (_f = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _f === void 0 ? void 0 : _f.days : 0,
                    totalDays: ((_g = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _g === void 0 ? void 0 : _g.totalDays) ? (_h = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _h === void 0 ? void 0 : _h.totalDays : 0,
                    totalHours: ((_j = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _j === void 0 ? void 0 : _j.totalHours) ? (_k = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _k === void 0 ? void 0 : _k.totalHours : 0
                },
                isEmployee: payload.isEmployee,
                floorDescription: spacePrice[0].floorDescription,
                floorNumber: spacePrice[0].floorNumber,
                floorLabel: spacePrice[0].floorLabel,
                bookingType: payload.bookingType,
                partnerId: mongoose_1.Types.ObjectId(payload.partnerId),
                category: spacePrice[0].category,
                subCategory: spacePrice[0].subCategory,
                adminCommissionAmount: (_l = payload === null || payload === void 0 ? void 0 : payload.adminCommissionAmount) === null || _l === void 0 ? void 0 : _l.commissionAmount,
            };
            let bookingData;
            if (checkDuplicateItems) {
                bookingData = await exports.BookingCartV1.updateDocument(criteriaForDuplicateSpace, dataToInsert, { upsert: false, new: true });
            }
            else {
                bookingData = await new this.model(dataToInsert).save();
            }
            let response = await this.spaceCartResponse(spacePrice, payload, calculatedPrice, bookingData, totalSpaceCapacity);
            return response;
        }
        catch (error) {
            console.error(`we have an error while addToEmployeeCart ===> ${error}`);
            next(error);
        }
    }
    async addToEmployeeProlongedCart(payload, headers, next, userDetail, propertyDetail, spacePrice) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        try {
            let deviceId = headers.devicedetails.deviceId;
            payload.deviceId = deviceId;
            let criteriaForDuplicateSpace = {
                "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId),
                "cartInfo.spaceId": { $in: payload.spaceIds }
            };
            let checkDuplicateItems = await exports.BookingCartV1.findOne(criteriaForDuplicateSpace);
            let { endDate, startDate } = _services_1.formattedTime({ fromDate: payload.fromDate, toDate: payload.toDate });
            endDate = moment_1.default(payload.toDate).add(payload.offset, "minute").toDate();
            startDate = moment_1.default(payload.fromDate).add(payload.offset, "minute").toDate();
            const calculatedPrice = await _entity_1.PayV1.calculateBookingDuration(endDate, startDate, payload);
            let cartInfo = [];
            let totalSpaceCapacity = 0;
            console.log("here to e");
            for (let i = 0; i < spacePrice.length; i++) {
                cartInfo.push({
                    spaceId: spacePrice[i]._id
                });
                totalSpaceCapacity = totalSpaceCapacity + spacePrice[i].capacity;
            }
            let dataToInsert = {
                deviceId: deviceId,
                quantity: payload.quantity,
                cartInfo: cartInfo,
                totalSpaceCapacity: totalSpaceCapacity,
                fromDate: moment_1.default(payload.fromDate).toISOString(),
                toDate: moment_1.default(payload.toDate).toISOString(),
                shareUrl: propertyDetail.shareUrl,
                userData: {
                    userId: userDetail._id,
                    status: userDetail.status,
                    name: userDetail.name,
                    image: userDetail.image ? userDetail === null || userDetail === void 0 ? void 0 : userDetail.image : "",
                    phoneNo: userDetail.phoneNo,
                    countryCode: userDetail.countryCode,
                    createdAt: userDetail.createdAt,
                    email: userDetail.email,
                    profileStatus: userDetail.profileStatus
                },
                propertyData: {
                    propertyId: propertyDetail._id ? propertyDetail._id : "",
                    status: propertyDetail.status ? propertyDetail.status : "",
                    name: propertyDetail.name ? propertyDetail.name : "",
                    images: propertyDetail.images ? propertyDetail.images : "",
                    address: propertyDetail.address ? propertyDetail.address : "",
                    autoAcceptUpcomingBooking: propertyDetail.autoAcceptUpcomingBooking,
                    hostName: propertyDetail.userData.name,
                    hostImage: propertyDetail.userData.image,
                    hostEmail: propertyDetail.userData.email
                },
                hostId: propertyDetail.userData.userId,
                bookingDuration: {
                    year: ((_a = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _a === void 0 ? void 0 : _a.year) ? (_b = calculatedPrice.bookingDuration) === null || _b === void 0 ? void 0 : _b.year : 0,
                    months: ((_c = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _c === void 0 ? void 0 : _c.months) ? (_d = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _d === void 0 ? void 0 : _d.months : 0,
                    days: ((_e = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _e === void 0 ? void 0 : _e.days) ? (_f = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _f === void 0 ? void 0 : _f.days : 0,
                    totalDays: ((_g = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _g === void 0 ? void 0 : _g.totalDays) ? (_h = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _h === void 0 ? void 0 : _h.totalDays : 0,
                    totalHours: ((_j = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _j === void 0 ? void 0 : _j.totalHours) ? (_k = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _k === void 0 ? void 0 : _k.totalHours : 0
                },
                isEmployee: payload.isEmployee,
                floorDescription: spacePrice[0].floorDescription,
                floorNumber: spacePrice[0].floorNumber,
                floorLabel: spacePrice[0].floorLabel,
                bookingType: payload.bookingType,
                partnerId: payload.partnerId,
                category: spacePrice[0].category,
                subCategory: spacePrice[0].subCategory,
                adminCommissionAmount: payload === null || payload === void 0 ? void 0 : payload.adminCommissionAmount.commissionAmount,
            };
            let bookingData;
            if (checkDuplicateItems) {
                bookingData = await exports.BookingCartV1.updateDocument(criteriaForDuplicateSpace, dataToInsert, { upsert: false });
            }
            else {
                bookingData = await new this.model(dataToInsert).save();
            }
            let response = await this.prolongSpaceCartResponse(spacePrice, payload, calculatedPrice, bookingData, totalSpaceCapacity);
            return response;
        }
        catch (error) {
            console.error(`we have an error while addToEmployeeCart ===> ${error}`);
            next(error);
        }
    }
    async fetchPropertyAndUserDetail(payload, res) {
        var _a, _b, _c;
        try {
            const userDetail = await _entity_1.UserV1.findOne({ _id: mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.userId) }, {
                _id: 1,
                name: 1,
                status: 1,
                image: 1,
                createdAt: 1,
                phoneNo: 1,
                email: 1,
                countryCode: 1,
                dob: 1,
                profileStatus: 1,
                bio: 1
            });
            const propertyDetail = await _entity_1.PropertyV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.propertyId) }, {
                propertyId: 1,
                status: 1,
                name: 1,
                images: 1,
                userId: 1,
                address: 1,
                autoAcceptUpcomingBooking: 1,
                "userData.name": 1,
                "userData.image": 1,
                "userData.email": 1,
                "userData.userId": 1,
                "userData.dob": 1,
                "shareUrl": 1,
                "country.tax": 1,
                "state.tax": 1
            });
            let spaceIds = [];
            let offerPriceOfCategory = [];
            payload.spaceId.split(',').forEach((element) => {
                spaceIds.push(mongoose_1.Types.ObjectId(element));
            });
            const spacePrice = await _entity_1.PropertySpaceV1.findMany({ _id: { $in: spaceIds } }, { isEmployee: 1, category: 1, subCategory: 1, spaceLabel: 1, pricing: 1, capacity: 1, position: 1, gridRow: 1, gridColumn: 1, floorImage: 1, units: 1, isOfferPrice: 1, floorDescription: 1, floorNumber: 1, floorLabel: 1 });
            payload.spaceIds = spaceIds;
            console.log(spacePrice);
            if (((_a = spacePrice[0]) === null || _a === void 0 ? void 0 : _a.isOfferPrice) == 1) {
                offerPriceOfCategory = await exports.BookingCartV1.fetchOfferPrice(payload, spacePrice);
                console.log("offerPriceOfCategory", offerPriceOfCategory);
            }
            let commissionAmount;
            if (((_b = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.userData) === null || _b === void 0 ? void 0 : _b.userId) !== undefined) {
                commissionAmount = await host_v1_entity_1.HostV1.findOne({ _id: (_c = propertyDetail === null || propertyDetail === void 0 ? void 0 : propertyDetail.userData) === null || _c === void 0 ? void 0 : _c.userId }, { commissionAmount: 1 });
                payload["adminCommissionAmount"] = commissionAmount;
            }
            return {
                payload: payload,
                userDetail: payload.userId ? userDetail : {},
                propertyDetail: propertyDetail,
                spacePrice: spacePrice,
                offerPriceOfCategory: offerPriceOfCategory
            };
        }
        catch (error) {
            console.error(`we have an error while fetchPropertyAndUserDetail ===> ${error}`);
        }
    }
    async prolongSpaceCartResponse(spacePrice, payload, calculatedPrice, bookingData, totalSpaceCapacity) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        try {
            let cart = {
                quantity: bookingData === null || bookingData === void 0 ? void 0 : bookingData.quantity,
                _id: bookingData === null || bookingData === void 0 ? void 0 : bookingData._id,
                startDate: bookingData === null || bookingData === void 0 ? void 0 : bookingData.startDate,
                endDate: bookingData === null || bookingData === void 0 ? void 0 : bookingData.endDate,
                deviceId: bookingData === null || bookingData === void 0 ? void 0 : bookingData.deviceId,
                userId: bookingData === null || bookingData === void 0 ? void 0 : bookingData.userId,
                offerPrice: bookingData === null || bookingData === void 0 ? void 0 : bookingData.offerPrice,
                offerLabelType: bookingData === null || bookingData === void 0 ? void 0 : bookingData.offerLabelType,
                taxes: bookingData === null || bookingData === void 0 ? void 0 : bookingData.taxes,
                totalPayable: bookingData === null || bookingData === void 0 ? void 0 : bookingData.totalPayable,
                cartInfo: bookingData === null || bookingData === void 0 ? void 0 : bookingData.cartInfo,
                basePrice: bookingData === null || bookingData === void 0 ? void 0 : bookingData.basePrice,
                pricing: bookingData === null || bookingData === void 0 ? void 0 : bookingData.pricing
            };
            let response = [{
                    category: spacePrice[0].category,
                    subCategory: spacePrice[0].subCategory,
                    maxQuantity: spacePrice.length,
                    cartDetails: cart,
                    occupancy: totalSpaceCapacity,
                    offerPrice: bookingData.offerPrice,
                    taxPercentage: payload['tax'],
                    bookingDuration: {
                        year: (_a = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _a === void 0 ? void 0 : _a.year,
                        months: (_b = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _b === void 0 ? void 0 : _b.months,
                        days: (_c = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _c === void 0 ? void 0 : _c.days,
                        totalDays: (_d = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _d === void 0 ? void 0 : _d.totalDays,
                        totalHours: (_e = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _e === void 0 ? void 0 : _e.totalHours
                    },
                    isEmployee: (_f = spacePrice[0]) === null || _f === void 0 ? void 0 : _f.isEmployee,
                    spaceAvailability: payload.availableUnits,
                    floorDescription: (_g = spacePrice[0]) === null || _g === void 0 ? void 0 : _g.floorDescription,
                    floorNumber: (_h = spacePrice[0]) === null || _h === void 0 ? void 0 : _h.floorNumber,
                    floorLabel: (_j = spacePrice[0]) === null || _j === void 0 ? void 0 : _j.floorLabel,
                    partnerId: mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.partnerId)
                }];
            return response;
        }
        catch (error) {
            console.error(`we have an error in spaceCartResponse ==> ${error}`);
        }
    }
}
exports.BookingCartV1 = new UserCartEntity(booking_cart_model_1.default);
//# sourceMappingURL=user.cart.v1.entity.js.map