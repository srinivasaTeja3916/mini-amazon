export let cart;
loadFromStorage();
export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem("cart")) || [
    
  ];
}
export function addToCart(productId) {
  let quantityElement = document.querySelector(
    `.js-quantity-selector-${productId}`
  );
  let quantity = quantityElement ? Number(quantityElement.value) : 1;
  let present;
  cart.forEach((ele) => {
    if (ele.productId === productId) {
      present = ele;
    }
  });
  if (present) {
    present.quantity += Number(quantity);
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: "1",
    });
  }
  document.querySelector(".cart-quantity").innerHTML = calculateCartQuantity();
  document.querySelector(".js-cart-quantity-mobile").innerHTML =
  calculateCartQuantity();
  saveToStorage();
}
export function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += Number(item.quantity);
  });
  return cartQuantity;
}
export function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
export function removeFromCart(productId) {
  let newCart = [];
  cart.forEach((item) => {
    if (item.productId !== productId) {
      newCart.push(item);
    }
  });
  cart = newCart;

  saveToStorage();
}
export function updateDeliveryOption(productId, deliveryOptionId) {
  let present;
  // console.log(cart);

  cart.forEach((ele) => {
    if (ele.productId == productId) {
      present = ele;
    }
  });
  present.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}
