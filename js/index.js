/**
 * ============================================
 * MAIN ENTRY POINT (index.js)
 * ============================================
 *
 * This file is the starting point of your application.
 * It handles:
 * - Getting DOM elements
 * - Form validation
 * - Starting the quiz
 * - Loading/error states
 *
 * DOM ELEMENTS TO GET:
 * - quizOptionsForm: #quizOptions
 * - playerNameInput: #playerName
 * - categoryInput: #categoryMenu
 * - difficultyOptions: #difficultyOptions
 * - questionsNumber: #questionsNumber
 * - startQuizBtn: #startQuiz
 * - questionsContainer: .questions-container
 *
 * FUNCTIONS TO IMPLEMENT:
 * - showLoading() - Display loading spinner
 * - hideLoading() - Remove loading spinner
 * - showError(message) - Display error card
 * - validateForm() - Check if form is valid
 * - showFormError(message) - Show error on form
 * - resetToStart() - Reset to initial state
 * - startQuiz() - Main function to start quiz
 */

// ============================================
// TODO: Get DOM Element References
// ============================================
// Use document.getElementById() and document.querySelector()
import Quiz from "./quiz.js";
import Question from "./question.js";
var quizOptions = document.getElementById("quizOptions");
var playerNameInput = document.getElementById("playerName");
var categoryInput = document.getElementById("categoryMenu");
var difficultyOptions = document.getElementById("difficultyOptions");
var questionsNumber = document.getElementById("questionsNumber");
var startQuizBtn = document.getElementById("startQuiz");
var questionContainer = document.querySelector(".questions-container");
// ============================================
// TODO: Create variable to store current quiz
// ============================================
let currentQuiz = null;

// ============================================
// TODO: Create showLoading() function
// ============================================
// Set questionsContainer.innerHTML to loading HTML
// See index.html for the HTML structure

function showLoading() {
  questionContainer.innerHTML = `
      <div class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading Questions...</p>
    </div>`;
}

// ============================================
// TODO: Create hideLoading() function
// ============================================
// Find and remove the loading overlay

function hideLoading() {
  let loading = document.querySelector(".loading-overlay");
  loading.remove();
}

// ============================================
// TODO: Create showError(message) function
// ============================================
// Set questionsContainer.innerHTML to error HTML
// Include the message parameter in the display
// Add click listener to retry button that calls resetToStart()

function showError(message) {
  questionContainer.innerHTML = `
     <div class="game-card error-card">
      <div class="error-icon">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <h3 class="error-title">Oops! Something went wrong</h3>
      <p class="error-message">${message}.</p>
      <button class="btn-play retry-btn">
        <i class="fa-solid fa-rotate-right"></i> Try Again
      </button>
    </div>`;
    let retry = document.querySelector('.retry-btn');
    retry.addEventListener('click', function () {
    resetToStart()
});

}

// ============================================
// TODO: Create validateForm() function
// ============================================
// Return object: { isValid: boolean, error: string | null }
// Check:
// 1. questionsNumber has a value
// 2. Value is >= 1 (minimum questions)
// 3. Value is <= 50 (maximum questions)
function validateForm() {
  const value = parseInt(questionsNumber.value);
  if (!questionsNumber.value)
    return { isValid: false, error: "Please enter number of questions" };
  if (value < 1) return { isValid: false, error: "Minimum is 1 question" };
  if (value > 50) return { isValid: false, error: "Maximum is 50 questions" };
  return { isValid: true, error: null };
}

// ============================================
// TODO: Create showFormError(message) function
// ============================================
// Create error div with class 'form-error'
// Insert before the start button
// Remove after 3 seconds with fade effect

function showFormError(message) {
  const formError = document.querySelector(".form-error");
    if (formError)
        formError.remove();

  const div = document.createElement("div");
  div.className = "form-error";
  div.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
  startQuizBtn.before(div);
  setTimeout(() =>{ div.remove()}, 3000);
}
// ============================================
// TODO: Create resetToStart() function
// ============================================
// 1. Clear questionsContainer
// 2. Reset form values
// 3. Show the form (remove 'hidden' class)
// 4. Set currentQuiz = null

function resetToStart() {
  questionContainer.innerHTML = "";
  playerNameInput.value = "";
  categoryInput.value = "";
  difficultyOptions.value = "";
  questionsNumber.value = "";
  currentQuiz = null;
  quizOptions.classList.remove("hidden");
}

// ============================================
// TODO: Create async startQuiz() function
// ============================================
// This is the main function, called when Start button is clicked
//
// Steps:
// 1. Validate the form
// 2. If not valid, show error and return
// 3. Get form values:
//    - playerName (use 'Player' if empty)
//    - category
//    - difficulty
//    - numberOfQuestions
// 4. Create new Quiz instance
// 5. Hide the form (add 'hidden' class)
// 6. Show loading spinner
// 7. Try to fetch questions:
//    - await currentQuiz.getQuestions()
//    - Hide loading
//    - Check if questions exist
//    - Create first Question and display it
// 8. Catch any errors:
//    - Hide loading
//    - Show error message

// ============================================
// TODO: Add Event Listeners
// ============================================
// 1. startQuizBtn click -> call startQuiz()
// 2. questionsNumber keydown -> if Enter, call startQuiz()
async function startQuiz() {
  const { isValid, error } = validateForm();
  if (!isValid) {
    showFormError(error);
    return;
  }

  const playerName = playerNameInput.value.trim() || "Player";
  const category = categoryInput.value;
  const difficulty = difficultyOptions.value;
  const numberOfQuestions = questionsNumber.value;
  quizOptions.classList.add("hidden");

  showLoading();

  try {
    currentQuiz = new Quiz(category, difficulty, numberOfQuestions, playerName);
    await currentQuiz.getQuestions();
    hideLoading();
    if (!currentQuiz.questions.length) {
      showError("No questions found");
      return;
    }

    const question = new Question(currentQuiz, questionContainer, resetToStart);
    question.displayQuestion();
  } catch (err) {
    hideLoading();
    showError(err.message);
  }
}

startQuizBtn.addEventListener("click", function () {
  startQuiz();
});

questionsNumber.addEventListener("keydown", function (e) {
  if (e.key === "Enter") startQuiz();
});
