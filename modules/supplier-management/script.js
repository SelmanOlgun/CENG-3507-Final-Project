const farmers = [
  { id: "1", name: "John Doe", contact: "123-456-7890", location: "New York" },
  {
    id: "2",
    name: "Jane Smith",
    contact: "987-654-3210",
    location: "Los Angeles",
  },
  { id: "3", name: "Ali Khan", contact: "555-555-5555", location: "Karachi" },
  {
    id: "4",
    name: "Maria Garcia",
    contact: "444-444-4444",
    location: "Madrid",
  },
  {
    id: "5",
    name: "Olivia Martinez",
    contact: "567-890-1234",
    location: "Seattle",
  },
  {
    id: "6",
    name: "William Smith",
    contact: "678-901-2345",
    location: "Phoenix",
  },
];

let purchases = JSON.parse(localStorage.getItem("purchases")) || [
  {
    id: "101",
    farmerId: "1",
    date: new Date("2020-03-15"),
    quantity: 100,
    pricePerKg: 2.5,
    totalCost: 250,
  },
  {
    id: "102",
    farmerId: "2",
    date: new Date("2020-07-10"),
    quantity: 200,
    pricePerKg: 3.0,
    totalCost: 600,
  },
  {
    id: "103",
    farmerId: "3",
    date: new Date("2021-02-20"),
    quantity: 150,
    pricePerKg: 2.8,
    totalCost: 420,
  },
  {
    id: "104",
    farmerId: "4",
    date: new Date("2021-11-15"),
    quantity: 50,
    pricePerKg: 4.0,
    totalCost: 200,
  },
  {
    id: "105",
    farmerId: "5",
    date: new Date("2022-05-05"),
    quantity: 300,
    pricePerKg: 3.5,
    totalCost: 1050,
  },
  {
    id: "106",
    farmerId: "6",
    date: new Date("2023-01-30"),
    quantity: 120,
    pricePerKg: 2.7,
    totalCost: 324,
  },
  {
    id: "107",
    farmerId: "1",
    date: new Date("2023-08-10"),
    quantity: 180,
    pricePerKg: 3.2,
    totalCost: 576,
  },
  {
    id: "108",
    farmerId: "2",
    date: new Date("2024-04-25"),
    quantity: 220,
    pricePerKg: 3.8,
    totalCost: 836,
  },
  {
    id: "109",
    farmerId: "3",
    date: new Date("2025-06-15"),
    quantity: 140,
    pricePerKg: 2.9,
    totalCost: 406,
  },
  {
    id: "110",
    farmerId: "4",
    date: new Date("2025-12-01"),
    quantity: 90,
    pricePerKg: 4.5,
    totalCost: 405,
  },
];

let blueberryData = JSON.parse(localStorage.getItem("blueberryData")) || {
  totalQuantity: 0,
};
if (typeof blueberryData.totalQuantity !== "number") {
  blueberryData.totalQuantity = parseFloat(blueberryData.totalQuantity) || 0;
}

console.log("Current Blueberry Data:", blueberryData);

const validateFarmerInput = (id, name, contact, location, isEdit = false) => {
  if (!id || !name || !contact || !location) {
    alert("All fields are required.");
    return false;
  }

  const idRegex = /^[1-9]\d*$/;
  if (!idRegex.test(id)) {
    alert("Farmer ID must be a positive integer.");
    return false;
  }

  if (!isNaN(name)) {
    alert("Farmer name must not be a number.");
    return false;
  }

  const contactRegex = /^\d{3}-\d{3}-\d{4}$/;
  if (!contactRegex.test(contact)) {
    alert("Contact must be in the format 123-456-7890.");
    return false;
  }

  if (!isNaN(location)) {
    alert("Location must not be a number.");
    return false;
  }

  if (!isEdit && farmers.some((farmer) => farmer.id === id)) {
    alert("Farmer ID already exists. Use a unique ID.");
    return false;
  }

  return true;
};

const filterFarmers = (query) => {
  const lowerCaseQuery = query.toLowerCase();

  const filteredFarmers = farmers.filter(
    (farmer) =>
      farmer.name.toLowerCase().includes(lowerCaseQuery) ||
      farmer.location.toLowerCase().includes(lowerCaseQuery)
  );

  renderFarmersTable(filteredFarmers);
};

