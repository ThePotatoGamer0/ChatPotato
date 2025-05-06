// Set the API base URL
const API_BASE = 'https://ai.potatogamer.uk';

// Function to get cookies by name
function getCookie(name) {
  let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

// Function to set cookies
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to update the chat UI and store it in cookies
function updateChatHistory(prompt, response) {
  let chatHistory = getCookie('chatHistory');
  chatHistory = chatHistory ? JSON.parse(chatHistory) : [];

  // Add the new prompt and response to the history
  chatHistory.push({ prompt: prompt, response: response });

  // If history exceeds 10 entries, remove the oldest
  if (chatHistory.length > 10) {
    chatHistory.shift();
  }

  // Save the updated history in cookies (convert it to a JSON string)
  setCookie('chatHistory', JSON.stringify(chatHistory), 7);

  // Render the updated chat history in the UI
  renderChatHistory(chatHistory);
}

// Function to render chat history in the UI
function renderChatHistory(chatHistory) {
  const chatBox = document.getElementById('chat-history');
  chatBox.innerHTML = ''; // Clear the current chat history in the UI

  chatHistory.forEach(item => {
    const chatItem = document.createElement('div');
    chatItem.classList.add('chat-item');
    chatItem.innerHTML = `<strong>You:</strong> ${item.prompt}<br><strong>PotatoGPT:</strong> ${item.response}`;
    chatBox.appendChild(chatItem);
  });
}

function formatChatHistory(historyArray) {
  return historyArray.map(item => `You: ${item.prompt}\nPotatoGPT: ${item.response}`).join('\n');
}

// Function to handle form submission and send prompt to the server
document.getElementById('ai-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  document.getElementById('response').innerText = "Thinking...";
  
  let chatHistory = getCookie('chatHistory');
  if (chatHistory) {
    try {
      chatHistory = JSON.parse(chatHistory); // ✅ Convert string to object
    } catch (e) {
      chatHistory = []; // Fallback if JSON is malformed
    }
  } else {
    chatHistory = [];
  }

  const prompt = document.getElementById('prompt').value;
  const systemPrompt = "You are PotatoGPT, a helpful AI chatbot. Continue the conversation naturally using the previous chat history. Do not repeat or describe the history — just answer the new user input appropriately.";

  const formattedHistory = formatChatHistory(chatHistory);
  const promptWithHistory = `${systemPrompt}\n\n${formattedHistory}\nYou: ${prompt}\nPotatoGPT:`;


  try {
    const response = await fetch(`${API_BASE}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptWithHistory }),
    });

    const data = await response.json();
    const taskId = data.task_id;

    // Get the result after processing
    let result;
    let status;
    do {
      const resultResponse = await fetch(`${API_BASE}/result/${taskId}`);
      const resultData = await resultResponse.json();
      status = resultData.status;

      if (status === 'done') {
        result = resultData.response;
        document.getElementById('response').innerText = result;
        updateChatHistory(prompt, result); // Update chat history with the new response
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000)); // wait before retrying
      }
    } while (status !== 'done');

  } catch (error) {
    console.error("Error:", error);
    document.getElementById('response').innerText = "Error fetching response.";
  }
});

// On page load, load and render the chat history from cookies
window.onload = function () {
  const chatHistory = getCookie('chatHistory');
  if (chatHistory) {
    renderChatHistory(JSON.parse(chatHistory));
  }
};

// Function to delete a cookie
function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Event listener for the Clear Chat History button
document.getElementById('clear-chat-history').addEventListener('click', function () {
  deleteCookie('chatHistory');
  document.getElementById('chat-history').innerHTML = '';
  document.getElementById('response').innerText = '';
  alert("Chat history has been cleared.");
});
