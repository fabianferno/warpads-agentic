
export interface Ad {
    title: string;
    description: string;
    link: string;
}

export interface AdResponse {
    originalMessage: string;
    ad: Ad;
}