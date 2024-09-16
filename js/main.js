import { handleCartHtmlMarkup, handleConfirmedCartMarkup } from "./index.js";

//!#region start=============================================================[General Helpers]
/**
 * ?Handle all class List method needed
 * @param {element} el the method the class is passed to
 * @param {class} cl the target that is handled
 * @param {selector} find the class, attribute, or id
 */
export const cList = {
  add: (el, cl) => el.classList.add(cl),
  rem: (el, cl) => el.classList.remove(cl),
  tog: (el, cl) => el.classList.toggle(cl),
  closest: (el, find) => el.closest(find),
};

/**
 * ? Handle querySelector calls
 * @param {element} parent  el a single element while elAll target a nodeList
 * @param {selector} selector the class, attribute, or id
 */
export const select = {
  el: (parent, selector) => parent.querySelector(selector),
  elAll: (parent, selector) => parent.querySelectorAll(selector),
};

//!#region end==============================================================
//!#region start=============================================================[Intersection]
/**
 * ?Handle intersection observer for lazy loading images & quick Navigation.
 * @param {IntersectionObserverEntry[]} entries - The observer entries.
 * @param {IntersectionObserver} observer - The observer instance.
 */
const intersection = {
  handleLazyPicture: (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const picture = entry.target;

      //   Update Source
      const source = picture.querySelectorAll("source");
      source.forEach((source) => {
        const srcSet = source.dataset.srcset;
        if (source) source.srcset = srcSet;
      });

      //   Update Img
      const img = picture.querySelector("img");
      const imgSrc = img.dataset.src;
      if (img) img.src = imgSrc;
      img.addEventListener("load", () => {
        cList.rem(img, "lazy--img");
        cList.rem(picture, "lazy-img--container");
      });
      observer.unobserve(picture);
    });
  },

  handleQuickNavigation: (entries) => {
    const [entry] = entries;
    const aTref = select.el(document, "[data-quick-navigation]");
    !entry.isIntersecting ? cList.add(aTref, "show") : cList.rem(aTref, "show");
  },

  optionsLazy: {
    root: null,
    threshold: 0.1,
  },
  optionsNav: {
    root: null,
    threshold: 0.7,
  },
};

const lazyPictureObserver = new IntersectionObserver(
  intersection.handleLazyPicture,
  intersection.optionsLazy
);

const lazyQuickObserver = new IntersectionObserver(
  intersection.handleQuickNavigation,
  intersection.optionsNav
);

/**
 * ?Called in index.js after the async method has been handled
 */
export const intersectionsInit = (pictures, header) => {
  pictures.forEach((picture) => lazyPictureObserver.observe(picture));
  lazyQuickObserver.observe(header);
};

//!#region end==============================================================
//!#region start=============================================================[async]
export const fetchData = async function () {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) throw new Error("Server Not Found");
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err, "Error Message");
    return [];
  }
};

export const getData = (result) => {
  if (!Array.isArray(result)) {
    console.log("Expected an array but  got :;", result);
    return [];
  }
  const [...data] = result;

  return Object.values(data).map((data) => ({
    item: data.category,
    desktopImg: data.image.desktop,
    mobileImg: data.image.mobile,
    tabletImg: data.image.tablet,
    thumbnail: data.image.thumbnail,
    productName: data.name,
    productPrice: data.price,
  }));
};
//!#region end==============================================================
//!#region start=============================================================[UI]
//*-------------------------------------------------------------------------{Update}
export const itemSates = new Map();

export const local = {
  // Corrected method name and parameter
  isParsed: (parsedState) => {
    if (!Array.isArray(parsedState)) return;

    itemSates.clear();
    parsedState.forEach(([key, value]) => {
      if (key && value) itemSates.set(key, value);
    });
  },

  saveToLocalStorage: () => {
    try {
      const serializedState = JSON.stringify(Array.from(itemSates.entries()));
      localStorage.setItem("itemStates", serializedState);
    } catch (err) {
      console.error("Error saving to localStorage", err);
    }
  },

  loadFromLocalStorage: () => {
    try {
      const serializedState = localStorage.getItem("itemStates");
      if (serializedState) {
        const parsedState = JSON.parse(serializedState);
        // Use the updated method name and pass the parsedState
        local.isParsed(parsedState);

        // Update the UI
        itemSates.forEach((_, itemId) => updateUI(itemId));
      } else {
        console.error("No data found in localStorage");
      }
    } catch (err) {
      console.error("Error getting from local storage", err);
    }
  },
};

