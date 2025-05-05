document.addEventListener('DOMContentLoaded', function() { // Ensure DOM is fully loaded
    const spicySwitch = document.getElementById('spicySwitch');
    const spicyNavItem = document.getElementById('spicyNavItem');
    spicyNavItem.style.display = 'none'; // Hide the spicy Option by default
    spicySwitch.addEventListener('change', function() {
      if (spicySwitch.checked) {
        // Switch is ON - Show the spicy Option
        spicyNavItem.style.display = 'block'; /* Or 'inline-block' if needed */
      } else {
        // Switch is OFF - Hide the spicy Option
        spicyNavItem.style.display = 'none';
      }
    });
  });