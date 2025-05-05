document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ai-form');
  const promptInput = document.getElementById('prompt');
  const responseBox = document.getElementById('response');

  if (!form || !promptInput || !responseBox) {
    console.error("Form or input elements not found!");
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const prompt = promptInput.value.trim();
    if (!prompt) return;

    responseBox.textContent = "Thinking...";

    try {
      const res = await fetch('https://ai.potatogamer.uk/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();
      responseBox.textContent = data.response || "No response from PotatoGPT.";
    } catch (err) {
      responseBox.textContent = "Error contacting AI. Try again later.";
      console.error(err);
    }
  });
});
