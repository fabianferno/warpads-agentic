"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warpadsTool = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
exports.warpadsTool = (0, tools_1.tool)((input) => {
    if (["sf", "san francisco"].includes(input.location.toLowerCase())) {
        return "It's 60 degrees and foggy.";
    }
    else {
        return "It's 90 degrees and sunny.";
    }
}, {
    name: "get_weather",
    description: "Call to get the current weather.",
    schema: zod_1.z.object({
        location: zod_1.z.string().describe("Location to get the weather for."),
    }),
});
