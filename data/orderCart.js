import { products } from "./products.js";
import {cart} from './cart.js';
import { renderPaymentSummary } from "../scripts/checkout/paymentSummary.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { getDeliveryOption } from "./deliveryOptions.js";

export let orderCart = JSON.parse(localStorage.getItem('orderCart')) || [];


function saveOrderCart(){
  localStorage.setItem('orderCart', JSON.stringify(orderCart));
}

export function addToOrderCart(orderId,productIds) {
  let matchingItem;
  
  const today=dayjs();
  const dateString = today.format(
       'MMMM D'
    );

  const orderProducts = cart
    .filter(cartItem => productIds.includes(cartItem.productId))
    .map(cartItem => {
      // Calculate arriving date using deliveryOption
      const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
      const arrivingDate = dayjs().add(
        deliveryOption ? deliveryOption.deliveryDays : 3,
        'days'
      ).format('MMMM D');
      
      return {
        quantity: cartItem.quantity,
        arrivingDate,
        productId: cartItem.productId,
        orderPlacedDate: dateString
      };
    });

    const shippingCents = cart
    .filter(cartItem => productIds.includes(cartItem.productId))
    .reduce((sum, cartItem) => {
      const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
      return sum + (deliveryOption ? deliveryOption.priceCents : 0);
    }, 0);

    const productCents = orderProducts.reduce((sum, product) => {
      const matchingProduct = products.find(p => p.id === product.productId);
      return sum + (matchingProduct ? matchingProduct.priceCents * product.quantity : 0);
    }, 0);

   let totalCents = productCents + shippingCents;
   console.log(totalCents)
   totalCents+=totalCents*0.1;

   console.log(totalCents)
  orderCart.unshift({
      orderId :orderId,
      totalCents : totalCents,
      orderPlacedDate: dateString,
      products:orderProducts
    }
  );
  cart.length = 0;
  localStorage.setItem('cart', JSON.stringify(cart));
  saveOrderCart();
}