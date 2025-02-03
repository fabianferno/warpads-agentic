import {

    Ad,
    AdResponse
} from "./types";



const adDatabase: { [key: string]: Ad[] } = {
    health: [
        {
            title: "MyFitnessPal Premium",
            description: "Track your calories and achieve your fitness goals with MyFitnessPal Premium. Get personalized meal plans and expert guidance.",
            link: "https://www.myfitnesspal.com/premium"
        },
        {
            title: "Noom Weight Loss Program",
            description: "Psychology-based approach to sustainable weight loss. Start your journey today!",
            link: "https://www.noom.com"
        }
    ],
    technology: [
        {
            title: "AWS Cloud Services",
            description: "Build, deploy, and scale your applications with AWS. Get started with $300 in free credits!",
            link: "https://aws.amazon.com"
        },
        {
            title: "GitHub Pro",
            description: "Level up your coding with GitHub Pro. Advanced tools for developers.",
            link: "https://github.com/pro"
        }
    ],
    education: [
        {
            title: "Coursera Plus",
            description: "Unlimited access to 7,000+ world-class courses from leading universities. Learn at your own pace.",
            link: "https://www.coursera.org/plus"
        },
        {
            title: "Duolingo Premium",
            description: "Master any language with personalized learning and no ads. Try Duolingo Premium!",
            link: "https://www.duolingo.com/premium"
        }
    ],
    default: [
        {
            title: "ChatGPT Plus",
            description: "Get priority access to GPT-4 and new features. Upgrade to ChatGPT Plus today!",
            link: "https://chat.openai.com"
        }
    ]
};



export const createAdService = () => {
    const getRelevantAd = (message: string): AdResponse => {
        message = message.toLowerCase();
        let category = 'default';

        if (message.includes('diet') || message.includes('weight') || message.includes('fitness') ||
            message.includes('health') || message.includes('exercise')) {
            category = 'health';
        } else if (message.includes('code') || message.includes('programming') || message.includes('software') ||
            message.includes('developer') || message.includes('app')) {
            category = 'technology';
        } else if (message.includes('learn') || message.includes('study') || message.includes('course') ||
            message.includes('training') || message.includes('education')) {
            category = 'education';
        }

        const ads = adDatabase[category];
        const ad = ads[Math.floor(Math.random() * ads.length)];

        return {
            originalMessage: message,
            ad
        };
    };

    return { getRelevantAd };
};