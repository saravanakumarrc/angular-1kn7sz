import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <div style='display:flex'>
      <app-shop-search [label]="'*Shop:'" class="form-control" [group]="testForm"
							[advSearchEnabled]="true" formControlName="shop" name="shop1">
						</app-shop-search>
            <app-shop-search [label]="'*Shop:'" class="form-control" [group]="testForm"
							[advSearchEnabled]="true" formControlName="shop" name="shop1">
						</app-shop-search>
    </div>
  `
})
export class AppComponent {
    value = { text: "Small", value: 1 };
}
