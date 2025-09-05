export const cart = [];
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
  //updating cart
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  document.querySelector(".cart-quantity").innerHTML = cartQuantity;
}
