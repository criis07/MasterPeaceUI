import {
  AsyncPipe,
  CurrencyPipe,
  NgClass,
  NgTemplateOutlet,
  CommonModule 
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
    FormArray,
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
import { getAvatarImageSrc } from 'Utils/image.utils';
import { ProductDetail } from './products.types';
import { products } from '../../mock-api/apps/ecommerce/inventory/data';

@Component({
  selector: 'products',
  standalone: true,
  templateUrl: './products.component.html',
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
encapsulation: ViewEncapsulation.None,
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
    CommonModule
  ],
})
export class ProductsComponent 
implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    products$: Observable<InventoryProduct[]>;
    catalogs$: Observable<Catalogs[]>;
    batchs$:Observable<Batch[]>;


    brands: InventoryBrand[];
    categories: InventoryCategory[];
    catalogs: Catalogs[];
    batchs: Batch[];
    filteredTags: InventoryTag[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedProduct: InventoryProduct | null = null;
    selectedProductForm: UntypedFormGroup;
    tags: InventoryTag[];
    tagsEditMode: boolean = false;
    vendors: InventoryVendor[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _productsService: ProductsService
    ) {}

    ngOnInit(): void {
      // Create the selected product form
      this.selectedProductForm = this._formBuilder.group({
        id: [''],
        category: [''],
        name: ['', [Validators.required]],
        description: [''],
        tags: [[]],
        sku: [''],
        barcode: [''],
        brand: [''],
        vendor: [''],
        stock: [''],
        reserved: [''],
        cost: [''],
        basePrice: [''],
        taxPercent: [''],
        price: [''],
        weight: [''],
        thumbnail: [''],
        images: [[]],
        currentImageIndex: [0], // Image index that is currently being viewed
        active: [false],
        productId: [''],
        productCodeId: [''],
        importDate: [''],
        batchId: [''],
        Origin:[''],
        available: [''],
        productModel:[''],
        productDetails: this._formBuilder.array([])
      });

      // Get the pagination
      this._productsService.pagination$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((pagination: InventoryPagination) => {
              // Update the pagination
              this.pagination = pagination;

              // Mark for check
              this._changeDetectorRef.markForCheck();
          });

      // Get the catalogs
      this._productsService.catalogs$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((catalogs: Catalogs[]) => {
                  // Update the categories
                  this.catalogs = catalogs;
                  console.log('hola desde categorias', this.catalogs)
                  // Mark for check
                  this._changeDetectorRef.markForCheck();
              });

       this._productsService.batchs$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((batchs: Batch[]) => {
                  // Update the categories
                  this.batchs = batchs;
                  console.log('hola desde categorias', this.batchs)
                  // Mark for check
                  this._changeDetectorRef.markForCheck();
              });
    
      // Get the products
      console.log('Prueba productos var',this._productsService.products$)
      this.products$ = this._productsService.products$;
      console.log(this.products$);

      this.catalogs$ = this._productsService.catalogs$;
      console.log(this.catalogs$);

      this.batchs$ = this._productsService.batchs$;
      console.log(this.batchs$);

      // Subscribe to search input field value changes
      this.searchInputControl.valueChanges
          .pipe(
              takeUntil(this._unsubscribeAll),
              debounceTime(300),
              switchMap((query) => {
                  this.closeDetails();
                  this.isLoading = true;
                  return this._productsService.getProducts(
                      0,
                      10,
                      'name',
                      'asc',
                      query
                  );
              }),
              map(() => {
                  this.isLoading = false;
              })
          )
          .subscribe();
    }
    /**
     * After view init
     */
    ngAfterViewInit(): void {
      if (this._sort && this._paginator) {
          // Set the initial sort
          this._sort.sort({
              id: 'name',
              start: 'asc',
              disableClear: true,
          });

          // Mark for check
          this._changeDetectorRef.markForCheck();

          // If the user changes the sort order...
          this._sort.sortChange
              .pipe(takeUntil(this._unsubscribeAll))
              .subscribe(() => {
                  // Reset back to the first page
                  this._paginator.pageIndex = 0;

                  // Close the details
                  this.closeDetails();
              });

          // Get products if sort or page changes
          merge(this._sort.sortChange, this._paginator.page)
              .pipe(
                  switchMap(() => {
                      this.closeDetails();
                      this.isLoading = true;
                      return this._productsService.getProducts(
                          this._paginator.pageIndex,
                          this._paginator.pageSize,
                          this._sort.active,
                          this._sort.direction
                      );
                  }),
                  map(() => {
                      this.isLoading = false;
                  })
              )
              .subscribe();
      }
  }

        /**
     * On destroy
     */
        ngOnDestroy(): void {
          // Unsubscribe from all subscriptions
          this._unsubscribeAll.next(null);
          this._unsubscribeAll.complete();
      }
      /**
     * Close the details
     */
      closeDetails(): void {
        this.selectedProduct = null;
      }

          /**
     * Create product
     */
    createProduct(): void {
      // Create the product
      this._productsService.createProduct().subscribe((newProduct) => {
          // Go to new product
          this.selectedProduct = newProduct;

          // Fill the form
          this.selectedProductForm.patchValue(newProduct);

          // Mark for check
          this._changeDetectorRef.markForCheck();
      });
  }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
        /**
     * Toggle product details
     *
     * @param productId
     */
        toggleDetails(productId: number): void {
            // If the product is already selected...
            if (this.selectedProduct && this.selectedProduct.productId === productId) {
                // Close the details
                this.closeDetails();
                console.log(this.selectedProductForm.value);

                return;
            }

            // Get the product by id
            this._productsService.getProductById(productId).subscribe((product) => {
                // Set the selected product
                this.selectedProduct = product;
                console.log('hola desde get by id', product);
            
                // Fill the main form values
                this.selectedProductForm.patchValue({
                    productId: product.productId,
                    productCodeId: product.productCodeId,
                    importDate: product.importDate,
                    batchId: product.batchId,
                    available: product.available
                });
            
                // Clear the FormArray before filling it
                const productDetailsArray = this.selectedProductForm.get('productDetails') as FormArray;
                productDetailsArray.clear();
            
                // Fill the FormArray with ProductDetails
                product.productDetails.forEach(detail => {
                    productDetailsArray.push(this._formBuilder.group({
                        productDetailId: [detail.productDetailId],
                        amount: [detail.amount],
                        unitaryPrice: [detail.unitaryPrice],
                        productImage: [detail.productImage],
                        productModel: [detail.productModel]
                    }));
                    console.log('pushshh',productDetailsArray)
                    console.log('pushshh',product.productDetails)
                    console.log(this.selectedProductForm.get('productDetails').value);
                });
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
            });
        }
        
        getAvatarImageSrc(productImage: string): string {
            return `data:image/png;base64,${productImage}`;
        }
}
