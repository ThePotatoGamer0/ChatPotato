document.querySelector("#ai-form").addEventListener("submit", function(event) {
  event.preventDefault();  // Prevent form from submitting and refreshing the page

  const prompt = document.querySelector("#prompt").value;
  fetch('/ask', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt })
  })
  .then(response => response.json())
  .then(data => {
      if (data.task_id) {
          document.getElementById("response").innerText = 'Processing...';
          getResult(data.task_id);  // Start polling the result with the task_id
      } else {
          document.getElementById("response").innerText = 'Error: No task ID received.';
      }
  })
  .catch(error => {
      console.error('Error:', error);
      document.getElementById("response").innerText = 'Error during request.';
  });
});

// Function to fetch result from the server
function getResult(task_id) {
  fetch(`/result/${task_id}`)
      .then(response => response.json())
      .then(data => {
          if (data.status === 'done') {
              document.getElementById("response").innerText = data.response;  // Display the response
          } else {
              setTimeout(() => getResult(task_id), 1000);  // Retry every second if pending
          }
      })
      .catch(error => {
          console.error('Error fetching result:', error);
          document.getElementById("response").innerText = 'Error retrieving response.';
      });
}
