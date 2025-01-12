function sendWhatsAppMessage(customerName, message) {
    const url = `https://api.whatsapp.com/send?phone=+1234567890&text=Hi ${customerName}, ${message}`;
    window.open(url, '_blank');
}
function sendWhatsAppMessage(contact, message) {
    const encodedMessage = encodeURIComponent(message); // Encode the message for URL safety
    const url = `https://api.whatsapp.com/send?phone=${contact}&text=${encodedMessage}`;
    window.open(url, '_blank');
}
