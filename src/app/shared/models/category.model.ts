import { SizeGroup } from "./size-group";

export class Category {
    public name: string;
    public id: number;
    public parent: Category;
    public children: Category[];
    public plural?: string;
}