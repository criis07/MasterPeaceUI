import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { ProductsComponent } from './products.component';
import { ProductsService } from '../products.service';

export default [
    {
        path     : '',
        component: ProductsComponent,
        children:[
            {
                path:'',
                component: ProductsComponent,
                resolve:{
                    catalogs: ()=> inject(ProductsService).getCatalogs(),
                    products: ()=> inject(ProductsService).getProducts(),
                    batchs: ()=> inject(ProductsService).getBaths()
                }
            }
        ]
    },
] as Routes;