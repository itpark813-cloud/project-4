// Новая база знаний: Темы курса Foundation (C++, биты, байты, структуры)
const QUESTION_POOL = [
    { q: "Сколько бит информации содержится в одном стандартном байте?", a: ["4 бита", "8 бит", "16 бит", "1024 бита"], correct: 1 },
    { q: "Сколько мегабайт (МБ) содержится в 1 гигабайте (ГБ) по канонам двоичной системы?", a: ["1000 МБ", "1024 МБ", "512 МБ", "2048 МБ"], correct: 1 },
    { q: "Какое расширение файлов используется по умолчанию для исходного кода языка C++?", a: [".html", ".cpp", ".exe", ".cplus"], correct: 1 },
    { q: "Какая функция служит главной и обязательной точкой входа в любую программу на C++?", a: ["start()", "begin()", "main()", "execute()"], correct: 2 },
    { q: "Какой тип данных в C++ выделяет в памяти ровно 1 байт и хранит один символ?", a: ["int", "float", "char", "double"], correct: 2 },
    { q: "Каким знаком или символом обязана завершаться базовая инструкция в коде C++?", a: ["Точка (.)", "Запятая (,)", "Двоеточие (:)", "Точка с запятой (;)"], correct: 3 },
    { q: "Что из этого является минимальной единицей измерения объема информации?", a: ["Байт", "Бит", "Килобайт", "Слово"], correct: 1 },
    { q: "Какой оператор используется в C++ для вывода текстовых данных в консоль?", a: ["std::cin", "std::cout", "print()", "printf()"], correct: 1 },
    { q: "Какое ключевое слово в C++ объявляет логический тип данных (истина / ложь)?", a: ["logical", "bit", "bool", "boolean"], correct: 2 },
    { q: "В какую память загружается программа во время своего непосредственного выполнения?", a: ["В постоянную (HDD/SSD)", "В оперативную (RAM)", "В кэш видеокарты", "На облачный сервер"], correct: 1 },
    { q: "Какой оператор используется в языке C++ для строгой проверки равенства двух переменных?", a: ["=", "==", "===", "match"], correct: 1 },
    { q: "Как называется процесс перевода понятного человеку кода C++ в машинный двоичный код?", a: ["Интерпретация", "Компиляция", "Депортация", "Архивация"], correct: 1 },
    { q: "Какое ключевое слово заставляет функцию мгновенно завершить работу и отдать результат?", a: ["break", "exit", "stop", "return"], correct: 3 },
    { q: "Сколько возможных комбинаций состояний могут закодировать всего 2 бита информации?", a: ["2 комбинации", "4 комбинации", "8 комбинаций", "16 комбинаций"], correct: 1 },
    { q: "Какой цикл в программировании запускается, когда число повторений известно заранее?", a: ["while", "do-while", "for", "if-else"], correct: 2 },
    { q: "Что такое архитектурный термин CPU в рамках компьютерных систем?", a: ["Видеокарта", "Блок питания", "Центральный процессор", "Материнская плата"], correct: 2 },
    { q: "Как называется алгоритм или функция, которая осуществляет вызов самой себя?", a: ["Инверсия", "Цикличность", "Рекурсия", "Итерация"], correct: 2 },
    { q: "Какой комментарий в синтаксисе C++ считается корректным однострочным?", a: ["# это комментарий", "// это комментарий", "/* это комментарий */", "<!-- комментарий -->"], correct: 1 },
    { q: "Какое значение по умолчанию вернет логическое выражение (5 > 3 && 2 > 4)?", a: ["true (1)", "false (0)", "Ошибка синтаксиса", "undefined"], correct: 1 },
    { q: "Какое из этих чисел является представлением терабайта (ТБ)?", a: ["1024 Килобайта", "1024 Мегабайта", "1024 Гигабайта", "1000 Гигабайт"], correct: 2 }
];

const CORRECT_REACTIONS = ["Гений Foundation! 🧠", "Код компилируется! 🎯", "База сдана! 🔥", "Изи для тебя! 😎"];
const WRONG_REACTIONS = ["Сбой компиляции... 🤖", "Утеряны пакеты данных ❌", "Перечитай лекцию! 📉", "Упс, синтаксическая ошибка! 😿"];

