window.addEventListener("DOMContentLoaded", () => {
  const username = sessionStorage.getItem("username");
  if (!username) {
    alert("ログインしてください。");
    location.href = "index.html";
    return;
  }

  fetch("user_data.csv")
    .then(res => res.text())
    .then(data => {
      const lines = data.trim().split("\n").map(line => line.split(","));
      const user = lines.find(line => line[0] === username);
      if (!user) {
        document.getElementById("user-info").textContent = "ユーザー情報が見つかりません";
        return;
      }

      const [id, pass, name, year, classNum, number, course] = user;
      document.getElementById("user-info").textContent =
        `${year}年${classNum}組${number}番 ${course}コース ${name} さんの時間割`;

      const file = {
        AG: "ag_timetable.csv",
        SG: "sg_timetable.csv",
        本科: "honka_timetable.csv"
      }[course];

      if (!file) return;

      fetch(file)
        .then(res => res.text())
        .then(csv => {
          const rows = csv.trim().split("\n").map(line => line.split(","));
          const table = document.createElement("table");
          const thead = document.createElement("thead");
          const tbody = document.createElement("tbody");

          rows.forEach((row, i) => {
            const tr = document.createElement("tr");
            row.forEach(cell => {
              const tag = i === 0 ? "th" : "td";
              const td = document.createElement(tag);
              td.textContent = cell;
              tr.appendChild(td);
            });
            if (i === 0) thead.appendChild(tr);
            else tbody.appendChild(tr);
          });

          table.appendChild(thead);
          table.appendChild(tbody);
          document.getElementById("timetable-area").appendChild(table);
        });
    });

  document.getElementById("logout").addEventListener("click", () => {
    sessionStorage.clear();
    location.href = "index.html";
  });
});
