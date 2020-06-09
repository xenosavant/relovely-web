export interface IAuthItem {
    error?: string;
    page?: 'signup' | 'signin' | 'sell' | 'reset' | 'instagram';
    token?: string;
    username?: string;
}