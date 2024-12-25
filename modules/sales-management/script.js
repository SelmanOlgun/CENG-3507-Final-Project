document.addEventListener("DOMContentLoaded", () => {
  addExampleOrders();

  populateProductCategories();
  displayOrders();
  setupFilters();
  calculateRevenue();
  calculateSalesReport();

  const form = document.getElementById("orderForm");
  const productCategorySelect = document.getElementById("productCategory");
  const quantityInput = document.getElementById("quantity");
  const totalPriceDisplay = document.getElementById("totalPrice");

  productCategorySelect.addEventListener("change", updateTotalPrice);
  quantityInput.addEventListener("input", updateTotalPrice);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const orderId = document.getElementById("orderId").value;
    const customerName = document.getElementById("customerName").value;
    const contact = document.getElementById("contact").value;
    const productCategoryIndex = productCategorySelect.value;
    const quantity = parseInt(quantityInput.value, 10);
    const status = document.getElementById("status").value;
    const orderDate = document.getElementById("orderDate").value;

    if (!/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(contact)) {
      alert("Contact must be in the format 123-456-7890.");
      return;
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
      alert("Quantity must be a positive integer.");
      return;
    }

    if (!/^[0-9]+$/.test(orderId)) {
      alert("Order ID must be a positive integer.");
      return;
    }
    const orderYear = new Date(orderDate).getFullYear();
    if (orderYear < 2000 || orderYear > 2025) {
      alert("Order date must be between the years 2000 and 2025.");
      return;
    }

    const existingOrders = getOrdersFromLocalStorage();
    if (existingOrders.some((order) => order.orderId === orderId)) {
      alert("Order ID must be unique.");
      return;
    }

    const products = getProductsFromLocalStorage();
    const product = products[productCategoryIndex];

    const totalPrice = (product.price_per_unit * quantity).toFixed(2);

    const newOrder = {
      orderId,
      customerName,
      contact,
      productCategory: product.product_category,
      quantity,
      status,
      totalPrice,
      date: orderDate,
    };

    saveOrderToLocalStorage(newOrder);
    alert("Order added successfully!");
    form.reset();
    updateTotalPrice();
    displayOrders();
  });
});

function calculateSalesReport() {
  const orders = getOrdersFromLocalStorage();
  const salesReport = {};

  orders.forEach((order) => {
    if (!salesReport[order.productCategory]) {
      salesReport[order.productCategory] = 0;
    }
    salesReport[order.productCategory] += order.quantity;
  });

  displaySalesReport(salesReport);
}

function displaySalesReport(salesReport) {
  const salesReportList = document.getElementById("salesReportList");
  salesReportList.innerHTML = "";

  for (const [category, unitsSold] of Object.entries(salesReport)) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<strong>${category}:</strong> <span>${unitsSold} units sold</span>`;
    salesReportList.appendChild(listItem);
  }
}
function calculateRevenue() {
  const orders = getOrdersFromLocalStorage();
  const products = getProductsFromLocalStorage();

  let totalRevenue = 0;
  const categoryRevenue = {};

  orders.forEach((order) => {
    const product = products.find(
      (p) => p.product_category === order.productCategory
    );
    const revenue = order.quantity * product.price_per_unit;

    totalRevenue += revenue;

    if (!categoryRevenue[order.productCategory]) {
      categoryRevenue[order.productCategory] = 0;
    }
    categoryRevenue[order.productCategory] += revenue;
  });

  document.getElementById(
    "totalRevenue"
  ).textContent = `$${totalRevenue.toFixed(2)}`;

  const categoryRevenueList = document.getElementById("categoryRevenueList");
  categoryRevenueList.innerHTML = "";

  for (const [category, revenue] of Object.entries(categoryRevenue)) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<strong>${category}:</strong> <span>$${revenue.toFixed(
      2
    )}</span>`;
    categoryRevenueList.appendChild(listItem);
  }
}

function getOrdersFromLocalStorage() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}

function getProductsFromLocalStorage() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function addExampleOrders() {
  const exampleOrders = [
    {
      orderId: "1",
      customerName: "John Doe",
      contact: "john.doe@example.com",
      productCategory: "Small (100g)",
      quantity: 10,
      status: "pending",
      totalPrice: "10.00",
      date: "2024-01-01",
    },
    {
      orderId: "2",
      customerName: "Jane Smith",
      contact: "jane.smith@example.com",
      productCategory: "Medium (250g)",
      quantity: 5,
      status: "processed",
      totalPrice: "45.00",
      date: "2024-01-02",
    },
    {
      orderId: "3",
      customerName: "Alice Johnson",
      contact: "alice.johnson@example.com",
      productCategory: "Large (500g)",
      quantity: 3,
      status: "shipped",
      totalPrice: "42.75",
      date: "2024-01-03",
    },
    {
      orderId: "4",
      customerName: "Bob Brown",
      contact: "bob.brown@example.com",
      productCategory: "Extra Large (1kg)",
      quantity: 2,
      status: "delivered",
      totalPrice: "16.00",
      date: "2024-01-04",
    },
    {
      orderId: "5",
      customerName: "Emma Wilson",
      contact: "emma.wilson@example.com",
      productCategory: "Family Pack (2kg)",
      quantity: 1,
      status: "pending",
      totalPrice: "15.00",
      date: "2024-01-05",
    },
  ];

  const existingOrders = getOrdersFromLocalStorage();
  const mergedOrders = mergeOrders(existingOrders, exampleOrders);

  localStorage.setItem("orders", JSON.stringify(mergedOrders));
  console.log("Example orders have been added to localStorage.");
}