/**
 * ?Handle the each unique item and store the data in itemStates
 * @param {element} parent  target the parent or the id of an element
 * @param {dataAttribute} itemID gets the unique data attribute to preform a method
 * *@access  {UpdateUI || Events}
 * @author Peter Gods'power
 *
 */
const update = {
  getItemName: (parent) => {
    const grandParent = parent.parentNode;
    const itemElement = select.el(grandParent, "[data-product-card-details]");
    const itemName = itemElement.textContent;
    return itemName;
  },

  getThumbnail: (parent) => {
    const picture = select.el(parent, "[data-thumbnail]");
    const thumbnail = picture.dataset.thumbnail;
    return thumbnail;
  },

  initializeItemState: (parent) => {
    const itemId = parent.getAttribute("data-item-id");
    let itemName = update.getItemName(parent);
    let itemThumbnail = update.getThumbnail(parent);
    itemSates.set(itemId, {
      Name: itemName,
      thumbnail: itemThumbnail,
      count: 0,
      price: resultOf.getPrice(parent),
      totalPrice: 0,
      hasBeenIncremented: false,
    });
    local.saveToLocalStorage();
  },

  increment: (itemId) => {
    if (!itemSates.has(itemId)) return;
    const state = itemSates.get(itemId);

    const price = resultOf.getPrice(
      select.el(document, `[data-item-id="${itemId}"]`)
    );
    state.count++;
    state.price = price; // Update the price if needed
    state.totalPrice = state.price * state.count;
    const stateNotIncrement = !state.hasBeenIncremented;
    if (stateNotIncrement) state.hasBeenIncremented = true;
    updateUI(itemId);
    local.saveToLocalStorage();
  },

  decrement: (itemId) => {
    if (!itemSates.has(itemId)) return;
    const state = itemSates.get(itemId);
    if (state.count <= 0) return;
    const price = resultOf.getPrice(
      select.el(document, `[data-item-id="${itemId}"]`)
    );
    const currentPrice = (state.totalPrice -= state.price);
    state.price = price;
    state.count--;
    currentPrice <= 0
      ? (state.totalPrice = 0)
      : (state.totalPrice = currentPrice);
    if (state.count === 0) update.removeItemFromCart(itemId);
    help.handleIAllItemIsClosed();
    updateUI(itemId);
    local.saveToLocalStorage();
  },

  removeItemFromCart(itemId) {
    const parent = select.el(document, `[data-item-id="${itemId}"]`);
    if (parent) cList.rem(parent, "is--active");
    local.saveToLocalStorage();
  },
};

//*-------------------------------------------------------------------------{Helper}
/**
 * ?Helpers that can be called
 * @param Helper a simple helper method
 */
const help = {
  handleIAllItemIsClosed: () => {
    const item = select.elAll(document, ".is--active");
    const isActive = resultOf.allHaveClass(item, ".is--active");
    if (isActive) itemIsClosed();
  },

  handleAnyItemIsOpened: () => {
    const item = select.elAll(document, ".is--active");
    const isActive = resultOf.allHaveClass(item, ".is--active");
    if (!isActive) help.isActive();
  },
  initGrandTotal: () => {
    const grandTotal = calc.calculateGrandTotal();
    const grandTotalElement = select.elAll(document, "[data-grand-total]");
    grandTotalElement.forEach((total) => {
      total.textContent = `$${grandTotal}`;
    });
  },

  initTotalCartItem: () => {
    const itemCount = calc.calculateTotalCartItemAdded();
    const itemCountElement = select.el(document, "[data-cart-quantity]");
    itemCountElement.textContent = `(${itemCount})`;
  },

  aboveZero: (parent) => {
    const cart = select.el(document, "[data-cart]");
    const cartEmpty = select.el(document, "[data-cart-empty]");
    cList.add(parent, "is--active");
    cList.rem(cart, "hide");
    cList.add(cartEmpty, "hide");
  },

  isActive: () => {
    const cart = select.el(document, "[data-cart]");
    const cartEmpty = select.el(document, "[data-cart-empty]");
    cList.rem(cart, "hide");
    cList.add(cartEmpty, "hide");
  },
};

