const codeInput = document.getElementById("codeInput");
const hiddenInput = document.getElementById("hiddenInput");
const dots = document.querySelectorAll(".code_dot");
const errorMessage = document.getElementById("errorMessage");


// ВРЕМЕННЫЙ код для тестирования
const correctCode = "A7K29F";


// Нажимаем на поле — открывается клавиатура
codeInput.addEventListener("click", () => {
    hiddenInput.focus();
});


// Пользователь что-то вводит
hiddenInput.addEventListener("input", () => {

    // Только буквы и цифры
    let value = hiddenInput.value
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 6);

    hiddenInput.value = value;

    updateDots();

    // Убираем ошибку, когда пользователь начинает исправлять код
    errorMessage.classList.remove("show");

    // Если введено 6 символов
    if (value.length === 6) {
        checkCode();
    }
});


// Обновляем точки
function updateDots() {

    const value = hiddenInput.value;

    dots.forEach((dot, index) => {

        dot.textContent = value[index] || "";

        dot.classList.remove("selected");
    });

    // Подсвечиваем следующую свободную ячейку
    if (value.length < 6) {
        dots[value.length].classList.add("selected");
    }
}


function checkCode() {

    const enteredCode = hiddenInput.value;

    if (enteredCode === correctCode) {

        // Убираем выделение текущей ячейки
        dots.forEach(dot => {
            dot.classList.remove("selected");

            // Делаем все ячейки зелёными
            dot.classList.add("correct");
        });

        // Небольшая задержка перед переходом
        setTimeout(() => {
            window.location.href = "A7K29F.html";
        }, 500);

    } else {

        errorMessage.classList.add("show");

        codeInput.classList.add("shake");

        setTimeout(() => {
            codeInput.classList.remove("shake");
        }, 300);
    }
}

updateDots();
