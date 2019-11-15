import { KeyValue } from '@app/shared/interfaces/key-value.interface';
import { SizeFilterGroup } from '@app/shared/models/size-filter-group.model';

export const womensSizes: SizeFilterGroup[] = [
    {
        id: '1',
        name: `Women's Standard Numeric`,
        categoryId: 4,
        filters: [
            { key: '1', value: '00' },
            { key: '2', value: '0' },
            { key: '3', value: '2' },
            { key: '4', value: '4' },
            { key: '5', value: '6' },
            { key: '6', value: '8' },
            { key: '7', value: '10' },
            { key: '8', value: '12' },
            { key: '9', value: '14' },
            { key: '10', value: '16' },
            { key: '11', value: '18' },
            { key: '12', value: '20' },
            { key: '13', value: '22' }
        ],
        selectedKeys: []
    },
    {
        id: '2',
        categoryId: 4,
        name: `Women's Standard`,
        filters: [
            { key: '15', value: 'XXS' },
            { key: '16', value: 'XS' },
            { key: '17', value: 'S' },
            { key: '18', value: 'M' },
            { key: '19', value: 'L' },
            { key: '20', value: 'XL' },
            { key: '21', value: 'XXL' },
            { key: '22', value: 'XXXL' }
        ],
        selectedKeys: []
    },
    {
        id: '3',
        categoryId: 4,
        name: `Women's Petite`,
        filters: [
            { key: '23', value: '00P' },
            { key: '24', value: '0P' },
            { key: '25', value: '2P' },
            { key: '26', value: '4P' },
            { key: '27', value: '6P' },
            { key: '28', value: '8P' },
            { key: '29', value: '10P' },
            { key: '30', value: '12P' },
            { key: '31', value: '14P' },
            { key: '32', value: '16P' },
            { key: '33', value: '18P' },
            { key: '34', value: '20P' },
            { key: '35', value: '22P' }
        ],
        selectedKeys: []
    },
    {
        id: '4',
        categoryId: 4,
        name: `Women's Tall`,
        filters: [
            { key: '37', value: '00T' },
            { key: '38', value: '0T' },
            { key: '39', value: '2T' },
            { key: '40', value: '4T' },
            { key: '41', value: '6T' },
            { key: '42', value: '8T' },
            { key: '43', value: '10T' },
            { key: '44', value: '12T' },
            { key: '45', value: '14T' },
            { key: '46', value: '16T' },
            { key: '47', value: '18T' },
            { key: '48', value: '20T' },
            { key: '49', value: '22T' }
        ],
        selectedKeys: []
    },
    {
        id: '5',
        categoryId: 4,
        name: `Women's Maternity`,
        filters: [
            { key: '51', value: '00 Maternity' },
            { key: '52', value: '0 Maternity' },
            { key: '53', value: '2 Maternity' },
            { key: '54', value: '4 Maternity' },
            { key: '55', value: '6 Maternity' },
            { key: '56', value: '8 Maternity' },
            { key: '57', value: '10 Maternity' },
            { key: '58', value: '12 Maternity' },
            { key: '59', value: '14 Maternity' },
            { key: '60', value: '16 Maternity' },
            { key: '61', value: '18 Maternity' },
            { key: '62', value: '20 Maternity' },
            { key: '63', value: '22 Maternity' },
            { key: '64', value: 'XXS Maternity' },
            { key: '65', value: 'XS Maternity' },
            { key: '66', value: 'S Maternity' },
            { key: '67', value: 'M Maternity' },
            { key: '68', value: 'L Maternity' },
            { key: '69', value: 'XL Maternity' },
            { key: '70', value: 'XXL Maternity' }
        ],
        selectedKeys: []
    },
    {
        id: '6',
        categoryId: 13,
        name: `Women's Shoes`,
        filters: [
            { key: '72', value: '4' },
            { key: '73', value: '4.5' },
            { key: '74', value: '5' },
            { key: '75', value: '5.5' },
            { key: '76', value: '6' },
            { key: '77', value: '6.5' },
            { key: '78', value: '7' },
            { key: '79', value: '7.5' },
            { key: '80', value: '8' },
            { key: '81', value: '8.5' },
            { key: '82', value: '9' },
            { key: '83', value: '9.5' },
            { key: '84', value: '10' },
            { key: '85', value: '10.5' },
            { key: '86', value: '11' },
            { key: '87', value: '12' },
            { key: '88', value: '12.5' },
            { key: '89', value: '13' },
            { key: '90', value: '13.5' },
            { key: '70', value: '14' }
        ],
        selectedKeys: []
    }
]