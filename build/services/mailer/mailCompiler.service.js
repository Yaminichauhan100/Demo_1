"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const _common_1 = require("@common");
const _entity_1 = require("@entity");
const _services_1 = require("@services");
class mailerServiceClass {
    constructor() {
    }
    async fetchNotificationValue(email) {
        try {
            const userEmailAuth = await _entity_1.UserV1.findOne({ email: email }, { mailNotificationEnabled: 1 });
            if ((userEmailAuth === null || userEmailAuth === void 0 ? void 0 : userEmailAuth.mailNotificationEnabled) === 1) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
            return;
        }
    }
    async fetchHostNotificationValue(email) {
        try {
            const userEmailAuth = await _entity_1.HostV1.findOne({ email: email }, { mailNotificationEnabled: 1 });
            if ((userEmailAuth === null || userEmailAuth === void 0 ? void 0 : userEmailAuth.mailNotificationEnabled) === 1) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
            return;
        }
    }
    async sendInvoiceMail(html, bookingId, email) {
        try {
            let mailNotificationAllowed = await this.fetchNotificationValue(email);
            if (mailNotificationAllowed === true) {
                _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.INVOICE_EMAIL(`${email}`, html));
            }
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendHostInvoiceMail(html, bookingId, email, propertyName) {
        try {
            let mailNotificationAllowed = await this.fetchHostNotificationValue(email);
            if (mailNotificationAllowed === true) {
                _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.AD_INVOICE_EMAIL(`${email}`, html, propertyName));
            }
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendHostDemoInvite(html, userEmail, userName, propertyName) {
        try {
            _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.DEMO(`${userEmail}`, html, userName, propertyName));
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendUserPbStatus(html, userEmail) {
        try {
            _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.PB(`${userEmail}`, html));
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendUserPbStatusUnsuccessfull(html, userEmail) {
        try {
            _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.PB_UNSUCCESS(`${userEmail}`, html));
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendUserDemoInvite(html, userEmail, propertyName) {
        try {
            _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.USER_DEMO(`${userEmail}`, html, propertyName));
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendHostUpdateDemoInvite(html, userEmail, status) {
        try {
            _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.HOST_DEMO_STATUS(`${userEmail}`, html, status));
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendUserUpdateDemoInvite(html, userEmail, status) {
        try {
            _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.DEMO_STATUS(`${userEmail}`, html, status));
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendCoworkerInvite(html, userEmail, userName, propertyName) {
        try {
            _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.NEW_COWORKER_EMAIL(`${userEmail}`, html, userName, propertyName));
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendContactUs(html, userEmail, adminEmail) {
        try {
            _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.NEW_COUNTACTUS_MAIL(`${userEmail}`, html, adminEmail));
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendBookingCancellationEmailToHost(html, bookingId, hostEmail, userName, status) {
        try {
            let mailNotificationAllowed = await this.fetchHostNotificationValue(hostEmail);
            if (mailNotificationAllowed === true) {
                _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.HOST_BOOKING_STATUS(`${hostEmail}`, html, userName, status));
            }
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendBookingCancellationEmailByHost(html, bookingId, hostEmail, userName, status) {
        try {
            let mailNotificationAllowed = await this.fetchHostNotificationValue(hostEmail);
            if (mailNotificationAllowed === true) {
                _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.HOST_BOOKING_CANCELLED_STATUS(`${hostEmail}`, html, userName, status));
            }
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendBookingAcceptedEmailToHost(html, bookingId, hostEmail, userName, status) {
        try {
            let mailNotificationAllowed = await this.fetchHostNotificationValue(hostEmail);
            if (mailNotificationAllowed === true) {
                _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.HOST_BOOKING_STATUS(`${hostEmail}`, html, userName, status));
            }
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendBookingRejectedEmailToHost(html, bookingId, hostEmail) {
        try {
            let mailNotificationAllowed = await this.fetchHostNotificationValue(hostEmail);
            if (mailNotificationAllowed === true) {
                _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.BOOKING_REJECTED(`${hostEmail}`, html));
            }
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendBookingRejectedEmailToUser(html, bookingId, userEmail) {
        try {
            let mailNotificationAllowed = await this.fetchNotificationValue(userEmail);
            if (mailNotificationAllowed === true) {
                _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.BOOKING_REJECTED(`${userEmail}`, html));
            }
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendBookingAcceptedEmailToUser(html, bookingId, userEmail, hostName, status) {
        try {
            let mailNotificationAllowed = await this.fetchNotificationValue(userEmail);
            if (mailNotificationAllowed === true) {
                _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.USER_BOOKING_STATUS(`${userEmail}`, html, hostName, status));
            }
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendBookingCancellationEmailToUser(html, bookingId, userEmail, hostName, status) {
        try {
            let mailNotificationAllowed = await this.fetchNotificationValue(userEmail);
            if (mailNotificationAllowed === true) {
                _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.USER_BOOKING_STATUS(`${userEmail}`, html, hostName, status));
            }
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendBookingCancellationEmailByUser(html, bookingId, userEmail, hostName, status) {
        try {
            let mailNotificationAllowed = await this.fetchNotificationValue(userEmail);
            if (mailNotificationAllowed === true) {
                _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.USER_BOOKING_CANCELLED_STATUS(`${userEmail}`, html, hostName, status));
            }
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendGiftCard(html, userEmail, amount, userName) {
        try {
            _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.NEW_GIFT_CARD_EMAIL(`${userEmail}`, html, amount, userName));
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
    async sendClaimRequestSuccessEmail(html, hostEmail, hostName, status) {
        try {
            let mailNotificationAllowed = await this.fetchHostNotificationValue(hostEmail);
            if (mailNotificationAllowed === true) {
                _services_1.Mailer.sendMail(_common_1.FORMAT.EMAIL.USER.HOST_PROPERTY_CLAIM_STATUS(`${hostEmail}`, html, hostName, status));
            }
        }
        catch (error) {
            console.error(`we have an error while sending email ==> ${error}`);
        }
    }
}
exports.emailService = new mailerServiceClass();
//# sourceMappingURL=mailCompiler.service.js.map