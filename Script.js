const products = [
  {
    id: "250ml",
    name: "250ml",
    price: 100
  },
  {
    id: "500ml",
    name: "500ml",
    price: 200
  },
  {
    id: "1L",
    name: "1L",
    price: 400
  },
  {
    id: "5L",
    name: "5L",
    price: 2000
  },
  {
    id: "8L",
    name: "8L",
    price: 3200
  },
  {
    id: "16L",
    name: "16L",
    price: 6400
  }
];


let cart = JSON.parse(
  localStorage.getItem("oliveaCart") || "{}"
);


function saveCart() {

  localStorage.setItem(
    "oliveaCart",
    JSON.stringify(cart)
  );

  renderCart();
}


/* PAGE NAVIGATION */

function goTo(pageName) {

  document
    .querySelectorAll(".page")
    .forEach(page => {
      page.classList.remove("active");
    });

  document
    .getElementById(pageName)
    .classList.add("active");

  window.scrollTo(0, 0);

  if (pageName === "cart") {
    renderCart();
  }
}


document
  .querySelectorAll("[data-page]")
  .forEach(button => {

    button.addEventListener("click", () => {

      goTo(button.dataset.page);

    });

  });


/* CART BUTTON */

document
  .getElementById("cartButton")
  .addEventListener("click", () => {

    goTo("cart");

  });


/* PRODUCTS */

function renderProducts() {

  const productsContainer =
    document.getElementById("products");

  productsContainer.innerHTML =
    products.map(product => `

      <article class="product">

        <div class="product-size">
          ${product.name}
        </div>

        <div class="product-price">
          ${product.price.toLocaleString()} EGP
        </div>

        <button
          class="add-button"
          onclick="addToCart('${product.id}')"
        >
          Add to Cart
        </button>

      </article>

    `).join("");

}


/* ADD TO CART */

function addToCart(id) {

  cart[id] = (cart[id] || 0) + 1;

  saveCart();

}


/* CHANGE QUANTITY */

function changeQty(id, amount) {

  cart[id] = (cart[id] || 0) + amount;

  if (cart[id] <= 0) {

    delete cart[id];

  }

  saveCart();

}


/* REMOVE ITEM */

function removeItem(id) {

  delete cart[id];

  saveCart();

}


/* CART ITEMS */

function getCartItems() {

  return products
    .filter(product => cart[product.id])
    .map(product => ({
      ...product,
      quantity: cart[product.id]
    }));

}


/* RENDER CART */

function renderCart() {

  const itemsContainer =
    document.getElementById("cartItems");

  const cartCount =
    document.getElementById("cartCount");

  const items = getCartItems();


  const numberOfItems =
    items.reduce(
      (total, product) =>
        total + product.quantity,
      0
    );


  cartCount.textContent =
    numberOfItems;


  if (items.length === 0) {

    itemsContainer.innerHTML = `
      <div class="empty-cart">
        Your cart is empty.
      </div>
    `;

    document.getElementById(
      "cartTotal"
    ).textContent =
      "Total: 0 EGP";

    return;

  }


  itemsContainer.innerHTML =
    items.map(product => `

      <div class="cart-row">

        <div>

          <div class="cart-name">
            ${product.name}
          </div>

          <div class="cart-price">
            ${
              (
                product.price *
                product.quantity
              ).toLocaleString()
            } EGP
          </div>

        </div>


        <div class="qty-controls">

          <button
            onclick="changeQty('${product.id}', -1)"
          >
            −
          </button>

          <span>
            ${product.quantity}
          </span>

          <button
            onclick="changeQty('${product.id}', 1)"
          >
            +
          </button>

        </div>


        <button
          class="remove-button"
          onclick="removeItem('${product.id}')"
        >
          Remove
        </button>

      </div>

    `).join("");


  const total =
    items.reduce(
      (sum, product) =>
        sum +
        product.price *
        product.quantity,
      0
    );


  document.getElementById(
    "cartTotal"
  ).textContent =
    `Total: ${total.toLocaleString()} EGP`;

}


/* WHATSAPP ORDER */

document
  .getElementById("whatsappButton")
  .addEventListener("click", () => {

    const items = getCartItems();


    if (items.length === 0) {

      alert(
        "Your cart is empty."
      );

      return;

    }


    const total =
      items.reduce(
        (sum, product) =>
          sum +
          product.price *
          product.quantity,
        0
      );


    const orderLines =
      items.map(product =>

        `• ${product.name} × ${product.quantity} — ${
          (
            product.price *
            product.quantity
          ).toLocaleString()
        } EGP`

      );


    const message =
`Hi Olivéa! 🫒💚

I'd like to place an order:

${orderLines.join("\n")}

Total: ${total.toLocaleString()} EGP

Thank you!`;


    const phoneNumber =
      "2001001751071";


    const whatsappURL =
      `https://wa.me/${phoneNumber}?text=${
        encodeURIComponent(message)
      }`;


    window.open(
      whatsappURL,
      "_blank"
    );

  });


/* START WEBSITE */

renderProducts();

renderCart();
