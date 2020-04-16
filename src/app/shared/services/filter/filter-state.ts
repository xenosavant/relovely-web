
export interface IFilterState {
    preferences: IUserPreferences;
    activeSizeFilters: string[];
}

export interface IUserPreferences {
    sizes?: string[];
    colors?: string[];
    prices?: PriceRange[];
}

export interface PriceRange {
    id: string;
    min?: number;
    max?: number;
}