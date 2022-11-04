"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FORMAT = void 0;
const config_common_1 = require("./config.common");
const EMAIL = {
    ADMIN: {
        PASSWORD_CHANGE: (reciever) => ({
            to: reciever,
            subject: 'Password Change Successful',
            text: 'You have successfully changed your password.'
        }),
        FORGOT_PASSWORD: (reciever, payload) => ({
            to: reciever,
            subject: 'Forgot Password',
            html: `Hello, <br/><br/>Please click on this link to reset your password: <a href="${config_common_1.BASE.ADMIN}/account/reset-password/${payload.metaToken.value}">here</a>`
        }),
        FORGOT_PASSWORD_NEW: (reciever, html) => ({
            to: reciever,
            subject: 'Forgot Password',
            html: html
        }),
        RESET_PASSWORD: (reciever) => ({
            to: reciever,
            subject: 'Password Reset Successful',
            text: `You have successfully resetted your password.`
        }),
        USER_CREDENTIALS: (reciever, password) => ({
            to: reciever,
            subject: 'Password Reset Successful',
            html: `Hello, <br/><br/>You have been onboarded to Desk Now.<br/><br/>
            Your Credentials are<br/><br/></b>Email:${reciever}<br/><br/>Password:${password}`
        }),
    },
    USER: {
        FORGOT_PASSWORD: (reciever, html) => ({
            to: reciever,
            subject: 'Forgot Password',
            html: html
        }),
        SIGNUP_OTP: (reciever, payload) => ({
            to: reciever,
            subject: 'User SignUp',
            html: `Hello, <br/><br/>Your one time passcode is: ${payload.otp}`
        }),
        NEW_SIGNUP_OTP: (reciever, html) => ({
            to: reciever,
            subject: 'User SignUp',
            html: html
        }),
        NEW_SIGNUP_EMAIL: (reciever, html) => ({
            to: reciever,
            subject: 'Welcome to DeskNow',
            html: html
        }),
        EMPLOYEE_SHEET_EMAIL: (reciever, html, attachments) => ({
            to: reciever,
            subject: 'Employee Upload Status',
            html: html,
            attachments: attachments
        }),
        ADMIN_SHEET_EMAIL: (reciever, html, attachments) => ({
            to: reciever,
            subject: 'Property Sheet Upload Status',
            html: html,
            attachments: attachments
        }),
        USER_OTP: (reciever, html) => ({
            to: reciever,
            subject: 'Otp',
            html: html
        }),
        NEW_HOST_SIGNUP_EMAIL: (reciever, html) => ({
            to: reciever,
            subject: 'Welcome to Pam',
            html: html
        }),
        CLAIM_PROPETY_REQUEST: (reciever, html) => ({
            to: reciever,
            subject: 'Thank you for claiming the listing',
            html: html
        }),
        NEW_GIFT_CARD_EMAIL: (reciever, html, amount, userName) => ({
            to: reciever,
            subject: `You received a ${amount} gift card from ${userName}`,
            html: html
        }),
        INVOICE_EMAIL: (reciever, html) => ({
            to: reciever,
            subject: 'INVOICE',
            html: html
        }),
        AD_INVOICE_EMAIL: (reciever, html, propertyName) => ({
            to: reciever,
            subject: `Your Invoice for your promotion at ${propertyName}`,
            html: html
        }),
        BOOKING_EMAIL: (reciever, html) => ({
            to: reciever,
            subject: 'BOOKING',
            html: html
        }),
        BOOKING_EMAIL_CONFIRMATION_HOST: (reciever, html, propertyName) => ({
            to: reciever,
            subject: `New Booking received at ${propertyName}`,
            html: html
        }),
        BOOKING_EMAIL_CONFIRMATION_USER: (reciever, html, propertyName, status) => ({
            to: reciever,
            subject: `Your booking at ${propertyName} is  ${status}`,
            html: html
        }),
        BOOKING_EMAIL_PENDING_USER: (reciever, html, propertyName) => ({
            to: reciever,
            subject: `Your booking at ${propertyName} is  pending`,
            html: html
        }),
        DEMO: (reciever, html, userName, propertyName) => ({
            to: reciever,
            subject: `${userName} has requested a demo at ${propertyName}`,
            html: html
        }),
        DEMO_STATUS: (reciever, html, status) => ({
            to: reciever,
            subject: `Your demo has been ${status}`,
            html: html
        }),
        HOST_DEMO_STATUS: (reciever, html, status) => ({
            to: reciever,
            subject: `You have ${status} the demo`,
            html: html
        }),
        USER_DEMO: (reciever, html, propertyName) => ({
            to: reciever,
            subject: `Your Demo at ${propertyName}`,
            html: html
        }),
        PB: (reciever, html) => ({
            to: reciever,
            subject: 'Your profile was successfully verified.',
            html: html
        }),
        PB_UNSUCCESS: (reciever, html) => ({
            to: reciever,
            subject: 'Account not verified, please try again',
            html: html
        }),
        NEW_COHOST_EMAIL: (reciever, html, hostName) => ({
            to: reciever,
            subject: `Pending invitation as a co-host by ${hostName}`,
            html: html
        }),
        NEW_COWORKER_EMAIL: (reciever, html, userName, propertyName) => ({
            to: reciever,
            subject: `${userName} has invited you to work together at ${propertyName}`,
            html: html
        }),
        NEW_COUNTACTUS_MAIL: (reciever, html, adminEmail) => ({
            to: reciever,
            subject: 'Thank you for reaching out to us',
            bcc: adminEmail,
            html: html
        }),
        NEW_GIFTCARD_EMAIL: (reciever, html) => ({
            to: reciever,
            subject: 'Coworker Invited',
            html: html
        }),
        BOOKING_CANCELLED: (reciever, html) => ({
            to: reciever,
            subject: 'Booking Cancelled!',
            html: html
        }),
        USER_BOOKING_STATUS: (reciever, html, hostName, status) => ({
            to: reciever,
            subject: `${hostName} has ${status} your booking`,
            html: html
        }),
        USER_BOOKING_CANCELLED_STATUS: (reciever, html, hostName, status) => ({
            to: reciever,
            subject: `You have ${status} the booking`,
            html: html
        }),
        HOST_PROPERTY_CLAIM_STATUS: (reciever, html, hostName, status) => ({
            to: reciever,
            subject: `Your property claim request is ${status}`,
            html: html
        }),
        HOST_BOOKING_STATUS: (reciever, html, userName, status) => ({
            to: reciever,
            subject: `${userName} has ${status} his booking`,
            html: html
        }),
        HOST_BOOKING_CANCELLED_STATUS: (reciever, html, userName, status) => ({
            to: reciever,
            subject: `You have ${status} the booking`,
            html: html
        }),
        BOOKING_ACCEPTED: (reciever, html) => ({
            to: reciever,
            subject: 'Booking Accepted',
            html: html
        }),
        BOOKING_REJECTED: (reciever, html) => ({
            to: reciever,
            subject: 'Booking Rejected',
            html: html
        })
    }
};
exports.FORMAT = {
    EMAIL
};
//# sourceMappingURL=format.common.js.map