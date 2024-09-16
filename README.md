# Frontend Mentor | Product List with Cart

This repository contains my solution for the "Product List with Cart" challenge on Frontend Mentor. The project involves creating an interactive product list with a shopping cart system, featuring modern design and dynamic interactions.

## Table of Contents

- [Overview](#overview)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My Process](#my-process)
  - [Built With](#built-with)
  - [What I Learned](#what-i-learned)
  - [Continued Development](#continued-development)
  - [Useful Resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### Screenshot

![Desktop](./design/Desktop.png)
![Mobile](./design/Mobile.png)

### Links

- Solution URL: [Frontend Mentor Solution](https://www.frontendmentor.io/solutions/your-solution-url)
- Live Site URL: [Live Demo](https://your-github-username.github.io/your-repo-name)

## My Process

This project focuses on developing a product list with a fully interactive cart component. Key features include managing cart items, calculating totals, and dynamically updating the UI. The design adheres to modern web practices and provides a responsive experience across devices.

### Built With

- **Semantic HTML5 Markup:** Utilized semantic HTML elements for improved accessibility and SEO.
- **CSS:** Employed custom properties (variables) for consistent styling, Flex-box and Grid for layout, and responsive design techniques.
- **JavaScript:** Implemented dynamic interactions for managing cart states, item quantities, and UI updates using JavaScript modules.
- **SCSS:** Used SCSS for modular and maintainable CSS with features like variables, nesting, and mixins.

### JavaScript Modules

The project uses JavaScript modules to organize code effectively. Here’s a brief overview of the key modules:

#### `main.js`

- **Functionality:** Contains core logic for item management, UI updates, and event handling. It includes:
  - `getData()`: Fetches and processes data from the API.
  - `fetchData()`: Retrieves data from the server.
  - `intersectionsInit()`: Initializes intersection observers for lazy loading.
  - `handleMainEvent()`: Sets up event listeners for main interactions.
  - `itemSates`: Stores the state of cart items.
  - `select`: Helper functions for selecting DOM elements.
  - `local`: Manages local storage operations.

#### `index.js`

- **Functionality:** Manages the initialization and setup of the application. It includes:
  - `handleCardHtmlMarkup()`: Generates and injects product cards into the DOM.
  - `handleCartHtmlMarkup()`: Updates cart items and totals.
  - `handleConfirmedCartMarkup()`: Updates the cart with confirmed items.
  - **Initialization:** Calls functions to set up the product list and load data from local storage.

### BEM Methodology

In this project, the BEM (Block Element Modifier) methodology was applied to structure the CSS, enhancing maintainability and readability. Here’s how BEM was applied:

- **Block:** Represents the main components (e.g., `.product-list`, `.cart`, `.product-card`).
- **Element:** Represents a part of a block (e.g., `.product-card__image`, `.cart__item`).
- **Modifier:** Represents variations or states of blocks or elements (e.g., `.product-card--highlighted`, `.cart--empty`).

#### Example BEM Structure

- **Product List Block:**

  ```scss
  .product-list {
    // Block styles

    &__item {
      // Element styles
    }

    &__details {
      // Element styles
    }

    &--highlighted {
      // Modifier styles
    }
  }
  ```

- **Cart Block:**

  ```scss
  .cart {
    // Block styles

    &__item {
      // Element styles
    }

    &__total {
      // Element styles
    }

    &--empty {
      // Modifier styles
    }
  }
  ```

### What I Learned

Through this project, I enhanced my skills in:

- **Event Delegation:** Efficiently managing event listeners to handle interactions with dynamically generated elements.
- **JavaScript Modules:** Organizing code into modules to improve maintainability and separation of concerns.
- **JavaScript State Management:** Creating and managing the state of items in a cart, including adding, updating, and removing items.
- **CSS Custom Properties:** Utilizing CSS variables for consistent and dynamic styling.
- **SCSS:** Applying SCSS for modular and maintainable CSS with advanced features like variables and nesting.
- **Responsive Design:** Leveraging Flexbox and CSS Grid to create a responsive layout that adapts to various screen sizes.

### Continued Development

Future updates may include:

- **Enhanced JavaScript Interactions:** Adding more sophisticated interactive features and dynamic behavior.
- **Complex Animations:** Implementing more advanced CSS animations and transitions for improved user experience.
- **Accessibility Improvements:** Ensuring all interactive elements are fully accessible and optimizing overall user experience.

### Useful Resources

- [MDN Web Docs](https://developer.mozilla.org/en-US/) - Comprehensive documentation for web technologies.
- [CSS-Tricks](https://css-tricks.com/) - Articles and tutorials on modern CSS techniques.
- [Sass Documentation](https://sass-lang.com/documentation) - Official SCSS documentation.
- [JavaScript.info](https://javascript.info/) - In-depth JavaScript tutorials and guides.
- [Frontend Mentor](https://www.frontendmentor.io/) - Platform for frontend challenges and community feedback.

## Author

- **Frontend Mentor:** [@TheBeyonder616](https://www.frontendmentor.io/profile/@TheBeyonder616)
- **GitHub:** [@TheBeyonder616](https://github.com/TheBeyonder616)

## Acknowledgments

A special thanks to Frontend Mentor for providing this challenging project and to the community for their valuable feedback and support throughout the development process.
