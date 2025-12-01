import { getProduct, loadProductsFetch} from "../data/products.js";
import { orders } from "../data/orders.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {calculateCartQuantity} from "../data/cart.js";


async function loadTrackingPage() {
  await loadProductsFetch();
  const url = new URL(window.location.href);
  const today = dayjs();
  let percentProgress;
  let nrmlValue = false;
  let matchedItem;
  let deliveryTime;
  let itemQuantity;
  let orderTime;
  let finalDate;
  orders.some((element) => {
    if (url.searchParams.get("orderId") === element.id) {
      element.products.some((selectedItem) => {
        if (url.searchParams.get("productId") === selectedItem.productId) {
          matchedItem = getProduct(selectedItem.productId);
          deliveryTime = dayjs(selectedItem.estimatedDeliveryTime);
          finalDate = dayjs(selectedItem.estimatedDeliveryTime);
          orderTime = dayjs(element.orderTime);
          const secondsPassed = today.diff(orderTime, "second");
          const totalSeconds = deliveryTime.diff(orderTime, "second");
          percentProgress = (secondsPassed / totalSeconds) * 100;
          itemQuantity = selectedItem.quantity;
          nrmlValue = true;
          return true;
        }
      });
    }
    if (nrmlValue) {
      return true;
    }
  });
  let trackingHTML = `
  <div class="order-tracking">
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all order
    </a>
    <div class="delivery-date">Arriving on ${deliveryTime.format(
      "dddd, MMMM D"
    )}</div>

    <div class="product-info">
      ${matchedItem.name}
    </div>

    <div class="product-info">Quantity: ${itemQuantity}</div>

    <img
      class="product-image"
      src="${matchedItem.image}"
    />

    <div class="progress-labels-container">
      <div class="progress-label ${
        percentProgress < 50 ? "current-status" : ""
      }">Preparing</div>
      <div class="progress-label ${
        percentProgress >= 50 && percentProgress < 100 ? "current-status" : ""
      }">Shipped</div>
      <div class="progress-label ${
        percentProgress >= 100 ? "current-status" : ""
      }">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentProgress}%;"></div>
    </div>
  </div>`;

  function toggleDropdownMenu() {
    const toggleBtn = document.querySelector(".js-hamburger-menu-toggle");
    const dropdownMenu = document.querySelector(
      ".js-hamburger-menu-dropdown"
    );
    toggleBtn.addEventListener("click", () => {
      const isOpened = dropdownMenu.classList.contains(
        "hamburger-menu-opened"
      );

      if (!isOpened) {
        dropdownMenu.classList.add("hamburger-menu-opened");
      } else {
        dropdownMenu.classList.remove("hamburger-menu-opened");
      }
    });
  }
  toggleDropdownMenu();
  document.querySelector(".main").innerHTML = trackingHTML;
  document.querySelector(".cart-quantity").innerHTML = calculateCartQuantity();
  document.querySelector(".js-cart-quantity-mobile").innerHTML =
    calculateCartQuantity();
}
loadTrackingPage();
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
