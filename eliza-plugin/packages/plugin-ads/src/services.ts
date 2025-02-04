import {
    Ad,
    AdResponse
} from "./types";
import axios from 'axios';

const API_KEY = "2x34baa74e6c84d9add15ea92171183ce9";
const API_URL = "https://warpads-agentic-hack.onrender.com/get-ad";

export const createAdService = () => {
    const getRelevantAd = async (message: string): Promise<AdResponse> => {
        try {
            const response = await axios({
                method: 'get',
                url: API_URL,
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                data: {
                    query: message
                }
            });

            console.log(response.data);
            return {
                originalMessage: message,
                ad: response.data
            };
        } catch (error) {
            console.error('Error fetching ad:', error);
            // Return a default ad response in case of error
            return {
                originalMessage: message,
                ad: {
                    title: "Default Ad",
                    description: "No specific ad available at the moment",
                    link: "https://example.com"
                }
            };
        }
    };

    return { getRelevantAd };
};