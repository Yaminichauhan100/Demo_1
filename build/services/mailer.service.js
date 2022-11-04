"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mailer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sesTransport = require("nodemailer-ses-transport");
const common_1 = require("../common");
class MailerClass {
    constructor(senderName) {
        if (process.env.NODE_ENV === 'prod') {
            this.sender = `${senderName}<${common_1.CONFIG.SES_EMAIL}>`;
            this.transporter = nodemailer_1.default.createTransport(sesTransport({
                accessKeyId: common_1.CONFIG.SES.ACCESS_KEY,
                secretAccessKey: common_1.CONFIG.SES.SECRET_KEY,
                region: common_1.CONFIG.SES.REGION
            }));
        }
        else {
            this.sender = `${senderName}<${common_1.CONFIG.SYS_EMAIL}>`;
            this.transporter = nodemailer_1.default.createTransport({
                host: 'mail.appinventive.com',
                port: 587,
                secure: false,
                service: 'gmail',
                auth: {
                    user: common_1.CONFIG.SYS_EMAIL,
                    pass: common_1.CONFIG.SYS_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
        }
    }
    async sendMail(mailOptions) {
        try {
            if (!mailOptions.to)
                Promise.reject('Email reciever not provided in the mailer options');
            if (!mailOptions.subject)
                Promise.reject('Email subject not provided in the mailer options');
            if (!mailOptions.text && !mailOptions.html)
                Promise.reject('Email content not provided in the mailer options');
            mailOptions['from'] = this.sender;
            if (process.env.NODE_ENV !== '_development') {
                let emailSentResponse = await this.transporter.sendMail(mailOptions);
                if (emailSentResponse) {
                    console.log(`EMAIL [messageId: ${emailSentResponse.messageId}] TO [recieptens: ${emailSentResponse.envelope.to}]`);
                    return true;
                }
                else
                    return false;
            }
            else
                return true;
        }
        catch (error) {
            console.error(`we have an error in sendMail utility ==> ${error}`);
        }
    }
}
exports.Mailer = new MailerClass('Desk Now Support');
//# sourceMappingURL=mailer.service.js.map