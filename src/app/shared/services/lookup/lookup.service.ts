import { Injectable, OnInit } from '@angular/core';
import { Category } from '../../models/category.model';
import { SizeFilterGroup } from '../../models/size-filter-group.model';
import { BaseService } from '../base.service';
import { LookupState } from './lookup-state';
import { ColorFilter } from '@app/shared/interfaces/color-filter.interface';
import { states } from '../../../data/states'
import { State } from './state';
import { HttpClient } from '@angular/common/http';
import { sizes } from '@app/data/sizes.data';
import { colors } from '@app/data/colors.data';
import { prices } from '@app/data/prices.data';
import { categories } from '@app/data/categories.data';

@Injectable()
export class LookupService extends BaseService {

    private _state: LookupState;
    private _catMap: Map<string, Category> = new Map();
    private _sizeMap = {};
    private _colorNameMap = {};
    private _colorMap = {};
    private _states: State[] = [];

    constructor(httpClient: HttpClient) {
        super(httpClient);
        Object.entries(states).forEach(item => {
            this._states.push({ abbreviation: item[0], full: item[1] })
        })
        this._state = {
            categories: categories,
            sizes: sizes,
            colors: colors,
            prices: prices,
        }
        this._state.categories.forEach(cat => {
            this.populateParents(cat);
        });
        this._state.sizes.forEach(sizes => {
            this.buildSizeDictionary(sizes);
        });
        this.buildColorDictionary(this._state.colors);
    }
    public navLookup = {};

    public get state() {
        return this._state;
    }

    public getCategory(id: string): Category {
        return this._catMap[id];
    }

    public getParents(id: string): Category[] {
        const cat = this._catMap[id];
        return this.getParent(cat);
    }

    private getParent(cat: Category, array = []) {
        const parent = cat.parent;
        if (parent) {
            array.push(parent);
            return this.getParent(parent, array);
        }
        return array;
    }

    public getSize(id: string) {
        return this._sizeMap[id];
    }

    public getColorName(id: string) {
        return this._colorNameMap[id];
    }

    public getColor(id: string) {
        return this._colorMap[id];
    }

    private populateParents(category: Category) {
        this._catMap[category.id] = category;
        if (category.children) {
            category.children.forEach(cat => {
                cat.parent = category;
                this.populateParents(cat);
            });
        }
    }

    private buildSizeDictionary(group: SizeFilterGroup) {
        group.filters.forEach(filter => {
            this._sizeMap[filter.key] = filter.value;
        })
    }

    private buildColorDictionary(colors: ColorFilter[]) {
        colors.forEach(color => {
            this._colorNameMap[color.key] = color.value;
        });
        colors.forEach(color => {
            this._colorMap[color.key] = color.color;
        })
    }

    public get states() {
        return this._states;
    }
}