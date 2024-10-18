// Variables for DOM elements and product list
const productList = document.getElementById('productList');
const searchInput = document.getElementById('search');
const categoryCheckboxes = document.querySelectorAll('.filter__category-checkbox');
const sortOptions = document.getElementById('sortOptions');
const loadMoreButton = document.getElementById('loadMoreButton');
const totalProductsCount = document.getElementById('totalProductsCount');
const errorMessage = document.getElementById('errorMessage');
const noProductsMessage = document.getElementById('noProductsMessage');

// Product management variables
let products = [];
let filteredProducts = [];
let currentProductIndex = 0;
const productsPerLoad = 10;

// Show shimmer effect while loading products
function showShimmerEffect() {
   const shimmerEffect = document.getElementById('shimmerEffect');
   shimmerEffect.innerHTML = '';

   // Create shimmer items based on expected products count
   for (let i = 0; i < productsPerLoad; i++) {
      const shimmerItem = document.createElement('div');
      shimmerItem.className = 'shimmer-item';
      shimmerEffect.appendChild(shimmerItem);
   }
   shimmerEffect.style.display = 'grid';
}

function hideShimmerEffect() {
   const shimmerEffect = document.getElementById('shimmerEffect');
   shimmerEffect.style.display = 'none';
}

// Display error message
function displayError(message) {
   errorMessage.textContent = message;
   errorMessage.style.display = 'block';
}

// Hide error message
function hideError() {
   errorMessage.style.display = 'none';
}

// Fetch products from API and initialize the product list
async function fetchProducts() {
   showShimmerEffect();
   hideError();
   try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
         throw new Error('Failed to fetch products. Please try again later.');
      }
      products = await response.json();
      filteredProducts = products;
      displayProducts(filteredProducts.slice(0, productsPerLoad));
      currentProductIndex = productsPerLoad;

      // Show "Load More" button if there are more products to load
      toggleLoadMoreButton(filteredProducts);
      totalProductsCount.textContent = products.length;
   } catch (error) {
      console.error('Error fetching products:', error);
      displayError(error.message);
   } finally {
      hideShimmerEffect();
   }
}

// Display a set of products
function displayProducts(productsToDisplay) {
   productsToDisplay.forEach(product => {
      const productItem = document.createElement('div');
      productItem.className = 'product-item';
      productItem.innerHTML = `
            <div class="product__image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product__description">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            </div>
        `;
      productList.appendChild(productItem);
   });
}

// Load more products functionality
function loadMoreProducts() {
   const nextProducts = filteredProducts.slice(currentProductIndex, currentProductIndex + productsPerLoad);
   displayProducts(nextProducts);
   currentProductIndex += productsPerLoad;

   // Hide "Load More" button if no more products to load
   toggleLoadMoreButton(filteredProducts);
}

function toggleFilterCategories() {
   const filterCategories = document.querySelector('.filter__categories');
   const hamburger = document.getElementById('hamburger');

   // Toggle the display state of the filter categories
   if (filterCategories.style.display === 'none' || filterCategories.style.display === '') {
      filterCategories.style.display = 'block';
      hamburger.classList.add('active');
   } else {
      filterCategories.style.display = 'none';
      hamburger.classList.remove('active');
   }
}

function toggleSortByPrice() {
   const sortbyprice = document.querySelector('.filter__sort-options');
   const sort = document.getElementById('sort');

   // Toggle the display state of the filter categories
   if (sortbyprice.style.display === 'none' || sortbyprice.style.display === '') {
      sortbyprice.style.display = 'block';
      sort.classList.add('active');
   } else {
      sortbyprice.style.display = 'none';
      sort.classList.remove('active');
   }
}

// Filter products based on search, categories, and sorting
function filterProducts() {
   const query = searchInput.value.toLowerCase();
   const selectedCategories = Array.from(categoryCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

   // Filter by search query
   filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(query)
   );

   // Filter by selected categories
   if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
         selectedCategories.includes(product.category)
      );
   }

   // Sort products
   sortFilteredProducts();

   // Reset product display
   currentProductIndex = 0;
   productList.innerHTML = '';

   // Display products or show no products message
   if (filteredProducts.length === 0) {
      noProductsMessage.textContent = 'Product not found';
      noProductsMessage.style.display = 'block';
   } else {
      noProductsMessage.style.display = 'none';
      displayProducts(filteredProducts.slice(0, productsPerLoad));
      currentProductIndex = productsPerLoad;
   }

   // Update total products count
   totalProductsCount.textContent = filteredProducts.length;

   // Toggle "Load More" button
   toggleLoadMoreButton(filteredProducts);
}

// Sort products based on the selected sort option
function sortFilteredProducts() {
   const sortValue = sortOptions.value;
   if (sortValue === 'priceLowToHigh') {
      filteredProducts.sort((a, b) => a.price - b.price);
   } else if (sortValue === 'priceHighToLow') {
      filteredProducts.sort((a, b) => b.price - a.price);
   }
}

// Toggle "Load More" button visibility based on product count
function toggleLoadMoreButton(productsList) {
   loadMoreButton.style.display = currentProductIndex < productsList.length ? 'block' : 'none';
}

// Event listeners
searchInput.addEventListener('input', filterProducts);
categoryCheckboxes.forEach(checkbox => checkbox.addEventListener('change', filterProducts));
sortOptions.addEventListener('change', filterProducts);
loadMoreButton.addEventListener('click', loadMoreProducts);

fetchProducts();