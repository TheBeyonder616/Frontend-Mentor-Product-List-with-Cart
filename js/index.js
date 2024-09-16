import {
  getData,
  fetchData,
  intersectionsInit,
  handleMainEvent,
} from "./main.js";

import { itemSates, select, local } from "./main.js";
const response = await fetchData();
const data = getData(response);

//!=================================================================[Handle Markup]
const handleIntersection = () => {
  const pictures = select.elAll(document, "[data-picture]");
  // const header = select.el(document, "[data-header]");
  const header = document.getElementById("header");
  intersectionsInit(pictures, header);
};

const reverseOrder = function (data) {
  return Object.keys(data).reverse();
};

//! ========================================================================{CartItem}
export const handleCardHtmlMarkup = (product) => {
  reverseOrder(data).forEach((key) => {
    const markup = `
        <!-- Card-${key} -->
        <div class="product-card">
        <!-- Card Image -->
        <div class="product-card__img" data-product-img data-item-id ='${key}'>
        <picture class="lazy-img--container picture
        " data-picture data-thumbnail='${data[key].thumbnail}'>
            <!-- ?[Desktop] -->
            <source
                media="(min-width: 64em)"
                data-srcset=${data[key].desktopImg}
            />
            <!-- ?[Tab] -->
            <source
                media="(min-width:48em)"
                data-srcset=${data[key].tabletImg}
            />
            <!-- ?[Mobile] -->
            <img
                class="img lazy--img"
                data-src=${data[key].mobileImg}
                alt="${data[key].productName} served on a plate"
            />

            </picture>

            <!-- !Absolute -->
            <!-- Cart button -->
            <div class="product-card__buttons">
            <div class="product-card__buttons__overlay">
                <a class="product-card__add-button a" data-add-to-cart>
                <!-- Add to cart -->
                <div class="wrapper">
                    <div class="svg">
                    <svg aria-label="Icon add to cart">
                        <use
                        xlink:href="./assets/images/icon.svg#icon-add-to-cart"
                        ></use>
                    </svg>
                    </div>
                    <span>Add to Cart</span>
                </div>
                </a>
                <!-- Quantity -->
                <a class="product-card__quantity a">
                <div class="wrapper quantity--wrapper">
                    <!-- Increment -->
                    <div class="svg small--svg" data-increment>
                    <svg aria-label="Icon increment item">
                    <use
                        xlink:href="./assets/images/icon.svg#icon-increment-quantity"
                        ></use>
                    </svg>
                    </div>
                    <!-- Quantity -->
                    <span data-quantity>0</span>
                    <!-- Decrement -->
                    <div class="svg small--svg" data-decrement>
                    <svg aria-label="Icon decrement item">
                        <use
                        xlink:href="./assets/images/icon.svg#icon-decrement-quantity"
                        ></use>
                    </svg>
                    </div>
                </div>
                </a>
            </div>
            </div>
        </div>

        <!-- Card-details -->
        <div class="product-card__details">
            <!-- Title -->
            <h2 class="heading-secondary">${data[key].item}</h2>
            <!-- Product Name -->
            <h3 class="heading-third" data-product-card-details>${data[key].productName}</h3>
            <!-- Price -->
            <h4 class="heading-fourth" data-product-price>$${data[key].productPrice}</h4>
        </div>
        </div>

`;

    product.insertAdjacentHTML("afterbegin", markup);
  });

  handleIntersection();
  handleMainEvent();
};

// !========================================================{CartMarkup}

