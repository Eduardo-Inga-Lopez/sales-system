document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const stock = document.getElementById('productStock').value;

    const productList = document.getElementById('productList');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${name}</td>
        <td>${price}</td>
        <td>${stock}</td>
        <td><button class="btn btn-warning btn-sm" onclick="updateStock(this)">Actualizar Stock</button></td>
    `;

    productList.appendChild(row);

    document.getElementById('productForm').reset();
    updateProductSelects();
});

document.getElementById('clientForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('clientName').value;
    const email = document.getElementById('clientEmail').value;

    const clientList = document.getElementById('clientList');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${name}</td>
        <td>${email}</td>
        <td>0</td> <!-- Inicializar el contador de compras -->
        <td><button class="btn btn-warning btn-sm" onclick="updateEmail(this)">Actualizar Email</button></td>
    `;

    clientList.appendChild(row);

    document.getElementById('clientForm').reset();
    updateClientSelect();
});

document.getElementById('addProduct').addEventListener('click', function() {
    const productContainer = document.getElementById('productContainer');
    const newProductDiv = document.createElement('div');
    newProductDiv.classList.add('mb-3');
    newProductDiv.innerHTML = `
        <label for="selectProduct" class="form-label">Seleccionar Producto</label>
        <select class="form-select selectProduct" required>
            <option value="" disabled selected>Seleccione el producto</option>
            <!-- Aquí se agregarán los productos -->
        </select>
        <label for="productQuantity" class="form-label mt-2">Cantidad</label>
        <input type="number" class="form-control productQuantity" required/>
    `;
    productContainer.appendChild(newProductDiv);
    updateProductSelects();
});

document.getElementById('salesForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const clientName = document.getElementById('selectClient').value;
    const productSelects = document.querySelectorAll('.selectProduct');
    const productQuantities = document.querySelectorAll('.productQuantity');
    const salesList = document.getElementById('salesList');
    let total = 0;
    let products = [];

    for (let i = 0; i < productSelects.length; i++) {
        const product = productSelects[i].value;
        const quantity = parseInt(productQuantities[i].value);
        const productRow = Array.from(document.querySelectorAll('#productList tr')).find(row => row.cells[0].innerText === product);
        const stock = parseInt(productRow.cells[2].innerText);

        if (quantity > stock) {
            alert(`No hay suficiente stock para el producto ${product}`);
            return;
        }

        // Actualizar el stock del producto
        productRow.cells[2].innerText = stock - quantity;

        // Calcular el total y preparar el detalle de productos
        total += parseFloat(productRow.cells[1].innerText) * quantity;
        products.push(`${quantity}x ${product}`);
    }

    // Incrementar el contador de compras del cliente
    const clientRow = Array.from(document.querySelectorAll('#clientList tr')).find(row => row.cells[0].innerText === clientName);
    let purchaseCount = 0;

    if (clientRow) {
        const purchaseCountCell = clientRow.cells[2]; // Columna de contador de compras
        purchaseCount = parseInt(purchaseCountCell.innerText) + 1;
        purchaseCountCell.innerText = purchaseCount; // Actualizar el contador en la tabla de clientes
    }

    // Registrar la venta en la tabla de ventas, incluyendo el contador
    const saleRow = document.createElement('tr');
    saleRow.innerHTML = `
        <td>${clientName}</td>
        <td>${products.join(', ')}</td>
        <td>S/. ${total.toFixed(2)}</td>
        <td>${purchaseCount}</td> <!-- Mostrando el contador -->
        <td><button class="btn btn-danger btn-sm" onclick="deleteSale(this)">Eliminar</button></td>
    `;
    salesList.appendChild(saleRow);

    // Limpiar el formulario
    document.getElementById('salesForm').reset();
    updateProductSelects();
    updateClientSelect();
});


// Función para eliminar una venta
function deleteSale(button) {
    const row = button.closest('tr');
    row.remove();
}

function updateStock(button) {
    const row = button.parentNode.parentNode;
    const stockCell = row.cells[2];
    const newStock = prompt("Ingrese el nuevo stock:", stockCell.innerHTML);
    if (newStock !== null) {
        stockCell.innerHTML = newStock;
    }
}

function updateEmail(button) {
    const row = button.parentNode.parentNode;
    const emailCell = row.cells[1];
    const newEmail = prompt("Ingrese el nuevo email:", emailCell.innerHTML);
    if (newEmail !== null) {
        emailCell.innerHTML = newEmail;
    }
}

function updateProductSelects() {
    const productSelects = document.querySelectorAll('.selectProduct');
    const productList = document.querySelectorAll('#productList tr');
    productSelects.forEach(select => {
        select.innerHTML = '<option value="" disabled selected>Seleccione el producto</option>';
        productList.forEach(row => {
            const option = document.createElement('option');
            option.value = row.cells[0].innerText;
            option.innerText = row.cells[0].innerText;
            select.appendChild(option);
        });
    });
}

function updateClientSelect() {
    const clientSelect = document.getElementById('selectClient');
    const clientList = document.querySelectorAll('#clientList tr');
    clientSelect.innerHTML = '<option value="" disabled selected>Seleccione el cliente</option>';
    clientList.forEach(row => {
        const option = document.createElement('option');
        option.value = row.cells[0].innerText;
        option.innerText = row.cells[0].innerText;
        clientSelect.appendChild(option);
    });
}