const STORAGE_KEY = "occupational-safety-mastered";
const ROUND_SIZE = 10;
let mastered = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
let current = [];
const $ = (selector) => document.querySelector(selector);
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
const active = () => questions.filter((question) => !mastered.has(question.id));

function updateProgress() { $("#remaining-count").textContent = active().length; }
function updateAnswered() { const count = current.filter((_, index) => document.querySelector(`input[name="q${index}"]:checked`)).length; $("#answer-count").textContent = `已作答 ${count} / ${current.length}`; }

function startQuiz() {
  current = shuffle(active()).slice(0, Math.min(ROUND_SIZE, active().length));
  $("#quiz-screen").classList.remove("hidden"); $("#result-screen").classList.add("hidden");
  $("#quiz-heading").textContent = `本次測驗：${current.length} 題`; $("#answer-count").textContent = `已作答 0 / ${current.length}`;
  $("#questions").innerHTML = current.map((question, index) => `<fieldset class="question"><legend><span class="question-number">${index + 1}.</span>${question.prompt}</legend><div class="options">${question.choices.map((choice, choiceIndex) => `<label class="option"><input type="radio" name="q${index}" value="${choiceIndex}"><span>${String.fromCharCode(65 + choiceIndex)}. ${choice}</span></label>`).join("")}</div></fieldset>`).join("");
  $("#questions").onchange = updateAnswered; updateProgress();
}

function gradeQuiz() {
  if (current.some((_, index) => !document.querySelector(`input[name="q${index}"]:checked`))) { alert("請完成每一題後再送出。"); return; }
  const mistakes = []; let score = 0;
  current.forEach((question, index) => { const selected = Number(document.querySelector(`input[name="q${index}"]:checked`).value); if (selected === question.answer) { mastered.add(question.id); score += 1; } else { mistakes.push(question); } });
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...mastered])); updateProgress();
  $("#quiz-screen").classList.add("hidden"); $("#result-screen").classList.remove("hidden");
  $("#score-text").textContent = `答對 ${score} / ${current.length} 題`; $("#result-message").textContent = mistakes.length ? "以下是答錯題目的正確答案：" : "太棒了，這次全部答對！";
  $("#mistakes").innerHTML = mistakes.map((question, index) => `<article class="mistake"><strong>第 ${index + 1} 題</strong><p>${question.prompt}</p><p class="correct-answer">正確答案：${String.fromCharCode(65 + question.answer)}. ${question.choices[question.answer]}</p></article>`).join("");
  const done = active().length === 0; $("#retry-button").disabled = done; $("#retry-button").textContent = done ? "已完成所有題目！" : "再次測驗";
}

$("#submit-button").addEventListener("click", gradeQuiz); $("#retry-button").addEventListener("click", startQuiz); startQuiz();

