export let cart = JSON.parse(localStorage.getItem("cart")) || [
  {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 1,
  },
  {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
  },
  {
    productId: "54e0eccd-8f36-462b-b68a-8182611d9add",
    quantity: 3,
  },
];
export function addToCart(productId) {
  let quantity = Number(
    document.querySelector(`.js-quantity-selector-${productId}`).value
  );
  let present;
  cart.forEach((ele) => {
    if (ele.productId === productId) {
      present = ele;
    }
  });
  if (present) {
    present.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
    });
  }
  saveToStorage();

  //updating cart
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  document.querySelector(".cart-quantity").innerHTML = cartQuantity;
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
