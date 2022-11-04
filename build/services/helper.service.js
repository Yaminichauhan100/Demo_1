"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helper = void 0;
const fs_1 = __importDefault(require("fs"));
const request_1 = __importDefault(require("request"));
const crypto_1 = __importDefault(require("crypto"));
const v1_1 = __importDefault(require("uuid/v1"));
exports.Helper = {
    convertSortType: function (sortType) {
        return sortType === 'asc' ? 1 : -1;
    },
    generateMetaToken: function () {
        return { time: new Date(Date.now() + 3600000), value: v1_1.default() };
    },
    lookupGenerator: function (from, localField, foreignField, as) {
        return { from, localField, foreignField, as };
    },
    precise: function (n) {
        return parseFloat(n.toPrecision(4));
    },
    checkFileExists: function (fileName) {
        return !!fs_1.default.existsSync(fileName);
    },
    createNewDirectory: function (directory) {
        if (typeof directory === 'string') {
            !fs_1.default.existsSync(directory) && fs_1.default.mkdirSync(directory, { recursive: true });
        }
        else {
            directory.forEach(dir => {
                !fs_1.default.existsSync(dir) && fs_1.default.mkdirSync(dir, { recursive: true });
            });
        }
        return true;
    },
    async getRequest(url) {
        return new Promise((resolve, reject) => {
            request_1.default.get(url, (err, res, body) => {
                if (err)
                    reject(err);
                else {
                    resolve(body);
                }
            });
        });
    },
    async readFile(path, encoding) {
        return new Promise((resolve, reject) => {
            let options = {};
            if (encoding)
                options.encoding = encoding;
            fs_1.default.readFile(path, options, (err, data) => {
                if (err)
                    reject(err);
                else {
                    resolve(data);
                }
            });
        });
    },
    async deleteFile(path) {
        return new Promise((resolve, reject) => {
            fs_1.default.unlink(path, (err) => {
                if (err)
                    reject(err);
                else {
                    resolve(true);
                }
            });
        });
    },
    async generateOtp() {
        let min = Math.ceil(1000);
        let max = Math.floor(9999);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    randomString() {
        return crypto_1.default.randomBytes(20).toString('hex');
    },
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    },
    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371;
        var dLat = this.deg2rad(lat2 - lat1);
        var dLon = this.deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }
};
//# sourceMappingURL=helper.service.js.map