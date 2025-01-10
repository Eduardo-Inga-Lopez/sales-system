// Funciones de búsqueda y ordenamiento
function searchTable(tableId, searchTerm) {
  const table = document.getElementById(tableId);
  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.getElementsByTagName("tr"));

  rows.forEach((row) => {
    const text = Array.from(row.getElementsByTagName("td"))
      .map((cell) => cell.textContent.toLowerCase())
      .join(" ");

    const match = text.includes(searchTerm.toLowerCase());
    row.style.display = match ? "" : "none";
  });
}

function sortTable(tableId, column, direction) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.getElementsByTagName('tr'));

    const sortedRows = rows.sort((a, b) => {
        let aValue = a.cells[column].textContent.trim();
        let bValue = b.cells[column].textContent.trim();

        // Eliminar símbolo de moneda y convertir a número si es necesario
        if (aValue.startsWith('S/.')) {
            aValue = parseFloat(aValue.replace('S/.', '').trim());
            bValue = parseFloat(bValue.replace('S/.', '').trim());
        }

        const isNumber = !isNaN(aValue) && !isNaN(bValue);

        return isNumber
            ? (direction === 'asc' ? aValue - bValue : bValue - aValue)
            : (direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue));
    });

    tbody.innerHTML = '';
    sortedRows.forEach(row => tbody.appendChild(row));
}

// Configurar búsqueda en tiempo real
document.querySelectorAll("input[data-table]").forEach((input) => {
  input.addEventListener("input", (e) => {
    const tableId = e.target.dataset.table + "Table";
    searchTable(tableId, e.target.value);
  });
});

// Configurar ordenamiento por columnas
document.querySelectorAll("th[data-sort]").forEach((th) => {
  th.addEventListener("click", (e) => {
    const column = parseInt(e.target.dataset.sort);
    const currentDir = e.target.classList.contains("sort-asc") ? "desc" : "asc";

    // Actualizar estados de ordenamiento
    document
      .querySelectorAll("th")
      .forEach((el) => el.classList.remove("sort-asc", "sort-desc"));
    e.target.classList.add(`sort-${currentDir}`);

    // Ordenar tabla
    const tableId = e.target.closest("table").id;
    sortTable(tableId, column, currentDir);
  });
});

// Gestión de productos
document
  .getElementById("productForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const stock = document.getElementById("productStock").value;

    const productList = document.getElementById("productList");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${name}</td>
        <td>${price}</td>
        <td>${stock}</td>
        <td>
            <button class="btn btn-warning btn-sm" onclick="openUpdateStockForm(this)">
                Actualizar Stock
            </button>
        </td>
    `;

    productList.appendChild(row);
    document.getElementById("productForm").reset();
    updateProductSelects();
    $("#offcanvasProductForm").offcanvas("hide");
  });

function openUpdateStockForm(button) {
  const row = button.closest("tr");
  const cells = row.getElementsByTagName("td");
  const currentStock = cells[2].textContent;
  const rowIndex = Array.from(row.parentNode.children).indexOf(row);

  document.getElementById("currentStock").value = currentStock;
  document.getElementById("newStock").value = currentStock;
  document.getElementById("updateProductIndex").value = rowIndex;

  new bootstrap.Offcanvas(
    document.getElementById("offcanvasUpdateStock")
  ).show();
}

document
  .getElementById("updateStockForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const rowIndex = document.getElementById("updateProductIndex").value;
    const newStock = document.getElementById("newStock").value;

    const row = document.getElementById("productList").children[rowIndex];
    row.getElementsByTagName("td")[2].textContent = newStock;

    bootstrap.Offcanvas.getInstance(
      document.getElementById("offcanvasUpdateStock")
    ).hide();
    updateProductSelects();
  });

// Gestión de clientes
document
  .getElementById("clientForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("clientName").value;
    const email = document.getElementById("clientEmail").value;

    const clientList = document.getElementById("clientList");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${name}</td>
        <td>${email}</td>
        <td>0</td>
        <td>
            <button class="btn btn-warning btn-sm" onclick="openUpdateEmailForm(this)">
                Actualizar Email
            </button>
        </td>
    `;

    clientList.appendChild(row);
    document.getElementById("clientForm").reset();
    updateClientSelect();
    $("#offcanvasClientForm").offcanvas("hide");
  });

