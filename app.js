// Полный пул легких и интересных вопросов для мероприятия
const QUESTION_POOL = [
    { q: "Какой язык делает страницы сайтов интерактивными?", a: ["JavaScript", "HTML", "CSS", "C++"], correct: 0 },
    { q: "Что из этого НЕ является операционной системой?", a: ["HTML", "Windows", "Linux", "macOS"], correct: 0 },
    { q: "Какая птица традиционно считается символом мудрости?", a: ["Сова", "Орел", "Попугай", "Воробей"], correct: 0 },
    { q: "Какая гора на планете Земля является самой высокой?", a: ["Эверест", "Килиманджаро", "Эльбрус", "Фудзияма"], correct: 0 },
    { q: "Какой цвет получится, если смешать синюю и желтую краску?", a: ["Зеленый", "Фиолетовый", "Оранжевый", "Коричневый"], correct: 0 },
    { q: "Сколько секунд в одной стандартной минуте?", a: ["60 секунд", "30 секунд", "100 секунд", "120 секунд"], correct: 0 },
    { q: "Как называется столица нашей Республики Узбекистан?", a: ["Ташкент", "Самарканд", "Бухара", "Хива"], correct: 0 },
    { q: "Какое животное по праву называют царем зверей?", a: ["Лев", "Тигр", "Медведь", "Слон"], correct: 0 },
    { q: "Какой океан на планете является самым большим по площади?", a: ["Тихий океан", "Атлантический", "Индийский", "Северный Ледовитый"], correct: 0 },
    { q: "Из какого природного материала выпекают обычное стекло?", a: ["Из песка", "Из глины", "Из камня", "Из дерева"], correct: 0 },
    { q: "Какая ягода или фрукт из перечисленных весит больше всех?", a: ["Арбуз", "Дыня", "Тыква", "Ананас"], correct: 0 },
    { q: "Какая валюта официально используется в Японии?", a: ["Иена", "Доллар", "Евро", "Юань"], correct: 0 },
    { q: "Сколько зубов у здорового взрослого человека?", a: ["32", "28", "36", "40"], correct: 0 },
    { q: "Какая планета Солнечной системы знаменита своими огромными кольцами?", a: ["Сатурн", "Марс", "Юпитер", "Нептун"], correct: 0 },
    { q: "Что собирают пчелы, перелетая с цветка на цветок?", a: ["Нектар", "Мед", "Воск", "Пыльцу"], correct: 3 }
];

// Забавные словесные реакции интерфейса
const CORRECT_REACTIONS = ["Гений! 🧠", "В точку!🎯", "Красавчик! 🔥", "Это было изи! 😎"];
const WRONG_REACTIONS = ["Упс, мимо... 🤖", "Близко, но нет 😿", "Ошибка в матрице ❌", "Ну почти! 📉"];

// Переменные состояния игры
let gameQuestions = [];
let currentIdx = 0;
let score = 0;
let currentStreak = 0;
let maxStreak = 0;
let totalQuestionsRequested = 10;

// Элементы UI
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

// Утилита: Алгоритм перемешивания Fisher-Yates (полный рандом без повторов)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Переключение экранов
function switchScreen(screenToShow) {
    [startScreen, quizScreen, resultScreen].forEach(s => s.classList.remove("active"));
    screenToShow.classList.add("active");
}

// Запуск викторины
document.getElementById("start-btn").addEventListener("click", () => {
    totalQuestionsRequested = parseInt(document.getElementById("question-count").value);
    
    // 1. Копируем пул и перемешиваем его целиком
    let shuffledPool = shuffleArray([...QUESTION_POOL]);
    
    // 2. Берем ровно столько, сколько выбрал пользователь
    gameQuestions = shuffledPool.slice(0, totalQuestionsRequested);
    
    // Сброс статистики
    currentIdx = 0;
    score = 0;
    currentStreak = 0;
    maxStreak = 0;
    
    switchScreen(quizScreen);
    renderQuestion();
});

