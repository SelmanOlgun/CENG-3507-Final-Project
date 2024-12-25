document
  .getElementById("generateReportBtn")
  .addEventListener("click", generateReport);

function generateReport() {
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);
  const taxRate = parseFloat(document.getElementById("taxRate").value) / 100;

  if (
    isNaN(startDate) ||
    isNaN(endDate) ||
    startDate.getFullYear() < 2000 ||
    endDate.getFullYear() > 2025 ||
    startDate > endDate
  ) {
    alert("Please select valid dates between the years 2000 and 2025.");
    return;
  }

  if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) {
    alert("Tax rate must be an integer between 0 and 100.");
    return;
  }

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const expenses = calculateExpenses(products);

  let totalRevenue = 0;
  let totalProfit = 0;
  let totalUnitsSold = 0;
  const productDetails = {};

  orders.forEach((order) => {
    const orderDate = new Date(order.date);
    if (orderDate >= startDate && orderDate <= endDate) {
      const revenue = parseFloat(order.totalPrice);
      totalRevenue += revenue;

      const product = products.find(
        (p) => p.product_category === order.productCategory
      );
      const costPerUnit = product ? product.price_per_unit * 0.6 : 0;
      const profit = revenue - costPerUnit * order.quantity;
      totalProfit += profit;

      totalUnitsSold += order.quantity;

      if (!productDetails[order.productCategory]) {
        productDetails[order.productCategory] = {
          unitsSold: 0,
          revenue: 0,
          profit: 0,
        };
      }
      productDetails[order.productCategory].unitsSold += order.quantity;
      productDetails[order.productCategory].revenue += revenue;
      productDetails[order.productCategory].profit += profit;
    }
  });

  const tax = totalProfit * taxRate;
  const netProfit = totalRevenue - expenses - tax;

  displaySummary(
    totalRevenue,
    expenses,
    totalProfit,
    netProfit,
    tax,
    totalUnitsSold
  );
  displayProductDetails(productDetails);
  displayRemainingStock(
    products.map((product) => ({
      category: product.product_category,
      remainingKg: product.currentKg,
    }))
  );

  drawRevenuePieChart(productDetails);
  drawProfitBarChart(productDetails);
}

function calculateExpenses(products) {
  const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
  return purchases.reduce((total, purchase) => {
    const purchaseDate = new Date(purchase.date);
    if (purchaseDate >= startDate && purchaseDate <= endDate) {
      return total + purchase.totalCost;
    }
    return total;
  }, 0);
}

function displaySummary(revenue, expenses, profit, netProfit, tax, unitsSold) {
  const summaryDiv = document.getElementById("summary");
  summaryDiv.innerHTML = `
    <p>Total Revenue: $${revenue.toFixed(2)}</p>
    <p>Total Units Sold: ${unitsSold}</p>
    <p>Total Expenses: $${expenses.toFixed(2)}</p>
    <p>Total Profit: $${profit.toFixed(2)}</p>
    <p>Tax Applied (${((tax / profit) * 100).toFixed(2)}%): $${tax.toFixed(
    2
  )}</p>
    <p>Net Profit: $${netProfit.toFixed(2)}</p>
  `;
}

function displayProductDetails(details) {
  const tableBody = document.getElementById("productTableBody");
  tableBody.innerHTML = "";

  for (const [category, data] of Object.entries(details)) {
    const averagePrice = data.revenue / (data.unitsSold || 1);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${category}</td>
      <td>${data.unitsSold}</td>
      <td>${data.revenue.toFixed(2)}</td>
      <td>${data.profit.toFixed(2)}</td>
      <td>${averagePrice.toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
  }
}

function displayRemainingStock(stock) {
  const tableBody = document.getElementById("stockTableBody");
  tableBody.innerHTML = "";

  stock.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.category}</td>
      <td>${item.remainingKg.toFixed(2)} kg</td>
    `;
    tableBody.appendChild(row);
  });
}

function drawRevenuePieChart(productDetails) {
  const ctx = document.getElementById("revenuePieChart").getContext("2d");
  const labels = Object.keys(productDetails);
  const data = Object.values(productDetails).map((detail) => detail.revenue);

  new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["red", "blue", "green", "orange", "purple"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
}

function drawProfitBarChart(productDetails) {
  const ctx = document.getElementById("profitBarChart").getContext("2d");
  const labels = Object.keys(productDetails);
  const data = Object.values(productDetails).map((detail) => detail.profit);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Profit ($)",
          data,
          backgroundColor: "green",
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