let gameQuestions = [];
let currentIdx = 0;
let score = 0;
let currentStreak = 0;
let maxStreak = 0;
let totalQuestionsRequested = 10;

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initGameLogic();
    calculateAnalytics();
});

// МОДУЛЬ ВКЛАДОК (МЕНЮ)
function initTabs() {
    const tabGame = document.getElementById("tab-game");
    const tabAnalytics = document.getElementById("tab-analytics");
    const contentGame = document.getElementById("game-tab-content");
    const contentAnalytics = document.getElementById("analytics-tab-content");

    tabGame.addEventListener("click", () => {
        tabGame.classList.add("active");
        tabAnalytics.classList.remove("active");
        contentGame.classList.add("active");
        contentAnalytics.classList.remove("active");
    });

    tabAnalytics.addEventListener("click", () => {
        tabAnalytics.classList.add("active");
        tabGame.classList.remove("active");
        contentAnalytics.classList.add("active");
        contentGame.classList.remove("active");
        calculateAnalytics(); // Пересчитываем статистику при открытии
    });
}

// Утилита: Полный случайный перемешиватель (Алгоритм Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// МОДУЛЬ ИГРЫ
function initGameLogic() {
    const startScreen = document.getElementById("start-screen");
    const quizScreen = document.getElementById("quiz-screen");
    const resultScreen = document.getElementById("result-screen");

    document.getElementById("start-btn").addEventListener("click", () => {
        totalQuestionsRequested = parseInt(document.getElementById("question-count").value);
        
        let shuffledPool = shuffleArray([...QUESTION_POOL]);
        gameQuestions = shuffledPool.slice(0, totalQuestionsRequested);
        
        currentIdx = 0;
        score = 0;
        currentStreak = 0;
        maxStreak = 0;
        
        startScreen.classList.remove("active");
        resultScreen.classList.remove("active");
        quizScreen.classList.add("active");
        renderQuestion();
    });

    document.getElementById("restart-btn").addEventListener("click", () => {
        resultScreen.classList.remove("active");
        startScreen.classList.add("active");
    });

    document.getElementById("clear-stats-btn").addEventListener("click", () => {
        if(confirm("Вы уверены, что хотите стереть историю ваших тестов?")) {
            localStorage.removeItem("quiz_history");
            calculateAnalytics();
        }
    });
}

