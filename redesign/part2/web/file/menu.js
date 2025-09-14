const header = document.getElementById('menuHeader');
  const menu = document.getElementById('menuItems');
  let open = false;

  header.addEventListener('click', () => {
    open = !open;
    menu.style.maxHeight = open ? menu.scrollHeight + 'px' : '0';
    header.textContent = open ? 'منوی اصلی پروژه ▲' : 'منوی اصلی پروژه ▼';
  });