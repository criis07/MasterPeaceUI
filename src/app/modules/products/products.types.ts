export interface InventoryProduct {
    productId: number;
    productCodeId: number;
    importDate: string;
    batchId: number;
    available: boolean;
    productDetails: ProductDetail[];
}
export interface ProductDetail {
    productDetailId: number;
    amount: number;
    unitaryPrice: number;
    productImage: string;
    productModel: string;
  }

export interface InventoryPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface InventoryCategory {
    id: string;
    parentId: string;
    name: string;
    slug: string;
}
export interface InventoryBrand {
    id: string;
    name: string;
    slug: string;
}

export interface InventoryTag {
    id?: string;
    title?: string;
}

export interface InventoryVendor {
    id: string;
    name: string;
    slug: string;
}

export interface Catalogs{
    catalogId: number;
    productCode: string;
    catalogDescription: string;
}

export interface Batch{
    batchId: number;
    origin: string;
    importDate: Date;
    grossPrice: number;
    profitMargin: number;
    importCost: number;
    transportCost: number;
}
