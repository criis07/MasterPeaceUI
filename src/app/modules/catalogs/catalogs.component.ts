import {
  AsyncPipe,
  CurrencyPipe,
  NgClass,
  NgTemplateOutlet,
} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ProductsService } from 'app/modules/products.service';
import {
  InventoryBrand,
  InventoryCategory,
  InventoryPagination,
  InventoryProduct,
  InventoryTag,
  InventoryVendor,
  Batch,
  Catalogs
} from 'app/modules/products/products.types';
import {
  Observable,
  Subject,
  debounceTime,
  map,
  merge,
  switchMap,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'catalogs',
  standalone: true,
  templateUrl: './catalogs.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    /* language=SCSS */
    `
        .inventory-grid {
            grid-template-columns: 48px auto 40px;

            @screen sm {
                grid-template-columns: 48px auto 112px 72px;
            }

            @screen md {
                grid-template-columns: 48px 112px auto 112px 72px;
            }

            @screen lg {
                grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
            }
        }
    `,
],
changeDetection: ChangeDetectionStrategy.OnPush,
animations: fuseAnimations,
imports: [
    MatProgressBarModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSortModule,
    NgTemplateOutlet,
    MatPaginatorModule,
    NgClass,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatRippleModule,
    AsyncPipe,
    CurrencyPipe,
  ],
})
export class CatalogsComponent implements OnInit
{    
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  isLoading: boolean = false;
  products$: Observable<InventoryProduct[]>;
    /**
     * Constructor
     */
    constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      private _fuseConfirmationService: FuseConfirmationService,
      private _formBuilder: UntypedFormBuilder,
      private _productsService: ProductsService
    )
    {
      
    }
  ngOnInit(): void {
            // Get the products
            this.products$ = this._productsService.products$;
            console.log(this.products$);
  }
    createCatalog(): void{
      console.log('creando catalogo');
    }

}
