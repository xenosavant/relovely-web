import { Category } from '../models/category.model';
import { NavigationItem } from '../models/navigation-item.model';

export interface INavigationState {
    showNavBar: boolean;
    pageHeader: string;
    navigationHeader: string;
    showFilterBar: boolean;
    showProductGrid: boolean;
    categoryItems: Category[];
    chipItems: NavigationItem[];
    selectedCategoryId: string;
    selectedCategory: Category;
}

