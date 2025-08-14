import {cart, addToCart} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

let displayedProducts = [...products];

function renderProducts(displayedProducts){
  let productsHTML = '';

  displayedProducts.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          $${formatCurrency(product.priceCents)}
        </div>

        <div class="product-quantity-container js-quantity-container">
          <select>
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart js-add-to-cart">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart-button"
        data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });
  updateCartQuantity();
  document.querySelector('.js-products-grid').innerHTML = productsHTML;
  
  document.querySelectorAll('.js-add-to-cart-button')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;

      const quantitySelect = button.closest('.product-container').querySelector('select');  //qunatity selector
      if (!quantitySelect) {
        console.warn('No quantity select found, defaulting to 1');
        addToCart(productId, 1);
      } else {
        const selectedQuantity = parseInt(quantitySelect.value, 10) || 1;
        addToCart(productId, selectedQuantity);
      }

      updateCartQuantity();
      const added = button.closest('.product-container').querySelector('.js-add-to-cart'); // Added green checkmart transition
      added.style.opacity = '1';
      setTimeout(() => {
        added.style.opacity = '0';
      }, 1500);
      quantitySelect.value = "1";
    });
  });
}

renderProducts(displayedProducts); //showing default page with all products

const searchBar = document.getElementById('search-bar'); //on pressing Enter
const searchButton = document.getElementById('search-button');  //om pressing search button (image)

function filterProducts(){
  const searchText= searchBar.value.trim().toLowerCase();

  if(!searchText){
    renderProducts(products);
    return;
  }
  const searchedProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchText) ||
    (product.description && product.description.toLowerCase().includes(searchText))
  );
  renderProducts(searchedProducts);
} // STORING ALL PRODUCTS ON THE BASIS OF INITIAL ENTERED IN SEARCHBAR

searchBar.addEventListener('keydown', (event)=>{ //LISTEN FOR THE ENTER KEY
  if(event.key==='Enter'){
    filterProducts();
  }
});

searchButton.addEventListener(('click'), filterProducts);

function updateCartQuantity() {   //update Cart Quantity
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector('.js-cart-quantity')
    .innerHTML = cartQuantity;
}


