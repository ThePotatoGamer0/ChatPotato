const textElement = document.getElementById('typing-text');
const textToType = "loading...";
let charIndex = 0;

function type() {
  if (charIndex < textToType.length) {
    textElement.textContent += textToType.charAt(charIndex);
    charIndex++;
    setTimeout(type, 100); // Adjust typing speed here (milliseconds)
  } else {
    setTimeout(erase, 0); // Delay before erasing
  }
}

function erase() {
  if (charIndex > 0) {
    textElement.textContent = textToType.substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, 50); // Adjust erasing speed here (milliseconds)
  } else {
    setTimeout(type, 0); // Delay before retyping
  }
}

type(); // Start the animation
