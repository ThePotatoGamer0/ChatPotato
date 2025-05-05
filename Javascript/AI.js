document.querySelector("#ai-form").addEventListener("submit", function(event) {
  event.preventDefault();  // Prevent the form from refreshing the page

  var prompt = document.querySelector("#prompt").value;
  var resultElement = document.querySelector("#response");

  resultElement.textContent = "Thinking...";  // Indicate the system is processing

  // Step 1: Send the prompt to the backend
  fetch('http://localhost:5000/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: prompt })
  })
  .then(response => response.json())
  .then(data => {
    var taskId = data.task_id;

    // Step 2: Poll the server for the result
    var pollInterval = setInterval(function() {
      fetch(`http://localhost:5000/result/${taskId}`)
        .then(response => response.json())
        .then(resultData => {
          if (resultData.status === "done") {
            resultElement.textContent = resultData.response;
            clearInterval(pollInterval);  // Stop polling when the result is ready
          } else {
            resultElement.textContent = "Still processing...";
          }
        });
    }, 2000);  // Poll every 2 seconds
  })
  .catch(error => {
    console.error('Error:', error);
    resultElement.textContent = "Error occurred. Please try again.";
  });
});
