export interface IAuthItem {
    error?: string;
    page?: 'signup' | 'signin' | 'sell' | 'reset' | 'instagram';
    token?: string;
    redirect?: string,
    username?: string;
}