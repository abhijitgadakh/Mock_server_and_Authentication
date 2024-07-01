// Get DOM elements
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const fetchTodosButton = document.getElementById("fetchTodosButton");
const notification = document.getElementById("notification");
const todosContainer = document.getElementById("todos");

// Variables to store user authentication details
let userAuthToken = "";
let userId = "";

// Event listener for login button
loginButton.addEventListener("click", async () => {
  const username = usernameInput.value;
  const password = passwordInput.value;

  const response = await fetch(
    "https://json-with-auth.onrender.com/user/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }
  );

  const data = await response.json();

  if (response.ok) {
    userAuthToken = data.token;
    userId = data.userId;

    // Set local storage
    localStorage.setItem("userAuthToken", userAuthToken);
    localStorage.setItem("userId", userId);

    // Display welcome notification
    notification.textContent = `Hey ${username}, welcome back!`;

    // Enable fetch todos button
    fetchTodosButton.disabled = false;
  } else {
    notification.textContent = "Login failed. Please try again.";
  }
});

// Event listener for fetch todos button
fetchTodosButton.addEventListener("click", async () => {
  const response = await fetch(
    `https://json-with-auth.onrender.com/todos?userId=${userId}`,
    {
      headers: { Authorization: `Bearer ${userAuthToken}` },
    }
  );

  const todos = await response.json();

  // Display todos
  todosContainer.innerHTML = "";
  todos.forEach((todo) => {
    const todoItem = document.createElement("div");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", async () => {
      const updatedTodo = { ...todo, completed: checkbox.checked };
      await fetch(`https://json-with-auth.onrender.com/todos/${todo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userAuthToken}`,
        },
        body: JSON.stringify(updatedTodo),
      });
    });
    todoItem.appendChild(checkbox);
    todoItem.appendChild(document.createTextNode(todo.title));
    todosContainer.appendChild(todoItem);
  });
});

// Check local storage for existing login
document.addEventListener("DOMContentLoaded", () => {
  const storedAuthToken = localStorage.getItem("userAuthToken");
  const storedUserId = localStorage.getItem("userId");

  if (storedAuthToken && storedUserId) {
    userAuthToken = storedAuthToken;
    userId = storedUserId;
    fetchTodosButton.disabled = false;
    notification.textContent = `Welcome back!`;
  }
});
