import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    BehaviorSubject,
    Observable,
    filter,
    map,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { environment } from 'Environments/Environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

      // Private
      private _brands: BehaviorSubject<InventoryBrand[] | null> =
      new BehaviorSubject(null);
  private _categories: BehaviorSubject<InventoryCategory[] | null> =
      new BehaviorSubject(null);
  private _pagination: BehaviorSubject<InventoryPagination | null> =
      new BehaviorSubject(null);
  private _product: BehaviorSubject<InventoryProduct | null> =
      new BehaviorSubject(null);
  private _products: BehaviorSubject<InventoryProduct[] | null> =
      new BehaviorSubject(null);
  private _tags: BehaviorSubject<InventoryTag[] | null> = 
      new BehaviorSubject(null);
  private _vendors: BehaviorSubject<InventoryVendor[] | null> =
      new BehaviorSubject(null);
  private _catalog: BehaviorSubject<Catalogs | null> =
      new BehaviorSubject(null);
  private _catalogs: BehaviorSubject<Catalogs[] | null> =
      new BehaviorSubject(null);
  private _batchs: BehaviorSubject<Batch[] | null> =
      new BehaviorSubject(null);
  private apiUrl = environment.apiUrl;
  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  get products$(): Observable<InventoryProduct[]> {
    return this._products.asObservable();
  }

  get catalogs$(): Observable<Catalogs[]>{
    return this._catalogs.asObservable();
  }

  get batchs$(): Observable<Batch[]>{
    return this._batchs.asObservable();
  }
    /**
     * Getter for pagination
     */
    get pagination$(): Observable<InventoryPagination> {
      return this._pagination.asObservable();
  }

  /**
     * Get products
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
  getProducts(
    page: number = 0,
    size: number = 10,
    sort: string = 'name',
    order: 'asc' | 'desc' | '' = 'asc',
    search: string = ''
): Observable<{
    pagination: InventoryPagination;
    products: InventoryProduct[];
}> {
    console.log(this.apiUrl);
    return this._httpClient
        .get<{
            pagination: InventoryPagination;
            products: InventoryProduct[];
        }>(`${this.apiUrl}/api/v1/products`, {
            params: {
                page: '' + page,
                size: '' + size,
                sort,
                order,
                search,
            },
        })
        .pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._products.next(response.products);
                console.log('hola desde get product',response);
                console.log('paginacion?', response.pagination);
            })
        );
    }

        /**
     * Get categories
     */
    getCatalogs(): Observable<Catalogs[]> {
        return this._httpClient
            .get<Catalogs[]>(`${this.apiUrl}/api/v1/catalogs`)
            .pipe(
                tap((catalogs) => {
                    this._catalogs.next(catalogs);
                })
            );
    }

    getBaths(): Observable<Batch[]> {
        return this._httpClient
            .get<Batch[]>(`${this.apiUrl}/api/v1/batch`)
            .pipe(
                tap((batchs) => {
                    this._batchs.next(batchs);
                })
            );
    }

        /**
     * Get product by id
     */
        getProductById(id: number): Observable<InventoryProduct> {
            return this._products.pipe(
                take(1),
                map((products) => {
                    // Find the product
                    const product = products.find((item) => item.productId === id) || null;
    
                    // Update the product
                    this._product.next(product);
    
                    // Return the product
                    return product;
                }),
                switchMap((product) => {
                    if (!product) {
                        return throwError(
                            'Could not found product with id of ' + id + '!'
                        );
                    }
    
                    return of(product);
                })
            );
        }

        getCatalogById(id: number): Observable<Catalogs> {
            return this._catalogs.pipe(
                take(1),
                map((catalogs) => {
                    // Find the product
                    const catalog = catalogs.find((item) => item.catalogId === id) || null;
    
                    // Update the product
                    this._catalog.next(catalog);
    
                    // Return the product
                    return catalog;
                }),
                switchMap((catalog) => {
                    if (!catalog) {
                        return throwError(
                            'Could not found product with id of ' + id + '!'
                        );
                    }
    
                    return of(catalog);
                })
            );
        }
    /**
     * Create product
     */
    createProduct(): Observable<InventoryProduct> {
      return this.products$.pipe(
          take(1),
          switchMap((products) =>
              this._httpClient
                  .post<InventoryProduct>(
                      'api/apps/ecommerce/inventory/product',
                      {}
                  )
                  .pipe(
                      map((newProduct) => {
                          // Update the products with the new product
                          this._products.next([newProduct, ...products]);

                          // Return the new product
                          return newProduct;
                      })
                  )
          )   
        );
  }
}
