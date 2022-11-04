"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayV1 = void 0;
const mongoose_1 = require("mongoose");
const _services_1 = require("@services");
const base_entity_1 = __importDefault(require("../base.entity"));
const payment_model_1 = __importDefault(require("@models/payment.model"));
const user_model_1 = __importDefault(require("@models/user.model"));
const host_model_1 = __importDefault(require("@models/host.model"));
const payment_logs_model_1 = __importDefault(require("@models/payment_logs.model"));
const user_v1_entity_1 = require("./user.v1.entity");
const booking_v1_entity_1 = require("./booking.v1.entity");
const _common_1 = require("@common");
const moment = require("moment");
const _entity_1 = require("@entity");
const htmlHelper_1 = require("../../htmlHelper");
const _controllers_1 = require("@controllers");
class PaymentEntity extends base_entity_1.default {
    async updateEmployeeBookingPayDetails(objectToSave) {
        try {
            return await new this.model(objectToSave).save();
        }
        catch (error) {
            console.error(`we have an error while updateEmployeePayDetails ==> ${error}`);
        }
    }
    async updateRecurringPlan(booking) {
        try {
            await _entity_1.RecurringPayV1.removeAll({ bookingId: mongoose_1.Types.ObjectId(booking._id) });
            let month = booking.fromDate.getMonth();
            let recurringData = [];
            for (let m = moment(booking === null || booking === void 0 ? void 0 : booking.fromDate); m.isBefore(booking === null || booking === void 0 ? void 0 : booking.toDate); m.add(30, 'days')) {
                let recurringMonthlyData = {
                    month: month,
                    bookingId: booking._id,
                    fromDate: booking.fromDate,
                    toDate: booking.toDate,
                    paymentDate: m.format(),
                    paymentStatus: _common_1.ENUM.PAYMENT.STATUS.PENDING,
                    paymentPlan: _common_1.ENUM.PAYMENT.PLAN.MONTHLY,
                    monthlyPayable: booking.monthlyPayable
                };
                recurringData.push(recurringMonthlyData);
                month++;
            }
            await _entity_1.RecurringPayV1.insertMany(recurringData);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async updatePromotionStatus(promotionDetail) {
        try {
            const expireTime = _services_1.calculateDiffInSeconds(promotionDetail === null || promotionDetail === void 0 ? void 0 : promotionDetail.fromDate, true);
            await _services_1.redisDOA.setKey(`${_common_1.ENUM.PROPERTY.PROMOTION_FLAG.START}_${promotionDetail === null || promotionDetail === void 0 ? void 0 : promotionDetail._id}`, promotionDetail === null || promotionDetail === void 0 ? void 0 : promotionDetail.fromDate);
            await _services_1.redisDOA.expireKey(`${_common_1.ENUM.PROPERTY.PROMOTION_FLAG.START}_${promotionDetail === null || promotionDetail === void 0 ? void 0 : promotionDetail._id}`, expireTime);
        }
        catch (error) {
            console.error(`we got an error while updating promotion status =======> ${error}`);
        }
    }
    constructor(model) {
        super(model);
    }
    async getUserDetails(payload) {
        try {
            let userData = await user_model_1.default.findOne({ _id: mongoose_1.Types.ObjectId(payload) });
            return userData;
        }
        catch (error) {
            console.error(">>>>>>>>>>>>", error);
            return Promise.reject(error);
        }
    }
    async updateRecurringModel(booking) {
        var _a;
        try {
            await _entity_1.RecurringPayV1.removeAll({ bookingId: mongoose_1.Types.ObjectId(booking._id) });
            let month = booking.fromDate.getMonth();
            let recurringData = [];
            for (let date = moment(booking.fromDate); date.isBefore(moment(booking.toDate).subtract(1, 'month')); date.add(1, 'months')) {
                let recurringMonthlyData = {
                    month: month,
                    bookingId: booking._id,
                    fromDate: booking.fromDate,
                    toDate: booking.toDate,
                    paymentDate: date.format(),
                    paymentStatus: date.format() == moment(booking.fromDate).format() ?
                        _common_1.ENUM.PAYMENT.STATUS.SUCCESS :
                        _common_1.ENUM.PAYMENT.STATUS.PENDING,
                    paymentPlan: _common_1.ENUM.PAYMENT.PLAN.MONTHLY,
                    monthlyPayable: booking.giftCardAmount ? ((booking.totalPayable - booking.giftCardAmount) / ((_a = booking === null || booking === void 0 ? void 0 : booking.bookingDuration) === null || _a === void 0 ? void 0 : _a.months)) : booking.monthlyPayable
                };
                recurringData.push(recurringMonthlyData);
                month++;
            }
            await _entity_1.RecurringPayV1.insertMany(recurringData);
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async getHostDetails(payload) {
        try {
            let userData = await host_model_1.default.findOne({ _id: mongoose_1.Types.ObjectId(payload) });
            return userData;
        }
        catch (error) {
            console.error(">>>>>>>>>>>>", error);
            return Promise.reject(error);
        }
    }
    async insertPaymentLogs(userId, data, status) {
        try {
            let objectToSave = {
                userId: userId,
                data: data,
                status: status
            };
            let result = new payment_logs_model_1.default(objectToSave).save();
            return result;
        }
        catch (error) {
            console.error(">>>>>>>>>>>>2222", error);
            return Promise.reject(error);
        }
    }
    async updateBooking(payload, paymentIntent, checkAutoAccept, req) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20;
        try {
            let bookingDetails;
            let checkAutoAccept = await booking_v1_entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.bookingId) });
            let commission = await _entity_1.HostV1.findOne({ _id: mongoose_1.Types.ObjectId(checkAutoAccept.hostId) }, { commissionAmount: 1 });
            let adminCommission = (checkAutoAccept.totalPayable * commission.commissionAmount) / 100;
            let objectToSave = {
                stripeTransactionId: paymentIntent.id,
                price: checkAutoAccept.totalPayable,
                bookingId: payload.bookingId,
                status: _common_1.ENUM.PAYMENT.STATUS.SUCCESS,
                propertyId: checkAutoAccept.propertyData.propertyId,
                userId: payload.userId,
                paymentPlan: payload.paymentPlan,
                userType: _common_1.ENUM.USER.TYPE.USER,
                hostId: checkAutoAccept.hostId,
                last4: payload.cardDigit,
                transactionId: _services_1.generateUniqueId('DSKTR'),
                payoutPrice: checkAutoAccept.totalPayable - adminCommission,
                adminCommissionAmount: adminCommission
            };
            let [hostToken, userToken] = await Promise.all([
                _entity_1.HostV1.fetchHostDeviceToken(checkAutoAccept.hostId),
                user_v1_entity_1.UserV1.fetchUserDeviceToken(payload.userId)
            ]);
            let result = await new this.model(objectToSave).save();
            if (checkAutoAccept.propertyData.autoAcceptUpcomingBooking == true) {
                bookingDetails = await Promise.all([
                    booking_v1_entity_1.BookingV1.updateDocument({
                        _id: mongoose_1.Types.ObjectId(payload.bookingId),
                        "propertyData.autoAcceptUpcomingBooking": true
                    }, {
                        paymentStatus: _common_1.ENUM.PAYMENT.STATUS.SUCCESS,
                        bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED,
                        transactionId: result.transactionId,
                        transactionType: result.paymentPlan,
                        paymentMode: result.paymentMethod,
                        transactionDate: result.createdAt,
                        acceptedOn: moment(),
                        last4: payload.cardDigit,
                        paymentPlan: payload.paymentPlan,
                        adminCommission: adminCommission
                    }, { new: true }),
                ]);
                let pricePerUnit = (bookingDetails[0].basePrice).toFixed(2) / bookingDetails[0].quantity;
                let hostHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/Online_Booking/host_booking_emailer.html", {
                    logo: _common_1.CONSTANT.PAM_LOGO,
                    propertyName: `${bookingDetails[0].propertyData.name}`,
                    propertyAddress: `${bookingDetails[0].propertyData.address}`,
                    propertyImage: `${(_a = bookingDetails[0].propertyData) === null || _a === void 0 ? void 0 : _a.images[0]}`,
                    fromDate: moment(bookingDetails[0].fromDate).format('MMM DD,YYYY'),
                    toDate: moment(bookingDetails[0].toDate).format('MMM DD,YYYY'),
                    bookingId: bookingDetails[0].bookingId,
                    subCategoryName: bookingDetails[0].subCategory.name,
                    basePrice: _services_1.formatPrice(bookingDetails[0].basePrice),
                    offerPrice: _services_1.formatPrice(bookingDetails[0].offerPrice),
                    priceBeforeTaxes: _services_1.formatPrice(bookingDetails[0].basePrice),
                    totalPayable: _services_1.formatPrice(bookingDetails[0].totalPayable),
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
                    status: "confirmed",
                    healthierLogo: _common_1.CONSTANT.PEXELS_PEW,
                    webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : _common_1.WEB_PANELS.HOST_PANEL_PROD,
                    CONTACT_US: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_HOST_STAGING : _common_1.WEB_PANELS.CONTACT_US_PAM_PROD,
                    FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_HOST_STAGING : _common_1.WEB_PANELS.FAQ_PAM_PROD,
                    cancelBookingUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/host/booking/booking-details/${payload.bookingId}` : `${_common_1.WEB_PANELS.HOST_PANEL_PROD}/host/booking/booking-details/${payload.bookingId}`,
                    tAndCUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/content/term-condition` : `${_common_1.WEB_PANELS.HOST_PANEL_PROD}/content/term-condition`,
                    calendarIndexUrl: _common_1.CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowhoststg.appskeeper.com/host/outlook-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.HOST}` :
                        `${_common_1.WEB_PANELS.USER_PANEL_PROD}/host/outlook-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.HOST}`,
                    calendarIndexGmailUrl: _common_1.CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowhoststg.appskeeper.com/host/gmail-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.HOST}` :
                        `${_common_1.WEB_PANELS.HOST_PANEL_PROD}/host/gmail-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.HOST}`
                });
                let bookingHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/Online_Booking/booking-confirmation.html", {
                    logo: _common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                    status: "confirmed",
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
                    userName: bookingDetails[0].userData.name,
                    propertyName: `${bookingDetails[0].propertyData.name}`,
                    propertyAddress: `${bookingDetails[0].propertyData.address}`,
                    propertyImage: `${(_b = bookingDetails[0].propertyData) === null || _b === void 0 ? void 0 : _b.images[0]}`,
                    hostEmail: `${(_d = (_c = bookingDetails[0]) === null || _c === void 0 ? void 0 : _c.propertyData) === null || _d === void 0 ? void 0 : _d.hostEmail}`,
                    hostName: `${(_f = (_e = bookingDetails[0]) === null || _e === void 0 ? void 0 : _e.propertyData) === null || _f === void 0 ? void 0 : _f.hostName}`,
                    addressPin: _common_1.CONSTANT.ADDRESS_PIN,
                    fromDate: moment(bookingDetails[0].fromDate).format('MMM DD,YYYY'),
                    toDate: moment(bookingDetails[0].toDate).format('MMM DD,YYYY'),
                    bookingId: bookingDetails[0].bookingId,
                    subCategoryName: bookingDetails[0].subCategory.name,
                    quantity: bookingDetails[0].quantity,
                    totalPayable: _services_1.formatPrice(bookingDetails[0].totalPayable),
                    paymentPlan: ((_g = bookingDetails[0]) === null || _g === void 0 ? void 0 : _g.paymentPlan) != _common_1.ENUM.PAYMENT.PLAN.COMPLETE ? 'Monthly' : 'Complete',
                    bookingStatus: 'Successfully',
                    price: _services_1.formatPrice(bookingDetails[0].basePrice),
                    taxPercentage: bookingDetails[0].taxPercentage,
                    taxes: _services_1.formatPrice(bookingDetails[0].taxes),
                    pricePerUnit: _services_1.formatPrice(pricePerUnit),
                    webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                    contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                    FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD,
                    contactUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/chat?userId=${bookingDetails[0].hostId}` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/chat?userId=${bookingDetails[0].hostId}`,
                    cancelBookingUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/profile/booking/detail/${payload.bookingId}` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/profile/booking/detail/${payload.bookingId}`,
                    tAndCUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/content/term-condition` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/content/term-condition`,
                    calendarIndexUrl: _common_1.CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowuserstg.appskeeper.com/user/outlook-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.USER}` :
                        `${_common_1.WEB_PANELS.USER_PANEL_PROD}/user/outlook-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.USER}`,
                    calendarIndexGmailUrl: _common_1.CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowuserstg.appskeeper.com/user/gmail-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.USER}` :
                        `${_common_1.WEB_PANELS.USER_PANEL_PROD}/user/gmail-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.USER}`
                });
                await Promise.all([
                    this.createCalendarEvents((_h = bookingDetails[0]) === null || _h === void 0 ? void 0 : _h.userData.userId, (_j = bookingDetails[0]) === null || _j === void 0 ? void 0 : _j.hostId, bookingDetails[0], req),
                    _services_1.PushNotification.bookingSuccessfulHost(hostToken, bookingDetails[0]),
                    _services_1.PushNotification.sendUserBookingSuccessPushNotification(userToken, bookingDetails[0]),
                    _entity_1.PropertyV1.updateOne({ _id: mongoose_1.Types.ObjectId((_l = (_k = bookingDetails[0]) === null || _k === void 0 ? void 0 : _k.propertyData) === null || _l === void 0 ? void 0 : _l.propertyId) }, {
                        $inc: {
                            totalBookingsCount: 1,
                            averageDuration: (_o = (_m = bookingDetails[0]) === null || _m === void 0 ? void 0 : _m.bookingDuration) === null || _o === void 0 ? void 0 : _o.totalDays,
                            unitsBooked: (_p = bookingDetails[0]) === null || _p === void 0 ? void 0 : _p.quantity
                        }
                    }),
                    _entity_1.RecurringPayV1.update({ bookingId: mongoose_1.Types.ObjectId(bookingDetails[0]._id) }, { bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED }, { multi: true }),
                    _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.BOOKING_EMAIL_CONFIRMATION_HOST(`${bookingDetails[0].propertyData.hostEmail}`, hostHtml, bookingDetails[0].propertyData.name)),
                    _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.BOOKING_EMAIL_CONFIRMATION_USER(`${bookingDetails[0].userData.email}`, bookingHtml, bookingDetails[0].propertyData.name, "confirmed")),
                    _entity_1.RecurringPayV1.update({ bookingId: mongoose_1.Types.ObjectId(bookingDetails[0]._id) }, { bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED }, { multi: true }),
                    _entity_1.CoworkerV1.updateOne({
                        bookingId: (_q = bookingDetails[0]) === null || _q === void 0 ? void 0 : _q._id,
                        userId: (_r = bookingDetails[0]) === null || _r === void 0 ? void 0 : _r.userData.userId
                    }, {
                        name: (_s = bookingDetails[0]) === null || _s === void 0 ? void 0 : _s.userData.name,
                        email: (_t = bookingDetails[0]) === null || _t === void 0 ? void 0 : _t.userData.email,
                        status: 1,
                        image: (_u = bookingDetails[0]) === null || _u === void 0 ? void 0 : _u.userData.image,
                        ownerDetail: (_v = bookingDetails[0]) === null || _v === void 0 ? void 0 : _v.userData,
                        userId: (_w = bookingDetails[0]) === null || _w === void 0 ? void 0 : _w.userData.userId,
                        isOwner: 1,
                        bookingId: (_x = bookingDetails[0]) === null || _x === void 0 ? void 0 : _x._id,
                        bookingNumber: (_y = bookingDetails[0]) === null || _y === void 0 ? void 0 : _y.bookingId,
                        propertyId: (_z = bookingDetails[0]) === null || _z === void 0 ? void 0 : _z.propertyData.propertyId,
                        hostId: (_0 = bookingDetails[0]) === null || _0 === void 0 ? void 0 : _0.hostId,
                    }, { upsert: true })
                ]);
                await _services_1.GeneratePdf.invoice(payload.bookingId);
            }
            else {
                bookingDetails = await Promise.all([
                    booking_v1_entity_1.BookingV1.updateDocument({
                        _id: mongoose_1.Types.ObjectId(payload.bookingId),
                        "propertyData.autoAcceptUpcomingBooking": false
                    }, {
                        paymentStatus: _common_1.ENUM.PAYMENT.STATUS.SUCCESS,
                        bookingStatus: _common_1.ENUM.BOOKING.STATUS.PENDING,
                        transactionId: result.transactionId,
                        transactionType: result.paymentPlan,
                        paymentMode: result.paymentMethod,
                        transactionDate: result.createdAt,
                        paymentPlan: payload.paymentPlan,
                        adminCommission: adminCommission
                    })
                ]);
                let hostHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/Online_Booking/host_booking_emailer.html", {
                    logo: _common_1.CONSTANT.PAM_LOGO,
                    propertyName: `${bookingDetails[0].propertyData.name}`,
                    propertyAddress: `${bookingDetails[0].propertyData.address}`,
                    propertyImage: `${(_1 = bookingDetails[0].propertyData) === null || _1 === void 0 ? void 0 : _1.images[0]}`,
                    fromDate: moment(bookingDetails[0].fromDate).format('MMM DD,YYYY'),
                    toDate: moment(bookingDetails[0].toDate).format('MMM DD,YYYY'),
                    bookingId: bookingDetails[0].bookingId,
                    subCategoryName: bookingDetails[0].subCategory.name,
                    basePrice: _services_1.formatPrice(bookingDetails[0].basePrice),
                    offerPrice: _services_1.formatPrice(bookingDetails[0].offerPrice),
                    priceBeforeTaxes: _services_1.formatPrice(bookingDetails[0].basePrice),
                    totalPayable: _services_1.formatPrice(bookingDetails[0].totalPayable),
                    facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                    mockpur: _common_1.CONSTANT.MOCKUPER_6,
                    status: "pending",
                    appStore: _common_1.CONSTANT.APP_STORE_BADGE,
                    googlePlay: _common_1.CONSTANT.GOOGLE_PLAY_BADGE,
                    igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                    twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                    linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                    curratedLogo: _common_1.CONSTANT.COMPLEMENTRAY_2,
                    complementaryLogo: _common_1.CONSTANT.PEXELS_DARIA,
                    printingLogo: _common_1.CONSTANT.PEXELS_COTTONBRO,
                    healthierLogo: _common_1.CONSTANT.PEXELS_PEW,
                    webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : _common_1.WEB_PANELS.HOST_PANEL_PROD,
                    CONTACT_US: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_HOST_STAGING : _common_1.WEB_PANELS.CONTACT_US_PAM_PROD,
                    FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_HOST_STAGING : _common_1.WEB_PANELS.FAQ_PAM_PROD,
                    cancelBookingUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/host/booking/booking-details/${payload.bookingId}` : `${_common_1.WEB_PANELS.HOST_PANEL_PROD}/host/booking/booking-details/${payload.bookingId}`,
                    tAndCUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/content/term-condition` : `${_common_1.WEB_PANELS.HOST_PANEL_PROD}/content/term-condition`,
                    calendarIndexUrl: _common_1.CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowhoststg.appskeeper.com/host/outlook-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.HOST}` :
                        `${_common_1.WEB_PANELS.USER_PANEL_PROD}/host/outlook-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.HOST}`,
                    calendarIndexGmailUrl: _common_1.CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowhoststg.appskeeper.com/host/gmail-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.HOST}` :
                        `${_common_1.WEB_PANELS.HOST_PANEL_PROD}/host/gmail-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.HOST}`
                });
                let pricePerUnit = (bookingDetails[0].basePrice).toFixed(2) / bookingDetails[0].quantity;
                let bookingHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/Online_Booking/booking-confirmation.html", {
                    logo: _common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                    status: "pending",
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
                    userName: bookingDetails[0].userData.name,
                    propertyName: `${bookingDetails[0].propertyData.name}`,
                    propertyAddress: `${bookingDetails[0].propertyData.address}`,
                    propertyImage: `${(_2 = bookingDetails[0].propertyData) === null || _2 === void 0 ? void 0 : _2.images[0]}`,
                    hostEmail: `${(_4 = (_3 = bookingDetails[0]) === null || _3 === void 0 ? void 0 : _3.propertyData) === null || _4 === void 0 ? void 0 : _4.hostEmail}`,
                    hostName: `${(_6 = (_5 = bookingDetails[0]) === null || _5 === void 0 ? void 0 : _5.propertyData) === null || _6 === void 0 ? void 0 : _6.hostName}`,
                    addressPin: _common_1.CONSTANT.ADDRESS_PIN,
                    fromDate: moment(bookingDetails[0].fromDate).format('MMM DD,YYYY'),
                    toDate: moment(bookingDetails[0].toDate).format('MMM DD,YYYY'),
                    bookingId: bookingDetails[0].bookingId,
                    subCategoryName: bookingDetails[0].subCategory.name,
                    quantity: bookingDetails[0].quantity,
                    totalPayable: _services_1.formatPrice(bookingDetails[0].totalPayable),
                    paymentPlan: ((_7 = bookingDetails[0]) === null || _7 === void 0 ? void 0 : _7.paymentPlan) != _common_1.ENUM.PAYMENT.PLAN.COMPLETE ? 'Monthly' : 'Complete',
                    bookingStatus: 'Successfully',
                    price: _services_1.formatPrice(bookingDetails[0].basePrice),
                    taxPercentage: bookingDetails[0].taxPercentage,
                    taxes: _services_1.formatPrice(bookingDetails[0].taxes),
                    pricePerUnit: _services_1.formatPrice(pricePerUnit),
                    webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                    contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                    FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD,
                    contactUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/chat?userId=${bookingDetails[0].hostId}` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/chat?userId=${bookingDetails[0].hostId}`,
                    cancelBookingUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/profile/booking/detail/${payload.bookingId}` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/profile/booking/detail/${payload.bookingId}`,
                    tAndCUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/content/term-condition` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/content/term-condition`,
                    calendarIndexUrl: _common_1.CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowuserstg.appskeeper.com/user/outlook-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.USER}` :
                        `${_common_1.WEB_PANELS.USER_PANEL_PROD}/user/outlook-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.USER}`,
                    calendarIndexGmailUrl: _common_1.CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowuserstg.appskeeper.com/user/gmail-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.USER}` :
                        `${_common_1.WEB_PANELS.USER_PANEL_PROD}/user/gmail-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.USER}`
                });
                await Promise.all([
                    this.createCalendarEvents((_8 = bookingDetails[0]) === null || _8 === void 0 ? void 0 : _8.userData.userId, (_9 = bookingDetails[0]) === null || _9 === void 0 ? void 0 : _9.hostId, bookingDetails[0], req),
                    _services_1.PushNotification.bookingRequestHost(hostToken, bookingDetails[0]),
                    _services_1.PushNotification.sendBookingRequestPushNotification(userToken, bookingDetails[0]),
                    _entity_1.RecurringPayV1.update({ bookingId: mongoose_1.Types.ObjectId(bookingDetails[0]._id) }, { bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED }, { multi: true }),
                    _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.BOOKING_EMAIL_CONFIRMATION_USER(`${bookingDetails[0].userData.email}`, bookingHtml, bookingDetails[0].propertyData.name, "pending")),
                    _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.BOOKING_EMAIL_CONFIRMATION_HOST(`${bookingDetails[0].propertyData.hostEmail}`, hostHtml, bookingDetails[0].propertyData.name)),
                    _entity_1.RecurringPayV1.update({ bookingId: mongoose_1.Types.ObjectId(bookingDetails[0]._id) }, { bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED }, { multi: true }),
                    _services_1.redisDOA.insertKeyInRedis(`${_common_1.ENUM.REDIS.PENDING_BOOKING}_${bookingDetails[0]._id}`, 'toCancel'),
                    _services_1.redisDOA.expireKey(`${_common_1.ENUM.REDIS.PENDING_BOOKING}_${bookingDetails[0]._id}`, _common_1.ENUM.REDIS.EXPIRY_TIME),
                    _entity_1.CoworkerV1.updateOne({
                        bookingId: (_10 = bookingDetails[0]) === null || _10 === void 0 ? void 0 : _10._id,
                        userId: (_11 = bookingDetails[0]) === null || _11 === void 0 ? void 0 : _11.userData.userId
                    }, {
                        name: (_12 = bookingDetails[0]) === null || _12 === void 0 ? void 0 : _12.userData.name,
                        email: (_13 = bookingDetails[0]) === null || _13 === void 0 ? void 0 : _13.userData.email,
                        status: 1,
                        image: (_14 = bookingDetails[0]) === null || _14 === void 0 ? void 0 : _14.userData.image,
                        ownerDetail: (_15 = bookingDetails[0]) === null || _15 === void 0 ? void 0 : _15.userData,
                        userId: (_16 = bookingDetails[0]) === null || _16 === void 0 ? void 0 : _16.userData.userId,
                        isOwner: 1,
                        bookingId: (_17 = bookingDetails[0]) === null || _17 === void 0 ? void 0 : _17._id,
                        bookingNumber: (_18 = bookingDetails[0]) === null || _18 === void 0 ? void 0 : _18.bookingId,
                        propertyId: (_19 = bookingDetails[0]) === null || _19 === void 0 ? void 0 : _19.propertyData.propertyId,
                        hostId: (_20 = bookingDetails[0]) === null || _20 === void 0 ? void 0 : _20.hostId,
                    }, { upsert: true })
                ]);
                await _services_1.GeneratePdf.invoice(payload.bookingId);
            }
            return bookingDetails[0];
        }
        catch (error) {
            console.error(">>>>>>>>>>>>2222", error);
        }
    }
    async createCalendarEvents(userId, hostId, bookingDetails, req) {
        try {
            const msEventDetail = {
                subject: `Booking Confirmed`,
                start: bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.fromDate,
                end: bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.toDate,
                body: `Your booking ${bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.bookingId} has been scheduled for property ${bookingDetails === null || bookingDetails === void 0 ? void 0 : bookingDetails.propertyData.name}`
            };
            const [user, host] = await Promise.all([
                user_v1_entity_1.UserV1.findOne({ _id: mongoose_1.Types.ObjectId(userId) }, { outlookCalendarSyncStatus: 1, googleCalendarSyncStatus: 1, google_refresh_token: 1 }),
                _entity_1.HostV1.findOne({ _id: mongoose_1.Types.ObjectId(hostId) }, { outlookCalendarSyncStatus: 1, googleCalendarSyncStatus: 1, google_refresh_token: 1 })
            ]);
            if (user === null || user === void 0 ? void 0 : user.outlookCalendarSyncStatus) {
                msEventDetail['userId'] = userId;
                msEventDetail['userType'] = _common_1.ENUM.USER.TYPE.USER;
                _controllers_1.CommonController.createOutlookEvent(req, msEventDetail);
            }
            if (host === null || host === void 0 ? void 0 : host.outlookCalendarSyncStatus) {
                msEventDetail['userId'] = hostId;
                msEventDetail['userType'] = _common_1.ENUM.USER.TYPE.HOST;
                _controllers_1.CommonController.createOutlookEvent(req, msEventDetail);
            }
            if (user === null || user === void 0 ? void 0 : user.googleCalendarSyncStatus) {
                _services_1.GoogleCalendar.createEvent({ refresh_token: user === null || user === void 0 ? void 0 : user.google_refresh_token }, bookingDetails);
            }
            if (host === null || host === void 0 ? void 0 : host.googleCalendarSyncStatus) {
                _services_1.GoogleCalendar.createHostEvent({ refresh_token: host === null || host === void 0 ? void 0 : host.google_refresh_token }, bookingDetails);
            }
        }
        catch (error) {
            console.error(`we have an error in createCalendarEvents`, error);
        }
    }
    async giftCardCheckout(bookingParam, paymentIntent) {
        var _a, _b, _c, _d, _e;
        try {
            let bookingDetails;
            let objectToSave = {
                price: bookingParam.totalPayable,
                bookingId: bookingParam._id,
                status: _common_1.ENUM.PAYMENT.STATUS.SUCCESS,
                propertyId: bookingParam.propertyData.propertyId,
                userId: bookingParam.userData.userId,
                paymentPlan: _common_1.ENUM.PAYMENT.PLAN.COMPLETE,
                userType: _common_1.ENUM.USER.TYPE.USER,
                hostId: bookingParam.hostId,
                transactionId: _services_1.generateUniqueId('DSKTR'),
                paymentMethod: 'giftCard'
            };
            let [hostToken, userToken] = await Promise.all([
                _entity_1.HostV1.fetchHostDeviceToken(bookingParam.hostId),
                user_v1_entity_1.UserV1.fetchUserDeviceToken(bookingParam.userData.userId)
            ]);
            let result = await new this.model(objectToSave).save();
            if (bookingParam.propertyData.autoAcceptUpcomingBooking == true) {
                bookingDetails = await Promise.all([
                    booking_v1_entity_1.BookingV1.updateDocument({
                        _id: mongoose_1.Types.ObjectId(bookingParam._id),
                        "propertyData.autoAcceptUpcomingBooking": true
                    }, {
                        giftCardStatus: _common_1.ENUM.BOOKING.GIFT_CARD_STATUS.APPLIED,
                        paymentStatus: _common_1.ENUM.PAYMENT.STATUS.SUCCESS,
                        bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED,
                        transactionId: result.transactionId,
                        transactionType: result.paymentPlan,
                        paymentMode: result.paymentMethod,
                        transactionDate: result.createdAt,
                        acceptedOn: moment(),
                        paymentPlan: _common_1.ENUM.PAYMENT.PLAN.COMPLETE
                    }),
                ]);
                await Promise.all([
                    _services_1.PushNotification.bookingSuccessfulHost(hostToken, bookingDetails[0]),
                    _services_1.PushNotification.sendUserBookingSuccessPushNotification(userToken, bookingDetails[0]),
                    _entity_1.PropertyV1.updateOne({ _id: mongoose_1.Types.ObjectId((_b = (_a = bookingDetails[0]) === null || _a === void 0 ? void 0 : _a.propertyData) === null || _b === void 0 ? void 0 : _b.propertyId) }, {
                        $inc: {
                            totalBookingsCount: 1,
                            averageDuration: (_d = (_c = bookingDetails[0]) === null || _c === void 0 ? void 0 : _c.bookingDuration) === null || _d === void 0 ? void 0 : _d.totalDays,
                            unitsBooked: (_e = bookingDetails[0]) === null || _e === void 0 ? void 0 : _e.quantity
                        }
                    })
                ]);
            }
            else {
                bookingDetails = await Promise.all([
                    booking_v1_entity_1.BookingV1.updateDocument({
                        _id: mongoose_1.Types.ObjectId(bookingParam._id),
                        "propertyData.autoAcceptUpcomingBooking": false
                    }, {
                        giftCardStatus: _common_1.ENUM.BOOKING.GIFT_CARD_STATUS.APPLIED,
                        paymentStatus: _common_1.ENUM.PAYMENT.STATUS.SUCCESS,
                        bookingStatus: _common_1.ENUM.BOOKING.STATUS.PENDING,
                        transactionId: result.transactionId,
                        transactionType: result.paymentPlan,
                        paymentMode: result.paymentMethod,
                        transactionDate: result.createdAt,
                        paymentPlan: _common_1.ENUM.PAYMENT.PLAN.COMPLETE
                    })
                ]);
                await Promise.all([
                    _services_1.PushNotification.bookingRequestHost(hostToken, bookingDetails[0]),
                    _services_1.PushNotification.sendBookingRequestPushNotification(userToken, bookingDetails[0])
                ]);
            }
            return bookingDetails[0];
        }
        catch (error) {
            console.error(">>>>>>>>>>>>2222", error);
            throw error;
        }
    }
    async updateStripeCustomerId(userId, data) {
        await user_v1_entity_1.UserV1.updateDocument({ _id: mongoose_1.Types.ObjectId(userId) }, { stripeCustomerId: data.toString() });
        return;
    }
    async updateStripeHostCustomerId(userId, data) {
        await _entity_1.HostV1.updateDocument({ _id: mongoose_1.Types.ObjectId(userId) }, { stripeCustomerId: data.toString() });
        return;
    }
    async updateStatusAfterPayment(payload, hostId) {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            let checkAutoAccept = await booking_v1_entity_1.BookingV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.id) }, {
                paymentStatus: _common_1.ENUM.PAYMENT.STATUS.SUCCESS,
                bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED,
                acceptedOn: moment()
            });
            let [hostToken, userToken] = await Promise.all([
                _entity_1.HostV1.fetchHostDeviceToken(hostId),
                user_v1_entity_1.UserV1.fetchUserDeviceToken(checkAutoAccept.userData.userId)
            ]);
            let userHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/booking/action.user.html", {
                logo: _common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                bookingId: checkAutoAccept === null || checkAutoAccept === void 0 ? void 0 : checkAutoAccept.bookingId,
                userName: (_a = checkAutoAccept === null || checkAutoAccept === void 0 ? void 0 : checkAutoAccept.userData) === null || _a === void 0 ? void 0 : _a.name,
                hostName: (_b = checkAutoAccept === null || checkAutoAccept === void 0 ? void 0 : checkAutoAccept.propertyData) === null || _b === void 0 ? void 0 : _b.hostName,
                status: `accepted`,
                redirectionUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/profile/booking/detail/${payload.id}` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/profile/booking/detail/${payload.id}`,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD
            });
            let hostHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/booking/action.host.html", {
                logo: _common_1.CONSTANT.PAM_LOGO,
                bookingId: checkAutoAccept === null || checkAutoAccept === void 0 ? void 0 : checkAutoAccept.bookingId,
                userName: (_c = checkAutoAccept === null || checkAutoAccept === void 0 ? void 0 : checkAutoAccept.propertyData) === null || _c === void 0 ? void 0 : _c.hostName,
                status: `accepted`,
                redirectionUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/host/booking/booking-details/${payload.id}` : `${_common_1.WEB_PANELS.HOST_PANEL_PROD}/host/booking/booking-details/${payload.id}`,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : _common_1.WEB_PANELS.HOST_PANEL_PROD,
                CONTACT_US: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_HOST_STAGING : _common_1.WEB_PANELS.CONTACT_US_PAM_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_HOST_STAGING : _common_1.WEB_PANELS.FAQ_PAM_PROD,
                calendarIndexUrl: `https://desknowuserdev.appskeeper.com/api/fetchIndex?bookingId=${payload.id}&userType=${_common_1.ENUM.USER.TYPE.HOST}`
            });
            await Promise.all([
                _services_1.PushNotification.bookingRequestHostSuccess(hostToken, checkAutoAccept),
                _services_1.PushNotification.sendBookingRequestUserSuccess(userToken, checkAutoAccept),
                _entity_1.PropertyV1.updateOne({ _id: mongoose_1.Types.ObjectId(checkAutoAccept.propertyData.propertyId) }, {
                    $inc: {
                        totalBookingsCount: 1,
                        averageDuration: checkAutoAccept.bookingDuration.totalDays,
                        unitsBooked: parseInt(checkAutoAccept.quantity)
                    }
                }),
                _services_1.emailService.sendBookingAcceptedEmailToHost(hostHtml, payload.id, (_d = checkAutoAccept === null || checkAutoAccept === void 0 ? void 0 : checkAutoAccept.propertyData) === null || _d === void 0 ? void 0 : _d.hostEmail, (_e = checkAutoAccept === null || checkAutoAccept === void 0 ? void 0 : checkAutoAccept.userData) === null || _e === void 0 ? void 0 : _e.name, "accepted"),
                _services_1.emailService.sendBookingAcceptedEmailToUser(userHtml, payload.id, (_f = checkAutoAccept === null || checkAutoAccept === void 0 ? void 0 : checkAutoAccept.userData) === null || _f === void 0 ? void 0 : _f.email, (_g = checkAutoAccept === null || checkAutoAccept === void 0 ? void 0 : checkAutoAccept.propertyData) === null || _g === void 0 ? void 0 : _g.hostName, "accepted")
            ]);
            return checkAutoAccept;
        }
        catch (error) {
            console.error(">>>>>>>>>>>>2222", error);
            return Promise.reject(error);
        }
    }
    async updateStatusAfterReject(payload, hostId) {
        var _a, _b, _c, _d;
        try {
            let checkAutoReject = await booking_v1_entity_1.BookingV1.updateDocument({ _id: mongoose_1.Types.ObjectId(payload.id) }, { bookingStatus: _common_1.ENUM.BOOKING.STATUS.REJECTED, rejectedOn: moment() });
            let [hostToken, userToken] = await Promise.all([
                _entity_1.HostV1.fetchHostDeviceToken(hostId),
                user_v1_entity_1.UserV1.fetchUserDeviceToken(checkAutoReject.userData.userId)
            ]);
            let userHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/booking/action.user.html", {
                logo: _common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                bookingId: checkAutoReject === null || checkAutoReject === void 0 ? void 0 : checkAutoReject.bookingId,
                userName: (_a = checkAutoReject === null || checkAutoReject === void 0 ? void 0 : checkAutoReject.userData) === null || _a === void 0 ? void 0 : _a.name,
                status: `rejected`,
                redirectionUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowuserstg.appskeeper.com/profile/booking/detail/${payload.id}` : `${_common_1.WEB_PANELS.USER_PANEL_PROD}/profile/booking/detail/${payload.id}`,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD,
            });
            let hostHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/booking/action.host.html", {
                logo: _common_1.CONSTANT.PAM_LOGO,
                bookingId: checkAutoReject === null || checkAutoReject === void 0 ? void 0 : checkAutoReject.bookingId,
                userName: (_b = checkAutoReject === null || checkAutoReject === void 0 ? void 0 : checkAutoReject.propertyData) === null || _b === void 0 ? void 0 : _b.hostName,
                status: `rejected`,
                redirectionUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? `https://desknowhoststg.appskeeper.com/host/booking/booking-details/${payload.id}` : `${_common_1.WEB_PANELS.HOST_PANEL_PROD}/host/booking/booking-details/${payload.id}`,
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : _common_1.WEB_PANELS.HOST_PANEL_PROD,
                CONTACT_US: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_HOST_STAGING : _common_1.WEB_PANELS.CONTACT_US_PAM_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_HOST_STAGING : _common_1.WEB_PANELS.FAQ_PAM_PROD,
            });
            await Promise.all([
                _services_1.PushNotification.bookingRequestHostReject(hostToken, checkAutoReject),
                _services_1.PushNotification.sendBookingRequestUserRejected(userToken, checkAutoReject),
                _controllers_1.PaymentController.refund(payload.id, {}),
                _services_1.emailService.sendBookingRejectedEmailToHost(hostHtml, payload.id, (_c = checkAutoReject === null || checkAutoReject === void 0 ? void 0 : checkAutoReject.propertyData) === null || _c === void 0 ? void 0 : _c.hostEmail),
                _services_1.emailService.sendBookingRejectedEmailToUser(userHtml, payload.id, (_d = checkAutoReject === null || checkAutoReject === void 0 ? void 0 : checkAutoReject.userData) === null || _d === void 0 ? void 0 : _d.email)
            ]);
            return checkAutoReject;
        }
        catch (error) {
            console.error(">>>>>>>>>>>>2222", error);
            return Promise.reject(error);
        }
    }
    async fetchPaymentPlans(bookingId) {
        try {
            let bookingDetails = await booking_v1_entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(bookingId) });
            switch (bookingDetails.paymentPlan) {
                case _common_1.ENUM.PAYMENT.PLAN.COMPLETE:
                    let completePlan = {
                        paymentPlan: bookingDetails.paymentPlan,
                        totalPayable: bookingDetails.totalPayable,
                        transactionDate: bookingDetails.transactionDate
                    };
                    return completePlan;
                case _common_1.ENUM.PAYMENT.PLAN.MONTHLY:
                    let monthlyPlan = await _entity_1.RecurringPayV1.findMany({ bookingId: mongoose_1.Types.ObjectId(bookingId) });
                    return monthlyPlan;
                default:
                    {
                        let monthlyPlan = await _entity_1.RecurringPayV1.findMany({ bookingId: mongoose_1.Types.ObjectId(bookingId) });
                        return monthlyPlan;
                    }
            }
        }
        catch (error) {
            console.error(`we have an error while fetching payment plan ==> ${error}`);
        }
    }
    async getTransactionData(bookingId) {
        try {
            let transactionData = await payment_model_1.default.findOne({ bookingId: mongoose_1.Types.ObjectId(bookingId) }, { stripeTransactionId: 1, userId: 1, price: 1 });
            return transactionData;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    async fetchTotalPayout(payload) {
        try {
            let pipeline = [];
            let matchCriteria = [];
            if (payload && payload.status) {
                matchCriteria.push({ 'bookingStatus': payload.status });
            }
            else {
                matchCriteria.push({ 'bookingStatus': { $ne: 5 } });
            }
            if (payload.fromDate)
                matchCriteria.push({ createdAt: { $gte: new Date(payload.fromDate) } });
            if (payload.toDate)
                matchCriteria.push({ createdAt: { $lte: new Date(payload.toDate) } });
            pipeline.push({ $match: { $and: matchCriteria } });
            pipeline.push({ $group: { _id: null, count: { $sum: 1 } } }, { $project: { _id: 0 } });
            let details = await booking_v1_entity_1.BookingV1.basicAggregate(pipeline);
            details && details.length > 0 ? details = details[0] : details = { count: 0 };
            return details;
        }
        catch (error) {
            console.error(`we have an error while calculating total payout ==> ${error}`);
        }
    }
    async calculateBookingDuration(endDate, startDate, payload) {
        try {
            switch (payload === null || payload === void 0 ? void 0 : payload.bookingType) {
                case _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM:
                    const diffTime = Math.abs(endDate - startDate);
                    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    let monthTemp = days / _common_1.CONSTANT.CALENDER_STATICS.MONTH;
                    let totalDays = Math.trunc(days % _common_1.CONSTANT.CALENDER_STATICS.MONTH);
                    let totalMonths = Math.trunc(monthTemp % _common_1.CONSTANT.CALENDER_STATICS.MONTH);
                    let totalYear = Math.trunc(monthTemp / _common_1.CONSTANT.CALENDER_STATICS.TOTAL_MONTHS);
                    return {
                        bookingDuration: {
                            days: totalDays,
                            months: totalMonths,
                            year: totalYear,
                            totalDays: days
                        }
                    };
                case _common_1.ENUM.USER.BOOKING_TYPE.HOURLY:
                    return {
                        bookingDuration: {
                            totalHours: payload.totalHours
                        }
                    };
                case _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY:
                    return {
                        bookingDuration: {
                            months: payload === null || payload === void 0 ? void 0 : payload.totalMonths,
                        }
                    };
            }
        }
        catch (error) {
            console.error(`we have an error in fetchCalculatedPrice ==> ${error}`);
        }
    }
}
exports.PayV1 = new PaymentEntity(payment_model_1.default);
//# sourceMappingURL=payment.v1.entity.js.map