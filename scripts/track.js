import { orderCart } from "../data/orderCart.js";
import { getProduct } from "../data/products.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

const params = new URLSearchParams(window.location.search);
const orderId = params.get('orderId');
const productId = params.get('productId');

let trackHTML = '';

if (orderId && productId) {
  const order = orderCart.find(o => o.orderId === orderId);

  if (order) {
    const orderItem = order.products.find(p => p.productId === productId);

    if (orderItem) {
      const product = getProduct(productId);

      const placedDate = new Date(orderItem.orderPlacedDate + ", " + new Date().getFullYear());
      const arrivingDate = new Date(orderItem.arrivingDate + ", " + new Date().getFullYear());

      const shipDate = new Date(placedDate.getTime() + (arrivingDate.getTime() - placedDate.getTime()) / 2);

      const today = new Date();

      let status = "Preparing";
      let progressPercent = 10;

      if (today.getTime() >= shipDate.getTime() && today.getTime() < arrivingDate.getTime()) {
        status = "Shipped";
        progressPercent = 50;
      } else if (today.getTime() >= arrivingDate.getTime()) {
        status = "Delivered";
        progressPercent = 100;
      }

      trackHTML = `
        <div class="delivery-date">
          Arriving on ${orderItem.arrivingDate}
        </div>

        <div class="product-info">${product.name}</div>
        <div class="product-info">Quantity: ${orderItem.quantity}</div>

        <img class="product-image" src="${product.image}">

        <div class="progress-labels-container">
          <div class="progress-label ${status === 'Preparing' ? 'current-status' : ''}">Preparing</div>
          <div class="progress-label ${status === 'Shipped' ? 'current-status' : ''}">Shipped</div>
          <div class="progress-label ${status === 'Delivered' ? 'current-status' : ''}">Delivered</div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar" style="width:${progressPercent}%"></div>
        </div>
      `;
    } else {
      trackHTML = `<div>Product not found in this order.</div>`;
    }
  } 
  else {
    trackHTML = `<div>Order not found.</div>`;
  }
} 
else {
  trackHTML = `<div>Invalid tracking info.</div>`;
}

const trackContainer = document.querySelector('.js-item-track');
if (trackContainer) {
  trackContainer.innerHTML = trackHTML;
}
