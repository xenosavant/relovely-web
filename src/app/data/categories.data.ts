import { Category } from "@app/shared/models/category.model";

export const categories: Category[] = [
    {
        name: 'Women',
        id: 1,
        parent: null,
        children: [
            {
                name: 'Clothing',
                id: 4,
                parent: null,
                children: [
                    {
                        name: 'Dresses',
                        id: 5,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Tops',
                        id: 6,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Jackets & Coats',
                        id: 7,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Skirts',
                        id: 8,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Swimwear',
                        id: 9,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Tanks',
                        id: 10,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Sleepwear',
                        id: 11,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Sweaters',
                        id: 12,
                        parent: null,
                        children: []
                    }
                ]
            },
            {
                name: 'Shoes',
                id: 13,
                parent: null,
                children: [
                    {
                        name: 'Pumps',
                        id: 14,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Heels',
                        id: 15,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Athletic',
                        id: 16,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Boots',
                        id: 17,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Slip-Ons',
                        id: 18,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Sandals & Flip Flops',
                        id: 19,
                        parent: null,
                        children: []
                    }
                ]
            },
            {
                name: 'Handbags & Accessories',
                id: 20,
                parent: null,
                children: [
                    {
                        name: 'Purses',
                        id: 21,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Jewelry',
                        id: 22,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Belts',
                        id: 23,
                        parent: null,
                        children: []
                    }
                ]
            }
        ]
    },
    {
        name: 'Men',
        id: 2,
        parent: null,
        children: [
            {
                name: 'Clothing',
                id: 24,
                parent: null,
                children: [
                    {
                        name: 'Activewear',
                        id: 25,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Jeans',
                        id: 26,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Shorts',
                        id: 27,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Suits',
                        id: 28,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Pants',
                        id: 29,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Polos',
                        id: 30,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'T-Shirts',
                        id: 31,
                        parent: null,
                        children: []
                    }
                ]
            },
            {
                name: 'Shoes',
                id: 3,
                parent: null,
                children: [
                    {
                        name: 'Athletic',
                        id: 32,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Boots',
                        id: 33,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Dress',
                        id: 34,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Loafers',
                        id: 35,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Oxfords',
                        id: 36,
                        parent: null,
                        children: []
                    }
                ]
            },
            {
                name: 'Accessories',
                id: 37,
                parent: null,
                children: [
                    {
                        name: 'Belts',
                        id: 38,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Hats',
                        id: 39,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Watches',
                        id: 40,
                        parent: null,
                        children: []
                    }
                ]
            }
        ]
    },
    {
        name: 'Kids',
        id: 2,
        parent: null,
        children: [
            {
                name: 'Clothing',
                id: 24,
                parent: null,
                children: [
                    {
                        name: 'Baby Boys',
                        id: 25,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Baby Girls',
                        id: 26,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Boys',
                        id: 27,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Girls',
                        id: 28,
                        parent: null,
                        children: []
                    }
                ]
            },
            {
                name: 'Shoes',
                id: 3,
                parent: null,
                children: [
                    {
                        name: 'Baby Boys',
                        id: 25,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Baby Girls',
                        id: 26,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Boys',
                        id: 27,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Girls',
                        id: 28,
                        parent: null,
                        children: []
                    }

                ]
            },
            {
                name: 'Accessories',
                id: 37,
                parent: null,
                children: [
                    {
                        name: 'Baby Boys',
                        id: 25,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Baby Girls',
                        id: 26,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Boys',
                        id: 27,
                        parent: null,
                        children: []
                    },
                    {
                        name: 'Girls',
                        id: 28,
                        parent: null,
                        children: []
                    }
                ]
            }
        ]
    }

]