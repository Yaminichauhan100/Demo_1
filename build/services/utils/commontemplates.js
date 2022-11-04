"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonTemplateUtil = void 0;
const handlebars = __importStar(require("handlebars"));
class CommonTemplateUtil {
    constructor(template) {
        this.fs = require('fs');
        this.template = template;
    }
    compileFile(complieData) {
        return new Promise((resolve, reject) => {
            this.fs.readFile(this.template, 'utf8', (err, content) => {
                if (err)
                    reject(err);
                try {
                    const template = handlebars.compile(content);
                    let html = template(complieData);
                    resolve(html);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
}
exports.CommonTemplateUtil = CommonTemplateUtil;
//# sourceMappingURL=commontemplates.js.map