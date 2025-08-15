import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../shared/models/order';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddressPipe } from "../../shared/pipes/address-pipe";
import { PaymentPipe } from "../../shared/pipes/payment-pipe";

@Component({
  selector: 'app-order-detailed',
  imports: [
    MatCardModule,
    MatButton,
    DatePipe,
    CurrencyPipe,
    AddressPipe,
    PaymentPipe,
    RouterLink
],
  templateUrl: './order-detailed.component.html',
  styleUrl: './order-detailed.component.scss'
})
export class OrderDetailedComponent implements OnInit{
  private orderService = inject(OrderService);
  private ActivatedRoute = inject(ActivatedRoute);
  order?: Order; 

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder() {
    const id = this.ActivatedRoute.snapshot.paramMap.get('id');

    if (!id) return;

    this.orderService.getOrderDetailed(+id).subscribe({
      next: order => this.order = order
    })
  }
}
