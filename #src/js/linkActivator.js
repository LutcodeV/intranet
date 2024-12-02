class LinkActivator {
  constructor() {
    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
      threshold: 0.3 // Триггер на 30% пересечения
    });
    this.init();
  }

  init() {
    // Находим все элементы с data-target
    const links = document.querySelectorAll('a[data-target]');
    links.forEach(link => {
      const targetId = link.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Добавляем наблюдение за каждым элементом с data-target
        this.observer.observe(targetElement);
      }
    });
  }

  handleIntersect(entries) {
    entries.forEach(entry => {
      const targetId = entry.target.id;
      const linkedElements = document.querySelectorAll(`a[data-target="${targetId}"]`);

      // Добавляем или удаляем класс "active" в зависимости от видимости элемента
      linkedElements.forEach(link => {
        if (entry.isIntersecting) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    });
  }
}

// Инициализируем модуль
document.addEventListener('DOMContentLoaded', () => new LinkActivator());