function mergeOrders(existingOrders, exampleOrders) {
  const existingOrderIds = existingOrders.map((order) => order.orderId);

  const newOrders = exampleOrders.filter(
    (exampleOrder) => !existingOrderIds.includes(exampleOrder.orderId)
  );

  return [...existingOrders, ...newOrders];
}

function populateProductCategories() {
  const products = getProductsFromLocalStorage();
  const select = document.getElementById("productCategory");

  products.forEach((product, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = product.product_category;
    select.appendChild(option);
  });
}

function updateTotalPrice() {
  const productCategoryIndex = document.getElementById("productCategory").value;
  const quantity = parseFloat(document.getElementById("quantity").value);

  if (productCategoryIndex !== "" && !isNaN(quantity) && quantity > 0) {
    const products = getProductsFromLocalStorage();
    const product = products[productCategoryIndex];
    const totalPrice = (product.price_per_unit * quantity).toFixed(2);
    document.getElementById("totalPrice").textContent = `$${totalPrice}`;
  } else {
    document.getElementById("totalPrice").textContent = "$0.00";
  }
}

function displayOrders(orders = null) {
  const tableBody = document.querySelector("#orderTable tbody");
  const allOrders = getOrdersFromLocalStorage();
  const filteredOrders = orders || allOrders;

  tableBody.innerHTML = "";

  if (filteredOrders.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="9" style="text-align:center;">No orders found</td>`;
    tableBody.appendChild(row);
    return;
  }

  filteredOrders.forEach((order, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.orderId}</td>
      <td>${order.customerName}</td>
      <td>${order.contact}</td>
      <td>${order.productCategory}</td>
      <td>${order.quantity}</td>
      <td>${order.totalPrice}</td>
      <td>
        <select class="status-dropdown" data-index="${index}">
          <option value="pending" ${
            order.status === "pending" ? "selected" : ""
          }>Pending</option>
          <option value="processed" ${
            order.status === "processed" ? "selected" : ""
          }>Processed</option>
          <option value="shipped" ${
            order.status === "shipped" ? "selected" : ""
          }>Shipped</option>
          <option value="delivered" ${
            order.status === "delivered" ? "selected" : ""
          }>Delivered</option>
        </select>
      </td>
      <td>${order.date}</td>
    `;
    tableBody.appendChild(row);
  });

  setupStatusChangeHandlers();
}

function setupStatusChangeHandlers() {
  const dropdowns = document.querySelectorAll(".status-dropdown");

  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("change", (event) => {
      const index = event.target.getAttribute("data-index");
      const newStatus = event.target.value;

      const orders = getOrdersFromLocalStorage();
      orders[index].status = newStatus;

      localStorage.setItem("orders", JSON.stringify(orders));
      alert(`Order status updated to ${newStatus}`);
    });
  });
}

function setupFilters() {
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");

  searchInput.addEventListener("input", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
}

function applyFilters() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const statusFilter = document.getElementById("statusFilter").value;

  const allOrders = getOrdersFromLocalStorage();

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchInput) ||
      order.productCategory.toLowerCase().includes(searchInput);

    const matchesStatus =
      !statusFilter || order.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  displayOrders(filteredOrders);
}

function getProductsFromLocalStorage() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function getOrdersFromLocalStorage() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}

function saveOrderToLocalStorage(order) {
  const orders = getOrdersFromLocalStorage();
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
}

function generateCSV(data, headers) {
  let csvContent = headers.join(",") + "\n";

  for (const [key, value] of Object.entries(data)) {
    csvContent += `${key},${value}\n`;
  }

  return csvContent;
}

function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function downloadRevenueReport() {
  const orders = getOrdersFromLocalStorage();
  const products = getProductsFromLocalStorage();

  const revenueData = {};
  let totalRevenue = 0;

  orders.forEach((order) => {
    const product = products.find(
      (p) => p.product_category === order.productCategory
    );
    if (!product) return;

    const revenue = product.price_per_unit * order.quantity;

    if (!revenueData[order.productCategory]) {
      revenueData[order.productCategory] = 0;
    }

    revenueData[order.productCategory] += revenue;
    totalRevenue += revenue;
  });

  revenueData["Total Revenue"] = totalRevenue.toFixed(2);

  const headers = ["Category", "Revenue"];
  const csvContent = generateCSV(revenueData, headers);
  downloadCSV(csvContent, "Revenue_Report.csv");
}

function downloadSalesReport() {
  const orders = getOrdersFromLocalStorage();

  const salesData = {};
  orders.forEach((order) => {
    if (!salesData[order.productCategory]) {
      salesData[order.productCategory] = 0;
    }
    salesData[order.productCategory] += order.quantity;
  });

  const headers = ["Category", "Units Sold"];
  const csvContent = generateCSV(salesData, headers);
  downloadCSV(csvContent, "Sales_Report.csv");
}
