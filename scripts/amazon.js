import { cart, addToCart } from "../data/cart.js";
import { products } from "../data/products.js";
let htmlText = "";
products.forEach((product) => {
  htmlText += `
  <div class="product-container">
    <div class="product-image-container">
      <img
        class="product-image"
        src="${product.image}"
      />
    </div>

    <div class="product-name limit-text-to-2-lines">
      ${product.name}
    </div>

    <div class="product-rating-container">
      <img class="product-rating-stars" src="images/ratings/rating-${
        product.rating.stars * 10
      }.png" />
      <div class="product-rating-count link-primary">${
        product.rating.count
      }</div>
    </div>

    <div class="product-price">$${product.priceCents / 100}</div>
    <div class="product-quantity-container">
      <select name="amazonName" class="js-quantity-selector-${product.id}">
        <option selected value="1">
          1
        </option>
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

    <div class="added-to-cart just-added-${product.id}">
      <img src="images/icons/checkmark.png" />
      Added
    </div>
    <button class="add-to-cart-button button-primary" data-product-id="${
      product.id
    }">Add to Cart</button>
  </div>`;
});

function addedAnimation(productId) {
  let addedToCart = document.querySelector(`.just-added-${productId}`);
  addedToCart.classList.add("recently-added");
  setTimeout(() => {
    if (fresh) {
      clearTimeout(fresh);
    }
    const newElement = setTimeout(() => {
      console.log(productId);
      addedToCart.classList.remove("recently-added");
    }, 2000);
    fresh = newElement;
  });
}

document.querySelector(".products-grid").innerHTML = htmlText;

let fresh;
document.querySelectorAll(".button-primary").forEach((element) => {
  //1st EventListener
  element.addEventListener("click", () => {
    const productId = element.dataset.productId;
    addedAnimation(productId);
    addToCart(productId);
  });
});