//*-------------------------------------------------------------------------{Calculations}
/**
 * ?Returns a calculation which would be updated by the updateUI method
 * @returns {grandTotal}  the total of all the cartItem added total
 * @returns {cart} the total Number of items added to card
 *
 */
const calc = {
  calculateGrandTotal: () => {
    let grandTotal = 0;
    itemSates.forEach((state) => {
      grandTotal += state.totalPrice;
    });
    return grandTotal;
  },

  calculateTotalCartItemAdded: () => {
    let cart = 0;
    const cartItem = select.elAll(document, ".is--active");
    cart = cartItem.length;
    return cart;
  },
};

const updateUI = (itemId) => {
  if (!itemSates.has(itemId)) return;
  const state = itemSates.get(itemId);
  const parent = select.el(document, `[data-item-id="${itemId}"]`);
  const quantityElement = select.el(parent, "[data-quantity]");
  const priceElement = select.el(parent, "[data-product-price]");
  if (quantityElement) quantityElement.textContent = state.count;
  if (priceElement) priceElement.textContent = `$${state.price}`;
  help.initGrandTotal();
  help.initTotalCartItem();

  const cartParent = select.el(document, "[data-cart-item-parent]");
  handleCartHtmlMarkup(cartParent);

  const isAboveZero = state.count > 0;

  isAboveZero
    ? cList.add(parent, "is--active")
    : cList.rem(parent, "is--active");

  help.handleAnyItemIsOpened();

  const confirmParent = select.el(document, "[data-confirm-container]");
  handleConfirmedCartMarkup(confirmParent);
};

//!#region end=============================================================
//!#region start=============================================================[Cart]

/**
 * ?Returns an item, price or a boolean value
 * @param {element} parent  get an element and returns an item
 * @param {element} e gets an element a price content and returns a Number
 * @param {NodeList} el gets a node list and perform a boolean method with the cl
 *
 * *@access  {update}
 * @author Peter Gods'power
 * */
const resultOf = {
  getPriceElement: (parent) => {
    const grandParent = parent.parentNode;
    const item = select.el(grandParent, "[data-product-price]");
    return item;
  },

  getItemPrice: (e) => {
    const priceText = e.textContent.trim();
    const match = priceText.match(/[\d.]+/);
    const parsedPrice = match ? parseFloat(match[0]) : 0;
    return parsedPrice;
  },

  getPrice: (parent) => {
    const priceElement = resultOf.getPriceElement(parent);
    const price = resultOf.getItemPrice(priceElement);
    return price;
  },

  allHaveClass: (el, cl) => {
    return [...el].every((el) => el.classList.contains(cl));
  },
};

// !========================================{Cart Markup}

/**
 * ?Handle what happens when an item is Opened
 * @param {element} parent  target the parent or the id of an element
 * @param {dataAttribute} id gets the unique data attribute to preform a method
 * *@access  {itemIsOpen}
 * @author Peter Gods'power
 * */
const call = {
  initCartItem: (parent) => {
    const grandParent = parent.parentNode;
  },

  calFirstTotal: (parent) => {
    const grandParent = parent.parentNode;
    const priceElement = select.el(grandParent, "[data-product-price]");
    let price = resultOf.getItemPrice(priceElement);
    const grandTotalElement = select.el(document, "[data-grand-total]");
    let grandTotal = grandTotalElement.textContent;
    const isZero = grandTotal === "$0";
    if (isZero);
    grandTotal = `$${price}`;
  },

  isOpenFuc: (parent, id) => {
    call.calFirstTotal(parent);
    updateUI(id);
    const cartParent = select.el(document, "[data-cart-item-parent]");
    call.initCartItem(parent);
    handleCartHtmlMarkup(cartParent);
    const confirmParent = select.el(document, "[data-confirm-container]");
    handleConfirmedCartMarkup(confirmParent);
  },
};

