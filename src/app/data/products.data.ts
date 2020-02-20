import { Product } from '@app/shared/models/product.model';
import { getRandomString } from 'selenium-webdriver/safari';
import { seller1 } from './seller-list.data';

export const products: Product[] = [
    {
        id: 'a1636ad1-5db1-49af-ad24-9e3ec7a4eb55',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        title: 'Striped Blue Top',
        asset: './assets/images/blue-shirt.jpeg',
        seller: seller1,
        size: 'M', price: 50.00,
        similarItems: [],
        moreItems: [],
        auction: true
    },
    {
        id: 'f13b1ccc-7eba-473f-a704-5bfc552a00cf',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        title: 'Round Straw Crossbody Bag',
        asset: './assets/images/hand-bag.jpeg',
        seller: seller1,
        size: 'OS', price: 80.00,
        similarItems: [],
        moreItems: []
    },
    {
        id: 'a656ddce-a760-43c2-83d0-0bcb5eedf14b',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        title: 'Polkadot Dress',
        asset: './assets/images/polka-dress.jpeg',
        seller: seller1,
        size: 'OS', price: 80.00,
        similarItems: [],
        moreItems: []
    },
    {
        id: 'e4bbcc8f-b7bf-464c-a77e-f89c739aba9a',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        title: 'Black Top',
        asset: './assets/images/black_top.jpeg',
        seller: seller1,
        size: 'M', price: 15.00,
        similarItems: [],
        moreItems: [],
        auction: true
    },
    {
        id: '5904a789-5685-4b15-9333-403c820477e9',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        title: 'Sun Hat',
        asset: './assets/images/hat.jpeg',
        seller: seller1, size: 'L', price: 25.00,
        similarItems: [],
        moreItems: []
    },
    {
        id: '0a01991e-cec0-4a3c-8c9f-50ee32e9a9cd',
        title: 'Designer Bag',
        asset: './assets/images/purse.jpeg',
        seller: seller1,
        size: 'OS', price: 50.00,
        similarItems: [],
        moreItems: []
    },
    {
        id: '17b6d07e-e19f-435a-8413-308559f02713',
        title: 'Green Dress',
        asset: './assets/images/green_dress.jpeg',
        seller: seller1, size: '0', price: 50.00,
        similarItems: [],
        moreItems: []
    },
    {
        id: '7298a728-8189-4722-af85-fa8c821f85f6',
        title: 'White Tank Top',
        asset: './assets/images/top.jpeg',
        seller: seller1, size: 'S', price: 150.00,
        similarItems: [],
        moreItems: []
    },
    {
        id: '5d192bd9-8f63-4bf0-bde1-add76d240bc6',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        title: 'Yellow Blazer',
        asset: './assets/images/yellow-jacket.jpeg',
        seller: seller1, size: 'L', price: 50.00,
        similarItems: [],
        moreItems: []
    },
    {
        id: '6af77985-4b4a-4919-a75f-3f3fae727f1e',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        title: 'Tan BLazer',
        asset: './assets/images/blazer.jpeg',
        seller: seller1,
        size: '40L', price: 175.00,
        similarItems: [],
        moreItems: []
    }
];