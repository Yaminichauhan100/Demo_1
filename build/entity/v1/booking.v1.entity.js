"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingV1 = void 0;
const mongoose_1 = require("mongoose");
const base_entity_1 = __importDefault(require("../base.entity"));
const booking_model_1 = __importDefault(require("@models/booking.model"));
const _entity_1 = require("@entity");
const _common_1 = require("@common");
const _services_1 = require("@services");
const moment_1 = __importDefault(require("moment"));
const htmlHelper_1 = require("../../htmlHelper");
class BookingEntity extends base_entity_1.default {
    constructor(model) {
        super(model);
    }
    async updateEmployeeBookingStatus(payload, bookingDetail, req) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14;
        try {
            let bookingDetails;
            if ((bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.prolongedStatus) === _common_1.ENUM.BOOKING.PROLONGED_STATUS.PENDING
                && (bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.prolongBookingId)) {
                await exports.BookingV1.updateOne({ _id: mongoose_1.Types.ObjectId(bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.prolongBookingId) }, {
                    $set: {
                        prolongedStatus: _common_1.ENUM.BOOKING.PROLONGED_STATUS.SUCCESS,
                        prolongBookingId: mongoose_1.Types.ObjectId(bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.prolongBookingId)
                    }
                }, {});
            }
            let objectToSave = {
                bookingId: bookingDetail._id,
                status: _common_1.ENUM.PAYMENT.STATUS.SUCCESS,
                propertyId: bookingDetail.propertyData.propertyId,
                userId: bookingDetail.userData.userId,
                userType: _common_1.ENUM.USER.TYPE.USER,
                hostId: bookingDetail.hostId,
                transactionId: _services_1.generateUniqueId('DSKTR'),
                paymentMethod: payload.paymentMethod
            };
            let [hostToken, userToken] = await Promise.all([
                _entity_1.HostV1.fetchHostDeviceToken(bookingDetail.hostId),
                _entity_1.UserV1.fetchUserDeviceToken(bookingDetail.userData.userId)
            ]);
            let result = await _entity_1.PayV1.updateEmployeeBookingPayDetails(objectToSave);
            if (bookingDetail.propertyData.autoAcceptUpcomingBooking == true) {
                bookingDetails = await Promise.all([
                    exports.BookingV1.updateDocument({
                        _id: mongoose_1.Types.ObjectId(payload.bookingId),
                        "propertyData.autoAcceptUpcomingBooking": true
                    }, {
                        paymentStatus: _common_1.ENUM.PAYMENT.STATUS.SUCCESS,
                        bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED,
                        transactionId: result.transactionId,
                        paymentMode: result.paymentMethod,
                        transactionDate: result.createdAt,
                        acceptedOn: moment_1.default()
                    }, { new: true }),
                ]);
                let hostHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/Online_Booking/host_booking_emailer.html", {
                    logo: _common_1.CONSTANT.PAM_LOGO,
                    propertyName: `${bookingDetails[0].propertyData.name}`,
                    propertyAddress: `${bookingDetails[0].propertyData.address}`,
                    propertyImage: `${(_a = bookingDetails[0].propertyData) === null || _a === void 0 ? void 0 : _a.images[0]}`,
                    fromDate: moment_1.default(bookingDetails[0].fromDate).format('MMM DD,YYYY'),
                    toDate: moment_1.default(bookingDetails[0].toDate).format('MMM DD,YYYY'),
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
                        `https://desknowuserstg.appskeeper.com/user/outlook-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.HOST}` :
                        `${_common_1.WEB_PANELS.USER_PANEL_PROD}/host/outlook-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.HOST}`,
                    calendarIndexGmailUrl: _common_1.CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowuserstg.appskeeper.com/user/gmail-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.HOST}` :
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
                    fromDate: moment_1.default(bookingDetails[0].fromDate).format('MMM DD,YYYY'),
                    toDate: moment_1.default(bookingDetails[0].toDate).format('MMM DD,YYYY'),
                    bookingId: bookingDetails[0].bookingId,
                    subCategoryName: bookingDetails[0].subCategory.name,
                    quantity: bookingDetails[0].quantity,
                    bookingStatus: 'Successfully',
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
                    _entity_1.PayV1.createCalendarEvents(bookingDetail.userData.userId, bookingDetail.hostId, bookingDetail, req),
                    _services_1.PushNotification.bookingSuccessfulHost(hostToken, bookingDetails[0]),
                    _services_1.PushNotification.sendUserBookingSuccessPushNotification(userToken, bookingDetails[0]),
                    _entity_1.PropertyV1.updateOne({ _id: mongoose_1.Types.ObjectId((_h = (_g = bookingDetails[0]) === null || _g === void 0 ? void 0 : _g.propertyData) === null || _h === void 0 ? void 0 : _h.propertyId) }, {
                        $inc: {
                            totalBookingsCount: 1,
                            averageDuration: (_k = (_j = bookingDetails[0]) === null || _j === void 0 ? void 0 : _j.bookingDuration) === null || _k === void 0 ? void 0 : _k.totalDays,
                            unitsBooked: (_l = bookingDetails[0]) === null || _l === void 0 ? void 0 : _l.quantity
                        }
                    }),
                    _entity_1.RecurringPayV1.update({ bookingId: mongoose_1.Types.ObjectId(bookingDetails[0]._id) }, { bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED }, { multi: true }),
                    _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.BOOKING_EMAIL_CONFIRMATION_HOST(`${bookingDetails[0].propertyData.hostEmail}`, hostHtml, bookingDetails[0].propertyData.name)),
                    _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.BOOKING_EMAIL_CONFIRMATION_USER(`${bookingDetails[0].userData.email}`, bookingHtml, bookingDetails[0].propertyData.name, "confirmed")),
                    _entity_1.RecurringPayV1.update({ bookingId: mongoose_1.Types.ObjectId(bookingDetails[0]._id) }, { bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED }, { multi: true }),
                    _entity_1.CoworkerV1.updateOne({
                        bookingId: (_m = bookingDetails[0]) === null || _m === void 0 ? void 0 : _m._id,
                        userId: (_o = bookingDetails[0]) === null || _o === void 0 ? void 0 : _o.userData.userId
                    }, {
                        name: (_p = bookingDetails[0]) === null || _p === void 0 ? void 0 : _p.userData.name,
                        email: (_q = bookingDetails[0]) === null || _q === void 0 ? void 0 : _q.userData.email,
                        status: 1,
                        image: (_r = bookingDetails[0]) === null || _r === void 0 ? void 0 : _r.userData.image,
                        ownerDetail: (_s = bookingDetails[0]) === null || _s === void 0 ? void 0 : _s.userData,
                        userId: (_t = bookingDetails[0]) === null || _t === void 0 ? void 0 : _t.userData.userId,
                        isOwner: 1,
                        bookingId: (_u = bookingDetails[0]) === null || _u === void 0 ? void 0 : _u._id,
                        bookingNumber: (_v = bookingDetails[0]) === null || _v === void 0 ? void 0 : _v.bookingId,
                        propertyId: (_w = bookingDetails[0]) === null || _w === void 0 ? void 0 : _w.propertyData.propertyId,
                        hostId: (_x = bookingDetails[0]) === null || _x === void 0 ? void 0 : _x.hostId,
                    }, { upsert: true })
                ]);
                _entity_1.UserV1.updateOne({ _id: bookingDetail.userData.userId }, { $inc: { bookingCount: 1 } });
            }
            else {
                bookingDetails = await Promise.all([
                    exports.BookingV1.updateDocument({
                        _id: mongoose_1.Types.ObjectId(payload.bookingId),
                        "propertyData.autoAcceptUpcomingBooking": false
                    }, {
                        paymentStatus: _common_1.ENUM.PAYMENT.STATUS.SUCCESS,
                        bookingStatus: _common_1.ENUM.BOOKING.STATUS.PENDING,
                        transactionId: result.transactionId,
                        transactionType: result.paymentPlan,
                        paymentMode: result.paymentMethod,
                        transactionDate: result.createdAt,
                    })
                ]);
                let hostHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/Online_Booking/host_booking_emailer.html", {
                    logo: _common_1.CONSTANT.PAM_LOGO,
                    propertyName: `${bookingDetails[0].propertyData.name}`,
                    propertyAddress: `${bookingDetails[0].propertyData.address}`,
                    fromDate: moment_1.default(bookingDetails[0].fromDate).format('MMM DD,YYYY'),
                    toDate: moment_1.default(bookingDetails[0].toDate).format('MMM DD,YYYY'),
                    bookingId: bookingDetails[0].bookingId,
                    propertyImage: `${(_y = bookingDetails[0].propertyData) === null || _y === void 0 ? void 0 : _y.images[0]}`,
                    subCategoryName: bookingDetails[0].subCategory.name,
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
                        `https://desknowuserstg.appskeeper.com/user/outlook-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.USER}` :
                        `${_common_1.WEB_PANELS.USER_PANEL_PROD}/user/outlook-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.USER}`,
                    calendarIndexGmailUrl: _common_1.CONFIG.NODE_ENV === 'stag' ?
                        `https://desknowuserstg.appskeeper.com/user/gmail-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.USER}` :
                        `${_common_1.WEB_PANELS.USER_PANEL_PROD}/user/gmail-access?bookingId=${payload.bookingId}&userType=${_common_1.ENUM.USER.TYPE.USER}`
                });
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
                    propertyImage: `${(_z = bookingDetails[0].propertyData) === null || _z === void 0 ? void 0 : _z.images[0]}`,
                    hostEmail: `${(_1 = (_0 = bookingDetails[0]) === null || _0 === void 0 ? void 0 : _0.propertyData) === null || _1 === void 0 ? void 0 : _1.hostEmail}`,
                    hostName: `${(_3 = (_2 = bookingDetails[0]) === null || _2 === void 0 ? void 0 : _2.propertyData) === null || _3 === void 0 ? void 0 : _3.hostName}`,
                    addressPin: _common_1.CONSTANT.ADDRESS_PIN,
                    fromDate: moment_1.default(bookingDetails[0].fromDate).format('MMM DD,YYYY'),
                    toDate: moment_1.default(bookingDetails[0].toDate).format('MMM DD,YYYY'),
                    bookingId: bookingDetails[0].bookingId,
                    subCategoryName: bookingDetails[0].subCategory.name,
                    quantity: bookingDetails[0].quantity,
                    bookingStatus: 'Successfully',
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
                    _entity_1.PayV1.createCalendarEvents(bookingDetail.userData.userId, bookingDetail.hostId, bookingDetail, req),
                    _services_1.PushNotification.bookingRequestHost(hostToken, bookingDetails[0]),
                    _services_1.PushNotification.sendBookingRequestPushNotification(userToken, bookingDetails[0]),
                    _entity_1.RecurringPayV1.update({ bookingId: mongoose_1.Types.ObjectId(bookingDetails[0]._id) }, { bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED }, { multi: true }),
                    _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.BOOKING_EMAIL_CONFIRMATION_USER(`${bookingDetails[0].userData.email}`, bookingHtml, bookingDetails[0].propertyData.name, "pending")),
                    _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.BOOKING_EMAIL_CONFIRMATION_HOST(`${bookingDetails[0].propertyData.hostEmail}`, hostHtml, bookingDetails[0].propertyData.name)),
                    _entity_1.RecurringPayV1.update({ bookingId: mongoose_1.Types.ObjectId(bookingDetails[0]._id) }, { bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED }, { multi: true }),
                    _services_1.redisDOA.insertKeyInRedis(`${_common_1.ENUM.REDIS.PENDING_BOOKING}_${bookingDetails[0]._id}`, 'toCancel'),
                    _services_1.redisDOA.expireKey(`${_common_1.ENUM.REDIS.PENDING_BOOKING}_${bookingDetails[0]._id}`, _common_1.ENUM.REDIS.EXPIRY_TIME),
                    _entity_1.CoworkerV1.updateOne({
                        bookingId: (_4 = bookingDetails[0]) === null || _4 === void 0 ? void 0 : _4._id,
                        userId: (_5 = bookingDetails[0]) === null || _5 === void 0 ? void 0 : _5.userData.userId
                    }, {
                        name: (_6 = bookingDetails[0]) === null || _6 === void 0 ? void 0 : _6.userData.name,
                        email: (_7 = bookingDetails[0]) === null || _7 === void 0 ? void 0 : _7.userData.email,
                        status: 1,
                        image: (_8 = bookingDetails[0]) === null || _8 === void 0 ? void 0 : _8.userData.image,
                        ownerDetail: (_9 = bookingDetails[0]) === null || _9 === void 0 ? void 0 : _9.userData,
                        userId: (_10 = bookingDetails[0]) === null || _10 === void 0 ? void 0 : _10.userData.userId,
                        isOwner: 1,
                        bookingId: (_11 = bookingDetails[0]) === null || _11 === void 0 ? void 0 : _11._id,
                        bookingNumber: (_12 = bookingDetails[0]) === null || _12 === void 0 ? void 0 : _12.bookingId,
                        propertyId: (_13 = bookingDetails[0]) === null || _13 === void 0 ? void 0 : _13.propertyData.propertyId,
                        hostId: (_14 = bookingDetails[0]) === null || _14 === void 0 ? void 0 : _14.hostId,
                    }, { upsert: true })
                ]);
            }
            return bookingDetail;
        }
        catch (error) {
            console.error(`we have an error in checkout module ==> ${error}`);
        }
    }
    async normalUserDurationCheck(payload, offset) {
        try {
            switch (payload === null || payload === void 0 ? void 0 : payload.bookingType) {
                case _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM:
                    return await this.fetchCustomUnitAvailability(payload, offset);
                case _common_1.ENUM.USER.BOOKING_TYPE.HOURLY:
                    return await this.fetchHourlyUnitAvailability(payload, offset);
                case _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY:
                    return await this.fetchMonthlyUnitAvailability(payload, offset);
            }
        }
        catch (error) {
            console.error(`we have an error while durationCheck ==> ${error}`);
        }
    }
    async fetchCustomUnitAvailability(payload, offset) {
        var _a, _b;
        try {
            let startTime = _common_1.DATABASE.DATE_CONSTANTS.calculateCurrentDate(payload.fromDate, payload.offset);
            let endTime = _common_1.DATABASE.DATE_CONSTANTS.toDate(payload.toDate, payload.offset);
            let [spaceDetail, bookingDetail] = await Promise.all([
                _entity_1.PropertySpaceV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.spaceId) }, { units: 1 }),
                exports.BookingV1.findMany({
                    "spaceId": mongoose_1.Types.ObjectId(payload.spaceId),
                    isEmployee: false,
                    bookingType: _common_1.ENUM.USER.BOOKING_TYPE.CUSTOM,
                    $or: [
                        { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: startTime } },
                        { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $gte: endTime } },
                        { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: endTime } },
                        { fromDate: { $lte: startTime }, toDate: { $gte: startTime } }
                    ],
                    bookingStatus: {
                        $nin: [
                            _common_1.ENUM.BOOKING.STATUS.ABANDONED,
                            _common_1.ENUM.BOOKING.STATUS.CANCELLED,
                            _common_1.ENUM.BOOKING.STATUS.REJECTED,
                            _common_1.ENUM.BOOKING.STATUS.COMPLETED
                        ]
                    }
                }, { quantity: 1, fromDate: 1, toDate: 1 })
            ]);
            let totalUnitsAvailable = 0;
            let availableUnits;
            if (bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.length) {
                for (let i = 0; i < bookingDetail.length; i++) {
                    totalUnitsAvailable = totalUnitsAvailable + bookingDetail[i].quantity;
                }
                for (let i = 0; i < bookingDetail.length; i++) {
                    availableUnits = spaceDetail.units.custom - totalUnitsAvailable;
                    if (payload.quantity > availableUnits) {
                        payload['availableUnits'] = 0;
                        payload['quantity'] = (payload === null || payload === void 0 ? void 0 : payload.quantity) > 1 ? (payload === null || payload === void 0 ? void 0 : payload.quantity) - 1 : payload === null || payload === void 0 ? void 0 : payload.quantity;
                        break;
                    }
                }
            }
            else {
                if (payload.quantity > ((_a = spaceDetail === null || spaceDetail === void 0 ? void 0 : spaceDetail.units) === null || _a === void 0 ? void 0 : _a.custom)) {
                    payload['availableUnits'] = 0;
                    payload['quantity'] = (payload === null || payload === void 0 ? void 0 : payload.quantity) > 1 ? (payload === null || payload === void 0 ? void 0 : payload.quantity) - 1 : payload === null || payload === void 0 ? void 0 : payload.quantity;
                }
                else {
                    availableUnits = (_b = spaceDetail === null || spaceDetail === void 0 ? void 0 : spaceDetail.units) === null || _b === void 0 ? void 0 : _b.custom;
                }
            }
            return payload;
        }
        catch (error) {
            console.error(`we have an error in fetchCustomUnitAvailability ==> ${error}`);
        }
    }
    async fetchMonthlyUnitAvailability(payload, offset) {
        var _a, _b;
        try {
            let startTime = _common_1.DATABASE.DATE_CONSTANTS.calculateCurrentDate(payload.fromDate, payload.offset);
            let endTime = _common_1.DATABASE.DATE_CONSTANTS.toDate(payload.toDate, payload.offset);
            let [spaceDetail, bookingDetail] = await Promise.all([
                _entity_1.PropertySpaceV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.spaceId) }, { units: 1 }),
                exports.BookingV1.findMany({
                    isEmployee: false,
                    "spaceId": mongoose_1.Types.ObjectId(payload.spaceId),
                    bookingType: _common_1.ENUM.USER.BOOKING_TYPE.MONTHLY,
                    $or: [
                        { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: startTime } },
                        { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $gte: endTime } },
                        { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: endTime } },
                        { fromDate: { $lte: startTime }, toDate: { $gte: startTime } }
                    ],
                    bookingStatus: {
                        $nin: [
                            _common_1.ENUM.BOOKING.STATUS.ABANDONED,
                            _common_1.ENUM.BOOKING.STATUS.CANCELLED,
                            _common_1.ENUM.BOOKING.STATUS.REJECTED,
                            _common_1.ENUM.BOOKING.STATUS.COMPLETED
                        ]
                    }
                }, { quantity: 1, fromDate: 1, toDate: 1 })
            ]);
            let totalUnitsAvailable = 0;
            let availableUnits;
            if (bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.length) {
                for (let i = 0; i < bookingDetail.length; i++) {
                    totalUnitsAvailable = totalUnitsAvailable + bookingDetail[i].quantity;
                }
                for (let i = 0; i < bookingDetail.length; i++) {
                    availableUnits = spaceDetail.units.monthly - totalUnitsAvailable;
                    if (payload.quantity > availableUnits) {
                        payload['availableUnits'] = 0;
                        payload['quantity'] = (payload === null || payload === void 0 ? void 0 : payload.quantity) > 1 ? (payload === null || payload === void 0 ? void 0 : payload.quantity) - 1 : payload === null || payload === void 0 ? void 0 : payload.quantity;
                        break;
                    }
                }
            }
            else {
                if (payload.quantity > ((_a = spaceDetail === null || spaceDetail === void 0 ? void 0 : spaceDetail.units) === null || _a === void 0 ? void 0 : _a.monthly)) {
                    payload['availableUnits'] = 0;
                    payload['quantity'] = (payload === null || payload === void 0 ? void 0 : payload.quantity) > 1 ? (payload === null || payload === void 0 ? void 0 : payload.quantity) - 1 : payload === null || payload === void 0 ? void 0 : payload.quantity;
                }
                else {
                    availableUnits = (_b = spaceDetail === null || spaceDetail === void 0 ? void 0 : spaceDetail.units) === null || _b === void 0 ? void 0 : _b.monthly;
                }
            }
            return payload;
        }
        catch (error) {
            console.error(`we have an error in fetchMonthlyUnitAvailability ==> ${error}`);
        }
    }
    async fetchHourlyUnitAvailability(payload, offset) {
        var _a, _b;
        try {
            let startTime = _common_1.DATABASE.DATE_CONSTANTS.hourlyFromDate(payload.fromDate, payload.offset);
            let endTime = _common_1.DATABASE.DATE_CONSTANTS.hourlyToDate(payload.toDate, payload.offset);
            let [spaceDetail, bookingDetail] = await Promise.all([
                _entity_1.PropertySpaceV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.spaceId) }, { units: 1 }),
                exports.BookingV1.findMany({
                    "spaceId": mongoose_1.Types.ObjectId(payload.spaceId),
                    isEmployee: false,
                    bookingType: _common_1.ENUM.USER.BOOKING_TYPE.HOURLY,
                    $or: [
                        { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: startTime } },
                        { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $gte: endTime } },
                        { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: endTime } },
                        { fromDate: { $lte: startTime }, toDate: { $gte: startTime } }
                    ],
                    bookingStatus: {
                        $nin: [
                            _common_1.ENUM.BOOKING.STATUS.ABANDONED,
                            _common_1.ENUM.BOOKING.STATUS.CANCELLED,
                            _common_1.ENUM.BOOKING.STATUS.REJECTED,
                            _common_1.ENUM.BOOKING.STATUS.COMPLETED
                        ]
                    }
                }, { quantity: 1, fromDate: 1, toDate: 1 })
            ]);
            let totalUnitsAvailable = 0;
            let availableUnits;
            if (bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.length) {
                for (let i = 0; i < bookingDetail.length; i++) {
                    totalUnitsAvailable = totalUnitsAvailable + bookingDetail[i].quantity;
                }
                for (let i = 0; i < bookingDetail.length; i++) {
                    availableUnits = spaceDetail.units.hourly - totalUnitsAvailable;
                    if (payload.quantity > availableUnits) {
                        payload['availableUnits'] = 0;
                        payload['quantity'] = (payload === null || payload === void 0 ? void 0 : payload.quantity) > 1 ? (payload === null || payload === void 0 ? void 0 : payload.quantity) - 1 : payload === null || payload === void 0 ? void 0 : payload.quantity;
                        break;
                    }
                }
            }
            else {
                if (payload.quantity > ((_a = spaceDetail === null || spaceDetail === void 0 ? void 0 : spaceDetail.units) === null || _a === void 0 ? void 0 : _a.hourly)) {
                    payload['availableUnits'] = 0;
                    payload['quantity'] = (payload === null || payload === void 0 ? void 0 : payload.quantity) > 1 ? (payload === null || payload === void 0 ? void 0 : payload.quantity) - 1 : payload === null || payload === void 0 ? void 0 : payload.quantity;
                }
                else {
                    availableUnits = (_b = spaceDetail === null || spaceDetail === void 0 ? void 0 : spaceDetail.units) === null || _b === void 0 ? void 0 : _b.hourly;
                }
            }
            return payload;
        }
        catch (error) {
            console.error(`we have an error in fetchHourlyUnitAvailability ==> ${error}`);
        }
    }
    async employeeDurationCheck(payload, offset) {
        try {
            let startTime;
            let endTime;
            if (payload.bookingType == _common_1.ENUM.USER.BOOKING_TYPE.HOURLY) {
                startTime = _common_1.DATABASE.DATE_CONSTANTS.hourlyFromDate(payload.fromDate, payload.offset);
                endTime = _common_1.DATABASE.DATE_CONSTANTS.hourlyToDate(payload.toDate, payload.offset);
            }
            else {
                startTime = _common_1.DATABASE.DATE_CONSTANTS.calculateCurrentDate(payload.fromDate, payload.offset);
                endTime = _common_1.DATABASE.DATE_CONSTANTS.toDate(payload.toDate, payload.offset);
            }
            let [spaceDetail, bookingDetail] = await Promise.all([
                _entity_1.PartnerFloorV1.findOne({ spaceId: mongoose_1.Types.ObjectId(payload.spaceId), status: _common_1.ENUM.PROPERTY.STATUS.ACTIVE }, { employeeUnits: 1 }),
                exports.BookingV1.findMany({
                    isEmployee: true,
                    "spaceId": mongoose_1.Types.ObjectId(payload.spaceId),
                    $or: [
                        { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: startTime } },
                        { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $gte: endTime } },
                        { fromDate: { $gte: startTime, $lte: endTime }, toDate: { $lte: endTime } },
                        { fromDate: { $lte: startTime }, toDate: { $gte: startTime } }
                    ],
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
            let availableUnits;
            if (bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.length) {
                for (let i = 0; i < bookingDetail.length; i++) {
                    totalUnitsAvailable = totalUnitsAvailable + bookingDetail[i].quantity;
                }
                for (let i = 0; i < bookingDetail.length; i++) {
                    availableUnits = (spaceDetail === null || spaceDetail === void 0 ? void 0 : spaceDetail.employeeUnits) - totalUnitsAvailable;
                    if (payload.quantity > availableUnits) {
                        payload['availableUnits'] = 0;
                        payload['quantity'] = (payload === null || payload === void 0 ? void 0 : payload.quantity) > 1 ? (payload === null || payload === void 0 ? void 0 : payload.quantity) - 1 : payload === null || payload === void 0 ? void 0 : payload.quantity;
                        break;
                    }
                }
            }
            else {
                if (payload.quantity > (spaceDetail === null || spaceDetail === void 0 ? void 0 : spaceDetail.employeeUnits)) {
                    payload['availableUnits'] = 0;
                    payload['quantity'] = (payload === null || payload === void 0 ? void 0 : payload.quantity) > 1 ? (payload === null || payload === void 0 ? void 0 : payload.quantity) - 1 : payload === null || payload === void 0 ? void 0 : payload.quantity;
                }
                else {
                    availableUnits = spaceDetail === null || spaceDetail === void 0 ? void 0 : spaceDetail.employeeUnits;
                }
            }
            return payload;
        }
        catch (error) {
            console.error(`we have an error while durationCheck ==> ${error}`);
        }
    }
    async userBookSpace(cartData, headers, payload) {
        var _a, _b, _c, _d;
        try {
            let deviceId = headers.devicedetails.deviceId;
            let dataToInsert = {
                cartId: cartData._id,
                deviceId: deviceId,
                quantity: cartData.quantity,
                cartInfo: cartData.cartInfo,
                fromDate: moment_1.default(cartData.fromDate).toISOString(),
                toDate: moment_1.default(cartData.toDate).toISOString(),
                occupancy: cartData.occupancy * cartData.quantity,
                userData: {
                    userId: cartData.userData.userId,
                    status: cartData.userData.status,
                    name: cartData.userData.name,
                    image: cartData.userData.image,
                    phoneNo: cartData.userData.phoneNo,
                    countryCode: cartData.userData.countryCode,
                    createdAt: cartData.userData.createdAt,
                    email: cartData.userData.email,
                    dob: cartData.userData.dob,
                    profileStatus: cartData.userData.profileStatus,
                    bio: cartData.userData.bio
                },
                taxes: cartData === null || cartData === void 0 ? void 0 : cartData.taxes,
                taxPercentage: cartData === null || cartData === void 0 ? void 0 : cartData.taxPercentage,
                offerPrice: (cartData === null || cartData === void 0 ? void 0 : cartData.offerPrice) ? cartData === null || cartData === void 0 ? void 0 : cartData.offerPrice : 0,
                offerLabelType: (cartData === null || cartData === void 0 ? void 0 : cartData.offerLabelType) ? cartData === null || cartData === void 0 ? void 0 : cartData.offerLabelType : {},
                shareUrl: cartData.shareUrl,
                bookingId: _services_1.generateUniqueId('DSK'),
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
                hostId: cartData.hostId,
                totalPayable: cartData.totalPayable,
                monthlyPayable: (cartData === null || cartData === void 0 ? void 0 : cartData.monthlyPayable) ? await _services_1.roundOffNumbers(cartData.monthlyPayable) : 0,
                totalSpaceCapacity: cartData.totalSpaceCapacity,
                basePrice: cartData.basePrice,
                bookingDuration: {
                    months: (_a = cartData.bookingDuration) === null || _a === void 0 ? void 0 : _a.months,
                    days: (_b = cartData.bookingDuration) === null || _b === void 0 ? void 0 : _b.days,
                    totalDays: (_c = cartData.bookingDuration) === null || _c === void 0 ? void 0 : _c.totalDays,
                    totalHours: (_d = cartData.bookingDuration) === null || _d === void 0 ? void 0 : _d.totalHours
                },
                category: cartData.category,
                subCategory: cartData.subCategory,
                bookingMode: 0,
                floorDescription: cartData.floorDescription,
                floorNumber: cartData.floorNumber,
                partnerId: cartData.partnerId,
                isEmployee: cartData.isEmployee,
                floorLabel: cartData.floorLabel,
                bookingType: cartData.bookingType,
                adminCommissionAmount: cartData.adminCommissionAmount
            };
            let response = await new this.model(dataToInsert).save();
            if ((payload === null || payload === void 0 ? void 0 : payload.extended) === true) {
                await exports.BookingV1.updateOne({ _id: mongoose_1.Types.ObjectId(response === null || response === void 0 ? void 0 : response._id) }, {
                    $set: {
                        prolongedStatus: _common_1.ENUM.BOOKING.PROLONGED_STATUS.PENDING,
                        prolongBookingId: mongoose_1.Types.ObjectId(cartData.prolongBookingId)
                    }
                }, {});
            }
            Promise.all([
                _entity_1.BookingCartV1.remove({ _id: cartData._id }),
                exports.BookingV1.updateCalendarSchedule(dataToInsert, response === null || response === void 0 ? void 0 : response._id),
                _entity_1.FavouriteV1.updateOne({
                    "property._id": cartData.propertyData.propertyId
                }, { $set: { "property.isBooked": true } }),
                _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(cartData.hostId) }, { $pull: { deletedClient: mongoose_1.Types.ObjectId(cartData.userData.userId) } })
            ]);
            return response;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async userEmployeeBookSpace(cartData, headers, payload) {
        var _a, _b, _c, _d, _e;
        try {
            let deviceId = headers.devicedetails.deviceId;
            let dataToInsert = {
                cartId: cartData._id,
                cartInfo: cartData.cartInfo,
                bookingType: cartData.bookingType,
                deviceId: deviceId,
                quantity: cartData.quantity,
                fromDate: moment_1.default(cartData.fromDate).toISOString(),
                toDate: moment_1.default(cartData.toDate).toISOString(),
                occupancy: cartData.occupancy * cartData.quantity,
                userData: {
                    userId: cartData.userData.userId,
                    status: cartData.userData.status,
                    name: cartData.userData.name,
                    image: cartData.userData.image,
                    phoneNo: cartData.userData.phoneNo,
                    countryCode: cartData.userData.countryCode,
                    createdAt: cartData.userData.createdAt,
                    email: cartData.userData.email,
                    dob: cartData.userData.dob,
                    profileStatus: cartData.userData.profileStatus,
                    bio: cartData.userData.bio,
                },
                shareUrl: cartData.shareUrl,
                bookingId: _services_1.generateUniqueId('DSK'),
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
                hostId: cartData.hostId,
                totalSpaceCapacity: cartData.totalSpaceCapacity,
                bookingDuration: {
                    year: (_a = cartData.bookingDuration) === null || _a === void 0 ? void 0 : _a.year,
                    months: (_b = cartData.bookingDuration) === null || _b === void 0 ? void 0 : _b.months,
                    days: (_c = cartData.bookingDuration) === null || _c === void 0 ? void 0 : _c.days,
                    totalDays: (_d = cartData.bookingDuration) === null || _d === void 0 ? void 0 : _d.totalDays,
                    totalHours: (_e = cartData.bookingDuration) === null || _e === void 0 ? void 0 : _e.totalHours,
                },
                category: cartData.category,
                subCategory: cartData.subCategory,
                bookingMode: 0,
                floorDescription: cartData.floorDescription,
                floorNumber: cartData.floorNumber,
                partnerId: cartData.partnerId,
                isEmployee: cartData.isEmployee,
                floorLabel: cartData.floorLabel
            };
            let response = await new this.model(dataToInsert).save();
            if ((payload === null || payload === void 0 ? void 0 : payload.extended) === true) {
                await exports.BookingV1.updateOne({ _id: mongoose_1.Types.ObjectId(response === null || response === void 0 ? void 0 : response._id) }, {
                    $set: {
                        prolongedStatus: _common_1.ENUM.BOOKING.PROLONGED_STATUS.PENDING,
                        prolongBookingId: mongoose_1.Types.ObjectId(cartData.prolongBookingId)
                    }
                }, {});
            }
            Promise.all([
                _entity_1.BookingCartV1.remove({ _id: cartData._id }),
                exports.BookingV1.updateCalendarSchedule(dataToInsert, response === null || response === void 0 ? void 0 : response._id),
                _entity_1.FavouriteV1.updateOne({
                    "property._id": cartData.propertyData.propertyId
                }, { $set: { "property.isBooked": true } }),
                _entity_1.HostV1.updateOne({ _id: mongoose_1.Types.ObjectId(cartData.hostId) }, { $pull: { deletedClient: mongoose_1.Types.ObjectId(cartData.userData.userId) } })
            ]);
            return response;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            throw error;
        }
    }
    async fetchBookingDetails(bookingId) {
        try {
            let pipeline = [];
            let matchCondition = {};
            matchCondition['_id'] = mongoose_1.Types.ObjectId(bookingId);
            pipeline.push({ '$match': matchCondition }, {
                $project: {
                    quantity: 1,
                    _id: 1,
                    fromDate: 1,
                    toDate: 1,
                    deviceId: 1,
                    userId: 1,
                    propertyData: 1,
                    offerPrice: 1,
                    offerLabelType: 1,
                    bookingDuration: 1,
                    basePrice: 1,
                    taxes: 1,
                    totalPayable: 1,
                    categoryData: {
                        category: "$category",
                        subCategory: "$subCategory"
                    },
                    giftCardAmount: 1,
                    giftCardNo: 1,
                    isEmployee: 1,
                    bookingType: 1,
                    taxPercentage: 1,
                    cartInfo: 1
                },
            }, {
                "$lookup": {
                    "from": "properties",
                    "let": {
                        "propertyId": "$propertyData.propertyId",
                        taxPercentage: '$taxPercentage'
                    },
                    "pipeline": [
                        {
                            "$match": {
                                "$expr": {
                                    "$and": [
                                        { "$eq": ["$_id", "$$propertyId"] },
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                rating: 1,
                                taxPercentage: '$$taxPercentage'
                            }
                        }
                    ],
                    "as": "reviewDetail"
                }
            }, { $unwind: "$reviewDetail" });
            let response = await exports.BookingV1.basicAggregate(pipeline);
            return response;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error);
        }
    }
    async fetchPaymentPlanAndPrice(payload) {
        var _a, _b;
        try {
            let bookingDetail = await exports.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(payload.bookingId) }, {
                fromDate: 1,
                toDate: 1,
                spaceId: 1,
                pricing: 1,
                totalPayable: 1,
                quantity: 1,
                giftCardAmount: 1,
                monthlyPayable: 1,
                bookingDuration: 1,
                offerPrice: 1
            });
            const { endDate, startDate } = _services_1.formattedTime({ fromDate: bookingDetail.fromDate, toDate: bookingDetail.toDate });
            let calculatedPrice = await _services_1.calcPaymentPlan(endDate, startDate, bookingDetail.quantity, bookingDetail.pricing);
            delete calculatedPrice.dailyPricing;
            delete calculatedPrice.yearlyPricing;
            calculatedPrice['totalPayable'] = bookingDetail.totalPayable;
            if ((bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.giftCardAmount) > 0 && (bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.monthlyPayable)) {
                const tempMonthlyPricing = await _services_1.roundOffNumbers(calculatedPrice.totalPayable / ((_a = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.bookingDuration) === null || _a === void 0 ? void 0 : _a.months));
                let recurringDetail = await _entity_1.RecurringPayV1.findOne({ bookingId: mongoose_1.Types.ObjectId(bookingDetail._id) });
                bookingDetail['monthlyPayable'] = tempMonthlyPricing;
                if (!recurringDetail) {
                    await this.updateRecurringPayDetail(bookingDetail);
                }
                else {
                    calculatedPrice['monthlyPricing'] = ((bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.totalPayable) - (bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.giftCardAmount)) / ((_b = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.bookingDuration) === null || _b === void 0 ? void 0 : _b.months);
                }
                calculatedPrice['totalPayable'] = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.totalPayable;
                (bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.giftCardAmount) ? calculatedPrice['giftCardAmount'] = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.giftCardAmount : 0;
                (bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.offerPrice) ? calculatedPrice['offerPrice'] = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.offerPrice : calculatedPrice.offerPrice = 0;
            }
            else {
                if (bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.monthlyPayable) {
                    let recurringDetail = await _entity_1.RecurringPayV1.findOne({ bookingId: mongoose_1.Types.ObjectId(bookingDetail._id) });
                    if (!recurringDetail) {
                        await this.updateRecurringPayDetail(bookingDetail);
                    }
                }
                (bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.offerPrice) ? calculatedPrice.offerPrice = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.offerPrice : calculatedPrice.offerPrice = 0;
                calculatedPrice['monthlyPricing'] = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.monthlyPayable;
                calculatedPrice['totalPayable'] = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.totalPayable;
                (bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.giftCardAmount) ? calculatedPrice['giftCardAmount'] = bookingDetail === null || bookingDetail === void 0 ? void 0 : bookingDetail.giftCardAmount : 0;
            }
            calculatedPrice.monthlyPricing <= 0 ? delete calculatedPrice.monthlyPricing : "";
            return calculatedPrice;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async updateRecurringPayDetail(bookingDetail) {
        try {
            let month = bookingDetail.fromDate.getMonth();
            let recurringData = [];
            for (let date = moment_1.default(bookingDetail.fromDate); date.isBefore(moment_1.default(bookingDetail.toDate).subtract(30, 'days')); date.add(30, 'days')) {
                let recurringMonthlyData = {
                    month: month,
                    bookingId: bookingDetail._id,
                    fromDate: bookingDetail.fromDate,
                    toDate: bookingDetail.toDate,
                    paymentDate: date.format(),
                    paymentStatus: date.format() == moment_1.default(bookingDetail.fromDate).format() ?
                        _common_1.ENUM.PAYMENT.STATUS.SUCCESS :
                        _common_1.ENUM.PAYMENT.STATUS.PENDING,
                    paymentPlan: _common_1.ENUM.PAYMENT.PLAN.MONTHLY,
                    monthlyPayable: bookingDetail.monthlyPayable
                };
                recurringData.push(recurringMonthlyData);
                month++;
            }
            await _entity_1.RecurringPayV1.insertMany(recurringData);
        }
        catch (error) {
            console.error(`we have an error while inserting recurring detail ==> ${error}`);
        }
    }
    async fetchBookingSchedule(payload) {
        try {
            let pipeline = [];
            let matchCondition = {};
            let subCategoryArray = [];
            let categoryArray = [];
            pipeline.push({ $match: matchCondition }, {
                "$lookup": {
                    "from": "propertySpace",
                    "let": { "propertyId": "$propertyData.propertyId" },
                    "pipeline": [
                        {
                            '$match': {
                                $and: [
                                    { $expr: { $eq: ['$_id', '$$propertyId'] } }
                                ]
                            }
                        }
                    ],
                    "as": "categoryData"
                }
            });
            if (payload.categoryIds) {
                categoryArray = payload.categoryIds.split(",");
                for (let i = 0; i < categoryArray.length; i++) {
                    categoryArray[i] = mongoose_1.Types.ObjectId(categoryArray[i]);
                }
                pipeline.push({ 'categoryData.subCategory._id': { $in: subCategoryArray } });
            }
            if (payload.subCategoryIds) {
                subCategoryArray = payload.subCategoryIds.split(",");
                for (let i = 0; i < subCategoryArray.length; i++) {
                    subCategoryArray[i] = mongoose_1.Types.ObjectId(subCategoryArray[i]);
                }
                pipeline.push({ 'categoryData.subCategory._id': { $in: subCategoryArray } });
            }
            let response = await exports.BookingV1.basicAggregate(pipeline);
            return response;
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
            throw error;
        }
    }
    async updateCalendarSchedule(cartData, bookingId, toRemove) {
        try {
            if (toRemove == true)
                await _entity_1.CalendarV1.removeAll({ "bookingDetails.bookingId": bookingId });
            const fromDateLimit = _common_1.DATABASE.DATE_CONSTANTS.utcTimeDate(cartData.fromDate);
            const toDateLimit = _common_1.DATABASE.DATE_CONSTANTS.utcTimeDate(cartData.toDate);
            for (let days = moment_1.default(fromDateLimit); days <= moment_1.default(toDateLimit); days.add(1, 'days')) {
                let dateToInsert = days.toISOString();
                _entity_1.CalendarV1.updateOne({
                    date: dateToInsert,
                    hostId: cartData.hostId,
                    propertyId: cartData.propertyData.propertyId
                }, {
                    $push: {
                        "bookingDetails": {
                            subCategory: cartData.subCategory,
                            category: cartData.category,
                            bookingId: bookingId,
                            quantity: cartData.quantity,
                            bookingMode: cartData.bookingMode
                        }
                    },
                    $set: {
                        date: dateToInsert,
                        hostId: cartData.hostId,
                        propertyId: cartData.propertyData.propertyId,
                    }
                }, {
                    upsert: true
                });
            }
        }
        catch (error) {
            console.error(`we have an error while updating calendar data ==> ${error}`);
        }
    }
    async calendarFormatter(data, date) {
        try {
            const payloadMonth = moment_1.default(date).month();
            const filteredArray = data.filter((element) => element._id.monthNumber === payloadMonth);
            return filteredArray;
        }
        catch (error) {
            console.error(`we have an error in calendarFormatter => ${error}`);
            throw error;
        }
    }
    async getPayoutData() {
        try {
            let pipeline = [];
            pipeline.push({
                $match: {
                    $and: [
                        {
                            createdAt: { $gte: new Date((new Date().getTime() - (15 * 24 * 60 * 60 * 1000))) }
                        },
                        { paymentStatus: _common_1.ENUM.PAYMENT.STATUS.SUCCESS },
                        { bookingStatus: _common_1.ENUM.BOOKING.STATUS.ACCEPTED }
                    ]
                }
            }, {
                $project: {
                    _id: 1,
                    paymentStatus: 1,
                    bookingStatus: 1,
                    hostId: 1,
                    totalPayable: 1,
                    propertyData: 1
                }
            });
            const response = await exports.BookingV1.basicAggregate(pipeline);
            return response;
        }
        catch (error) {
            console.error(`we have an error => ${error}`);
            throw error;
        }
    }
    async getBookingCount(payload) {
        let pipeline = [];
        let matchCriteria = [];
        if (payload && payload.status) {
            matchCriteria.push({ 'bookingStatus': payload.status });
        }
        else {
            matchCriteria.push({ 'bookingStatus': { $eq: _common_1.ENUM.BOOKING.STATUS.ONGOING } });
        }
        if (payload.fromDate)
            matchCriteria.push({ createdAt: { $gte: new Date(payload.fromDate) } });
        if (payload.toDate)
            matchCriteria.push({ createdAt: { $lte: new Date(payload.toDate) } });
        pipeline.push({ $match: { $and: matchCriteria } });
        pipeline.push({ $group: { _id: null, count: { $sum: 1 } } }, { $project: { _id: 0 } });
        let details = await exports.BookingV1.basicAggregate(pipeline);
        details && details.length > 0 ? details = details[0] : details = { count: 0 };
        return details.count;
    }
    async getTotalBookingCount(payload) {
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
        let details = await exports.BookingV1.basicAggregate(pipeline);
        details && details.length > 0 ? details = details[0] : details = { count: 0 };
        return details.count;
    }
    async fetchTotalRevenue(payload) {
        try {
            let pipeline = [];
            let matchCriteria = [];
            const startOfMonth = moment_1.default().startOf('month').format('YYYY-MM-DD hh:mm');
            const endOfMonth = moment_1.default().endOf('month').format('YYYY-MM-DD hh:mm');
            if (!payload.fromDate && !payload.toDate) {
                matchCriteria.push({ createdAt: { $gte: new Date(startOfMonth) } });
                matchCriteria.push({ createdAt: { $lte: new Date(endOfMonth) } });
            }
            if (payload.fromDate)
                matchCriteria.push({ createdAt: { $gte: new Date(payload.fromDate) } });
            if (payload.toDate)
                matchCriteria.push({ createdAt: { $lte: new Date(payload.toDate) } });
            if (matchCriteria.length)
                pipeline.push({ $match: { $and: matchCriteria } });
            pipeline.push({
                '$match': {
                    $expr: {
                        $and: [
                            { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.CANCELLED] },
                            { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.ABANDONED] },
                            { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.REJECTED] },
                            { $ne: ['$bookingStatus', _common_1.ENUM.BOOKING.STATUS.PENDING] }
                        ]
                    }
                }
            }, {
                $group: {
                    _id: null,
                    totalPayment: { $sum: "$totalPayable" }
                }
            }, { $project: { _id: 0, count: 1, totalPayment: 1 } });
            let details = await exports.BookingV1.basicAggregate(pipeline);
            details && details.length > 0 ? details = details[0] : details = { count: 0 };
            return details;
        }
        catch (error) {
            console.error(`we have an error while calculating total revenue ==> ${error}`);
        }
    }
    async cancellationCriteria(bookingDetails, numberOfDays) {
        try {
            if (bookingDetails.bookingStatus === _common_1.ENUM.BOOKING.STATUS.ONGOING) {
                return _common_1.ENUM.BOOKING.POLICY.CASE1;
            }
            else if (bookingDetails.bookingStatus === _common_1.ENUM.BOOKING.STATUS.UPCOMING) {
                if (numberOfDays >= 14) {
                    return _common_1.ENUM.BOOKING.POLICY.CASE2;
                }
                else if (numberOfDays == 13.9) {
                    return _common_1.ENUM.BOOKING.POLICY.CASE3;
                }
                else if (numberOfDays <= 13) {
                    return _common_1.ENUM.BOOKING.POLICY.CASE6;
                }
                else {
                    return _common_1.ENUM.BOOKING.POLICY.CASE4;
                }
            }
            else if (bookingDetails.bookingStatus === _common_1.ENUM.BOOKING.STATUS.PENDING) {
                return _common_1.ENUM.BOOKING.POLICY.CASE2;
            }
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
}
exports.BookingV1 = new BookingEntity(booking_model_1.default);
//# sourceMappingURL=booking.v1.entity.js.map