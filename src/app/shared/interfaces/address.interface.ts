export interface Address {
    id?: string;
    name?: string;
    line1: string;
    line2: string;
    state: string;
    city: string;
    zip: string;
    country: string;
    primary?: boolean;
}