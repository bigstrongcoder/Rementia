// Donation form handling
document.addEventListener('DOMContentLoaded', () => {
  const donateForm = document.getElementById('donate-form');
  const donateButton = document.querySelector('.donate-button');
  const cardNumberInput = document.getElementById('card-number');
  const expiryInput = document.getElementById('expiry');
  const cvcInput = document.getElementById('cvc');
  const amountInput = document.getElementById('amount');
  
  // Format card number with spaces
  cardNumberInput?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    e.target.value = value.replace(/(.{4})/g, '$1 ').trim();
  });

  // Format expiry date
  expiryInput?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
  });

  // Format CVC
  cvcInput?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    e.target.value = value;
  });

  // Handle form submission
  donateForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = donateForm.querySelector('button');
    button.disabled = true;
    button.classList.add('processing');

    // Simulate processing (replace with actual payment processing)
    setTimeout(() => {
      button.classList.remove('processing');
      button.classList.add('success');
      button.textContent = 'Thank You! ❤️';
      
      // Reset form after delay
      setTimeout(() => {
        button.disabled = false;
        button.classList.remove('success');
        button.textContent = 'Donate Now';
        donateForm.reset();
      }, 3000);
    }, 2000);
  });

  // Amount selection handling
  const amountButtons = document.querySelectorAll('.amount-option');
  amountButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      amountButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      amountInput.value = btn.dataset.amount;
    });
  });
});