"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineUserV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const offline_user_model_1 = __importDefault(require("@models/offline.user.model"));
const _entity_1 = require("@entity");
const _services_1 = require("@services");
const _common_1 = require("@common");
const moment_1 = __importDefault(require("moment"));
const htmlHelper_1 = require("../../htmlHelper");
class OfflineUserEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async addOfflineUser(payload) {
        try {
            return await new this.model(payload).save();
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async updateOfflineUser(payload, offlineUserId) {
        try {
            let dataToUpdate = {
                name: (payload === null || payload === void 0 ? void 0 : payload.name) ? payload === null || payload === void 0 ? void 0 : payload.name : "",
                "email": (payload === null || payload === void 0 ? void 0 : payload.email) ? payload === null || payload === void 0 ? void 0 : payload.email : "",
                "fullMobileNumber": (payload === null || payload === void 0 ? void 0 : payload.fullMobileNumber) ? payload === null || payload === void 0 ? void 0 : payload.fullMobileNumber : "",
                "companyName": (payload === null || payload === void 0 ? void 0 : payload.companyName) ? payload === null || payload === void 0 ? void 0 : payload.companyName : "",
                "companyEmail": (payload === null || payload === void 0 ? void 0 : payload.companyEmail) ? payload === null || payload === void 0 ? void 0 : payload.companyEmail : "",
                "companyOfficeNumber": (payload === null || payload === void 0 ? void 0 : payload.companyOfficeNumber) ? payload === null || payload === void 0 ? void 0 : payload.companyOfficeNumber : "",
                "houseNumber": (payload === null || payload === void 0 ? void 0 : payload.houseNumber) ? payload === null || payload === void 0 ? void 0 : payload.houseNumber : "",
                "street": (payload === null || payload === void 0 ? void 0 : payload.street) ? payload === null || payload === void 0 ? void 0 : payload.street : "",
                "landmark": (payload === null || payload === void 0 ? void 0 : payload.landmark) ? payload === null || payload === void 0 ? void 0 : payload.landmark : "",
                "country": (payload === null || payload === void 0 ? void 0 : payload.country) ? payload === null || payload === void 0 ? void 0 : payload.country : "",
                "zipCode": (payload === null || payload === void 0 ? void 0 : payload.zipCode) ? payload === null || payload === void 0 ? void 0 : payload.zipCode : "",
                "state": (payload === null || payload === void 0 ? void 0 : payload.state) ? payload === null || payload === void 0 ? void 0 : payload.state : "",
                "city": (payload === null || payload === void 0 ? void 0 : payload.city) ? payload === null || payload === void 0 ? void 0 : payload.city : "",
                "registrationNumber": (payload === null || payload === void 0 ? void 0 : payload.registrationNumber) ? payload === null || payload === void 0 ? void 0 : payload.registrationNumber : ""
            };
            return await this.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.userId) }, dataToUpdate, { new: true });
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async addSpaceToCart(payload, headers, next, userDetail, propertyDetail, spacePrice) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        try {
            let calculatedPrice;
            let deviceId = headers.devicedetails.deviceId;
            payload.deviceId = deviceId;
            let criteriaForDuplicateSpace = {
                "propertyData.propertyId": mongoose_1.Types.ObjectId(payload.propertyId),
                'cartInfo.spaceId': { $in: payload.spaceIds }
            };
            let checkDuplicateItems = await _entity_1.BookingCartV1.findOne(criteriaForDuplicateSpace);
            const { endDate, startDate } = _services_1.formattedTime({ fromDate: payload.fromDate, toDate: payload.toDate });
            switch (payload === null || payload === void 0 ? void 0 : payload.bookingType) {
                case _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM:
                    calculatedPrice = await _services_1.calculateCartPrice(0, endDate, startDate, payload.quantity, spacePrice.pricing, spacePrice.pricing.offerPricingArray);
                    break;
                case _common_1.ENUM.USER.BOOKING_TYPE.HOURLY:
                    calculatedPrice = await _entity_1.BookingCartV1.calculateHourlyCartPrice(payload, endDate, startDate, spacePrice, []);
                    break;
                case _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY:
                    calculatedPrice = await _entity_1.BookingCartV1.calculateMonthlyCartPrice(payload, endDate, startDate, spacePrice, []);
                    break;
            }
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
                deviceId: deviceId ? deviceId : "",
                quantity: payload.quantity,
                spaceId: payload.spaceId,
                totalSpaceCapacity: totalSpaceCapacity,
                fromDate: moment_1.default(payload.fromDate).toISOString(),
                toDate: moment_1.default(payload.toDate).toISOString(),
                cartInfo: cartInfo,
                totalPayable: payload.price,
                adminCommissionAmount: payload.commissionAmount,
                userData: {
                    userId: userDetail._id,
                    status: userDetail.status ? userDetail.status : "",
                    name: userDetail.name,
                    image: userDetail.image ? userDetail === null || userDetail === void 0 ? void 0 : userDetail.image : "",
                    phoneNo: userDetail.fullMobileNumber ? userDetail.fullMobileNumber : "",
                    countryCode: userDetail.countryCode ? userDetail.countryCode : "",
                    createdAt: userDetail.createdAt,
                    email: userDetail.email ? userDetail.email : ""
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
                hostId: propertyDetail.userId,
                bookingDuration: {
                    year: ((_a = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _a === void 0 ? void 0 : _a.year) ? (_b = calculatedPrice.bookingDuration) === null || _b === void 0 ? void 0 : _b.year : 0,
                    months: ((_c = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _c === void 0 ? void 0 : _c.months) ? (_d = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _d === void 0 ? void 0 : _d.months : 0,
                    days: ((_e = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _e === void 0 ? void 0 : _e.days) ? (_f = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _f === void 0 ? void 0 : _f.days : 0,
                    totalDays: ((_g = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _g === void 0 ? void 0 : _g.totalDays) ? (_h = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _h === void 0 ? void 0 : _h.totalDays : 0,
                    totalHours: ((_j = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _j === void 0 ? void 0 : _j.totalHours) ? (_k = calculatedPrice === null || calculatedPrice === void 0 ? void 0 : calculatedPrice.bookingDuration) === null || _k === void 0 ? void 0 : _k.totalHours : 0
                },
                floorDescription: spacePrice[0].floorDescription,
                floorNumber: spacePrice[0].floorNumber,
                floorLabel: spacePrice[0].floorLabel,
                bookingType: payload === null || payload === void 0 ? void 0 : payload.bookingType,
                category: spacePrice[0].category,
                subCategory: spacePrice[0].subCategory
            };
            let bookingData;
            if (checkDuplicateItems) {
                bookingData = await _entity_1.BookingCartV1.updateDocument(criteriaForDuplicateSpace, dataToInsert, { upsert: false, new: true });
            }
            else {
                bookingData = await _entity_1.BookingCartV1.saveOfflineCart(dataToInsert);
            }
            let response = await _entity_1.BookingCartV1.spaceCartResponse(spacePrice, payload, calculatedPrice, bookingData, totalSpaceCapacity);
            return response;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async userBookSpace(cartData, headers, offset) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        try {
            let deviceId = headers.devicedetails.deviceId;
            let dataToInsert = {
                bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED,
                cartId: cartData._id,
                deviceId: deviceId,
                quantity: cartData.quantity,
                cartInfo: cartData.cartInfo,
                fromDate: cartData.fromDate,
                toDate: cartData.toDate,
                occupancy: cartData.occupancy * cartData.quantity,
                bookingId: _services_1.generateUniqueId('DSK'),
                userData: {
                    userId: cartData.userData.userId,
                    status: cartData.userData.status,
                    name: cartData.userData.name,
                    image: cartData.userData.image,
                    phoneNo: cartData.userData.phoneNo,
                    countryCode: cartData.userData.countryCode,
                    createdAt: cartData.userData.createdAt,
                    email: cartData.userData.email
                },
                propertyData: {
                    propertyId: cartData.propertyData.propertyId,
                    status: cartData.propertyData.status,
                    name: cartData.propertyData.name,
                    images: cartData.propertyData.images,
                    address: cartData.propertyData.address,
                    hostName: cartData.propertyData.hostName,
                    autoAcceptUpcomingBooking: cartData.propertyData.autoAcceptUpcomingBooking,
                    hostImage: cartData.propertyData.hostImage,
                    hostEmail: cartData.propertyData.hostEmail
                },
                bookingMode: _common_1.ENUM.BOOKING_TYPE.TYPE.OFFLINE,
                hostId: cartData.hostId,
                totalPayable: cartData.totalPayable,
                pricing: cartData.pricing,
                totalSpaceCapacity: cartData.totalSpaceCapacity,
                basePrice: cartData.basePrice,
                bookingDuration: {
                    year: ((_a = cartData === null || cartData === void 0 ? void 0 : cartData.bookingDuration) === null || _a === void 0 ? void 0 : _a.year) ? (_b = cartData.bookingDuration) === null || _b === void 0 ? void 0 : _b.year : 0,
                    months: ((_c = cartData === null || cartData === void 0 ? void 0 : cartData.bookingDuration) === null || _c === void 0 ? void 0 : _c.months) ? (_d = cartData === null || cartData === void 0 ? void 0 : cartData.bookingDuration) === null || _d === void 0 ? void 0 : _d.months : 0,
                    days: ((_e = cartData === null || cartData === void 0 ? void 0 : cartData.bookingDuration) === null || _e === void 0 ? void 0 : _e.days) ? (_f = cartData === null || cartData === void 0 ? void 0 : cartData.bookingDuration) === null || _f === void 0 ? void 0 : _f.days : 0,
                    totalDays: ((_g = cartData === null || cartData === void 0 ? void 0 : cartData.bookingDuration) === null || _g === void 0 ? void 0 : _g.totalDays) ? (_h = cartData === null || cartData === void 0 ? void 0 : cartData.bookingDuration) === null || _h === void 0 ? void 0 : _h.totalDays : 0,
                    totalHours: ((_j = cartData === null || cartData === void 0 ? void 0 : cartData.bookingDuration) === null || _j === void 0 ? void 0 : _j.totalHours) ? (_k = cartData === null || cartData === void 0 ? void 0 : cartData.bookingDuration) === null || _k === void 0 ? void 0 : _k.totalHours : 0
                },
                category: cartData.category,
                subCategory: cartData.subCategory,
                floorDescription: cartData.floorDescription,
                floorNumber: cartData.floorNumber,
                partnerId: cartData.partnerId,
                isEmployee: cartData.isEmployee,
                floorLabel: cartData.floorLabel,
                bookingType: cartData.bookingType
            };
            let response = await _entity_1.BookingV1.createOne(dataToInsert);
            response.taxes = 0;
            let bookingHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/offline_booking/offline_booking_emailer.html", {
                logo: _common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                mockpur: _common_1.CONSTANT.MOCKUPER_6,
                appStore: _common_1.CONSTANT.APP_STORE_BADGE,
                googlePlay: _common_1.CONSTANT.GOOGLE_PLAY_BADGE,
                igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                curratedLogo: _common_1.CONSTANT.COMPLEMENTRAY_2,
                complementaryLogo: _common_1.CONSTANT.PEXELS_DARIA,
                printingLogo: _common_1.CONSTANT.PEXELS_COTTONBRO,
                healthierLogo: _common_1.CONSTANT.PEXELS_PEW,
                userName: response.userData.name,
                propertyName: `${response.propertyData.name}`,
                propertyAddress: `${response.propertyData.address}`,
                propertyImage: `${(_l = response.propertyData) === null || _l === void 0 ? void 0 : _l.images[0]}`,
                hostEmail: `${(_m = response === null || response === void 0 ? void 0 : response.propertyData) === null || _m === void 0 ? void 0 : _m.hostEmail}`,
                hostName: `${(_o = response === null || response === void 0 ? void 0 : response.propertyData) === null || _o === void 0 ? void 0 : _o.hostName}`,
                addressPin: _common_1.CONSTANT.ADDRESS_PIN,
                fromDate: moment_1.default(response.fromDate).format('MMM DD,YYYY'),
                toDate: moment_1.default(response.toDate).format('MMM DD,YYYY'),
                bookingId: response.bookingId,
                subCategoryName: response.subCategory.name,
                quantity: response.quantity,
                totalPayable: _services_1.formatPrice(response.totalPayable),
                paymentPlan: (response === null || response === void 0 ? void 0 : response.paymentPlan) != _common_1.ENUM.PAYMENT.PLAN.COMPLETE ? 'Monthly' : 'Complete',
                bookingStatus: 'Successfully',
                taxes: _services_1.formatPrice(response === null || response === void 0 ? void 0 : response.taxes),
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD,
                contactUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/chat?userId=${response.hostId}` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/chat?userId=${response.hostId}`,
                cancelBookingUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/profile/booking/detail/${response._id}` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/profile/booking/detail/${response._id}`,
                tAndCUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/content/term-condition` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/content/term-condition`,
                appStoreLink: _common_1.STORE_URL.APPSTORE_USER,
                playStoreLink: _common_1.STORE_URL.PLAYSOTE_USER
            });
            await Promise.all([
                _entity_1.BookingCartV1.remove({ _id: cartData._id }),
                _entity_1.BookingV1.updateCalendarSchedule(dataToInsert, response === null || response === void 0 ? void 0 : response._id),
                _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.BOOKING_EMAIL(`${response.userData.email}`, bookingHtml))
            ]);
            return response;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async userUpdateOfflineBooking(bookingData, payload) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        try {
            let dataToUpdate = {
                bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED,
                quantity: bookingData.quantity,
                spaceId: bookingData.spaceId,
                fromDate: bookingData.fromDate,
                toDate: bookingData.toDate,
                occupancy: payload.occupancy ? payload.occupancy * bookingData.quantity : payload.occupancy,
                userData: {
                    userId: bookingData.userData.userId,
                    status: bookingData.userData.status,
                    name: bookingData.userData.name,
                    image: bookingData.userData.image,
                    phoneNo: bookingData.userData.phoneNo,
                    countryCode: bookingData.userData.countryCode,
                    createdAt: bookingData.userData.createdAt,
                    email: bookingData.userData.email
                },
                propertyData: {
                    propertyId: bookingData.propertyData.propertyId,
                    status: bookingData.propertyData.status,
                    name: bookingData.propertyData.name,
                    images: bookingData.propertyData.images,
                    address: bookingData.propertyData.address,
                    hostName: bookingData.propertyData.hostName,
                    autoAcceptUpcomingBooking: bookingData.propertyData.autoAcceptUpcomingBooking,
                    hostImage: bookingData.propertyData.hostImage,
                    hostEmail: bookingData.propertyData.hostEmail
                },
                bookingMode: 1,
                hostId: bookingData.hostId,
                totalPayable: bookingData.totalPayable,
                totalSpaceCapacity: bookingData.totalSpaceCapacity,
                bookingDuration: {
                    year: ((_a = bookingData === null || bookingData === void 0 ? void 0 : bookingData.bookingDuration) === null || _a === void 0 ? void 0 : _a.year) ? (_b = bookingData.bookingDuration) === null || _b === void 0 ? void 0 : _b.year : 0,
                    months: ((_c = bookingData === null || bookingData === void 0 ? void 0 : bookingData.bookingDuration) === null || _c === void 0 ? void 0 : _c.months) ? (_d = bookingData === null || bookingData === void 0 ? void 0 : bookingData.bookingDuration) === null || _d === void 0 ? void 0 : _d.months : 0,
                    days: ((_e = bookingData === null || bookingData === void 0 ? void 0 : bookingData.bookingDuration) === null || _e === void 0 ? void 0 : _e.days) ? (_f = bookingData === null || bookingData === void 0 ? void 0 : bookingData.bookingDuration) === null || _f === void 0 ? void 0 : _f.days : 0,
                    totalDays: ((_g = bookingData === null || bookingData === void 0 ? void 0 : bookingData.bookingDuration) === null || _g === void 0 ? void 0 : _g.totalDays) ? (_h = bookingData === null || bookingData === void 0 ? void 0 : bookingData.bookingDuration) === null || _h === void 0 ? void 0 : _h.totalDays : 0,
                    totalHours: ((_j = bookingData === null || bookingData === void 0 ? void 0 : bookingData.bookingDuration) === null || _j === void 0 ? void 0 : _j.totalHours) ? (_k = bookingData === null || bookingData === void 0 ? void 0 : bookingData.bookingDuration) === null || _k === void 0 ? void 0 : _k.totalHours : 0
                },
                category: bookingData.category,
                subCategory: bookingData.subCategory,
                floorDescription: bookingData.floorDescription,
                floorNumber: bookingData.floorNumber,
                partnerId: bookingData === null || bookingData === void 0 ? void 0 : bookingData.partnerId,
                isEmployee: bookingData.isEmployee,
                floorLabel: bookingData.floorLabel,
                bookingType: bookingData.bookingType
            };
            let response = await _entity_1.BookingV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.bookingId) }, dataToUpdate);
            Promise.all([
                _entity_1.BookingCartV1.remove({ _id: bookingData._id }),
                _entity_1.BookingV1.updateCalendarSchedule(dataToUpdate, response === null || response === void 0 ? void 0 : response._id, true)
            ]);
            return response;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }
}
exports.OfflineUserV1 = new OfflineUserEntity(offline_user_model_1.default);
//# sourceMappingURL=offlineBooking.v1.entity.js.map