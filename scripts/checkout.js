import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProductsFetch } from "../data/products.js";
import "../data/products.js";

async function loadPage() {
  try {
    await loadProductsFetch();
    renderOrderSummary();
    renderPaymentSummary();
  } catch (error) {
    console.log("Unexpected error , please try again");
  }
}

loadPage();
