class Cart {
  cartItems;
  #localStorageKey;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage() {
    this.cartItems = JSON.parse(
      localStorage.getItem(this.#localStorageKey)
    ) || [
      {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 1,
        deliveryOptionId: "1",
      },
      {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionId: "2",
      },
      {
        productId: "54e0eccd-8f36-462b-b68a-8182611d9add",
        quantity: 3,
        deliveryOptionId: "1",
      },
    ];
  }

  saveToStorage() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
  }

  addToCart(productId) {
    let quantity = 1;
    let present;
    this.cartItems.forEach((ele) => {
      if (ele.productId === productId) {
        present = ele;
      }
    });
    if (present) {
      present.quantity += Number(quantity);
    } else {
      this.cartItems.push({
        productId: productId,
        quantity: quantity,
        deliveryOptionId: "1",
      });
    }
    this.saveToStorage();
  }

  calculateCartQuantity() {
    let cartQuantity = 0;
    this.cartItems.forEach((item) => {
      cartQuantity += Number(item.quantity);
    });
    return cartQuantity;
  }

  removeFromCart(productId) {
    let newCart = [];
    this.cartItems.forEach((item) => {
      if (item.productId !== productId) {
        newCart.push(item);
      }
    });
    this.cartItems = newCart;

    this.saveToStorage();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    let present;
    this.cartItems.forEach((ele) => {
      if (ele.productId == productId) {
        present = ele;
      }
    });
    present.deliveryOptionId = deliveryOptionId;
    this.saveToStorage();
  }
}

const cart = new Cart("cart-oop");
const businessCart = new Cart("cart-business");
console.log(cart);
console.log(businessCart);
console.log(businessCart instanceof Cart);
