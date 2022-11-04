"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratePdf = void 0;
const puppeteer_1 = require("puppeteer");
const _entity_1 = require("@entity");
const mongoose_1 = require("mongoose");
const htmlHelper_1 = require("../../htmlHelper");
const _common_1 = require("@common");
const _services_1 = require("@services");
const moment_1 = __importDefault(require("moment"));
const util_1 = require("./util");
class GeneratePdfClass {
    constructor() { }
    async generateHtml(bookingId) {
        try {
            let bookingDetails = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(bookingId) });
            let userData = await _entity_1.UserV1.findOne({ _id: mongoose_1.Types.ObjectId(bookingDetails.userData.userId) });
            let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/invoice/invoice.pdf.html", {
                desknowLogo: _common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                mockpur: _common_1.CONSTANT.MOCKUPER_6,
                appStore: _common_1.CONSTANT.APP_STORE_BADGE,
                googlePlay: _common_1.CONSTANT.GOOGLE_PLAY_BADGE,
                igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                bookingDay: moment_1.default(bookingDetails.createdAt).format('MMM DD,YYYY'),
                transactionId: bookingDetails.transactionId,
                seekerName: bookingDetails.userData.name,
                seekerAddress: userData.address,
                propertyName: `${bookingDetails.propertyData.name}`,
                propertyAddress: `${bookingDetails.propertyData.address}`,
                seekerContactNumber: `${bookingDetails.userData.countryCode} ${bookingDetails.userData.phoneNo}`,
                seekerEmail: `${bookingDetails.userData.email}`,
                fromDate: moment_1.default(bookingDetails.fromDate).format('MMM DD,YYYY'),
                toDate: moment_1.default(bookingDetails.toDate).format('MMM DD,YYYY'),
                bookingId: bookingDetails.bookingId,
                categoryName: bookingDetails.category.name,
                subCategoryName: bookingDetails.subCategory.name,
                quantity: bookingDetails.quantity,
                basePrice: util_1.formatPrice(bookingDetails.basePrice),
                pricePerUnit: util_1.formatPrice(bookingDetails.basePrice / bookingDetails.quantity),
                offerPrice: util_1.formatPrice(bookingDetails.offerPrice),
                priceBeforeTaxes: util_1.formatPrice(bookingDetails.basePrice),
                taxes: util_1.formatPrice(bookingDetails.taxes),
                taxPercentage: bookingDetails.taxPercentage,
                totalPayable: util_1.formatPrice(bookingDetails.totalPayable),
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD,
            });
            bookingDetails.userAddress = userData.address;
            return { html: html, bookingId: bookingDetails.bookingId, bookingDetails: bookingDetails };
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async generateHostHtml(bookingId) {
        try {
            let bookingDetails = await _entity_1.BookingV1.findOne({ _id: mongoose_1.Types.ObjectId(bookingId) });
            let userData = await _entity_1.UserV1.findOne({ _id: mongoose_1.Types.ObjectId(bookingDetails.userData.userId) });
            let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/invoice/invoice.host.pdf.html", {
                desknowLogo: _common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                mockpur: _common_1.CONSTANT.MOCKUPER_6,
                appStore: _common_1.CONSTANT.APP_STORE_BADGE,
                googlePlay: _common_1.CONSTANT.GOOGLE_PLAY_BADGE,
                igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                bookingDay: moment_1.default(bookingDetails.createdAt).format('MMM DD,YYYY'),
                transactionId: bookingDetails.transactionId,
                seekerName: bookingDetails.userData.name,
                seekerAddress: userData.address,
                propertyName: `${bookingDetails.propertyData.name}`,
                propertyAddress: `${bookingDetails.propertyData.address}`,
                seekerContactNumber: `${bookingDetails.userData.countryCode} ${bookingDetails.userData.phoneNo}`,
                seekerEmail: `${bookingDetails.userData.email}`,
                fromDate: moment_1.default(bookingDetails.fromDate).format('MMM DD,YYYY'),
                toDate: moment_1.default(bookingDetails.toDate).format('MMM DD,YYYY'),
                bookingId: bookingDetails.bookingId,
                categoryName: bookingDetails.category.name,
                subCategoryName: bookingDetails.subCategory.name,
                quantity: bookingDetails.quantity,
                basePrice: util_1.formatPrice(bookingDetails.basePrice),
                pricePerUnit: util_1.formatPrice(bookingDetails.basePrice / bookingDetails.quantity),
                offerPrice: util_1.formatPrice(bookingDetails.offerPrice),
                priceBeforeTaxes: util_1.formatPrice(bookingDetails.basePrice),
                taxes: util_1.formatPrice(bookingDetails.taxes),
                taxPercentage: bookingDetails.taxPercentage,
                totalPayable: util_1.formatPrice(bookingDetails.totalPayable),
                adminCommission: bookingDetails.adminCommission ? util_1.formatPrice(bookingDetails.adminCommission) : "N/A",
                webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD,
            });
            bookingDetails.userAddress = userData.address;
            return { html: html, bookingId: bookingDetails.bookingId, bookingDetails: bookingDetails };
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async generateAdvHtml(promotionId) {
        var _a, _b;
        try {
            let promotionDetails = await _entity_1.PromotionV1.findOne({ _id: mongoose_1.Types.ObjectId(promotionId) });
            let findHostEmail = await _entity_1.HostV1.findOne({ _id: mongoose_1.Types.ObjectId(promotionDetails.hostId) }, { email: 1, name: 1, address: 1 });
            promotionDetails.hostEmail = findHostEmail.email;
            promotionDetails.hostName = findHostEmail.name;
            promotionDetails.hostAddress = findHostEmail.address ? findHostEmail.address : "";
            const duration = await _common_1.checkDuration(promotionDetails.duration);
            const listingPlacement = await _common_1.checkListing(promotionDetails.listingType);
            const slotType = await _common_1.checkSlot(promotionDetails.slotType, promotionDetails.listingType);
            let html = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/promotionInvoice/invoice.pdf.html", {
                desknowLogo: _common_1.CONSTANT.PAM_LOGO,
                facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                mockpur: _common_1.CONSTANT.MOCKUPER_6,
                appStore: _common_1.CONSTANT.APP_STORE_BADGE,
                googlePlay: _common_1.CONSTANT.GOOGLE_PLAY_BADGE,
                igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                bookingDay: moment_1.default(promotionDetails.createdAt).format('MMM DD,YYYY'),
                transactionId: promotionDetails.transactionDetail.transactionId,
                seekerAddress: promotionDetails.hostAddress,
                seekerName: promotionDetails.hostName,
                propertyName: `${promotionDetails.propertyName}`,
                propertyAddress: `${promotionDetails.propertyAddress}`,
                fromDate: moment_1.default(promotionDetails.fromDate).format('MMM DD,YYYY'),
                toDate: moment_1.default(promotionDetails.toDate).format('MMM DD,YYYY'),
                promotionId: promotionDetails.promotionId,
                categoryName: (_a = promotionDetails === null || promotionDetails === void 0 ? void 0 : promotionDetails.category) === null || _a === void 0 ? void 0 : _a.name,
                subCategory: (_b = promotionDetails === null || promotionDetails === void 0 ? void 0 : promotionDetails.subCategory) === null || _b === void 0 ? void 0 : _b.name,
                duration: duration,
                slotType: slotType,
                listingPlacement: listingPlacement,
                basePrice: util_1.formatPrice(promotionDetails.transactionDetail.price),
                taxPercentage: promotionDetails.transactionDetail.taxPercentage,
                totalPrice: util_1.formatPrice(promotionDetails.transactionDetail.totalPrice),
                taxes: util_1.formatPrice(promotionDetails.transactionDetail.tax),
                dailyPrice: util_1.formatPrice(promotionDetails.transactionDetail.dailyPrice)
            });
            return { html: html, promotionId: promotionDetails._id, promotionDetails: promotionDetails };
        }
        catch (error) {
            console.error(`we have an error ==> ${error}`);
        }
    }
    async invoice(bookingId) {
        var _a, _b;
        try {
            const template = await this.generateHtml(bookingId);
            const hostTemplate = await this.generateHostHtml(bookingId);
            const browser = await puppeteer_1.launch({ headless: true });
            const page = await browser.newPage();
            await page.setContent(template.html);
            await page.emulateMediaType('screen');
            await page.pdf({
                path: `${process.cwd()}/public/invoices/${template.bookingId}.pdf`,
                format: 'A4',
                printBackground: true
            });
            await browser.close();
            let s3Object = await _services_1.S3Invoice.upload(`Invoice_${template.bookingId}`, `${process.cwd()}/public/invoices/${template.bookingId}.pdf`);
            const s3HostObject = await this.createHostInvoice(hostTemplate);
            if (s3Object === null || s3Object === void 0 ? void 0 : s3Object.Location) {
                let invoiceHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/invoice/invoice.html", {
                    desknowLogo: _common_1.CONSTANT.VERIFY_EMAIL_LOGO,
                    facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                    twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                    linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                    mockpur: _common_1.CONSTANT.MOCKUPER_6,
                    appStore: _common_1.CONSTANT.APP_STORE_BADGE,
                    googlePlay: _common_1.CONSTANT.GOOGLE_PLAY_BADGE,
                    igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                    bookingDay: moment_1.default(template.bookingDetails.createdAt).format('MMM DD,YYYY'),
                    transactionId: template.bookingDetails.transactionId,
                    seekerName: template.bookingDetails.userData.name,
                    seekerAddress: template.bookingDetails.userAddress,
                    propertyName: `${template.bookingDetails.propertyData.name}`,
                    propertyAddress: `${template.bookingDetails.propertyData.address}`,
                    seekerContactNumber: `${template.bookingDetails.userData.countryCode} ${template.bookingDetails.userData.phoneNo}`,
                    seekerEmail: `${template.bookingDetails.userData.email}`,
                    fromDate: moment_1.default(template.bookingDetails.fromDate).format('MMM DD,YYYY'),
                    toDate: moment_1.default(template.bookingDetails.toDate).format('MMM DD,YYYY'),
                    bookingId: template.bookingDetails.bookingId,
                    categoryName: template.bookingDetails.category.name,
                    subCategoryName: template.bookingDetails.subCategory.name,
                    quantity: template.bookingDetails.quantity,
                    basePrice: util_1.formatPrice(template.bookingDetails.basePrice),
                    pricePerUnit: util_1.formatPrice(template.bookingDetails.basePrice / template.bookingDetails.quantity),
                    offerPrice: util_1.formatPrice(template.bookingDetails.offerPrice),
                    priceBeforeTaxes: util_1.formatPrice(template.bookingDetails.basePrice),
                    taxes: util_1.formatPrice(template.bookingDetails.taxes),
                    taxPercentage: template.bookingDetails.taxPercentage,
                    totalPayable: util_1.formatPrice(template.bookingDetails.totalPayable),
                    invoiceUrl: s3Object === null || s3Object === void 0 ? void 0 : s3Object.Location,
                    webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.USER_PANEL_STAGING : _common_1.WEB_PANELS.USER_PANEL_PROD,
                    contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_STAGING : _common_1.WEB_PANELS.CONTACT_US_PROD,
                    FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_STAGING : _common_1.WEB_PANELS.FAQ_PROD,
                    appStoreLink: _common_1.STORE_URL.APPSTORE_USER,
                    playStoreLink: _common_1.STORE_URL.PLAYSOTE_USER
                });
                await Promise.all([
                    _services_1.emailService.sendInvoiceMail(invoiceHtml, (_a = template === null || template === void 0 ? void 0 : template.bookingDetails) === null || _a === void 0 ? void 0 : _a._id, (_b = template.bookingDetails) === null || _b === void 0 ? void 0 : _b.userData.email),
                    _entity_1.BookingV1.updateDocument({ _id: mongoose_1.Types.ObjectId(bookingId) }, {
                        invoiceUrl: s3Object === null || s3Object === void 0 ? void 0 : s3Object.Location, hostInvoice: s3HostObject === null || s3HostObject === void 0 ? void 0 : s3HostObject.Location
                    })
                ]);
            }
        }
        catch (error) {
            console.error(`we have an error while generating invoice pdf ===> ${error}`);
        }
    }
    async createHostInvoice(hostTemplate) {
        try {
            const browser = await puppeteer_1.launch({ headless: true });
            const page = await browser.newPage();
            await page.setContent(hostTemplate.html);
            await page.emulateMediaType('screen');
            await page.pdf({
                path: `${process.cwd()}/public/invoices/${hostTemplate.bookingId}_${2}.pdf`,
                format: 'A4',
                printBackground: true
            });
            await browser.close();
            let s3HostObject = await _services_1.S3Invoice.upload(`Invoice_${hostTemplate.bookingId}_${2}`, `${process.cwd()}/public/invoices/${hostTemplate.bookingId}_${2}.pdf`);
            console.log("===>>>>>>>>>>>>s3HostObject ", s3HostObject);
            return s3HostObject;
        }
        catch (error) {
            console.error(`we have an error in crateHostInvoice ==> ${error}`);
        }
    }
    async advInvoice(promotionId) {
        var _a, _b, _c, _d, _e, _f;
        try {
            const template = await this.generateAdvHtml(promotionId);
            const browser = await puppeteer_1.launch({ headless: true });
            const page = await browser.newPage();
            const duration = await _common_1.checkDuration(template.promotionDetails.duration);
            const listingPlacement = await _common_1.checkListing(template.promotionDetails.listingType);
            const slotType = await _common_1.checkSlot(template.promotionDetails.slotType, template.promotionDetails.listingType);
            await page.setContent(template.html);
            await page.emulateMediaType('screen');
            await page.pdf({
                path: `${process.cwd()}/public/invoices/${template.promotionDetails.transactionDetail.transactionId}.pdf`,
                format: 'A4',
                printBackground: true
            });
            await browser.close();
            let s3Object = await _services_1.S3Invoice.upload(`Invoice_${template.promotionDetails.transactionDetail.transactionId}`, `${process.cwd()}/public/invoices/${template.promotionDetails.transactionDetail.transactionId}.pdf`);
            if (s3Object === null || s3Object === void 0 ? void 0 : s3Object.Location) {
                let invoiceHtml = await htmlHelper_1.TEMPLATER.makeHtmlTemplate(process.cwd() + "/src/views/promotionInvoice/invoice.html", {
                    desknowLogo: _common_1.CONSTANT.PAM_LOGO,
                    facebookLogo: _common_1.CONSTANT.FACEBOOK_LOGO_PNG,
                    twitterLogo: _common_1.CONSTANT.TWITTER_LOGO_NEW,
                    linkedinLogo: _common_1.CONSTANT.LINKEDIN_LOGO,
                    mockpur: _common_1.CONSTANT.MOCKUPER_6,
                    appStore: _common_1.CONSTANT.APP_STORE_BADGE,
                    googlePlay: _common_1.CONSTANT.GOOGLE_PLAY_BADGE,
                    igLogo: _common_1.CONSTANT.INSTAGRAM_LOGO,
                    bookingDay: moment_1.default(template.promotionDetails.createdAt).format('MMM DD,YYYY'),
                    transactionId: template.promotionDetails.transactionDetail.transactionId,
                    propertyName: `${template.promotionDetails.propertyName}`,
                    propertyAddress: `${template.promotionDetails.propertyAddress}`,
                    fromDate: moment_1.default(template.promotionDetails.fromDate).format('MMM DD,YYYY'),
                    toDate: moment_1.default(template.promotionDetails.toDate).format('MMM DD,YYYY'),
                    promotionId: template.promotionDetails.promotionId,
                    categoryName: (_b = (_a = template.promotionDetails) === null || _a === void 0 ? void 0 : _a.category) === null || _b === void 0 ? void 0 : _b.name,
                    subCategory: (_d = (_c = template.promotionDetails) === null || _c === void 0 ? void 0 : _c.subCategory) === null || _d === void 0 ? void 0 : _d.name,
                    seekerAddress: template.promotionDetails.hostAddress,
                    seekerName: template.promotionDetails.hostName,
                    duration: duration,
                    slotType: slotType,
                    invoiceUrl: s3Object === null || s3Object === void 0 ? void 0 : s3Object.Location,
                    listingPlacement: listingPlacement,
                    basePrice: util_1.formatPrice(template.promotionDetails.transactionDetail.price),
                    taxPercentage: template.promotionDetails.transactionDetail.taxPercentage,
                    totalPrice: util_1.formatPrice(template.promotionDetails.transactionDetail.totalPrice),
                    taxes: util_1.formatPrice(template.promotionDetails.transactionDetail.tax),
                    dailyPrice: util_1.formatPrice(template.promotionDetails.transactionDetail.dailyPrice),
                    webPanelUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.HOST_PANEL_STAGING : _common_1.WEB_PANELS.HOST_PANEL_PROD,
                    contactUsUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.CONTACT_US_HOST_STAGING : _common_1.WEB_PANELS.CONTACT_US_PAM_PROD,
                    FAQUrl: _common_1.CONFIG.NODE_ENV === 'stag' ? _common_1.WEB_PANELS.FAQ_HOST_STAGING : _common_1.WEB_PANELS.FAQ_PAM_PROD,
                    appStoreLink: _common_1.STORE_URL.APPSTORE_HOST,
                    playStoreLink: _common_1.STORE_URL.PLAYSTORE_HOST
                });
                await Promise.all([
                    _services_1.emailService.sendHostInvoiceMail(invoiceHtml, (_e = template === null || template === void 0 ? void 0 : template.promotionDetails) === null || _e === void 0 ? void 0 : _e._id, (_f = template.promotionDetails) === null || _f === void 0 ? void 0 : _f.hostEmail, template.promotionDetails.propertyName),
                    _entity_1.PromotionV1.updateDocument({ _id: mongoose_1.Types.ObjectId(promotionId) }, { invoiceUrl: s3Object === null || s3Object === void 0 ? void 0 : s3Object.Location })
                ]);
            }
        }
        catch (error) {
            console.error(`we have an error while generating invoice pdf ===> ${error}`);
        }
    }
}
exports.GeneratePdf = new GeneratePdfClass();
//# sourceMappingURL=generatePdf.js.map