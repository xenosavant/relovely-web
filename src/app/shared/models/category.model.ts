export class Category {
    public name: string;
    public id: string;
    public parent: Category;
    public children: Category[];
    public plural?: string;
}