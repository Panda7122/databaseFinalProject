// Get the modal
var modal = document.getElementById("myModal");

// Function to handle feedback submission
function submitFeedback(event) {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  const subject = document.getElementById("subject").value;
  const content = document.getElementById("content").value;
  const feedbackTime = new Date().toISOString();

  fetch("/submitFeedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject: subject,
      content: content,
      time: feedbackTime,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        window.location.href = "index.html";
      } else {
        alert("提交回饋失敗，請再試一次。");
      }
    });
}

// Function to handle login
function login() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        updateUIAfterLogin(data);
        modal.style.display = "none"; // Close the modal
      } else {
        alert("帳號或是密碼有誤");
      }
    });
}

// Function to handle logout
function logout() {
  fetch("/logout").then(() => {
    updateUIAfterLogout();
    window.location.href = "index.html"; // Redirect to the main page
  });
}

// Function to handle registration
function register() {
  var username = document.getElementById("reg_username").value;
  var password = document.getElementById("reg_password").value;
  var nickname = document.getElementById("reg_nickname").value;

  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
      nickname: nickname,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("註冊成功");
        closeRegisterModal();
      } else {
        alert("註冊失敗");
      }
    });
}

// Function to close the registration modal
function closeRegisterModal() {
  document.getElementById("registerModal").style.display = "none";
}

// Function to open the registration modal
function registerAccount() {
  document.getElementById("registerModal").style.display = "block";
}

// Function to update UI after login
function updateUIAfterLogin(data) {
  if (data.admin) {
    document.getElementById("readFeedbackButton").style.display = "block";
  }
  document.getElementById("feedbackButton").style.display = "block";
  document.getElementById("favoritesButton").style.display = "block";
  document.getElementById("loginButton").style.display = "none";
  document.getElementById("logoutButton").style.display = "block";
  document.getElementById("usernameDisplay").innerText = data.nickname;
  document.getElementById("greeting").textContent = `你好，${data.nickname}`;
  document.getElementById("greeting").style.display = "block";
}

// Function to update UI after logout
function updateUIAfterLogout() {
  document.getElementById("greeting").textContent = "";
  document.getElementById("greeting").style.display = "none";
  document.getElementById("readFeedbackButton").style.display = "none";
  document.getElementById("feedbackButton").style.display = "none";
  document.getElementById("favoritesButton").style.display = "none";
  document.getElementById("logoutButton").style.display = "none";
  document.getElementById("loginButton").style.display = "block";
}

// Check session on page load
document.addEventListener("DOMContentLoaded", function () {
  fetch("/check-session")
    .then((response) => response.json())
    .then((data) => {
      if (data.loggedIn) {
        updateUIAfterLogin(data);
      }
    });

  // Attach event listener for feedback submission
  document.querySelector("input[type='submit']").onclick = submitFeedback;
});
