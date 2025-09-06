import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  saveToStorage,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

let checkhtml = "";
cart.forEach((element) => {
  const productId = element.productId;
  const quantity = element.quantity;
  let matchingItem;

  products.forEach((productItem) => {
    if (productItem.id === productId) {
      matchingItem = productItem;
    }
  });
  checkhtml += `
    <div class="cart-item-container next-level-${
      matchingItem.id
    } js-cart-container-${matchingItem.id}">
      <div class="delivery-date">Delivery date: Tuesday, June 21</div>

      <div class="cart-item-details-grid">
        <img
        class="product-image"
        src="${matchingItem.image}"
        />

          <div class="cart-item-details">
          <div class="product-name">
            ${matchingItem.name}
          </div>
          <div class="product-price">$${formatCurrency(
            matchingItem.priceCents
          )}</div>
          <div class="product-quantity">
            <span> Quantity: <span class="quantity-label quantity-label-${
              matchingItem.id
            }">${quantity}</span> </span>
            <span class="update-quantity-link link-primary upadate-quantity-${
              matchingItem.id
            }" data-product-id = "${matchingItem.id}">
            Update
            
            </span>
            <input class="quantity-input quantity-input-${
              matchingItem.id
            }" data-product-id="${
    matchingItem.id
  }" type="number" name="amazonValue">
            <span class="save-quantity-link link-primary" data-product-id="${
              matchingItem.id
            }">Save</span>
            <span class="delete-quantity-link link-primary" data-product-id="${
              matchingItem.id
            }">
            Delete
            </span>
          </div>
          </div>

          <div class="delivery-options">
          <div class="delivery-options-title">
              Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input
            type="radio"
            checked
            class="delivery-option-input"
            name="delivery-option-${matchingItem.id}"
            />
            <div>
            <div class="delivery-option-date">Tuesday, June 21</div>
            <div class="delivery-option-price">FREE Shipping</div>
            </div>
          </div>
          <div class="delivery-option">
            <input
            type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingItem.id}"
            />
            <div>
            <div class="delivery-option-date">Wednesday, June 15</div>
            <div class="delivery-option-price">$4.99 - Shipping</div>
            </div>
        </div>
        <div class="delivery-option">
            <input
            type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingItem.id}"
            />
            <div>
            <div class="delivery-option-date">Monday, June 13</div>
            <div class="delivery-option-price">$9.99 - Shipping</div>
            </div>
          </div>
          </div>
        </div>
          </div>
          `;
});

function deletion() {
  document.querySelectorAll(".delete-quantity-link").forEach((element) => {
    const productId = element.dataset.productId;
    element.addEventListener("click", () => {
      removeFromCart(productId);
      document.querySelector(`.next-level-${productId}`).remove();
      document.querySelector(
        ".return-to-home-link"
      ).innerHTML = `${calculateCartQuantity()} Items`;
    });
  });
}

function updation() {
  document.querySelectorAll(".update-quantity-link").forEach((element) => {
    element.addEventListener("click", () => {
      const productId = element.dataset.productId;
      const container = document.querySelector(
        `.js-cart-container-${productId}`
      );
      container.classList.add("is-editing-quantity");
    });
  });
}
function UsingSaveButton() {
  document
    .querySelectorAll(".save-quantity-link")
    .forEach((quantitySelected) => {
      quantitySelected.addEventListener("click", () => {
        const productId = quantitySelected.dataset.productId;
        const container = document.querySelector(
          `.js-cart-container-${productId}`
        );
        let newValue = document.querySelector(`.quantity-input-${productId}`);
        cart.forEach((element) => {
          if (element.productId === productId) {
            if (newValue.value === "") {
              newValue.value = 0;
            } else if (newValue.value > 0) {
              element.quantity = Number(newValue.value);
            }
            saveToStorage();
            document.querySelector(`.quantity-label-${productId}`).innerHTML =
              element.quantity;
            document.querySelector(".return-to-home-link").innerHTML = `
              ${calculateCartQuantity()} Items`;
          }
        });

        container.classList.remove("is-editing-quantity");
      });
    });
}
function UsingEnter() {
  document.querySelectorAll(".quantity-input").forEach((inputElement) => {
    const productId = inputElement.dataset.productId;
    let newvalue = document.querySelector(`.quantity-input-${productId}`);
    newvalue.addEventListener("keydown", (event) => {
      const container = document.querySelector(
        `.js-cart-container-${productId}`
      );
      let newValue = newvalue.value;
      if (event.key == "Enter") {
        cart.forEach((element) => {
          if (element.productId === productId) {
            if (newValue == "") {
              newValue = 0;
            } else if (newValue > 0) {
              element.quantity = Number(newValue);
            }
            saveToStorage();
            document.querySelector(`.quantity-label-${productId}`).innerHTML =
              element.quantity;
            document.querySelector(".return-to-home-link").innerHTML = `
              ${calculateCartQuantity()} Items`;
          }
        });
        container.classList.remove("is-editing-quantity");
      }
    });
  });
}

function saving() {
  UsingSaveButton();
  UsingEnter();
}
document.querySelector(".order-summary").innerHTML = checkhtml;

document.querySelector(
  ".return-to-home-link"
).innerHTML = `${calculateCartQuantity()} Items`;

deletion();
updation();
saving();
