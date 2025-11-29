import { cart, addToCart, calculateCartQuantity } from "../data/cart.js";
import { products, loadProductsFetch } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
loadProductsFetch().then(() => {
  renderProductsGrid();
});
function renderProductsGrid() {
  let htmlText = "";
  const url = new URL(window.location.href);
  const search = url.searchParams.get("search");
  let filterProducts = products;
  function searchUpdation() {
    document
      .querySelector(".search-button")
      .addEventListener("click", () => {
        const search = document.querySelector(".search-bar").value;
        if (search!='') {
          window.location.href = `amazon.html?search=${search}`;
        }
        else {
          window.location.href = 'amazon.html';
        }
      });
    document
      .querySelector(".search-bar")
      .addEventListener("keypress", (event) => {
        if (event.key == "Enter") {
          const search = document.querySelector(".search-bar").value;
          if (search != "") {
            window.location.href = `amazon.html?search=${search}`;
          } else {
            window.location.href = "amazon.html";
          }
        }
      });
  }

  if (search) {
    filterProducts = products.filter((product) => {
      let matchingKeyword = false;
      product.keywords.forEach((keyword) => {
        if (keyword.toLowerCase().includes(search.toLowerCase())) {
          matchingKeyword = true;
        }
      });
      return (
        matchingKeyword ||
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    });
  }
  const noResult = document.querySelector(".empty-results-message");
  if (filterProducts.length === 0) {
    noResult.style.display ='block';
    document.querySelector('.products-grid').innerHTML ="";
    document.querySelector(".cart-quantity").innerHTML =
      calculateCartQuantity();
      document.querySelector(".js-search-bar").value=search;
      searchUpdation()
    // renderProductsGrid()
  } else {
    document.querySelector(".js-search-bar").value = search;
    noResult.style.display = 'none';
    filterProducts.forEach((product) => {
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
      <img class="product-rating-stars" src="${product.getStarsUrl()}" />
      <div class="product-rating-count link-primary">${
        product.rating.count
      }</div>
    </div>

    <div class="product-price">$${product.getPrice()}</div>
    <div class="product-quantity-container">
      <select name="amazonName" class="js-quantity-selector-${product.id}">
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
      ${product.extraInfoHtml()}
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
    function toggleDropdownMenu() {
    const toggleBtn = document.querySelector(".js-hamburger-menu-toggle");
    const dropdownMenu = document.querySelector(".js-hamburger-menu-dropdown");
    toggleBtn.addEventListener('click', ()=> {
      const isOpened = dropdownMenu.classList.contains("hamburger-menu-opened");

      if (!isOpened) {
        dropdownMenu.classList.add("hamburger-menu-opened");
      } else {
        dropdownMenu.classList.remove("hamburger-menu-opened");
      }
    })
  }

    document.querySelector(".products-grid").innerHTML = htmlText;
    document.querySelector(".cart-quantity").innerHTML =
      calculateCartQuantity();
    document.querySelector(".js-cart-quantity-mobile").innerHTML =
      calculateCartQuantity();
    function addedAnimation(productId) {
      let addedToCart = document.querySelector(`.just-added-${productId}`);
      addedToCart.classList.add("recently-added");
      if (fresh[productId]) {
        clearTimeout(fresh[productId]);
      }
      fresh[productId] = setTimeout(() => {
        addedToCart.classList.remove("recently-added");
      }, 2000);
    }

    
    let fresh = {};
    document.querySelectorAll(".button-primary").forEach((element) => {
      //1st EventListener
      element.addEventListener("click", () => {
        const productId = element.dataset.productId;
        addedAnimation(productId);
        addToCart(productId);
      });
    });
    toggleDropdownMenu();
    
  }
}
