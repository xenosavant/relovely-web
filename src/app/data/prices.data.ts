import { PriceFilter } from "@app/shared/models/price-filter.model";

export const prices: PriceFilter[] = [
    {
        id: '1',
        maxPrice: 50,
        name: 'Under $50'
    },
    {
        id: '2',
        minPrice: 50,
        maxPrice: 100,
        name: '$50 - $100'
    },
    {
        id: '3',
        minPrice: 100,
        maxPrice: 200,
        name: '$100 - $200'
    },
    {
        id: '4',
        minPrice: 200,
        maxPrice: 300,
        name: '$200 - $300',
    },
    {
        id: '5',
        minPrice: 300,
        maxPrice: 400,
        name: '$300 - $400',
    },
    {
        id: '6',
        minPrice: 400,
        maxPrice: 500,
        name: '$400 - $500',
    },
    {
        id: '7',
        minPrice: 500,
        maxPrice: 1000,
        name: '$500 - $1000',
    },
    {
        id: '8',
        minPrice: 1000,
        name: 'Over $1000',
    }
]