const itemIsOpen = (e) => {
  const parent = cList.closest(e, "[data-product-img]");
  if (!parent) return;
  const itemId = parent.getAttribute("data-item-id");
  if (!itemSates.has(itemId)) update.initializeItemState(parent);
  update.increment(itemId);

  help.aboveZero(parent);
  const state = itemSates.get(itemId);
  const stateNotIncrement = !state.hasBeenIncremented;
  if (stateNotIncrement) state.hasBeenIncremented = true;
  call.isOpenFuc(parent, itemId);
  local.saveToLocalStorage();
};

export const itemIsClosed = () => {
  const cart = select.el(document, "[data-cart]");
  const cartEmpty = select.el(document, "[data-cart-empty]");
  cList.add(cart, "hide");
  cList.rem(cartEmpty, "hide");
};

/**
 * ?Handle how an item is added, reduced, increased,or reset
 * @param {element} parent  target the parent or the id of an element
 * @param {dataAttribute} id gets the unique data attribute to preform a method
 * *@access  {handledCartDisplay || handleItemDisplay}
 * @author Peter Gods'power
 * */
const item = {
  isAdd: (el) => {
    const parent = cList.closest(el, "[data-product-img]");
    update.initializeItemState(parent);
    itemIsOpen(el);
    local.saveToLocalStorage();
  },

  isReduced: (el) => {
    const itemId = cList
      .closest(el, "[data-product-img]")
      .getAttribute("data-item-id");
    update.decrement(itemId);
  },

  isIncreased: (el) => {
    const itemId = cList
      .closest(el, "[data-product-img]")
      .getAttribute("data-item-id");
    update.increment(itemId);
  },

  isReset: (id) => {
    const state = itemSates.get(id);
    state.count = 0;
    state.totalPrice = 0;
    const card = select.el(document, `[data-item-id='${id}']`);
    cList.rem(card, "is--active");
    help.handleIAllItemIsClosed();
    updateUI(id);
    local.saveToLocalStorage();
  },

  isDeleted: (el) => {
    const parent = cList.closest(el, "[data-added-cart-item]");
    const itemId = parent.getAttribute("data-item-id");
    const itemHasId = itemSates.has(itemId);
    // ?Reset the state
    if (itemHasId) item.isReset(itemId);
    parent.remove();
    local.saveToLocalStorage();
  },

  isDeletedAll: () => {
    itemSates.forEach((state, itemId) => {
      state.count = 0;
      state.totalPrice = 0;
      const card = select.el(document, `[data-item-id="${itemId}"]`);
      if (card) cList.rem(card, "is--active");
      help.handleIAllItemIsClosed();
      local.saveToLocalStorage();
    });
    help.initGrandTotal();
    help.initTotalCartItem();
    alert("Order would be shipped in a week :) 😊");
  },

  isConfirmed: () => {
    const order = select.el(document, "[data-cart-confirm]");
    cList.rem(order, "hide");
  },

  isInit: () => {
    const order = select.el(document, "[data-cart-confirm]");
    cList.add(order, "hide");
    item.isDeletedAll();
  },
};

const handleCartDisplay = (e) => {
  const addItem = e.target.closest("[data-add-to-cart]");
  const increase = e.target.closest("[data-increment]");
  const reduced = e.target.closest("[data-decrement]");

  if (addItem) item.isAdd(addItem);
  if (increase) item.isIncreased(increase);
  if (reduced) item.isReduced(reduced);
};

const handleCartItemDisplay = (e) => {
  const deleteItem = cList.closest(e.target, "[data-delete-cart-item]");
  const confirm = cList.closest(e.target, "[data-confirm-order]");
  const startNew = cList.closest(e.target, "[data-start-order]");
  if (deleteItem) item.isDeleted(deleteItem);
  if (confirm) item.isConfirmed();
  if (startNew) item.isInit();
};

const inItMain = (e) => {
  handleCartDisplay(e);
  handleCartItemDisplay(e);
};

//!#region end==============================================================
//!#region start=============================================================[Events]
export const handleMainEvent = function () {
  const main = document.getElementById("main");
  main.addEventListener("click", inItMain);
};
//!#region end==============================================================