document
  .getElementById("updateEmailForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const rowIndex = document.getElementById("updateClientIndex").value;
    const newEmail = document.getElementById("newEmail").value;

    const row = document.getElementById("clientList").children[rowIndex];
    row.getElementsByTagName("td")[1].textContent = newEmail;

    bootstrap.Offcanvas.getInstance(
      document.getElementById("offcanvasUpdateEmail")
    ).hide();
    updateClientSelect();
  });

document.getElementById("addProduct").addEventListener("click", function () {
  const productContainer = document.getElementById("productContainer");
  const newProductDiv = document.createElement("div");
  newProductDiv.classList.add("mb-3");
  newProductDiv.innerHTML = `
        <label for="selectProduct" class="form-label">Seleccionar Producto</label>
        <select class="form-select selectProduct" required>
            <option value="" disabled selected>Seleccione el producto</option>
        </select>
        <label for="productQuantity" class="form-label mt-2">Cantidad</label>
        <input type="number" class="form-control productQuantity" required/>
    `;
  productContainer.appendChild(newProductDiv);
  updateProductSelects();
});

document
  .getElementById("salesForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const clientName = document.getElementById("selectClient").value;
    const productSelects = document.querySelectorAll(".selectProduct");
    const productQuantities = document.querySelectorAll(".productQuantity");
    const salesList = document.getElementById("salesList");
    let total = 0;
    let products = [];

    for (let i = 0; i < productSelects.length; i++) {
      const product = productSelects[i].value;
      const quantity = parseInt(productQuantities[i].value);
      const productRow = Array.from(
        document.querySelectorAll("#productList tr")
      ).find((row) => row.cells[0].innerText === product);
      const stock = parseInt(productRow.cells[2].innerText);

      if (quantity > stock) {
        alert(`No hay suficiente stock para el producto ${product}`);
        return;
      }

      productRow.cells[2].innerText = stock - quantity;
      total += parseFloat(productRow.cells[1].innerText) * quantity;
      products.push(`${quantity}x ${product}`);
    }

    const clientRow = Array.from(
      document.querySelectorAll("#clientList tr")
    ).find((row) => row.cells[0].innerText === clientName);
    let purchaseCount = 0;

    if (clientRow) {
      const purchaseCountCell = clientRow.cells[2];
      purchaseCount = parseInt(purchaseCountCell.innerText) + 1;
      purchaseCountCell.innerText = purchaseCount;
    }

    const saleRow = document.createElement("tr");
    saleRow.innerHTML = `
        <td>${clientName}</td>
        <td>${products.join(", ")}</td>
        <td>S/. ${total.toFixed(2)}</td>
        <td>${purchaseCount}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteSale(this)">Eliminar</button></td>
    `;
    salesList.appendChild(saleRow);

    document.getElementById("salesForm").reset();
    document.getElementById("productContainer").innerHTML = "";
    document.getElementById("totalSale").value = "";
    $("#offcanvasSalesForm").offcanvas("hide");
  });

function deleteSale(button) {
  const row = button.closest("tr");
  row.remove();
}

function openUpdateEmailForm(button) {
  const row = button.closest("tr");
  const cells = row.getElementsByTagName("td");
  const currentEmail = cells[1].textContent;
  const rowIndex = Array.from(row.parentNode.children).indexOf(row);

  document.getElementById("currentEmail").value = currentEmail;
  document.getElementById("newEmail").value = currentEmail;
  document.getElementById("updateClientIndex").value = rowIndex;

  new bootstrap.Offcanvas(
    document.getElementById("offcanvasUpdateEmail")
  ).show();
}

function updateProductSelects() {
  const productSelects = document.querySelectorAll(".selectProduct");
  const productList = document.querySelectorAll("#productList tr");
  productSelects.forEach((select) => {
    select.innerHTML =
      '<option value="" disabled selected>Seleccione el producto</option>';
    productList.forEach((row) => {
      const option = document.createElement("option");
      option.value = row.cells[0].innerText;
      option.innerText = row.cells[0].innerText;
      select.appendChild(option);
    });
  });
}

function updateClientSelect() {
  const clientSelect = document.getElementById("selectClient");
  const clientList = document.querySelectorAll("#clientList tr");
  clientSelect.innerHTML =
    '<option value="" disabled selected>Seleccione el cliente</option>';
  clientList.forEach((row) => {
    const option = document.createElement("option");
    option.value = row.cells[0].innerText;
    option.innerText = row.cells[0].innerText;
    clientSelect.appendChild(option);
  });
}
