const TOTAL_QUESTIONS = questions.length;

let currentQuestion = 0;
let answeredQuestions = Array(TOTAL_QUESTIONS).fill(-1);
let showingResults = false;

function prevQuestion() {
    if (showingResults) {
        currentQuestion = TOTAL_QUESTIONS - 1;
        showQuestion(currentQuestion);
        return;
    }

    if (currentQuestion > 0) {
        currentQuestion -= 1;
        showQuestion(currentQuestion);
    }
}

function nextQuestion() {
    if (showingResults) {
        return;
    }

    if (currentQuestion < TOTAL_QUESTIONS - 1) {
        currentQuestion += 1;
        showQuestion(currentQuestion);
    } else if (allAnswered()) {
        showResults();
    }
}

function showQuestion(index) {
    showingResults = false;
    currentQuestion = index;

    const box = document.getElementById("question-box");
    const q = questions[index];
    const letters = ["A. ", "B. ", "C. ", "D. "];

    let html = `
        <h3>Frage ${index + 1} von ${TOTAL_QUESTIONS}</h3>
        <p>${q.question}</p>
    `;

    q.options.forEach((opt, i) => {
        html += `
            <label>
                <input type="radio" name="q${index}" value="${i}">
                <strong>${letters[i]}</strong>&nbsp; ${opt}
            </label>
        `;
    });

    box.innerHTML = html;

    const feedbackBox = document.getElementById("feedback");
    feedbackBox.classList.add("hidden");
    feedbackBox.innerHTML = "";

    showFeedback();
    updateProgressbar();
    updateButtonText();
}

function sendAnswer() {
    if (showingResults) {
        restartQuiz();
        return;
    }

    if (allAnswered()) {
        showResults();
        return;
    }

    const selected = document.querySelector(`input[name="q${currentQuestion}"]:checked`);

    if (!selected || answeredQuestions[currentQuestion] !== -1) {
        return;
    }

    answeredQuestions[currentQuestion] = parseInt(selected.value, 10);

    showFeedback();
    updateProgressbar();
    updateButtonText();
}

function showFeedback() {
    if (showingResults) {
        return;
    }

    const feedbackBox = document.getElementById("feedback");
    const selectedValue = answeredQuestions[currentQuestion];

    if (selectedValue === -1) {
        feedbackBox.innerHTML = "";
        feedbackBox.classList.add("hidden");
        return;
    }

    document.querySelectorAll(`input[name="q${currentQuestion}"]`).forEach(input => {
        input.disabled = true;
    });

    const correctValue = questions[currentQuestion].correct[0];
    const selectedInput = document.querySelector(
        `input[name="q${currentQuestion}"][value="${selectedValue}"]`
    );
    const correctInput = document.querySelector(
        `input[name="q${currentQuestion}"][value="${correctValue}"]`
    );

    document.querySelectorAll(`input[name="q${currentQuestion}"]`).forEach(input => {
        input.parentElement.classList.remove("correct", "wrong", "solution");
    });

    let feedbackMessage = "";

    if (selectedValue === correctValue) {
        selectedInput?.parentElement.classList.add("correct");
        feedbackMessage = "Die Antwort ist richtig:<br>";
        feedbackBox.classList.remove("wrong");
        feedbackBox.classList.add("correct");
    } else {
        selectedInput?.parentElement.classList.add("wrong");
        correctInput?.parentElement.classList.add("solution");
        feedbackMessage = "Die Antwort ist falsch:<br>";
        feedbackBox.classList.remove("correct");
        feedbackBox.classList.add("wrong");
    }

    feedbackMessage += questions[currentQuestion].explanation;
    feedbackBox.innerHTML = feedbackMessage;
    feedbackBox.classList.remove("hidden");
}

function showResults() {
    showingResults = true;
    currentQuestion = TOTAL_QUESTIONS;

    const box = document.getElementById("question-box");
    const correctAnswers = answeredQuestions.reduce((sum, answer, index) => {
        return sum + (answer === questions[index].correct[0] ? 1 : 0);
    }, 0);

    let resultText = "";

    if (correctAnswers === 5) {
        resultText = `
            <p>Stark – du hast die rechtlichen Grundlagen und Lizenzarten aus der Unterlage sicher drauf.</p>
        `;
    } else if (correctAnswers === 4) {
        resultText = `
            <p>Sehr gut. Nur an einer Stelle lohnt sich noch ein kurzer Blick in die Unterlage.</p>
        `;
    } else if (correctAnswers === 3) {
        resultText = `
            <p>Solide Grundlage. Bei den Rechtsbereichen und Lizenzarten kannst du noch etwas nachschärfen.</p>
        `;
    } else {
        resultText = `
            <p>Schau dir die Unterschiede zwischen den Gesetzen und Lizenzarten noch einmal kurz an und starte das Quiz danach erneut.</p>
        `;
    }

    box.innerHTML = `
        <h3>Ergebnis</h3>
        <p>Du hast ${correctAnswers} von ${TOTAL_QUESTIONS} Fragen richtig beantwortet.</p>
        ${resultText}
    `;

    const feedbackBox = document.getElementById("feedback");
    feedbackBox.innerHTML = "";
    feedbackBox.classList.add("hidden");
    feedbackBox.classList.remove("correct", "wrong");

    updateProgressbar();
    updateButtonText();
}

function updateButtonText() {
    const submitButton = document.getElementById("submit-btn");

    if (showingResults) {
        submitButton.innerText = "Quiz neu starten";
    } else if (allAnswered()) {
        submitButton.innerText = "Ergebnisse anzeigen";
    } else {
        submitButton.innerText = "Antwort absenden";
    }
}

function updateProgressbar() {
    const questionSteps = document.querySelectorAll(".quiz_progressbar .question-step");
    const resultStep = document.querySelector(".quiz_progressbar .step_result");

    questionSteps.forEach((step, index) => {
        step.classList.remove("active", "correct-step", "wrong-step");

        if (!showingResults && index === currentQuestion) {
            step.classList.add("active");
        }

        if (answeredQuestions[index] !== -1) {
            if (answeredQuestions[index] === questions[index].correct[0]) {
                step.classList.add("correct-step");
            } else {
                step.classList.add("wrong-step");
            }
        }
    });

    resultStep.classList.toggle("active", showingResults);
}

function allAnswered() {
    return answeredQuestions.every(answer => answer !== -1);
}

function restartQuiz() {
    currentQuestion = 0;
    answeredQuestions = Array(TOTAL_QUESTIONS).fill(-1);
    showingResults = false;
    showQuestion(0);
}

document.addEventListener("DOMContentLoaded", () => {
    showQuestion(0);
});