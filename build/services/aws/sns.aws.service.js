"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnsService = void 0;
const aws_sdk_1 = require("aws-sdk");
const _common_1 = require("@common");
class SnsServiceClass {
    constructor() {
        this.sns = new aws_sdk_1.SNS({
            accessKeyId: _common_1.CONFIG.SNS.ACCESS_KEY,
            secretAccessKey: _common_1.CONFIG.SNS.SECRET_KEY,
            region: _common_1.CONFIG.SNS.REGION
        });
    }
    async sendSms(phone, OTP) {
        console.log("send sms method call =========>", phone, OTP);
        this.sns.publish({
            Message: `Your OTP for Desk Now sign-up is ${OTP}`,
            Subject: "Desk Now Sign Up",
            PhoneNumber: phone
        }, (err, data) => {
            if (err)
                console.log("error", err);
            console.log("data ===> ", data);
        });
    }
}
exports.SnsService = new SnsServiceClass();
//# sourceMappingURL=sns.aws.service.js.map