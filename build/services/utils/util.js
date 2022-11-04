"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNumberString = exports.toObjectId = exports.formattedTime = exports.calculateBestOfferPrice = exports.calculateCartPrice = exports.calcPaymentPlan = exports.calculateDiffInSeconds = exports.calculateMonths = exports.arrayToObject = exports.fiveYearsFromNow = exports.generateTransactionUniqueId = exports.formatPrice = exports.generateGiftCardNumber = exports.generatePin = exports.generateUniqueId = exports.authorizationHeaderObj = exports.isBetween = exports.isNullUndefined = exports.roundOffNumbers = exports.logger = exports.createOutlookEventService = exports.getAuthenticatedClient = exports.insertCityInBatches = exports.getBucket = void 0;
const _common_1 = require("@common");
const celebrate_1 = require("celebrate");
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = require("mongoose");
var currencyFormatter = require('currency-formatter');
var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');
async function getBucket(id) {
    console.log(id, "user id in bucket");
    let bucket = id.replace(/\D/g, "");
    return bucket.substr(0, 3);
}
exports.getBucket = getBucket;
async function insertCityInBatches() {
    return;
}
exports.insertCityInBatches = insertCityInBatches;
async function getAuthenticatedClient(accessToken) {
    try {
        const client = graph.Client.init({
            authProvider: (done) => {
                done(null, accessToken);
            }
        });
        return client;
    }
    catch (error) {
        console.error(`we have an error in getAuthenticatedClient service ==> ${error}`);
        return;
    }
}
exports.getAuthenticatedClient = getAuthenticatedClient;
async function createOutlookEventService(accessToken, formData, timeZone) {
    try {
        const client = await getAuthenticatedClient(accessToken);
        const newEvent = {
            subject: formData.subject,
            start: {
                dateTime: moment_1.default(formData.start).toDate(),
                timeZone: timeZone
            },
            end: {
                dateTime: moment_1.default(formData.end).toDate(),
                timeZone: timeZone
            },
            body: {
                contentType: 'text',
                content: formData.body
            }
        };
        const responseFromPostEvent = await client.api('/me/events').post(newEvent);
        return responseFromPostEvent;
    }
    catch (error) {
        console.error(`we have an error createOutlookEventService ==> ${error}`);
    }
}
exports.createOutlookEventService = createOutlookEventService;
async function logger(...data) {
    try {
        if (_common_1.CONFIG.NODE_ENV !== 'prod') {
            data.map((elem) => { console.log(elem); });
        }
        else {
            return;
        }
    }
    catch (error) {
        console.error(`we have an error ==> ${error}`);
    }
}
exports.logger = logger;
async function roundOffNumbers(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}
exports.roundOffNumbers = roundOffNumbers;
function isNullUndefined(item) {
    try {
        let x = item === null || item === undefined || item === "" || Object.keys(item).length === 0;
        return x;
    }
    catch (err) {
        return true;
    }
}
exports.isNullUndefined = isNullUndefined;
function isBetween(x, min, max) {
    return x >= min && x <= max;
}
exports.isBetween = isBetween;
exports.authorizationHeaderObj = celebrate_1.Joi.object({
    devicedetails: celebrate_1.Joi.object().keys({
        type: celebrate_1.Joi.number().valid([0, 1, 2]).required(),
        token: celebrate_1.Joi.string().required().allow(''),
        deviceId: celebrate_1.Joi.string().required().allow('')
    }).required(),
    offset: celebrate_1.Joi.string().required().description("offset is required"),
}).unknown();
exports.generateUniqueId = (key) => {
    function random(min, max) {
        const uniqueNum = Math.floor(Math.random() * (max - min + 1)) + min;
        let uniqueString = uniqueNum.toString();
        return uniqueString.substring(0, uniqueString.length - 5);
    }
    let timeStamp = Date.now();
    return (`${key}${random(timeStamp, 45)}`);
};
exports.generatePin = (giftCard) => {
    function random(min, max) {
        const uniqueNum = Math.floor(Math.random() * (max - min + 1)) + min;
        let uniqueString = uniqueNum.toString();
        return uniqueString.substring(0, uniqueString.length - 4);
    }
    let timeStamp = Date.now();
    return (`${random(timeStamp, 45)}`);
};
exports.generateGiftCardNumber = () => {
    let uniqueString = (Math.floor(Math.random() * 900000000000) + 100000000000).toString().match(/.{1,4}/g);
    let giftCardNumber = uniqueString.join('');
    return giftCardNumber;
};
exports.formatPrice = (value) => {
    let price = currencyFormatter.format(value, { locale: 'de-DE' });
    return price;
};
exports.generateTransactionUniqueId = (key) => {
    let transactionId = `${key}${(Date.now())}`;
    return transactionId;
};
exports.fiveYearsFromNow = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const finalDate = new Date(year + 5, month, day);
    return finalDate;
};
exports.arrayToObject = (array, keyField) => array.reduce((obj, item) => {
    obj[item[keyField]] = item;
    return obj;
}, {});
exports.calculateMonths = (fromDate, toDate) => {
    let months = (moment_1.default(new Date(toDate)).endOf('day').add(300, "minute")).diff((moment_1.default(new Date(fromDate)).startOf('day').add(330, "minute")), 'months', false);
    return months <= 0 ? 0 : months;
};
exports.calculateDiffInSeconds = (fromDate, currentDate, toDate) => {
    if (currentDate === true) {
        currentDate = moment_1.default();
        const diff = moment_1.default(fromDate).diff(currentDate, 'seconds');
        return diff;
    }
    else {
        const diff = moment_1.default(toDate).diff(moment_1.default(fromDate), 'seconds');
        return diff;
    }
};
async function calcPaymentPlan(endDate, startDate, quantity, priceObj) {
    try {
        const diffTime = Math.abs(endDate - startDate);
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const monthsNumber = exports.calculateMonths(startDate, endDate);
        let monthTemp = days / _common_1.CONSTANT.CALENDER_STATICS.MONTH;
        let totalMonths = monthTemp % _common_1.CONSTANT.CALENDER_STATICS.MONTH > 1 ? monthTemp % _common_1.CONSTANT.CALENDER_STATICS.MONTH : 0;
        let totalYear = monthTemp / _common_1.CONSTANT.CALENDER_STATICS.TOTAL_MONTHS > 1 ? monthTemp / _common_1.CONSTANT.CALENDER_STATICS.TOTAL_MONTHS : 0;
        let pricing = {
            daily: days * (priceObj === null || priceObj === void 0 ? void 0 : priceObj.daily) * quantity,
            monthly: totalMonths * (priceObj === null || priceObj === void 0 ? void 0 : priceObj.monthly) * quantity,
            yearly: totalYear * (priceObj === null || priceObj === void 0 ? void 0 : priceObj.yearly) * quantity,
        };
        let calculatedPrice = {};
        let calculateTotalPayable = await calculateCartPrice(0, endDate, startDate, quantity, priceObj, [], true);
        calculatedPrice['totalPayable'] = calculateTotalPayable.totalPayable;
        calculatedPrice['dailyPricing'] = pricing.daily > 1 ? pricing.daily + _common_1.CONSTANT.TAXES.BASIC * pricing.daily / _common_1.CONSTANT.TAXES.DIVISOR : 0;
        calculatedPrice['monthlyPricing'] = pricing.monthly > 1 ? Math.round(((pricing.monthly + (calculateTotalPayable.dailyPricing + _common_1.CONSTANT.TAXES.BASIC * (pricing.monthly + calculateTotalPayable.dailyPricing) / _common_1.CONSTANT.TAXES.DIVISOR)) / Math.trunc(totalMonths) + Number.EPSILON) * 100) / 100 : 0;
        calculatedPrice['yearlyPricing'] = pricing.yearly > 1 ? pricing.yearly + _common_1.CONSTANT.TAXES.BASIC * pricing.yearly / _common_1.CONSTANT.TAXES.DIVISOR : 0;
        if (monthsNumber >= 3 && monthsNumber <= 12) {
            calculatedPrice['monthlyPricing'] = pricing.monthly > 1 ? Math.round(((pricing.monthly + (calculateTotalPayable.dailyPricing + _common_1.CONSTANT.TAXES.BASIC * (pricing.monthly + calculateTotalPayable.dailyPricing) / _common_1.CONSTANT.TAXES.DIVISOR)) / Math.trunc(totalMonths) + Number.EPSILON) * 100) / 100 : 0;
        }
        return calculatedPrice;
    }
    catch (error) {
        console.error(`we have an error in calcPaymentPlan ==> ${error}`);
        throw error;
    }
}
exports.calcPaymentPlan = calcPaymentPlan;
async function calculateCartPrice(tax, endDate, startDate, quantity, priceObj, offerPricingArray, spacePrice, paymentPlan) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        if (offerPricingArray && (offerPricingArray === null || offerPricingArray === void 0 ? void 0 : offerPricingArray.length) > 0) {
            let monthlyPrice = 0;
            let dailyPrice = 0;
            for (let i = 0; i < spacePrice.length; i++) {
                monthlyPrice = monthlyPrice + ((_b = (_a = spacePrice[i]) === null || _a === void 0 ? void 0 : _a.pricing) === null || _b === void 0 ? void 0 : _b.monthly);
                dailyPrice = dailyPrice + ((_d = (_c = spacePrice[i]) === null || _c === void 0 ? void 0 : _c.pricing) === null || _d === void 0 ? void 0 : _d.daily);
            }
            const diffTime = Math.abs(endDate - startDate);
            const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            let monthTemp = days / _common_1.CONSTANT.CALENDER_STATICS.MONTH;
            let totalDays = Math.trunc(days % _common_1.CONSTANT.CALENDER_STATICS.MONTH);
            let totalMonths = Math.trunc(monthTemp % _common_1.CONSTANT.CALENDER_STATICS.MONTH);
            let totalYear = Math.trunc(monthTemp / _common_1.CONSTANT.CALENDER_STATICS.TOTAL_MONTHS);
            let pricing = {
                days: totalDays * dailyPrice,
                totalMonthly: totalMonths * monthlyPrice
            };
            let calculatedPrice = {
                totalPrice: pricing.days + pricing.totalMonthly,
                basePrice: pricing.days,
                dailyPricing: pricing.days,
                monthlyPricing: pricing.totalMonthly,
                bookingDuration: {
                    days: totalDays,
                    months: totalMonths,
                    year: totalYear,
                    totalDays: days
                }
            };
            await calculateBestOfferPrice(calculatedPrice, offerPricingArray, quantity);
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
                let taxes = tax ? tax * (calculatedPrice.totalPrice) / _common_1.CONSTANT.TAXES.DIVISOR : _common_1.CONSTANT.TAXES.BASIC * calculatedPrice.totalPrice / _common_1.CONSTANT.TAXES.DIVISOR;
                calculatedPrice['dailyPricing'] = pricing.days > 1 ? pricing.days + _common_1.CONSTANT.TAXES.BASIC * pricing.days / _common_1.CONSTANT.TAXES.DIVISOR : 0;
                calculatedPrice['totalPayable'] = pricing.days + pricing.totalMonthly + taxes;
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
            let taxes = tax ? tax * (calculatedPrice.totalPrice - calculatedPrice.offerPrice) / _common_1.CONSTANT.TAXES.DIVISOR : _common_1.CONSTANT.TAXES.BASIC * calculatedPrice.totalPrice / _common_1.CONSTANT.TAXES.DIVISOR;
            calculatedPrice['dailyPricing'] = pricing.days > 1 ? pricing.days + _common_1.CONSTANT.TAXES.BASIC * pricing.days / _common_1.CONSTANT.TAXES.DIVISOR : 0;
            calculatedPrice['totalPayable'] = pricing.days + pricing.totalMonthly + taxes;
            calculatedPrice['taxes'] = taxes;
            if (calculatedPrice.bookingDuration.months >= 2) {
                calculatedPrice['monthlyPricing'] = await roundOffNumbers(calculatedPrice.totalPayable / totalMonths);
            }
            else {
                calculatedPrice['monthlyPricing'] = 0;
            }
            return calculatedPrice;
        }
        else {
            let monthlyPrice = 0;
            let dailyPrice = 0;
            for (let i = 0; i < spacePrice.length; i++) {
                monthlyPrice = monthlyPrice + ((_f = (_e = spacePrice[i]) === null || _e === void 0 ? void 0 : _e.pricing) === null || _f === void 0 ? void 0 : _f.monthly);
                dailyPrice = dailyPrice + ((_h = (_g = spacePrice[i]) === null || _g === void 0 ? void 0 : _g.pricing) === null || _h === void 0 ? void 0 : _h.daily);
            }
            const diffTime = Math.abs(endDate - startDate);
            const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            let monthTemp = days / _common_1.CONSTANT.CALENDER_STATICS.MONTH;
            let totalDays = Math.trunc(days % _common_1.CONSTANT.CALENDER_STATICS.MONTH);
            let totalMonths = Math.trunc(monthTemp % _common_1.CONSTANT.CALENDER_STATICS.MONTH);
            let pricing = {
                days: totalDays * dailyPrice,
                totalMonthly: totalMonths * monthlyPrice
            };
            let calculatedPrice = {
                totalPrice: pricing.days + pricing.totalMonthly,
                basePrice: pricing.days,
                dailyPricing: pricing.days,
                monthlyPricing: pricing.totalMonthly,
                bookingDuration: {
                    days: totalDays,
                    months: totalMonths,
                    totalDays: days
                }
            };
            let taxes = tax ? tax * calculatedPrice.totalPrice / _common_1.CONSTANT.TAXES.DIVISOR : _common_1.CONSTANT.TAXES.BASIC * calculatedPrice.totalPrice / _common_1.CONSTANT.TAXES.DIVISOR;
            calculatedPrice['dailyPricing'] = pricing.days > 1 ? pricing.days + _common_1.CONSTANT.TAXES.BASIC * pricing.days / _common_1.CONSTANT.TAXES.DIVISOR : 0;
            calculatedPrice['totalPayable'] = pricing.days + pricing.totalMonthly + taxes;
            calculatedPrice['taxes'] = taxes;
            if (calculatedPrice.bookingDuration.months >= 2) {
                calculatedPrice['monthlyPricing'] = await roundOffNumbers(calculatedPrice.totalPayable / totalMonths);
            }
            else {
                calculatedPrice['monthlyPricing'] = 0;
            }
            return calculatedPrice;
        }
    }
    catch (error) {
        console.error(`we have an error in utils ==> ${error}`);
        throw error;
    }
}
exports.calculateCartPrice = calculateCartPrice;
async function calculateBestOfferPrice(calculatedPrice, offerPricingArray, quantity) {
    var _a;
    try {
        calculatedPrice['offerMap'] = {};
        for (let i = offerPricingArray.length - 1; i >= 0; --i) {
            const offerPricingObj = offerPricingArray[i];
            calculatedPrice['offerPricingObj'] = offerPricingObj;
            for (let i = offerPricingObj.offerPricing.priceDetails.length - 1; i >= 0; --i) {
                const offerLabelTypes = offerPricingObj.offerPricing.priceDetails[i];
                calculatedPrice['priceRange'] = offerPricingObj.offerPricing.priceRange;
                switch (offerLabelTypes.discountLabelType) {
                    case _common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.BOOKING_DURATION: {
                        if (offerLabelTypes.days <= calculatedPrice.bookingDuration.days || offerLabelTypes.months <= calculatedPrice.bookingDuration.months) {
                            let currentOfferPrice = await roundOffNumbers((offerLabelTypes.discountPercentage / 100) * calculatedPrice.totalPrice);
                            calculatedPrice.offerMap[_common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.BOOKING_DURATION] = currentOfferPrice;
                        }
                        break;
                    }
                    case _common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.ADVANCE_BOOKING_DURATION: {
                        if ((offerLabelTypes === null || offerLabelTypes === void 0 ? void 0 : offerLabelTypes.months) === ((_a = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _a === void 0 ? void 0 : _a.months)) {
                            let currentOfferPrice = await roundOffNumbers((offerLabelTypes.discountPercentage / 100) * calculatedPrice.totalPrice);
                            calculatedPrice.offerMap[_common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.ADVANCE_BOOKING_DURATION] = currentOfferPrice;
                        }
                        break;
                    }
                    case _common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.UNITS: {
                        if (quantity >= offerLabelTypes.minUnits) {
                            let currentOfferPrice = await roundOffNumbers((offerLabelTypes.discountPercentage / 100) * calculatedPrice.totalPrice);
                            calculatedPrice.offerMap[_common_1.ENUM.PROPERTY.OFFER.DISCOUNT_LABEL_TYPE.UNITS] = currentOfferPrice;
                        }
                        break;
                    }
                }
            }
        }
    }
    catch (error) {
        console.error(`we have an error in calculateBestOfferPrice ==> ${error}`);
        throw error;
    }
}
exports.calculateBestOfferPrice = calculateBestOfferPrice;
exports.formattedTime = (bookingDetail) => {
    return {
        startDate: bookingDetail.fromDate,
        endDate: bookingDetail.toDate
    };
};
exports.toObjectId = (idArr) => {
    try {
        return idArr.map((i) => {
            return mongoose_1.Types.ObjectId(i);
        });
    }
    catch (error) {
        Promise.reject(error);
    }
};
exports.toNumberString = async (idArr) => {
    try {
        return idArr.map((i) => {
            return parseInt(i);
        });
    }
    catch (error) {
        console.error(`we have an error,${error}`);
    }
};
//# sourceMappingURL=util.js.map