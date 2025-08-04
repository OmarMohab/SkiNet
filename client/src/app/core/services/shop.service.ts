import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { pagination } from '../../shared/models/pagination';
import { Product } from '../../shared/models/product';
import { shopParams } from '../../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  
  private http = inject(HttpClient);
  baseUrl = 'https://localhost:5001/api/'
  types: string[] = [];
  brands: string[] = [];

  getProducts(shopParams: shopParams){
    let params = new HttpParams();

    if (shopParams.brands.length > 0) {
      params = params.append('brands', shopParams.brands.join(','))
    }

    if (shopParams.types.length > 0) {
      params = params.append('types', shopParams.types.join(','))
    }

    if (shopParams.sort) {
      params = params.append('sort', shopParams.sort);
    }

    if (shopParams.search) {
      params = params.append('search', shopParams.search)
    }

    params = params.append('pageSize', shopParams.PageSize);
    params = params.append('pageIndex', shopParams.pageNumber);

    return this.http.get<pagination<Product>>(this.baseUrl + 'products', { params })
  }

  getBrands(){
    if (this.brands.length > 0) return;

    return this.http.get<string[]>(this.baseUrl + 'products/brands').subscribe({
      next: response => this.brands = response
    })
  }

  getTypes(){
    if (this.types.length > 0) return;

    return this.http.get<string[]>(this.baseUrl + 'products/types').subscribe({
      next: response => this.types = response
    })
  }
}
