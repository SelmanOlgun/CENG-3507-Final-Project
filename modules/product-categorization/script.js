const initialProducts = [
  {
    product_category: "Small (100g)",
    weight: 0.1,
    price_per_unit: 1.2,
    currentQuantity: 120,
    currentKg: 12,
    minThreshold: 50,
    status: "Efficient",
  },
  {
    product_category: "Medium (250g)",
    weight: 0.25,
    price_per_unit: 3,
    currentQuantity: 40,
    currentKg: 10,
    minThreshold: 100,
    status: "Low Stock",
  },
  {
    product_category: "Large (500g)",
    weight: 0.5,
    price_per_unit: 5.5,
    currentQuantity: 150,
    currentKg: 75,
    minThreshold: 80,
    status: "Efficient",
  },
  {
    product_category: "Extra Large (1kg)",
    weight: 1.0,
    price_per_unit: 10,
    currentQuantity: 30,
    currentKg: 30,
    minThreshold: 50,
    status: "Low Stock",
  },
  {
    product_category: "Family Pack (2kg)",
    weight: 2.0,
    price_per_unit: 18,
    currentQuantity: 80,
    currentKg: 160,
    minThreshold: 150,
    status: "Low Stock",
  },
  {
    product_category: "Bulk Pack (5kg)",
    weight: 5.0,
    price_per_unit: 40,
    currentQuantity: 300,
    currentKg: 1500,
    minThreshold: 500,
    status: "Efficient",
  },
  {
    product_category: "Premium",
    weight: "Custom",
    price_per_unit: 12,
    currentQuantity: 0,
    currentKg: 0,
    minThreshold: 10,
    status: "Low Stock",
  },
];


const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
const mergedProducts = initialProducts.map((initialProduct) => {
  const existingProduct = storedProducts.find(
    (product) => product.product_category === initialProduct.product_category
  );
  return existingProduct ? { ...initialProduct, ...existingProduct } : initialProduct;
});

localStorage.setItem("products", JSON.stringify(mergedProducts));

function getProducts() {
  return JSON.parse(localStorage.getItem("products"));
}

function setProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
  updateUI();
}

function updateUI() {
  loadProducts();
  populateDropdowns();
  populatePackagingDropdown();
  populateStockTable();
  drawStockChart();
}

function updateBlueberryStockDisplay() {
  const blueberryData = JSON.parse(localStorage.getItem("blueberryData")) || { totalQuantity: 0 };
  document.getElementById("currentBlueberryStock").textContent = `Current Blueberry Stock: ${blueberryData.totalQuantity.toFixed(2)} kg`;
}
function loadProducts() {
  const products = getProducts();
  const tableBody = document.querySelector("#productTable tbody");
  tableBody.innerHTML = "";

  products.forEach((product, index) => {
    product.status =
      product.currentKg >= product.minThreshold ? "Efficient" : "Low Stock";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.product_category}</td>
      <td>${product.weight}</td>
      <td id="price-${index}">${product.price_per_unit}</td>
      <td id="quantity-${index}">${product.currentQuantity}</td>
      <td id="kg-${index}">${product.currentKg}</td>
      <td id="threshold-${index}">${product.minThreshold}</td>
      <td id="status-${index}" style="color: ${
        product.status === "Efficient" ? "green" : "red"
      }">
        ${product.status}
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function populateDropdowns() {
  const categorySelect = document.getElementById("category");
  const costCategorySelect = document.getElementById("costCategory");
  categorySelect.innerHTML = "";
  costCategorySelect.innerHTML = "";

  getProducts().forEach((product, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = product.product_category;

    categorySelect.appendChild(option);
    const costOption = option.cloneNode(true);
    costCategorySelect.appendChild(costOption);
  });
}

function populatePackagingDropdown() {
  const packagingSelect = document.getElementById("packagingCategory");
  packagingSelect.innerHTML = "";

  getProducts().forEach((product, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = product.product_category;
    packagingSelect.appendChild(option);
  });
}

function handlePriceUpdate(event) {
  event.preventDefault();

  const categoryIndex = document.getElementById("category").value;
  const newPrice = parseFloat(document.getElementById("newPrice").value);

  if (!isNaN(newPrice) && newPrice > 0) {
    const products = getProducts();
    products[categoryIndex].price_per_unit = newPrice;
    setProducts(products);
    alert("Price updated successfully!");
  } else {
    alert("Please enter a valid price.");
  }
}

function calculateTotalCost(event) {
  event.preventDefault();

  const categoryIndex = document.getElementById("costCategory").value;
  const quantity = parseFloat(document.getElementById("quantity").value);

  if (!isNaN(quantity) && quantity > 0) {
    const products = getProducts();
    const pricePerUnit = products[categoryIndex].price_per_unit;
    const totalCost = pricePerUnit * quantity;
    document.getElementById(
      "totalCost"
    ).textContent = `Total Cost: $${totalCost.toFixed(2)}`;
  } else {
    alert("Please enter a valid quantity.");
  }
}
function handlePackaging(event) {
  event.preventDefault();

  const categoryIndex = document.getElementById("packagingCategory").value;
  const quantity = parseInt(document.getElementById("packagingQuantity").value);

  if (!isNaN(quantity) && quantity > 0) {
    const products = getProducts();
    const product = products[categoryIndex];
    const totalKg =
      product.weight === "Custom" ? quantity : product.weight * quantity;

    let blueberryData = JSON.parse(localStorage.getItem("blueberryData")) || {
      totalQuantity: 0,
    };

    if (blueberryData.totalQuantity >= totalKg) {
      product.currentQuantity += quantity;
      product.currentKg += totalKg;

      blueberryData.totalQuantity -= totalKg;
      localStorage.setItem("blueberryData", JSON.stringify(blueberryData));

      setProducts(products);
      updateBlueberryStockDisplay();
      document.getElementById("packagingForm").reset();
      alert("Blueberries successfully packaged!");
    } else {
      alert(
        `Insufficient blueberry stock! You only have ${blueberryData.totalQuantity.toFixed(
          2
        )} kg available.`
      );
    }
  } else {
    alert("Please enter a valid quantity.");
  }
}

function populateStockTable() {
  const products = getProducts();
  const tableBody = document.querySelector("#stockStatusTable tbody");
  tableBody.innerHTML = "";

  products.forEach((product) => {
    const status = product.currentKg >= product.minThreshold ? "Efficient" : "Low Stock";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.product_category}</td>
      <td>${product.currentKg.toFixed(2)}</td>
      <td>${product.minThreshold}</td>
      <td style="color: ${status === "Efficient" ? "green" : "red"};">${status}</td>
    `;
    tableBody.appendChild(row);
  });
}

let stockChart;
function drawStockChart() {
  const products = getProducts();
  const ctx = document.getElementById("stockChart").getContext("2d");

  if (stockChart) {
    stockChart.destroy();
  }

  stockChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: products.map((p) => p.product_category),
      datasets: [
        {
          label: "Current Stock (kg)",
          data: products.map((p) => p.currentKg),
          backgroundColor: "skyblue",
        },
        {
          label: "Min Threshold (kg)",
          data: products.map((p) => p.minThreshold),
          backgroundColor: "orange",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  updateBlueberryStockDisplay();

  document
    .getElementById("updateForm")
    .addEventListener("submit", handlePriceUpdate);
  document
    .getElementById("costForm")
    .addEventListener("submit", calculateTotalCost);
  document
    .getElementById("packagingForm")
    .addEventListener("submit", handlePackaging);
});