document.getElementById("search-input").addEventListener("input", (event) => {
  const query = event.target.value.trim();
  filterFarmers(query);
});

const renderFarmersTable = (farmerList = farmers) => {
  const tableBody = document.querySelector("#farmers-table tbody");
  tableBody.innerHTML = "";

  farmerList.forEach((farmer, index) => {
    const row = `
      <tr>
        <td>${farmer.id}</td>
        <td>${farmer.name}</td>
        <td>${farmer.contact}</td>
        <td>${farmer.location}</td>
        <td>
          <button class="edit-farmer-btn" data-index="${index}">Edit</button>
          <button class="delete-farmer-btn" data-index="${index}">Delete</button>
        </td>
      </tr>`;
    tableBody.innerHTML += row;
  });

  document.querySelectorAll(".edit-farmer-btn").forEach((button) => {
    button.addEventListener("click", handleEditFarmer);
  });
  document.querySelectorAll(".delete-farmer-btn").forEach((button) => {
    button.addEventListener("click", handleDeleteFarmer);
  });
};

document.getElementById("add-farmer-btn").addEventListener("click", () => {
  const id = document.getElementById("farmer-id").value.trim();
  const name = document.getElementById("farmer-name").value.trim();
  const contact = document.getElementById("farmer-contact").value.trim();
  const location = document.getElementById("farmer-location").value.trim();

  if (!validateFarmerInput(id, name, contact, location)) {
    return;
  }

  farmers.push({ id, name, contact, location });
  renderFarmersTable();
  document.getElementById("farmer-form").reset();
});

const handleEditFarmer = (event) => {
  const index = event.target.dataset.index;
  const farmer = farmers[index];

  document.getElementById("farmer-id").value = farmer.id;
  document.getElementById("farmer-name").value = farmer.name;
  document.getElementById("farmer-contact").value = farmer.contact;
  document.getElementById("farmer-location").value = farmer.location;

  document.getElementById("add-farmer-btn").style.display = "none";
  const updateBtn = document.createElement("button");
  updateBtn.id = "update-farmer-btn";
  updateBtn.textContent = "Update Farmer";
  document.getElementById("farmer-form").appendChild(updateBtn);

  updateBtn.addEventListener("click", () => {
    const updatedId = document.getElementById("farmer-id").value.trim();
    const updatedName = document.getElementById("farmer-name").value.trim();
    const updatedContact = document
      .getElementById("farmer-contact")
      .value.trim();
    const updatedLocation = document
      .getElementById("farmer-location")
      .value.trim();

    if (
      !validateFarmerInput(
        updatedId,
        updatedName,
        updatedContact,
        updatedLocation,
        true
      )
    ) {
      return;
    }

    farmers[index] = {
      id: updatedId,
      name: updatedName,
      contact: updatedContact,
      location: updatedLocation,
    };

    renderFarmersTable();
    document.getElementById("farmer-form").reset();
    updateBtn.remove();
    document.getElementById("add-farmer-btn").style.display = "inline-block";
  });
};
const handleDeleteFarmer = (event) => {
  const index = event.target.dataset.index;
  farmers.splice(index, 1);
  renderFarmersTable();
};

const validateFarmerIdForPurchase = (farmerId) => {
  if (!farmers.some((farmer) => farmer.id === farmerId)) {
    alert("Invalid Farmer ID. Please enter a valid Farmer ID.");
    return false;
  }
  return true;
};

