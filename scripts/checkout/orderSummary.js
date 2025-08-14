import { cart, removeFromCart, updateDeliveryOption, saveToStorage } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';

import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {
  let cartSummaryHTML = '';

  if (cart.length === 0) {
    cartSummaryHTML = '<div class="cart-empty-message">Your cart is empty.</div>';
  } else {
    cart.forEach((cartItem) => {
      const productId = cartItem.productId;
      const matchingProduct = getProduct(productId);
      const deliveryOptionId = cartItem.deliveryOptionId;
      const deliveryOption = getDeliveryOption(deliveryOptionId);

      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
      );
      const dateString = deliveryDate.format('dddd, MMMM D');

      cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>

              <input type="number" class="quantity-input" value="${cartItem.quantity}" min="1" style="display:none; width:50px; margin-left:8px;">

              <button class="update-quantity-button link-primary" type="button">Update</button>

              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>`;
    });
  }

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
      );
      const dateString = deliveryDate.format('dddd, MMMM D');

      const priceString =
        deliveryOption.priceCents === 0
          ? 'FREE'
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">${priceString} Shipping</div>
          </div>
        </div>`;
    });

    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      if (container) container.remove();

      renderPaymentSummary();
      renderOrderSummary();  
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);

      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.update-quantity-button').forEach((button) => {
    button.addEventListener('click', () => {
      const container = button.closest('.cart-item-container');
      if (!container) return;

      const quantityLabel = container.querySelector('.quantity-label');
      const quantityInput = container.querySelector('.quantity-input');

      if (button.textContent === 'Update') {
        quantityLabel.style.display = 'none';
        quantityInput.style.display = 'inline-block';
        button.textContent = 'Save';
        quantityInput.focus();
      } else {
        const newQuantity = parseInt(quantityInput.value, 10);

        if (isNaN(newQuantity) || newQuantity < 1|| newQuantity>10) {
          alert('Please enter a quantity between 1 or 10.');
          quantityInput.focus();
          return;
        }

        const cartItemClass = Array.from(container.classList).find((c) =>
          c.startsWith('js-cart-item-container-')
        );
        if (!cartItemClass) return;

        const productId = cartItemClass.replace('js-cart-item-container-', '');

        const cartItem = cart.find((item) => item.productId === productId);

        if (cartItem) {
          cartItem.quantity = newQuantity;
          saveToStorage();

          quantityLabel.textContent = newQuantity;
          quantityLabel.style.display = 'inline';
          quantityInput.style.display = 'none';
          button.textContent = 'Update';

          renderPaymentSummary();
          renderOrderSummary();  
        }
        renderOrderSummary();
      }
    });
  });
}
