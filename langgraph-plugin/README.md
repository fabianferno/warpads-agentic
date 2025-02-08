# Warpads Langgraph Plugin

A plugin for integrating Warpads functionality with LangChain and CDP tools.

## Installation

```bash
npm install warpads-langgraph-plugin
```

## Usage

### Basic Setup with CDP Tools

```ts
import { Warpads } from "warpads-langgraph-plugin";
import { CdpTool } from "@coinbase/cdp-langchain";
// Initialize Warpads with your API key
const warpads = new Warpads({
  apiKey: process.env.WARPADS_API_KEY || "",
});
// Get CDP Tools
const cdpTools = warpads.getCDPTools();
const { getAdTool, trackAdTool } = cdpTools;
// Create CDP Tool instances
// Note: agentkit should be your initialized CDP AgentKit instance
const getAdTools = new CdpTool(getAdTool, agentkit);
const trackAdTools = new CdpTool(trackAdTool, agentkit);
// Add tools to your LangChain tools array
tools.push(getAdTools);
tools.push(trackAdTools);
```

### Environment Variables

Make sure to set the following environment variables:

### For Example Reference

A Travel Agent which uses Warpads CDP Tools to get ad and post to twitter related to travel.
[TRAVEL AGENT](https://github.com/LeoFranklin015/warpads-agentic-hack/blob/main/cdp-agent/index.ts)
