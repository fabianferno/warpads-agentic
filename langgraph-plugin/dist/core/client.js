"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarpadsError = exports.Warpads = void 0;
const CDPTools_1 = require("../tools/CDPTools");
class Warpads {
    config;
    constructor(config) {
        this.config = config;
    }
    getCDPTools() {
        return (0, CDPTools_1.createCDPTools)(this.config.apiKey);
    }
}
exports.Warpads = Warpads;
class WarpadsError extends Error {
    constructor(message) {
        super(`[Warpads] ${message}`);
        this.name = "WarpadsError";
    }
}
exports.WarpadsError = WarpadsError;
