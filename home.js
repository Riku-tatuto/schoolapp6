// home.js

// ページが読み込まれたときにデフォルトでホームを表示
document.addEventListener("DOMContentLoaded", () => {
  showSection('home');
});

// セクション切り替え関数
function showSection(section) {
  // 全セクションを非表示にする
  document.querySelectorAll('.section').forEach(el => {
    el.style.display = 'none';
  });

  // 選ばれたセクションを表示
  const target = document.getElementById(`${section}-section`);
  if (target) target.style.display = 'block';

  // メニューの active を更新
  document.querySelectorAll('.menu-item').forEach(el => {
    el.classList.remove('active');
  });
  const activeItem = document.querySelector(`.menu-item[data-section="${section}"]`);
  if (activeItem) activeItem.classList.add('active');
}
