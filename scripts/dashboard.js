let orders = JSON.parse(localStorage.getItem('orders')) || [];
let workbook; // Store workbook in memory

// Function to create and update the Excel workbook in memory
function createOrUpdateWorkbook() {
    const headers = ['Customer Name', 'Contact', 'Order Details', 'Price', 'Order Date', 'Order Time', 'Pickup Date', 'Status'];
    const data = orders.map(order => [
        order.customerName,
        order.contact,
        order.orderDetails,
        order.price,
        order.date,
        order.time,
        order.pickupDate,
        order.isFinished ? 'Finished' : 'Pending'
    ]);

    // Combine headers and data
    const worksheetData = [headers, ...data];

    // Create or update the worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // If workbook exists, update it; otherwise, create a new one
    if (workbook) {
        workbook.Sheets['Orders'] = worksheet;
    } else {
        workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    }
}

// Function to download the Excel file
function downloadExcelFile() {
    if (workbook) {
        XLSX.writeFile(workbook, 'orders.xlsx');
    } else {
        alert('No data available to download.');
    }
}

// Event listener for the download button
document.getElementById('downloadExcel').addEventListener('click', downloadExcelFile);

// Periodic check to update order statuses
setInterval(checkOrderStatuses, 60 * 1000); // Check every minute

document.getElementById('createOrderForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const customerName = document.getElementById('customerName').value;
    const contact = document.getElementById('contact').value;
    const orderDetails = document.getElementById('orderDetails').value;
    const price = document.getElementById('price').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const pickupDate = document.getElementById('pickupDate').value;

    const newOrder = {
        id: Date.now(),
        customerName,
        contact,
        orderDetails,
        price,
        date,
        time,
        pickupDate,
        isFinished: false,
    };

    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    renderOrders();
    createOrUpdateWorkbook(); // Update workbook in memory
    alert('Order created successfully!');
    document.getElementById('createOrderForm').reset();
});

function renderOrders() {
    const ordersTable = document.getElementById('orders');
    ordersTable.innerHTML = '';
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.customerName}</td>
            <td>${order.contact}</td>
            <td>${order.orderDetails}</td>
            <td>${order.price}</td>
            <td>${order.date}</td>
            <td>${order.time}</td>
            <td>${order.pickupDate}</td>
            <td>${order.isFinished ? 'Finished' : 'Pending'}</td>
            <td>
                ${
                    order.isFinished
                        ? '<button disabled>Finished</button>'
                        : `<button onclick="finishOrder(${order.id})">Mark as Finished</button>`
                }
            </td>
        `;
        ordersTable.appendChild(row);
    });
}

function finishOrder(id) {
    const order = orders.find(order => order.id === id);
    if (order) {
        order.isFinished = true;

        // Construct the message
        const message = `Hi ${order.customerName}, Your order "${order.orderDetails}" is finished! Total: ${order.price} Rs. --Tailor`;

        alert(`Order for ${order.customerName} marked as finished!`);
        sendWhatsAppMessage(order.contact, message); // Use customer's contact dynamically
    }
    localStorage.setItem('orders', JSON.stringify(orders));
    renderOrders();
    createOrUpdateWorkbook(); // Update workbook in memory
}

function sendWhatsAppMessage(contact, message) {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?phone=${contact}&text=${encodedMessage}`;
    window.open(url, '_blank');
}

function checkOrderStatuses() {
    const currentDate = new Date();
    orders.forEach(order => {
        const pickupDate = new Date(order.pickupDate);
        if (!order.isFinished && pickupDate < currentDate) {
            order.isFinished = false;
        }
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    renderOrders();
    createOrUpdateWorkbook(); // Update workbook in memory
}

renderOrders();
