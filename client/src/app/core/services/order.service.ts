import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Order, OrderToCreate } from '../../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  createOrder(OrderToCreate: OrderToCreate) {
    return this.http.post<Order>(this.baseUrl + 'orders', OrderToCreate)
  }

  getOrdersForUser() {
    this.http.get<Order[]>(this.baseUrl + 'orders');
  }

  getOrderDetailed(id: number) {
    this.http.get<Order>(this.baseUrl + 'orders/' + id)
  }
}
