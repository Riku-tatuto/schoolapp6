document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', () => {
    const page = item.dataset.page;
    window.location.href = `${page}.html`;
  });
});
