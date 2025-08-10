import { CanActivateFn } from '@angular/router';
import { CartService } from '../services/cart.service';
import { inject } from '@angular/core';
import { SnackbarService } from '../services/snackbar.service';

export const cartGuard: CanActivateFn = (route, state) => {
  const cartService = inject(CartService);
  const snack = inject(SnackbarService)

  if (cartService.cart()?.items)
  {
    return true;
  } else {
    snack.error('Your cart is empty')
    return false;
  }
};
