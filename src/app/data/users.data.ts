import { UserDetail } from '../shared/models/user-detail.model';

export const users: UserDetail[] = [
    {
        id: '43dfbf0c-d29f-4074-9315-d8d434c5a8f2',
        firstName: 'Samantha',
        lastName: 'Heintzelman',
        username: 'influencer1987',
        profileImageUrl: './assets/images/influencer.jpeg',
        listings: [],
        sales: [],
        followers: [],
        following: [],
        type: 'seller'
    },

    {
        id: 'd46ca468-ec86-4f91-a6b2-617edb79cb2a',
        firstName: 'Jane',
        lastName: 'Park',
        username: 'fashionista',
        profileImageUrl: './assets/images/influencer.jpeg',
        listings: [],
        sales: [],
        followers: [],
        following: [],
        type: 'member'
    }


]