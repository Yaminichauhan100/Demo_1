"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Invoice = void 0;
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const fs_1 = require("fs");
const _common_1 = require("@common");
class S3ServiceClass {
    constructor(basePath) {
        this.bucket = 'desk-now-live';
        this.basePath = basePath;
        this.s3 = new s3_1.default({
            accessKeyId: _common_1.CONFIG.S3.ACCESS_KEY,
            secretAccessKey: _common_1.CONFIG.S3.SECRET_KEY
        });
    }
    async upload(name, data) {
        try {
            const localFilePath = data;
            let readStream = fs_1.createReadStream(data);
            const params = {
                Key: `${this.basePath}${name}.pdf`,
                Body: readStream,
                Bucket: this.bucket,
                ACL: 'public-read'
            };
            return new Promise((resolve, reject) => {
                this.s3.upload(params, (err, data) => {
                    readStream.destroy();
                    if (err) {
                        console.error(`Error while readStream==>`, err);
                        return reject(err);
                    }
                    fs_1.unlink(localFilePath, (err) => {
                        if (err) {
                            console.error(`file deletion failed!!`);
                        }
                        console.info(`file deleted`);
                    });
                    return resolve(data);
                });
            });
        }
        catch (error) {
            console.error(`we have an error while uploading doc to s3,${error}`);
        }
    }
    async uploadImage(name, data) {
        try {
            const localFilePath = data;
            let readStream = fs_1.createReadStream(data);
            const params = {
                Key: `${this.basePath}${name}`,
                Body: readStream,
                Bucket: this.bucket,
                ACL: 'public-read'
            };
            return new Promise((resolve, reject) => {
                this.s3.upload(params, (err, data) => {
                    readStream.destroy();
                    if (err) {
                        console.error(`Error while readStream==>`, err);
                        return reject(err);
                    }
                    fs_1.unlink(localFilePath, (err) => {
                        if (err) {
                            console.error(`file deletion failed!!`);
                        }
                        console.info(`file deleted`);
                    });
                    return resolve(data);
                });
            });
        }
        catch (error) {
            console.error(`we have an error while uploading doc to s3,${error}`);
        }
    }
    async uploadVideo(name, data) {
        try {
            const localFilePath = data;
            let readStream = fs_1.createReadStream(data);
            const params = {
                Key: `${this.basePath}${name}`,
                Body: readStream,
                Bucket: this.bucket,
                ACL: 'public-read'
            };
            return new Promise((resolve, reject) => {
                this.s3.upload(params, (err, data) => {
                    readStream.destroy();
                    if (err) {
                        console.error(`Error while readStream==>`, err);
                        return reject(err);
                    }
                    fs_1.unlink(localFilePath, (err) => {
                        if (err) {
                            console.error(`file deletion failed!!`);
                        }
                        console.info(`file deleted`);
                    });
                    return resolve(data);
                });
            });
        }
        catch (error) {
            console.error(`we have an error while uploading doc to s3,${error}`);
        }
    }
    async uploadExcel(name, data) {
        try {
            const localFilePath = data;
            let readStream = fs_1.createReadStream(data);
            const params = {
                Key: `${this.basePath}${name}`,
                Body: readStream,
                Bucket: this.bucket,
                ACL: 'public-read'
            };
            return new Promise((resolve, reject) => {
                this.s3.upload(params, (err, data) => {
                    readStream.destroy();
                    if (err) {
                        console.error(`Error while readStream==>`, err);
                        return reject(err);
                    }
                    fs_1.unlink(localFilePath, (err) => {
                        if (err) {
                            console.error(`file deletion failed!!`);
                        }
                        console.info(`file deleted`);
                    });
                    return resolve(data);
                });
            });
        }
        catch (error) {
            console.error(`we have an error while uploading doc to s3,${error}`);
        }
    }
}
exports.S3Invoice = new S3ServiceClass(_common_1.BASE.AWS.INVOICE_PATH);
//# sourceMappingURL=s3.aws.service.js.map