// Рендеринг текущего вопроса
function renderQuestion() {
    const qData = gameQuestions[currentIdx];
    
    // Обновляем навигацию и прогресс-бар
    document.getElementById("progress-text").innerText = `Вопрос ${currentIdx + 1} из ${totalQuestionsRequested}`;
    document.getElementById("progress-fill").style.width = `${(currentIdx / totalQuestionsRequested) * 100}%`;
    document.getElementById("feedback-message").innerText = "";
    
    // Текст вопроса
    document.getElementById("question-text").innerText = qData.q;
    
    // Создаем массив объектов вариантов ответов, чтобы помнить, какой из них верный после перемешивания вариантов
    const originalAnswerText = qData.a[qData.correct];
    let choices = shuffleArray([...qData.a]); 
    
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";
    
    // Выводим перемешанные варианты ответов на экран
    choices.forEach(choiceText => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = choiceText;
        
        btn.addEventListener("click", () => handleAnswer(btn, choiceText === originalAnswerText, optionsContainer));
        optionsContainer.appendChild(btn);
    });
}

// Обработка клика по ответу
function handleAnswer(selectedBtn, isCorrect, container) {
    // Блокируем остальные кнопки, чтобы нельзя было нажать дважды
    Array.from(container.children).forEach(btn => btn.disabled = true);
    
    const feedback = document.getElementById("feedback-message");
    const streakCounter = document.getElementById("streak-counter");
    const streakVal = document.getElementById("streak-val");

    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
        
        feedback.innerText = CORRECT_REACTIONS[Math.floor(Math.random() * CORRECT_REACTIONS.length)];
        feedback.style.color = "var(--neon-green)";
        
        // Показываем стрик, если он больше 1
        if (currentStreak >= 2) {
            streakVal.innerText = currentStreak;
            streakCounter.style.display = "block";
        }
    } else {
        selectedBtn.classList.add("wrong");
        currentStreak = 0;
        streakCounter.style.display = "none";
        
        feedback.innerText = WRONG_REACTIONS[Math.floor(Math.random() * WRONG_REACTIONS.length)];
        feedback.style.color = "var(--neon-red)";
        
        // Подсвечиваем пользователю правильный ответ, чтобы было наглядно
        // (Правильный ответ определяем по логике сравнения текстов)
        const qData = gameQuestions[currentIdx];
        const correctText = qData.a[qData.correct];
        Array.from(container.children).forEach(btn => {
            if (btn.innerText === correctText) btn.classList.add("correct");
        });
    }

    // Задержка перед переходом к следующему вопросу
    setTimeout(() => {
        currentIdx++;
        if (currentIdx < totalQuestionsRequested) {
            renderQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

// Финальный расчет результатов
function showResults() {
    switchScreen(resultScreen);
    
    const accuracy = Math.round((score / totalQuestionsRequested) * 100);
    
    document.getElementById("stat-correct").innerText = `${score}/${totalQuestionsRequested}`;
    document.getElementById("stat-percent").innerText = `${accuracy}%`;
    document.getElementById("stat-max-streak").innerText = maxStreak;
    
    // Динамические звания и эмодзи на основе точности
    const emojiEl = document.getElementById("result-emoji");
    const rankEl = document.getElementById("result-rank");
    
    if (accuracy === 100) {
        emojiEl.innerText = "👑";
        rankEl.innerText = "Ранг: Абсолютный Кибер-Гений";
        rankEl.style.color = "var(--neon-cyan)";
    } else if (accuracy >= 70) {
        emojiEl.innerText = "🧠";
        rankEl.innerText = "Ранг: Магистр Эрудиции";
        rankEl.style.color = "var(--neon-green)";
    } else if (accuracy >= 40) {
        emojiEl.innerText = "👍";
        rankEl.innerText = "Ранг: Крепкий Орешек";
        rankEl.style.color = "#ff9f43";
    } else {
        emojiEl.innerText = "📚";
        rankEl.innerText = "Ранг: Стажёр (Нужно подтянуть базу)";
        rankEl.style.color = "var(--neon-red)";
    }
}

// Перезапуск
document.getElementById("restart-btn").addEventListener("click", () => {
    switchScreen(startScreen);
});
