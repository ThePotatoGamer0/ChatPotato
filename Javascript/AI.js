// Set the API base URL
const API_BASE = 'https://ai.potatogamer.uk';

// Function to get chat history from localStorage
function getChatHistory() {
  const stored = localStorage.getItem('chatHistory');
  try {
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Function to save chat history to localStorage
function setChatHistory(history) {
  localStorage.setItem('chatHistory', JSON.stringify(history));
}

// Function to update the chat UI and store it
function updateChatHistory(prompt, response) {
  let chatHistory = getChatHistory();

  chatHistory.push({ prompt, response });

  // Optional: limit history length (remove if unlimited is okay)
  if (chatHistory.length > 100) {
    chatHistory.shift(); // Keeps the most recent 100 messages
  }

  setChatHistory(chatHistory);
  renderChatHistory(chatHistory);
}

// Function to render chat history in the UI
function renderChatHistory(chatHistory) {
  const chatBox = document.getElementById('chat-history');
  chatBox.innerHTML = ''; // Clear current chat

  chatHistory.forEach(item => {
    const chatItem = document.createElement('div');
    chatItem.classList.add('chat-item');
    chatItem.innerHTML = `<strong>You:</strong> ${item.prompt}<br><strong>PotatoGPT:</strong> ${item.response}`;
    chatBox.appendChild(chatItem);
  });
}

// Format history for prompt
function formatChatHistory(historyArray) {
  return historyArray.map(item => `You: ${item.prompt}\nPotatoGPT: ${item.response}`).join('\n');
}

// Handle form submission
document.getElementById('ai-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  document.getElementById('response').innerText = "Thinking...";

  // Get selected model
  const selectedModel = document.getElementById('model-select').value;

  let chatHistory = localStorage.getItem('chatHistory');
  chatHistory = chatHistory ? JSON.parse(chatHistory) : [];

  const prompt = document.getElementById('prompt').value;
  const systemPrompt = "You are PotatoGPT, a helpful AI chatbot. Continue the conversation naturally using the previous chat history.";
  const formattedHistory = chatHistory.map(item => `You: ${item.prompt}\nPotatoGPT: ${item.response}`).join('\n');
  const promptWithHistory = `${systemPrompt}\n\n${formattedHistory}\nYou: ${prompt}\nPotatoGPT:`;

  try {
    const response = await fetch(`${API_BASE}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: promptWithHistory,
        model: selectedModel  // 🔥 Send selected model here
      }),
    });

    const data = await response.json();
    const taskId = data.task_id;

    // Wait for result...
    let status, result;
    do {
      const resultResponse = await fetch(`${API_BASE}/result/${taskId}`);
      const resultData = await resultResponse.json();
      status = resultData.status;
      if (status === 'done') {
        result = resultData.response;
        document.getElementById('response').innerText = result;

        // Update chat history
        chatHistory.push({ prompt, response: result });
        if (chatHistory.length > 50) chatHistory.shift();  // Limit size
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        renderChatHistory(chatHistory);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } while (status !== 'done');

  } catch (error) {
    console.error("Error:", error);
    document.getElementById('response').innerText = "Error fetching response.";
  }
});


// Load chat history on page load
window.onload = function () {
  const chatHistory = getChatHistory();
  renderChatHistory(chatHistory);
};

// Optional: Clear chat history button
document.getElementById('clear-chat-history').addEventListener('click', function () {
  localStorage.removeItem('chatHistory');
  renderChatHistory([]);
  document.getElementById('response').innerText = '';
});
