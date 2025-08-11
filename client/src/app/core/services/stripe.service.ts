import { inject, Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeAddressElement, StripeAddressElementOptions, StripeElements } from '@stripe/stripe-js'
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart.service';
import { Cart } from '../../shared/models/cart';
import { firstValueFrom, map } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  private cartService = inject(CartService);
  private elements?: StripeElements;
  private addressElemet?: StripeAddressElement;
  private accountService = inject(AccountService);

  constructor() {
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }

  getStripeInstance() {
    return this.stripePromise;
  }

  async initializeElemets() {
    if (!this.elements) {
      const stripe = await this.getStripeInstance();
      if (stripe) {
        const cart = await firstValueFrom(this.createOrUpdatePaymentIntent());
        this.elements = stripe.elements(
          { clientSecret: cart.clientSecret, appearance: { labels: 'floating' } }
        )
      } else {
        throw new Error('Stripe has not been loaded');
      }
    }

    return this.elements;
  }

  async createAddressElement() {
    if (!this.addressElemet) {
      const elements = await this.initializeElemets();
      if (elements) {
        const user = this.accountService.currentUser();
        let defaultValues: StripeAddressElementOptions['defaultValues'] = {};

        if (user) {
          defaultValues.name = user.firstName + ' ' + user.lastName;
        }

        if (user?.address) {
          defaultValues.address = {
            line1: user.address.line1,
            line2: user.address.line2,
            city: user.address.city,
            state: user.address.state,
            country: user.address.country,
            postal_code: user.address.postalCode
          }
        }

        const options: StripeAddressElementOptions = {
          mode: 'shipping',
          defaultValues
        }
        this.addressElemet = elements.create('address', options);
      } else {
        throw new Error('Elements instance has not been loaded');
      }
    }
    return this.addressElemet;
  }

  createOrUpdatePaymentIntent() {
    const cart = this.cartService.cart();

    if (!cart) throw new Error('Problem with cart');
    return this.http.post<Cart>(this.baseUrl + 'payments/' + cart.id, {}).pipe(
      map(cart => {
        this.cartService.setCart(cart);
        return cart;
      })
    )
  }

  disposeElements () {
    this.elements = undefined;
    this.addressElemet = undefined;
  }
}
