form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const prompt = promptInput.value.trim();
  responseBox.textContent = "Queued...";

  try {
    const res = await fetch('https://ai.potatogamer.uk/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    const taskId = data.task_id;

    // Polling loop
    let done = false;
    while (!done) {
      const statusRes = await fetch(`https://ai.potatogamer.uk/result/${taskId}`);
      const statusData = await statusRes.json();

      if (statusData.status === 'done') {
        responseBox.textContent = statusData.response;
        done = true;
      } else {
        responseBox.textContent += ".";
        await new Promise(r => setTimeout(r, 1000)); // Wait 1 second
      }
    }
  } catch (err) {
    responseBox.textContent = "Error reaching PotatoGPT.";
    console.error(err);
  }
});
