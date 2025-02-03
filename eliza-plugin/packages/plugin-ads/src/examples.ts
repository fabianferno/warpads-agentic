import { ActionExample } from "@elizaos/core";



export const getAdResponseExamples: ActionExample[][] = [
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
                text: "Digital marketing is a vast field that requires hands-on practice and structured learning. I'd recommend starting with the fundamentals of SEO, content marketing, and social media management. One great resource I can suggest is the Coursera Digital Marketing Specialization - they offer comprehensive courses taught by industry experts that cover everything from basics to advanced strategies. Would you like me to share more specific resources for any particular area of digital marketing?",
                action: "GET_RESPONSE_WITH_AD",
            },
        }
    ],
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
                text: "Starting your investment journey is a great decision! I recommend beginning with understanding market basics and investment fundamentals. Many successful investors start with index funds before moving to individual stocks. You might want to check out Noom's Stock Market Basics course - they have an excellent program that breaks down complex concepts into digestible lessons, perfect for beginners. Would you like me to explain more about different investment strategies or share some beginner-friendly resources?",
                action: "GET_RESPONSE_WITH_AD",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "How can I track my fitness progress effectively?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Tracking fitness progress is crucial for staying motivated and achieving your goals! The key is to monitor multiple metrics - not just weight, but also measurements, strength gains, and energy levels. MyFitnessPal Premium offers comprehensive tracking tools that can help you monitor all these aspects in one place. They also provide detailed nutrition analysis and workout planning features. Would you like some specific tips for tracking different aspects of your fitness journey?",
                action: "GET_RESPONSE_WITH_AD",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "I need help improving my coding skills",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Improving your coding skills is all about consistent practice and having the right learning resources. I recommend focusing on building real projects while learning new concepts. GitHub Pro can be particularly helpful here - it offers advanced code review tools and private repositories for practice. Their collaborative features can also connect you with other developers for feedback and learning. What specific programming languages or areas are you interested in focusing on?",
                action: "GET_RESPONSE_WITH_AD",
            },
        }
    ]
];