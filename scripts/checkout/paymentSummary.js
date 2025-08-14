import {cart} from '../../data/cart.js';

import { getProduct } from '../../data/products.js';

import { getDeliveryOption } from '../../data/deliveryOptions.js';

import  {formatCurrency}  from '../utils/money.js';
import { addToOrderCart } from '../../data/orderCart.js';

import { renderOrderSummary } from './orderSummary.js';


export function renderPaymentSummary(){
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem)=>{

    const product=getProduct(cartItem.productId);
     productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption=getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents+=deliveryOption.priceCents
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  
  const taxCents = totalBeforeTaxCents * 0.1;

  const totalCents = taxCents + totalBeforeTaxCents;

  const paymentSummaryHTMl = `
   <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (3):</div>
            <div class="payment-summary-money">
            $${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">
            $${formatCurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">
            $${formatCurrency(totalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">
            $${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">
            $${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button js-place-order-button button-primary">
            Place your order
          </button>
  `;
  document.querySelector('.js-payment-summary')
  .innerHTML = paymentSummaryHTMl;
  
  function updateHeaderCartQuantity() {

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  
    const quantityElement = document.querySelector('.js-cart-quantity');
  
    if (quantityElement) {
      quantityElement.textContent = `${totalQuantity} item${totalQuantity !== 1 ? 's' : ''}`;
    }
  }
  
  updateHeaderCartQuantity();

  document.querySelector('.js-place-order-button')
  .addEventListener('click', () => {
    const orderId = crypto.randomUUID();
    const productIds = cart.map(item => item.productId);

    addToOrderCart(orderId, productIds);

    renderOrderSummary();
    renderPaymentSummary();
    document.querySelector('.js-order-summary').innerHTML = 
    '<div class="order-placed-message" style:"">Thanks! Your order has been placed.</div>';
});



}