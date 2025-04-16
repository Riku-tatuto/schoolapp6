async function loadCSV(path) {
  const response = await fetch(path);
  const text = await response.text();
  return text.trim().split('\n').slice(1).map(line => {
    const [username, password, grade, classNum, number, name, course] = line.split(',');
    return { username, password, grade, classNum, number, name, course };
  });
}

function protectPage() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && location.pathname.includes('home.html')) {
    location.href = 'index.html';
  }
}

function highlightNav() {
  const path = location.pathname;
  if (path.includes('home.html')) {
    document.getElementById("nav-home")?.classList.add("active");
  }
  if (path.includes('schedule')) {
    document.getElementById("nav-schedule")?.classList.add("active");
  }
}

function showUserInfo() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (!user) return;

  const welcome = `${user.course}コースの${user.grade}年${user.classNum}組${user.number}番の${user.name}さん、ようこそ！`;
  document.getElementById("welcome").textContent = welcome;
  document.getElementById("user-info").textContent = `所属: ${user.course}コース`;

  loadSchedule(user.course);
}

async function loadSchedule(course) {
  const map = {
    "AG": "ag_schedule.csv",
    "SG": "sg_schedule.csv",
    "本科": "honka_schedule.csv"
  };
  const file = map[course];
  if (!file) return;

  const res = await fetch(file);
  const text = await res.text();
  const rows = text.trim().split('\n').map(row => row.split(','));

  const table = document.createElement('table');
  rows.forEach((row, i) => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement(i === 0 ? 'th' : 'td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  const container = document.getElementById("schedule-table");
  container.innerHTML = '';
  container.appendChild(table);
}

document.addEventListener("DOMContentLoaded", async () => {
  protectPage();
  highlightNav();

  const user = JSON.parse(sessionStorage.getItem('user'));
  if (user && location.pathname.includes("home.html")) {
    showUserInfo();
  }

  const form = document.getElementById("loginForm");
  if (form) {
    const users = await loadCSV("user_data.csv");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const match = users.find(u => u.username === username && u.password === password);
      if (match) {
        sessionStorage.setItem("user", JSON.stringify(match));
        location.href = "home.html";
      } else {
        document.getElementById("error-banner").style.display = "block";
      }
    });
  }
});
