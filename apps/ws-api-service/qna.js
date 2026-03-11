class QuestionAndAnswerGame {
    constructor() {
        this.questions = [
            {
                question: "What is the capital of France?",
                options: ["Paris", "London", "Berlin", "Rome"],
                answer: 0
            },
            {
                question: "What is the largest planet in our solar system?",
                options: ["Earth", "Saturn", "Jupiter", "Uranus"],
                answer: 2
            },
            {
                question: "Who wrote the book 'To Kill a Mockingbird'?",
                options: ["F. Scott Fitzgerald", "Harper Lee", "Jane Austen", "J.K. Rowling"],
                answer: 1
            }
        ];
        this.score = 0;
        this.currentQuestion = 0;
    }

    renderQuestion() {
        const questionElement = document.getElementById("question");
        const optionsElement = document.querySelector(".options");
        questionElement.textContent = 
this.questions[this.currentQuestion].question;
        optionsElement.innerHTML = "";
        for (let i = 0; i < 
this.questions[this.currentQuestion].options.length; i++) {
            const optionElement = document.createElement("LI");
            optionElement.textContent = 
this.questions[this.currentQuestion].options[i];
            optionElement.classList.add("option");
            if (i === this.questions[this.currentQuestion].answer) {
                optionElement.classList.add("correct");
            }
            optionsElement.appendChild(optionElement);
        }
    }

    checkAnswer() {
        const answerElement = 
document.querySelector("input[type='radio']");
        const answer = parseInt(answerElement.value) - 1;
        if (answer === this.questions[this.currentQuestion].answer) {
            this.score++;
            alert("Correct!");
        } else {
            alert(`Incorrect. The correct answer is 
${this.questions[this.currentQuestion].answer}`);
        }
        this.currentQuestion++;
        if (this.currentQuestion >= this.questions.length) {
            alert(`Game over! Your final score is ${this.score} out of 
${this.questions.length}`);
        } else {
            this.renderQuestion();
        }
    }

    startGame() {
        this.renderQuestion();
    }
}

const game = new QuestionAndAnswerGame();
game.startGame();