function renderQuestion() {
    const qData = gameQuestions[currentIdx];
    
    document.getElementById("progress-text").innerText = `Вопрос ${currentIdx + 1} из ${totalQuestionsRequested}`;
    document.getElementById("progress-fill").style.width = `${(currentIdx / totalQuestionsRequested) * 100}%`;
    document.getElementById("feedback-message").innerText = "";
    
    document.getElementById("question-text").innerText = qData.q;
    
    const originalAnswerText = qData.a[qData.correct];
    let choices = shuffleArray([...qData.a]); 
    
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";
    
    choices.forEach(choiceText => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = choiceText;
        
        btn.addEventListener("click", () => handleAnswer(btn, choiceText === originalAnswerText, optionsContainer));
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(selectedBtn, isCorrect, container) {
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
        
        const qData = gameQuestions[currentIdx];
        const correctText = qData.a[qData.correct];
        Array.from(container.children).forEach(btn => {
            if (btn.innerText === correctText) btn.classList.add("correct");
        });
    }

    setTimeout(() => {
        currentIdx++;
        if (currentIdx < totalQuestionsRequested) {
            renderQuestion();
        } else {
            finishQuizSession();
        }
    }, 1500);
}

// Завершение сессии и сохранение результатов в ЛОКАЛЬНУЮ БД
function finishQuizSession() {
    const quizScreen = document.getElementById("quiz-screen");
    const resultScreen = document.getElementById("result-screen");
    
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");
    
    const accuracy = Math.round((score / totalQuestionsRequested) * 100);
    
    document.getElementById("stat-correct").innerText = `${score}/${totalQuestionsRequested}`;
    document.getElementById("stat-percent").innerText = `${accuracy}%`;
    document.getElementById("stat-max-streak").innerText = maxStreak;
    
    // Рассчитываем ранги
    const rankEl = document.getElementById("result-rank");
    const emojiEl = document.getElementById("result-emoji");
    if (accuracy === 100) { rankEl.innerText = "Ранг: Старший Архитектор 👑"; emojiEl.innerText = "👑"; }
    else if (accuracy >= 70) { rankEl.innerText = "Ранг: C++ Разработчик 🧠"; emojiEl.innerText = "🧠"; }
    else if (accuracy >= 40) { rankEl.innerText = "Ранг: Джуниор на стажировке 💻"; emojiEl.innerText = "💻"; }
    else { rankEl.innerText = "Ранг: Студент на пересдаче 📚"; emojiEl.innerText = "📚"; }

    // СОХРАНЕНИЕ В LOCALSTORAGE
    let history = JSON.parse(localStorage.getItem("quiz_history")) || [];
    history.push({
        accuracy: accuracy,
        streak: maxStreak,
        date: Date.now()
    });
    localStorage.setItem("quiz_history", JSON.stringify(history));
}

// МОДУЛЬ МАТЕМАТИЧЕСКОГО АНАЛИЗА И ТРЕНДОВ
function calculateAnalytics() {
    let history = JSON.parse(localStorage.getItem("quiz_history")) || [];
    
    const totalGamesEl = document.getElementById("total-games");
    const globalAvgEl = document.getElementById("global-avg");
    const recordStreakEl = document.getElementById("record-streak");
    const trendBox = document.getElementById("trend-box");
    const trendTitle = document.getElementById("trend-title");
    const trendDesc = document.getElementById("trend-desc");
    const trendIcon = document.getElementById("trend-icon");

    // Обнуляем стили тренда перед вычислениями
    trendBox.className = "trend-widget";

    if (history.length === 0) {
        totalGamesEl.innerText = "0";
        globalAvgEl.innerText = "0%";
        recordStreakEl.innerText = "0";
        trendTitle.innerText = "Логи пусты";
        trendDesc.innerText = "Пройдите тестирование во вкладке 'Симулятор', чтобы ИИ собрал метрики.";
        trendIcon.innerText = "📊";
        return;
    }

    // Расчет базовых показателей
    const totalGames = history.length;
    const totalAccuracySum = history.reduce((sum, session) => sum + session.accuracy, 0);
    const globalAvg = Math.round(totalAccuracySum / totalGames);
    const highestStreak = Math.max(...history.map(s => s.streak));

    totalGamesEl.innerText = totalGames;
    globalAvgEl.innerText = `${globalAvg}%`;
    recordStreakEl.innerText = highestStreak;

    // СИСТЕМА ИНТЕЛЛЕКТУАЛЬНОГО АНАЛИЗА ТРЕНДА (ЛУЧШЕ ИЛИ ХУЖЕ)
    if (totalGames < 2) {
        trendTitle.innerText = "Сбор информации";
        trendDesc.innerText = "Статистика формируется. Запустите хотя бы еще одну сессию для оценки динамики.";
        trendIcon.innerText = "⏳";
        return;
    }

    // Сравниваем среднюю точность последнего теста с общим средним значением до него
    const lastSession = history[history.length - 1];
    const previousSessions = history.slice(0, -1);
    const prevAvg = Math.round(previousSessions.reduce((sum, s) => sum + s.accuracy, 0) / previousSessions.length);

    const difference = lastSession.accuracy - prevAvg;

    if (difference > 5) {
        // Ответы становятся явно ЛУЧШЕ
        trendBox.classList.add("trend-upgrade");
        trendTitle.innerText = "Ты улучшаешься! 📈";
        trendDesc.innerText = `Твой последний результат (${lastSession.accuracy}%) выше предыдущего среднего уровня (${prevAvg}%). Скорость усвоения Foundation растет!`;
        trendIcon.innerText = "🚀";
    } else if (difference < -5) {
        // Ответы становятся ХУЖЕ
        trendBox.classList.add("trend-downgrade");
        trendTitle.innerText = "Показатели падают... 📉";
        trendDesc.innerText = `Последний результат (${lastSession.accuracy}%) просел ниже твоей нормы (${prevAvg}%). Повтори мегабайты и синтаксис циклов.`;
        trendIcon.innerText = "⚠️";
    } else {
        // Стабильный результат
        trendBox.classList.add("trend-stable");
        trendTitle.innerText = "Стабильный уровень 📊";
        trendDesc.innerText = `Ты держишь планку на уровне устойчивых ${globalAvg}%. Отличная стабильность знаний кода!`;
        trendIcon.innerText = "🎯";
    }
}
