import { ActionExample } from "@elizaos/core";

export const getAdResponseExamples: ActionExample[][] = [
    // Learning & Education Examples
    [
        {
            user: "{{user1}}",
            content: {
                text: "What's the best way to learn digital marketing?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Master SEO, content creation & social media. Build real campaigns. Track metrics. Focus on hands-on practice & stay updated with trends.\n\nSuggested: HubSpot Academy Digital Marketing\nhttps://academy.hubspot.com/digital-marketing",
                action: "GET_RESPONSE_WITH_AD",
                intent: "LEARN"
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "How can I learn blockchain development?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Start with Web3 basics, smart contracts & Solidity. Build simple DApps. Join dev communities. Practice security best practices.\n\nSuggested: Web3 University - Complete Developer Course\nhttps://web3.university/courses/blockchain-dev",
                action: "GET_RESPONSE_WITH_AD",
                intent: "LEARN"
            },
        }
    ],

    // Investment & Finance Examples
    [
        {
            user: "{{user1}}",
            content: {
                text: "I want to start investing in stocks. Where should I begin?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Start with market basics & index funds. Learn risk management. Research companies before buying. Build a diversified portfolio slowly.\n\nSuggested: Fidelity Learn to Invest\nhttps://fidelity.com/learn",
                action: "GET_RESPONSE_WITH_AD",
                intent: "START"
            },
        }
    ],

    // Technology & Programming Examples
    [
        {
            user: "{{user1}}",
            content: {
                text: "How can I improve my coding skills?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Code daily. Build real projects. Learn git. Join open source. Pick one language & master it. Follow coding standards & best practices.\n\nSuggested: Frontend Masters Complete Web Dev\nhttps://frontendmasters.com",
                action: "GET_RESPONSE_WITH_AD",
                intent: "IMPROVE"
            },
        }
    ],

    // Career Development Examples
    [
        {
            user: "{{user1}}",
            content: {
                text: "How do I become a data scientist?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Master Python & statistics. Learn ML algorithms. Practice with real datasets. Build a portfolio. Get certified in key tools.\n\nSuggested: DataCamp Data Science Career Track\nhttps://datacamp.com/career-track",
                action: "GET_RESPONSE_WITH_AD",
                intent: "GUIDE"
            },
        }
    ],

    // General Skill Development
    [
        {
            user: "{{user1}}",
            content: {
                text: "What's the fastest way to learn a new language?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Practice daily. Use language apps. Watch native content. Join conversation groups. Focus on common phrases first.\n\nSuggested: Babbel Language Learning\nhttps://babbel.com/premium",
                action: "GET_RESPONSE_WITH_AD",
                intent: "RECOMMEND"
            },
        }
    ]
];