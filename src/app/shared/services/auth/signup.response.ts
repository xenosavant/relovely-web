import { UserDetail } from '../../models/user-detail.model';
import { UserAuth } from '@app/shared/models/user-auth.model';

export interface SignupResponse {
    user: UserAuth;
    jwt: string;
    existing?: boolean;
}