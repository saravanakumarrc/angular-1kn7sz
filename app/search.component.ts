import { Component, EventEmitter, forwardRef, HostListener, Input, OnChanges, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IData } from './IData';

export function shopRequiredValidator(value: any) {
    return (c: FormControl) => {
        const err = {
            required: {
                given: c.value
            }
        };
        return (c.value === 0 || (typeof c.value === 'undefined')) ? err : null;
    };
}

@Component({
    selector: 'app-shop-search',
    templateUrl: './shop-search.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ShopSearchComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => ShopSearchComponent), multi: true }]
})

export class ShopSearchComponent implements OnInit, OnChanges, ControlValueAccessor  {
    @ViewChild('shopSearch', {static: true}) control: ComboBoxComponent;

    @Input() label: string;
    @Input() shop: IData;
    @Input() group: FormGroup;
    @Input() name: string;
    @Input() advSearchEnabled = false;
    @Output() getSelectedShop = new EventEmitter();
    @Output() shopSelected = new EventEmitter();

    public listOfShops: Array<IData>;
    required = false;
    defGlobalShop = false;
    defGlobalValue: string;

public source: Array<IData> = [
        { text: "Small", value: 1 },
        { text: "Medium", value: 2 },
        { text: "Large", value: 3 }
    ];

    propagateChange = (_: any) => { };
    validateFn: any = () => { };

    constructor() {
        this.listOfShops = this.source;
    }

    ngOnInit() {
    }



    search(value: any) {
        if (value && value !== '') {
            const shopParamValue = (value && value.shopId) ? value.shopId : value;
            const shopSearchParams = {
                useLikeClause: true,
                shopId: shopParamValue,
                shop_Id: value.shop_Id ? value.shop_Id : 0,
                activeCode: true
            };
            
            this.listOfShops = this.source;
            let shopVal = null;

            if (shopParamValue !== '' && this.defGlobalShop && this.listOfShops && this.listOfShops.length >= 1) {
                shopVal = this.listOfShops.find(x => x.text === shopParamValue);

                if (shopVal != null && this.defGlobalValue === shopVal.shopId) {
                    this.defGlobalShop = false;
                    this.setSelectedShop(shopVal);
                }

            } else if (this.listOfShops && this.listOfShops.length === 1) {
                shopVal = this.listOfShops.find(x => x.text === shopParamValue);
                if (shopVal) {
                    shopSearchParams.shop_Id > 0 ? this.setSelectedShop(shopVal) : this.shopSelected.emit(shopVal);
                }
            }
        }
    }

    validate(c: FormControl) {
        // There is no method how to check validators or get all validators: https://github.com/angular/angular/issues/13461
        const formControl = new FormControl();
        if (c.validator) {
            const validationResult = c.validator(formControl);
            this.required = (validationResult !== null && validationResult.required === true);
        }
        if (this.required) {
            return shopRequiredValidator(this.shop)(c);
        }

    }

    @HostListener('focusout', ['$event.target'])
    onFocusout(target: any) {
        // List of css classes to ignore so that validation is not triggered
        const ignoredClasses = ['SearchButton', 'AdvancedSearchButton', 'AdvancedSearchOkButton', 'AdvancedSearchCancelButton', 'ResetButton'];

        for (const ignoredClass of ignoredClasses) {
            if (target.classList.contains(ignoredClass)) {
                return;
            }
        }

        if (target.value === '') {
            this.validateFn = shopRequiredValidator(target.value);
            this.propagateChange(target.value);
        }
    }

    ngOnChanges(inputs: any) {
        if (inputs.shop) {
            this.validateFn = shopRequiredValidator(this.shop);
            this.propagateChange(this.shop);
        }
    }

    onChange(event: IData) {
        this.shop = event;
        this.getSelectedShop.emit(event);
        this.propagateChange(event);
    }

    onSelect(event: IData) {
        this.shopSelected.emit(event);
        this.propagateChange(event);
    }

    onBlur(event: IData) {
        console.log('onBlur', event);
    }

    writeValue(value: any) {
        if (value) {
            if ((this.listOfShops.length >= 1 && this.listOfShops.find(x => x.shop_Id !== value.shop_Id)) ||
                this.listOfShops.length < 1) {
                this.defGlobalShop = value.defVal;
                this.defGlobalValue = value.shopId;
                this.search(value);

            }

        }
    }

    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void { }

    setSelectedShop(shop: IData) {
        this.listOfShops = [shop];
        this.onSelect(shop);
        this.onChange(shop);
    }

    handleFilter(value: string) {
        if (value && value !== '') {
            this.search(value);
        } else {
            this.listOfShops = [];
        }

    }

}
