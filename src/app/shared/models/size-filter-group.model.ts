import { KeyValue } from '../interfaces/key-value.interface';
import { Category } from './category.model';

export class SizeFilterGroup {
    public id: string;
    public categoryId: string;
    public name: string;
    public filters: KeyValue[];
    public selectedKeys: string[];
}