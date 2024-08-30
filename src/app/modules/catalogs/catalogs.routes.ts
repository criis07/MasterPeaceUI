import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { CatalogsComponent } from './catalogs.component';
import { ProductsService } from '../products.service';

export default [
    {
        path     : '',
        component: CatalogsComponent,
    },
] as Routes;