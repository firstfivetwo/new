const sliderTrack = document.querySelector('.slider-track');
const sliderThumb = document.getElementById('sliderThumb');
const sliderText = document.getElementById('sliderText');
const sliderTextMask = document.getElementById('sliderTextMask');
const sliderTextMasked = document.getElementById('sliderTextMasked');

let isDragging = false;
let startX = 0;
let currentX = 0;
let thumbOffset = 0;
let isCompleted = false;

// URL для перехода
const redirectUrl = '/auth'; // Замените на вашу ссылку

const getMaxOffset = () => {
  const trackWidth = sliderTrack.offsetWidth;
  const thumbWidth = sliderThumb.offsetWidth;
  return trackWidth - thumbWidth - 12;
};

const updateThumbPosition = (x) => {
  const maxOffset = getMaxOffset();
  let newX = Math.max(0, Math.min(x, maxOffset));
  sliderThumb.style.left = (newX + 6) + 'px';
  currentX = newX;

  // Вычисляем прогресс (0 - 1)
  const progress = newX / maxOffset;
  
  // Обновляем прозрачность основного текста
  sliderText.style.opacity = 1 - progress;
  
  // Обновляем маску для стирания текста (ширина маски = прогресс)
  sliderTextMask.style.width = (progress * 100) + '%';
  
  // Плавно меняем цвет кнопки от красного к зеленому
  const red = 255 - Math.round(progress * 220); // от 255 до 35
  const green = 59 + Math.round(progress * 196); // от 59 до 255
  const blue = 48 - Math.round(progress * 48); // от 48 до 0
  
  sliderThumb.style.background = `rgb(${red}, ${green}, ${blue})`;
  
  // Обновляем тень
  const shadowIntensity = 0.4 + progress * 0.4;
  sliderThumb.style.boxShadow = `0 4px 15px rgba(${red}, ${green}, ${blue}, ${shadowIntensity})`;

  // Если достигли конца
  if (newX >= maxOffset && !isCompleted) {
    onSlideComplete();
  }
};

const onSlideComplete = () => {
  isCompleted = true;
  
  // Полностью скрываем текст
  sliderText.style.opacity = '100%';
  sliderTextMask.style.width = '100%';
  
  // Делаем кнопку полностью зеленой
  sliderThumb.style.background = '#34c759';
  sliderThumb.style.boxShadow = '0 4px 20px rgba(52, 199, 89, 0.6)';
  
  // Меняем иконку на галочку
  sliderThumb.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="white"/>
    </svg>
  `;
  
  // Останавливаем анимацию пульсации
  sliderThumb.style.animation = 'none';
  
  // Через 1 секунду переходим по ссылке
  setTimeout(() => {
    window.location.href = redirectUrl;
  }, 1000);
};

const resetSlider = () => {
  if (isCompleted) return;
  
  sliderThumb.style.left = '6px';
  sliderText.style.opacity = '1';
  sliderTextMask.style.width = '0%';
  sliderThumb.style.background = '#ff3b30';
  sliderThumb.style.boxShadow = '0 4px 15px rgba(255, 59, 48, 0.4)';
  currentX = 0;
  isDragging = false;
  sliderThumb.classList.remove('dragging');
};

const startDrag = (clientX) => {
  if (isCompleted) return;
  isDragging = true;
  sliderThumb.classList.add('dragging');
  startX = clientX;
  thumbOffset = currentX;
};

const onDrag = (clientX) => {
  if (!isDragging || isCompleted) return;
  const deltaX = clientX - startX;
  const newX = thumbOffset + deltaX;
  updateThumbPosition(newX);
};

const endDrag = () => {
  if (!isDragging || isCompleted) return;
  isDragging = false;
  sliderThumb.classList.remove('dragging');
  
  const maxOffset = getMaxOffset();
  if (currentX < maxOffset) {
    // Возвращаем на место, если не дотащили
    sliderThumb.style.left = '6px';
    sliderText.style.opacity = '1';
    sliderTextMask.style.width = '0%';
    sliderThumb.style.background = '#ff3b30';
    sliderThumb.style.boxShadow = '0 4px 15px rgba(255, 59, 48, 0.4)';
    currentX = 0;
  }
};

// Mouse events
sliderThumb.addEventListener('mousedown', (e) => {
  e.preventDefault();
  startDrag(e.clientX);
});

document.addEventListener('mousemove', (e) => {
  onDrag(e.clientX);
});

document.addEventListener('mouseup', endDrag);

// Touch events
sliderThumb.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  startDrag(touch.clientX);
}, { passive: false });

document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  onDrag(touch.clientX);
}, { passive: false });

document.addEventListener('touchend', endDrag, { passive: false });

// Обработка изменения размера окна
window.addEventListener('resize', () => {
  if (currentX > 0 && !isCompleted) {
    const maxOffset = getMaxOffset();
    if (currentX > maxOffset) {
      currentX = maxOffset;
    }
    updateThumbPosition(currentX);
  }
});

// Добавить в конец script.js

// ===== ОБРАБОТКА ОПРОСА =====
document.addEventListener('DOMContentLoaded', function() {
  const voteForm = document.getElementById('voteForm');
  
  if (voteForm) {
    const radioButtons = voteForm.querySelectorAll('input[type="radio"]');
    
    radioButtons.forEach(radio => {
      radio.addEventListener('change', function() {
        // Убираем выделение у всех
        radioButtons.forEach(r => {
          r.closest('label').style.background = 'rgba(255, 255, 255, 0.08)';
        });
        
        // Подсвечиваем выбранный
        if (this.checked) {
          this.closest('label').style.background = 'rgba(76, 217, 100, 0.2)';
          this.closest('label').style.border = '1px solid rgba(76, 217, 100, 0.3)';
          
          // Показываем уведомление
          const selectedText = this.nextElementSibling.textContent;
          showNotification(`Вы выбрали: ${selectedText}`);
        }
      });
    });
  }
  
  // ===== ОБРАБОТКА ЖАЛОБ =====
  const complaintForm = document.getElementById('complaintForm');
  
  if (complaintForm) {
    complaintForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const message = document.getElementById('message');
      
      if (message.value.trim().length < 5) {
        showNotification('Пожалуйста, напишите сообщение (минимум 5 символов)', 'error');
        return;
      }
      
      showNotification('✅ Ваше сообщение отправлено анонимно!');
      message.value = '';
    });
  }
});

// ===== ФУНКЦИЯ УВЕДОМЛЕНИЯ =====
function showNotification(text, type = 'success') {
  // Удаляем старое уведомление
  const old = document.querySelector('.custom-notification');
  if (old) old.remove();
  
  const notification = document.createElement('div');
  notification.className = 'custom-notification';
  notification.textContent = text;
  
  if (type === 'error') {
    notification.style.background = '#ff3b30';
  } else {
    notification.style.background = '#4cd964';
  }
  
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 15px;
    color: white;
    font-weight: 600;
    font-size: 14px;
    z-index: 9999;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    animation: slideUp 0.3s ease;
    max-width: 90%;
    text-align: center;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(-50%) translateY(20px)';
    notification.style.transition = 'all 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Добавляем CSS для уведомления
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;
document.head.appendChild(style);
