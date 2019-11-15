import { UserDetail } from '../shared/models/user-detail.model';

export const users: UserDetail[] = [
    {
        id: '43dfbf0c-d29f-4074-9315-d8d434c5a8f2',
        firstName: 'Samantha',
        lastName: 'Heintzelman',
        username: 'influencer1987',
        imageUrl: './assets/images/influencer.jpeg',
        numberListings: 12,
        numberSales: 15,
        numberFollowers: 1150,
        numberFollowing: 246,
        products: [],
        isSeller: true
    },

    {
        id: 'd46ca468-ec86-4f91-a6b2-617edb79cb2a',
        firstName: 'Jane',
        lastName: 'Park',
        username: 'fashionista',
        imageUrl: 'https://bounceapp.s3.amazonaws.com/users/903248af-8e38-40bb-a102-79acd584f0f2/profile.jpeg',
        numberListings: 25,
        numberSales: 100,
        numberFollowers: 500,
        numberFollowing: 15,
        products: [],
        isSeller: false
    }


]