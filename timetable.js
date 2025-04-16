// ユーザー情報CSVを読み込んで、自分のコースを取得
fetch('user_data.csv')
  .then(res => res.text())
  .then(text => {
    const lines = text.trim().split('\n');
    const users = lines.slice(1).map(line => {
      const [username, password, course, grade, classNo, number, name] = line.split(',');
      return { username, course };
    });

    const currentUser = sessionStorage.getItem('username');
    const user = users.find(u => u.username === currentUser);

    if (!user) {
      alert('ユーザー情報が見つかりません');
      return;
    }

    const course = user.course.toUpperCase(); // AG, SG, 本科（←コース名が完全一致する必要あり）
    const csvFile = `timetable_${course}.csv`;

    // 対応する時間割CSVを読み込んで表示
    fetch(csvFile)
      .then(res => res.text())
      .then(data => {
        const rows = data.trim().split('\n').map(row => row.split(','));
        const table = document.getElementById('timetable');
        table.innerHTML = rows.map(row =>
          `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
        ).join('');
      })
      .catch(err => {
        alert('時間割データの読み込みに失敗しました');
        console.error(err);
      });
  })
  .catch(err => {
    alert('ユーザー情報の読み込みに失敗しました');
    console.error(err);
  });
