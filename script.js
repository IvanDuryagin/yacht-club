// Управление выезжающим меню
function toggleMenu() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.menu-overlay');
  const isOpening = !sidebar.classList.contains('active');

  if (isOpening) {
    // Вычисляем ширину полосы прокрутки и передаем её в CSS
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
  } else {
    // Сбрасываем при закрытии
    document.documentElement.style.setProperty('--scrollbar-width', `0px`);
  }

  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.classList.toggle('nav-open');
}

// Управление темной/светлой темой
const themeBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

function applyTheme(theme) {
  if (theme === 'dark') {
    htmlElement.classList.add('dark-mode');
    if(themeBtn) themeBtn.textContent = 'Светлая тема';
  } else {
    htmlElement.classList.remove('dark-mode');
    if(themeBtn) themeBtn.textContent = 'Тёмная тема';
  }
  localStorage.setItem('theme', theme);
}

if (themeBtn) {
  applyTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeBtn.addEventListener('click', () => {
    applyTheme(htmlElement.classList.contains('dark-mode') ? 'light' : 'dark');
  });
}

// === ПЛАВНЫЙ ПЕРЕХОД СТРАНИЦ САЙТА ===
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Игнорируем кнопки листания книги и кнопку скачивания
      if (this.classList.contains('book-btn') || this.closest('.book-container') || this.hasAttribute('download')) {
        return;
      }

      if (
        href && 
        !href.startsWith('#') && 
        !href.startsWith('mailto:') && 
        !href.startsWith('tel:') && 
        this.getAttribute('target') !== '_blank'
      ) {
        e.preventDefault();
        document.body.classList.add('page-exit');
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  });
});

// === УНИВЕРСАЛЬНАЯ ЛОГИКА КНИГИ ===
let currentPage = 1;
let totalPages = 23; 
let imgPrefix = "";

function updateBook() {
  const imgElement = document.getElementById('charter-image');
  const counterElement = document.getElementById('current-page-num');
  const prevBtn = document.querySelector('.book-btn.prev');
  const nextBtn = document.querySelector('.book-btn.next');

  if (!imgElement) return;

  // Анимация исчезновения
  imgElement.classList.add('fade-out');

  setTimeout(() => {
    // Подставляем правильный путь (1.webp или 1n.webp)
    imgElement.src = `img/${currentPage}${imgPrefix}.webp`;
    
    if (counterElement) {
        counterElement.textContent = currentPage;
        // Обновляем текст "из X", если он есть
        const totalTextElement = counterElement.nextElementSibling;
        if (totalTextElement) totalTextElement.textContent = totalPages;
    }

    if (prevBtn) prevBtn.style.opacity = currentPage === 1 ? '0.3' : '1';
    if (prevBtn) prevBtn.style.pointerEvents = currentPage === 1 ? 'none' : 'all';
    
    if (nextBtn) nextBtn.style.opacity = currentPage === totalPages ? '0.3' : '1';
    if (nextBtn) nextBtn.style.pointerEvents = currentPage === totalPages ? 'none' : 'all';

    imgElement.onload = () => {
      imgElement.classList.remove('fade-out');
    };
  }, 300);
}

function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    updateBook();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    updateBook();
  }
}

// Инициализация книги при загрузке
document.addEventListener("DOMContentLoaded", () => {
  const bookContainer = document.querySelector('.book-container');
  if (bookContainer && document.getElementById('charter-image')) {
    // Читаем параметры из HTML (data-total и data-prefix)
    totalPages = parseInt(bookContainer.getAttribute('data-total')) || 23;
    imgPrefix = bookContainer.getAttribute('data-prefix') || "";
    currentPage = 1;
    updateBook();
  }
});

// === ЛОГИКА ЛАЙТБОКСА (ОТКРЫТИЕ КАРТИНОК ИЗ BENTO) ===
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.querySelector('.close-modal');
  const bentoCards = document.querySelectorAll('.bento-card');

  if (modal && modalImg && closeBtn) {
    // Открытие при клике на карточку
    bentoCards.forEach(card => {
      card.addEventListener('click', () => {
        const imgSrc = card.getAttribute('data-img');
        if (imgSrc) {
          modalImg.src = imgSrc;
          modal.style.display = 'flex';
          document.body.style.overflow = 'hidden'; // Блокируем прокрутку
        }
      });
    });

    // Закрытие по крестику
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    });

    // Закрытие по клику на темный фон
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });

    // Закрытие по нажатию на Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }
});