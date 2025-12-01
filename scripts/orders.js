import { getProduct, loadProductsFetch } from "../data/products.js";
import { orders } from "../data/orders.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { formatCurrency } from "./utils/money.js";
import { addToCart, calculateCartQuantity, cart } from "../data/cart.js";

async function loadPage() {
  await loadProductsFetch();

  let ordersHTML = "";

  orders.forEach((order) => {
    const orderTimeString = dayjs(order.orderTime).format("MMMM D");

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderTimeString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${productsListHTML(order)}
        </div>
      </div>
    `;
  });

  function productsListHTML(order) {
    let productsListHTML = "";

    order.products.forEach((productDetails) => {
      const product = getProduct(productDetails.productId);

      productsListHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${dayjs(productDetails.estimatedDeliveryTime).format(
              "MMMM D"
            )}
          </div>
          <div class="product-quantity">
            Quantity: ${productDetails.quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again" data-product-id="${
            product.id
          }">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    return productsListHTML;
  }
  function toggleDropdownMenu() {
    const toggleBtn = document.querySelector(".js-hamburger-menu-toggle");
    const dropdownMenu = document.querySelector(".js-hamburger-menu-dropdown");
    toggleBtn.addEventListener("click", () => {
      const isOpened = dropdownMenu.classList.contains("hamburger-menu-opened");

      if (!isOpened) {
        dropdownMenu.classList.add("hamburger-menu-opened");
      } else {
        dropdownMenu.classList.remove("hamburger-menu-opened");
      }
    });
  }
  document.querySelector(".cart-quantity").innerHTML = calculateCartQuantity();
  document.querySelector(".orders-grid").innerHTML = ordersHTML;
  document.querySelector(".js-cart-quantity-mobile").innerHTML =
    calculateCartQuantity();
  document.querySelectorAll(".js-buy-again").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.productId);
      button.innerHTML = `<div class="buy-again-success">✔ Added</div> `;
      setTimeout(() => {
        button.innerHTML = `
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        `;
      }, 1000);
    });
  });
  toggleDropdownMenu();
}

loadPage();
document.querySelector(".search-button").addEventListener("click", () => {
  const search = document.querySelector(".search-bar").value;
  if (search != "") {
    window.location.href = `index.html?search=${search}`;
  } else {
    window.location.href = "index.html";
  }
});
document.querySelector(".search-bar").addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    const search = document.querySelector(".search-bar").value;
    if (search != "") {
      window.location.href = `index.html?search=${search}`;
    } else {
      window.location.href = "index.html";
    }
  }
});