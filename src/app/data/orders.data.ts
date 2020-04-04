import { Order } from "@app/shared/models/order.model";

export const orders: Order[] = [
    {
        id: '85c6964a-8198-4a00-bfa1-24b114fc9d37',
        product: {
            id: 'a1636ad1-5db1-49af-ad24-9e3ec7a4eb55',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            title: 'Striped Blue Top',
            asset: './assets/images/blue-shirt.jpeg',
            seller: { imageUrl: './assets/images/influencer.jpeg', username: 'fashionista', id: 'd46ca468-ec86-4f91-a6b2-617edb79cb2a', type: 'seller' },
            size: 'M', price: 5000,
            similarItems: [],
            moreItems: []
        },
        purchaseDate: '2019-11-01T20:26:48Z',
        shipDate: '2019-11-02T20:26:48Z',
        status: 'shipped',
        trackingNumber: '9384732984729384792384',
        shippingCarrierName: 'Fedex',
        shippingCarrerId: 'fedex',
        price: 1050,
        shippingCost: 500,
        tax: 100,
        total: 1650,
        seller: 'influencer1988',
        address: {
            line1: '298 6th Street',
            line2: 'Apt 1',
            city: 'Jersey City',
            state: 'NJ',
            zip: '07302',
            country: 'United States'
        }
    },
    {
        id: '85c6964a-8198-4a00-bfa1-24b114ffj73j',
        product: {
            id: 'a656ddce-a760-43c2-83d0-0bcb5eedf14b',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            title: 'Polkadot Dress',
            asset: './assets/images/polka-dress.jpeg',
            seller: {
                type: 'seller',
                imageUrl: 'https://bounceapp.s3.amazonaws.com/users/903248af-8e38-40bb-a102-79acd584f0f2/profile.jpeg',
                id: 'd46ca468-ec86-4f91-a6b2-617edb79cb2a', username: 'fashionista'
            },
            size: '2', price: 5000,
            similarItems: [],
            moreItems: []
        },
        purchaseDate: '2019-11-01T20:26:48Z',
        shipDate: '2019-11-02T20:26:48Z',
        status: 'shipped',
        trackingNumber: '9384732984729384792384',
        shippingCarrierName: 'Fedex',
        shippingCarrerId: 'fedex',
        price: 5600,
        shippingCost: 500,
        tax: 100,
        total: 6200,
        seller: 'influencer1988',
        address: {
            line1: '298 6th Street',
            line2: 'Apt 1',
            city: 'Jersey City',
            state: 'NJ',
            zip: '07302',
            country: 'United States'
        }
    },
]