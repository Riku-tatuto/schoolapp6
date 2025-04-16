// auth.js

let currentUser = null;

async function loadCSV() {
  const response = await fetch("user_data.csv");
  const text = await response.text();
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");

  const users = lines.slice(1).map(line => {
    const values = line.split(",");
    const user = {};
    headers.forEach((header, index) => {
      user[header.trim()] = values[index].trim();
    });
    return user;
  });

  return users;
}

function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem("currentUser"));
}

function setCurrentUser(user) {
  sessionStorage.setItem("currentUser", JSON.stringify(user));
}

function clearCurrentUser() {
  sessionStorage.removeItem("currentUser");
}

async function login(username, password) {
  const users = await loadCSV();
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    setCurrentUser(user);
    window.location.href = "home.html";
  } else {
    const errorBanner = document.getElementById("error-banner");
    if (errorBanner) {
      errorBanner.style.display = "block";
      errorBanner.textContent = "ユーザー名またはパスワードが間違っています。";
    }
  }
}

function logout() {
  clearCurrentUser();
  window.location.href = "index.html";
}

function protectPage() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "index.html";
  }
}

function showUserInfo() {
  const user = getCurrentUser();
  if (user) {
    currentUser = user;
    const { course, grade, class: classNum, number, name } = user;

    const userInfoElem = document.getElementById("user-info");
    if (userInfoElem) {
      userInfoElem.textContent = `${grade}年${classNum}組${number}番 ${course}コース ${name} さん`;
    }

    // 時間割読み込み（もし対象ページなら）
    if (document.getElementById("timetable-container")) {
      loadTimetable(course);
    }

    // 現在のページに応じてサイドバーのボタンをハイライト
    highlightActiveMenu();

    // ログアウトボタン
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
    }
  }
}

function highlightActiveMenu() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf("/") + 1);

  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach(item => {
    item.classList.remove("active");
  });

  const targetId = page.replace(".html", "");
  const activeItem = document.getElementById(`menu-${targetId}`);
  if (activeItem) {
    activeItem.classList.add("active");
  }
}

async function loadTimetable(course) {
  try {
    const response = await fetch(`timetable/${course}.csv`);
    const text = await response.text();
    const lines = text.trim().split("\n");
    const table = document.createElement("table");

    lines.forEach((line, i) => {
      const row = document.createElement("tr");
      const cells = line.split(",");

      cells.forEach(cellText => {
        const cell = i === 0 ? document.createElement("th") : document.createElement("td");
        cell.textContent = cellText.trim();
        row.appendChild(cell);
      });

      table.appendChild(row);
    });

    const container = document.getElementById("timetable-container");
    if (container) {
      container.innerHTML = ""; // 既存のテーブルを消す
      container.appendChild(table);
    }
  } catch (e) {
    console.error("時間割の読み込みエラー:", e);
  }
}

// ページごとに適切な処理を実行
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf("/") + 1);

  if (page === "index.html") {
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        login(username, password);
      });
    }
  } else {
    protectPage();
    showUserInfo();
  }
});
