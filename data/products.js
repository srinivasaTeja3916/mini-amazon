import { formatCurrency } from "../scripts/utils/money.js";

export function getProduct(productId) {
  let matchingItem;

  products.forEach((productItem) => {
    if (productItem.id === productId) {
      matchingItem = productItem;
    }
  });
  return matchingItem;
}
class Product {
  id;
  image;
  name;
  rating;
  priceCents;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `${formatCurrency(this.priceCents)}`;
  }
  extraInfoHtml() {
    return "";
  }
}

class Clothing extends Product {
  sizeChartLink;
  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }
  extraInfoHtml() {
    return `<a href="${this.sizeChartLink}" target="_blank">Size chart</a>`;
  }
}

export let products = [];

export function loadProductsFetch() {
  const promise = fetch("https://supersimplebackend.dev/products")
    .then((response) => {
      return response.json();
    })
    .then((productsData) => {
      products = productsData.map((productDetails) => {
        if (productDetails.type === "clothing") {
          return new Clothing(productDetails);
        }
        return new Product(productDetails);
      });
      console.log("load products");
    })
    .catch(() => {
      console.log("Unexpected error , please try again");
    });
  return promise;
}