const createCartItemMarkup = (itemId, state) => `
  <!-- Cart item for ${itemId} -->
  <div class="cart__item" data-added-cart-item data-item-id="${itemId}">
    <div class="cart__item__details">
      <!-- Product name -->
      <h3 class="heading-third cart--details">
        ${state.Name}
      </h3>
      <!-- *[Quantity and price] -->
      <div class="cart__item__cost">
        <!-- Quantity -->
        <span class="quantity" data-quantity>
          ${state.count} <span>X</span>
        </span>
        <!-- Value -->
        <span class="value heading-secondary" data-value>
          <span> @</span> $${state.price.toFixed(2)}
        </span>
        <!-- Cost -->
        <span class="cost heading-secondary" data-cost>
          $${state.totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
    <!-- Delete cart item -->
    <div class="delete-cart__item">
      <div class="svg small--svg" data-delete-cart-item data-item-id="${itemId}">
        <svg aria-label="Icon remove items">
          <use xlink:href="./assets/images/icon.svg#icon-remove-items"></use>
        </svg>
      </div>
    </div>
  </div>
`;

const item = {
  updateCartItem: (item, state) => {
    const quantityElement = select.el(item, "[data-quantity]");
    const costElement = select.el(item, "[data-cost]");
    if (quantityElement) quantityElement.textContent = `${state.count}x`;
    if (costElement)
      costElement.textContent = `$${state.totalPrice.toFixed(2)}`;
  },
  isNotExist: (parent, state, itemId, confirm) => {
    let markup;
    !confirm
      ? (markup = createCartItemMarkup(itemId, state))
      : (markup = createCartConfirmationMarkup(itemId, state));
    parent.insertAdjacentHTML("afterbegin", markup);
  },
  isAbove: (parent, state, itemId, confirm) => {
    const existingCartItem = select.el(parent, `[data-item-id="${itemId}"]`);

    existingCartItem
      ? item.updateCartItem(existingCartItem, state)
      : item.isNotExist(parent, state, itemId, confirm);
  },
  isNotAbove: (parent, itemId) => {
    const existingCartItem = select.el(parent, `[data-item-id="${itemId}"]`);
    if (existingCartItem) existingCartItem.remove();
  },
};

export const handleCartHtmlMarkup = (parent) => {
  itemSates.forEach((state, itemId) => {
    const stateAboveZero = state.count > 0;
    stateAboveZero
      ? item.isAbove(parent, state, itemId)
      : item.isNotAbove(parent, itemId);
  });
};

//!======================================================={Confirmation}
const createCartConfirmationMarkup = (itemId, state) => `
 <!-- !Content${itemId} -->
<div class="confirmed-wrapper" data-item-id="${itemId}">
  <!-- !Content -->
  <div class="confirmed__item__details">
    <div class="confirmed__item__img">
      <img
        class="img"
        src="${state.thumbnail}"
        alt="An image of a ${state.Name}"
      />
    </div>
    <!-- !Items Name -->
    <div class="confirmed__item__price">
      <!-- Product name -->
      <h3 class="heading-third cart--details">${state.Name}</h3>
      <!-- !Quantity -->
      <div class="cart__item__cost">
        <!-- Quantity -->
        <span class="quantity" data-quantity
          >${state.count} <span>X</span></span
        >
        <!-- Value -->
        <span class="value heading-secondary" data-value>
          <span> @</span>$${state.price.toFixed(2)}</span
        >
      </div>
    </div>
  </div>
  <!-- !{Cost} -->
  <span class="cost heading-secondary confirmed--cost" data-cost
    >$${state.totalPrice.toFixed(2)}</span
  >
</div>

    `;

export const handleConfirmedCartMarkup = function (parent) {
  itemSates.forEach((state, itemId) => {
    const stateAboveZero = state.count > 0;
    if (stateAboveZero) {
      const isIncremented = state.hasBeenIncremented;
      isIncremented
        ? item.isAbove(parent, state, itemId, true)
        : item.isNotExist(parent, state, itemId, true);
    } else {
      item.isNotAbove(parent, itemId);
    }
  });
};

const init = () => {
  const productGrid = document.querySelector("[data-product-grid]");
  handleCardHtmlMarkup(productGrid);
  local.loadFromLocalStorage();
};

init();
