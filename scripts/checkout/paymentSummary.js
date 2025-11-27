import { cart, calculateCartQuantity, saveToStorage } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { addOrder } from "../../data/orders.js";
export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingCost = 0;
  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingCost += deliveryOption.priceCents;
  });
  const totalBeforeTax = shippingCost + productPriceCents;
  const estimateTax = totalBeforeTax * 0.1;
  const totalCents = totalBeforeTax + estimateTax;
  const paymentSummaryHtML = `
  <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
      <div>Items (${calculateCartQuantity()}):</div>
      <div class="payment-summary-money">$${formatCurrency(
        productPriceCents
      )}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(shippingCost)}</div>
    </div>

    
    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(
        totalBeforeTax
      )}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(estimateTax)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>
    <button class="place-order-button button-primary js-payment-order">
      Place your order
    </button>
  `;
  document.querySelector(".payment-summary").innerHTML = paymentSummaryHtML;
  const common = document.querySelector(".place-order-button");
  if (calculateCartQuantity() === 0) {
    common.classList.add("payment-button-disabled");

    const noProducts = `<div class="noProducts">
    <div class="nrml-text">Your cart is empty.</div>
    <button class="referal-to-products"> View products</button></div>`;
    document.querySelector(".order-summary").innerHTML = noProducts;

    document
      .querySelector(".referal-to-products")
      .addEventListener("click", () => {
        window.location.href = "amazon.html";
      });
  }
  document
    .querySelector(".js-payment-order")
    .addEventListener("click", async () => {
      try {
        const response = await fetch("https://supersimplebackend.dev/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart: cart,
          }),
        });
        const order = await response.json();
        addOrder(order);
      } catch {
        console.log("Unexpected error. Try again later");
      }
      window.location.href = "orders.html";
      cart.splice(0, cart.length);
      saveToStorage();
    });
}
