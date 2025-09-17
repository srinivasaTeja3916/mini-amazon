import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";
import { loadCart } from "../data/cart.js";
import "../data/products.js";

Promise.all([
  new Promise((resolve) => {
    loadProducts(() => {
      resolve("I'm Teja");
    });
  }),
  new Promise((resolve) => {
    loadCart(() => {
      resolve("I'm Yugandhar<-->I'm Balu");
    });
  }),
]).then((value) => {
  console.log(value);
  renderOrderSummary();
  renderPaymentSummary();
});

// new Promise((resolve) => {
//   loadProducts(() => {
//     resolve();
//   });
// })
//   .then(() => {
//     return new Promise((resolve) => {
//       loadCart(() => {
//         resolve();
//       });
//     });
//   })
//   .then(() => {
//     renderOrderSummary();
//     renderPaymentSummary();
//   });

// loadProducts(() => {
//   loadCart(() => {
//     renderOrderSummary();
//     renderPaymentSummary();
//   });
// });
