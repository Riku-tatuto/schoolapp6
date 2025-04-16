fetch('timetable_data.csv')
  .then(response => response.text())
  .then(data => {
    const rows = data.trim().split('\n').map(row => row.split(','));
    const table = document.getElementById('timetable');
    table.innerHTML = rows.map(row => `
      <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
    `).join('');
  });
