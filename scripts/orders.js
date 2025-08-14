import { renderOrderSummary } from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
import {cart, addToCart} from '../data/cart.js';
import { orderCart } from '../data/orderCart.js';
import {formatCurrency} from './utils/money.js';
import {products, getProduct} from '../data/products.js';

export function orderCartUpdate(){
    
 
   let orderCartNew ='';

   orderCart.forEach((item) => {
    
    orderCartNew+= `
      <div class="order-container">

        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${item.orderPlacedDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(item.totalCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${item.orderId}</div>
          </div>
        </div>

        <div class="order-details-grid js-order-details-grid" 
        id="details-${item.orderId}">
          
        </div>
      </div>
    `;
   });
  document.querySelector('.js-order-grid')
    .innerHTML = orderCartNew;

    orderCart.forEach((order)=>{

      let orderCartDetail ='';

      order.products.forEach((orderItem)=>{
      const productId = orderItem.productId;
      

      const matchingProduct = getProduct(productId);

      orderCartDetail +=`  
      <div class="product-image-container">
          <img src="${matchingProduct.image}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${orderItem.arrivingDate}
          </div>
          <div class="product-quantity">
            Quantity: ${orderItem.quantity}
          </div>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=${order.orderId}&productId=${matchingProduct.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>

        </div>
      `;
    })
    document.querySelector(`#details-${order.orderId}`)
    .innerHTML = orderCartDetail;
    })
}
let totalCents=0;

orderCartUpdate();
function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector('.js-cart-quantity')
    .innerHTML = cartQuantity;
}
updateCartQuantity();