document.getElementById("add-purchase-btn").addEventListener("click", () => {
  const purchaseId = document.getElementById("purchase-id").value.trim();
  const farmerIdPurchase = document
    .getElementById("farmer-id-purchase")
    .value.trim();
  const purchaseDate = document.getElementById("purchase-date").value.trim();
  const purchaseQuantity = parseFloat(
    document.getElementById("purchase-quantity").value.trim()
  );
  const pricePerKg = parseFloat(
    document.getElementById("price-per-kg").value.trim()
  );

  if (
    !purchaseId ||
    !farmerIdPurchase ||
    !purchaseDate ||
    isNaN(purchaseQuantity) ||
    isNaN(pricePerKg)
  ) {
    alert(
      "All fields are required and quantity/price should be valid numbers."
    );
    return;
  }

  if (purchases.some((purchase) => purchase.id === purchaseId)) {
    alert("Purchase ID already exists. Please use a unique Purchase ID.");
    return;
  }

  if (!/^[1-9]\d*$/.test(purchaseId)) {
    alert("Purchase ID must be a positive integer.");
    return;
  }

  if (purchaseQuantity <= 0) {
    alert("Quantity must be a positive number.");
    return;
  }

  if (pricePerKg <= 0) {
    alert("Price per kg must be a positive number.");
    return;
  }

  const purchaseDateObj = new Date(purchaseDate);
  const minDate = new Date("2000-01-01");
  const maxDate = new Date("2025-12-31");
  if (purchaseDateObj < minDate || purchaseDateObj > maxDate) {
    alert("Date must be between the years 2000 and 2025.");
    return;
  }

  if (!validateFarmerIdForPurchase(farmerIdPurchase)) {
    return;
  }

  const totalCost = purchaseQuantity * pricePerKg;

  const purchase = {
    id: purchaseId,
    farmerId: farmerIdPurchase,
    date: new Date(purchaseDate),
    quantity: purchaseQuantity,
    pricePerKg: pricePerKg,
    totalCost: totalCost,
  };

  purchases.push(purchase);
  localStorage.setItem("purchases", JSON.stringify(purchases));

  blueberryData.totalQuantity = parseFloat(blueberryData.totalQuantity) || 0;
  blueberryData.totalQuantity += purchaseQuantity;
  localStorage.setItem("blueberryData", JSON.stringify(blueberryData));

  updatePurchasesTable();

  document.getElementById("purchase-form").reset();
});

function updatePurchasesTable() {
  const purchaseTableBody = document
    .getElementById("purchase-table")
    .getElementsByTagName("tbody")[0];
  purchaseTableBody.innerHTML = "";
  purchases.forEach((purchase) => {
    const row = purchaseTableBody.insertRow();
    row.innerHTML = `
      <td>${purchase.id}</td>
      <td>${purchase.farmerId}</td>
      <td>${new Date(purchase.date).toLocaleDateString()}</td>
      <td>${purchase.quantity}</td>
      <td>${purchase.pricePerKg}</td>
      <td>${purchase.totalCost.toFixed(2)}</td>
    `;
  });
}

renderFarmersTable();
updatePurchasesTable();

document
  .getElementById("calculate-expenses-btn")
  .addEventListener("click", () => {
    const totalExpenses = purchases.reduce(
      (total, purchase) => total + purchase.totalCost,
      0
    );
    document.getElementById(
      "total-expenses"
    ).textContent = `Total Expenses: $${totalExpenses.toFixed(2)}`;
  });

const sortByDate = () => {
  purchases.sort((a, b) => new Date(a.date) - new Date(b.date));
  updatePurchasesTable();
};

const sortByFarmer = () => {
  purchases.sort((a, b) => {
    const farmerA = parseInt(a.farmerId, 10);
    const farmerB = parseInt(b.farmerId, 10);
    return farmerA - farmerB;
  });
  updatePurchasesTable();
};

const sortByAmount = () => {
  purchases.sort((a, b) => a.totalCost - b.totalCost);
  updatePurchasesTable();
};

document.getElementById("sort-options-btn").addEventListener("click", () => {
  const menu = document.getElementById("sort-options-menu");
  menu.style.display =
    menu.style.display === "none" || menu.style.display === ""
      ? "block"
      : "none";
});

document.getElementById("sort-date-btn").addEventListener("click", sortByDate);
document
  .getElementById("sort-farmer-btn")
  .addEventListener("click", sortByFarmer);
document
  .getElementById("sort-amount-btn")
  .addEventListener("click", sortByAmount);

const exportFarmersAsCSV = () => {
  if (farmers.length === 0) {
    alert("No farmers to export.");
    return;
  }

  let csvContent = "Farmer ID,Name,Contact,Location\n";

  farmers.forEach((farmer) => {
    csvContent += `${farmer.id},${farmer.name},${farmer.contact},${farmer.location}\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "farmers_report.csv");
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

document
  .getElementById("export-farmers-btn")
  .addEventListener("click", exportFarmersAsCSV);
