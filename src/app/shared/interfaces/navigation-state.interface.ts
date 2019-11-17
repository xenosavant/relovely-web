import { Category } from '../models/category.model';
import { NavigationItem } from '../models/navigation-item.model';

export interface INavigationState {
    showNavBar: boolean;
    showTopLeveNavigation: boolean;
    pageHeader: string;
    navigationHeader: string;
    showFilterBar: boolean;
    showProfileBar: boolean;
    showProductGrid: boolean;
    categoryItems: Category[];
    chipItems: NavigationItem[];
    selectedCategoryId: number;
    currentNavigationItems: NavigationItem[];
}

