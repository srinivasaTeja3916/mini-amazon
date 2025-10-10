import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  saveToStorage,
  updateDeliveryOption,
} from "../../data/cart.js";
import { getProduct, products } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
export function renderOrderSummary() {
  let checkhtml = "";
  cart.forEach((element) => {
    const productId = element.productId;
    const quantity = element.quantity;
    const matchingItem = getProduct(productId);
    const deliveryOptionId = element.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    checkhtml += `
      <div class="cart-item-container next-level-${
        matchingItem.id
      } js-cart-container-${matchingItem.id}">
        <div class="delivery-date">Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img
          class="product-image"
          src="${matchingItem.image}"
          />

            <div class="cart-item-details">
            <div class="product-name">
              ${matchingItem.name}
            </div>
            <div class="product-price">$${matchingItem.getPrice()}</div>
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
    }" type="number" value=${quantity} name="amazonValue">
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
            ${deliveryOptionsHTML(matchingItem, element)}
            </div>
          </div>
            </div>
            `;
  });

  function deliveryOptionsHTML(matchingItem, element) {
    let html = ``;
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM, D");
      const priceCents =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === element.deliveryOptionId;

      html += `<div class="delivery-option js-delivery-option"
      data-product-id="${matchingItem.id}" data-delivery-option-id="${
        deliveryOption.id
      }">
      
          <input
          type="radio"
          ${isChecked ? "checked" : ""}
          class="delivery-option-input"
          name="delivery-option-${matchingItem.id}"
          />
          <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceCents} Shipping</div>
          </div>
        </div>`;
    });
    return html;
  }

  function deletion() {
    document.querySelectorAll(".delete-quantity-link").forEach((element) => {
      const productId = element.dataset.productId;
      element.addEventListener("click", () => {
        removeFromCart(productId);
        document.querySelector(`.next-level-${productId}`).remove();
        document.querySelector(
          ".return-to-home-link"
        ).innerHTML = `${calculateCartQuantity()} Items`;
        renderOrderSummary();
        renderPaymentSummary();
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
            let someNewValue = element.quantity;
            if (element.productId === productId) {
              if (newValue.value < 0) {
                alert("Not a valid quantity");
              } else if (newValue.value == "") {
                element.quantity = someNewValue;
                saveToStorage();
                renderOrderSummary();
                renderPaymentSummary();
                container.classList.remove("is-editing-quantity");
              } else if (newValue.value > 0) {
                element.quantity = Number(newValue.value);
                saveToStorage();
                document.querySelector(
                  `.quantity-label-${productId}`
                ).innerHTML = element.quantity;
                document.querySelector(".return-to-home-link").innerHTML = `
                ${calculateCartQuantity()} Items`;
                renderOrderSummary();
                renderPaymentSummary();
                container.classList.remove("is-editing-quantity");
              } else if (newValue.value == 0) {
                removeFromCart(productId);
                renderOrderSummary();
                renderPaymentSummary();
                container.classList.remove("is-editing-quantity");
              }
            }
          });
        });
      });
  }
  function UsingEnter() {
    document.querySelectorAll(".quantity-input").forEach((inputElement) => {
      const productId = inputElement.dataset.productId;
      let newvalue = document.querySelector(`.quantity-input-${productId}`);
      newvalue.addEventListener("keypress", (event) => {
        const container = document.querySelector(
          `.js-cart-container-${productId}`
        );
        let newValue = newvalue.value;

        if (event.key === "Enter") {
          cart.forEach((element) => {
            let someNewValue = element.quantity;
            if (element.productId === productId) {
              if (newValue < 0) {
                alert("Not a valid quantity");
              } else if (newValue > 0) {
                element.quantity = Number(newValue);
                saveToStorage();
                document.querySelector(
                  `.quantity-label-${productId}`
                ).innerHTML = element.quantity;
                document.querySelector(".return-to-home-link").innerHTML = `
                ${calculateCartQuantity()} Items`;
                renderOrderSummary();
                renderPaymentSummary();
                container.classList.remove("is-editing-quantity");
              } else if (newValue == "") {
                element.quantity = someNewValue;
                saveToStorage();
                renderOrderSummary();
                renderPaymentSummary();
                container.classList.remove("is-editing-quantity");
              } else if (newValue == 0) {
                removeFromCart(productId);
                renderOrderSummary();
                renderPaymentSummary();
                container.classList.remove("is-editing-quantity");
              }
            }
          });
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
  document.querySelectorAll(".js-delivery-option").forEach((newElement) => {
    newElement.addEventListener("click", () => {
      const { productId, deliveryOptionId } = newElement.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
