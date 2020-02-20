import { UserDetail } from '../../models/user-detail.model';

export interface SignupResponse {
    user: UserDetail;
    jwt: string;
}