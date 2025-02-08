"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarpadsError = exports.Warpads = void 0;
const tools_1 = require("../tools");
const CDPTools_1 = require("../tools/CDPTools");
class Warpads {
    constructor(config) {
        this.config = config;
    }
    async getTools() {
        return tools_1.warpadsTool;
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
