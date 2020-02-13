$(document).ready(function() {
    var time = 60;
    var timer;

var questions = [{question: 'What does JS stand for?',
    choices:['June Solstice', 'Jerry Seinfeld', 'Java Script', 'Jelly Sandwich'], 
    answerIndex: 2},
    {question: 'What does DOM stand for?',
    choices:['Day of mourning', 'Doom of Man', 'Dog or Man', 'Document Object Method'], 
    answerIndex: 3},
    {question: 'In Git, what command do you use to see what branches you have?',
    choices: ['Git blanch', 'Git branch', 'Get branch', 'Git fetch'],
    answerIndex: 2},
    {question: 'What does CDN stand for?',
    choices: ['Canadian Dollar', 'Computer Designated Notation', 'Content Delivery Network', 'Computative Data Normalized'],
    answerIndex: 3},
    {question: 'What do I need to cite in order to get Bootstrap to work?',
    choices: ['The proper CDN', 'The footer section', 'The header section', 'Query selector'],
    answerIndex: 2}


];
    
var questionIndex = -1;

var startBtnClick = getEl("#btn");
    startBtnClick.addEventListener("click", function(event){
    var startInfo = getEl('.start-info');
    var questionContainer = getEl('.card');
    startInfo.classList.add('hide');
    questionContainer.classList.remove('hide');
    //start timer
    generateTimer();
    //invoke a function which renders a question
    generateQuestion();
    // hide the Code Quiz text
});

/**
 * 
 * @param {string} selector 
 */
function getEl(selector) {
    return document.querySelector(selector);
}

var correct = 0;
var incorrect = 0;
function generateQuestion() {
    questionIndex++;
    if(questionIndex >= questions.length){
        finishGame();
        clearInterval(timer);
        //Here the questions are over and the user is done
    }

    var qEl = getEl('#question');
    qEl.innerText = questions[questionIndex].question;
    var choicesEl = getEl('#choices');
     var html = '';
     for (var i = 0; i < questions[questionIndex].choices.length; i++) {
         var choice = questions[questionIndex].choices[i];
         html+='<li class="list-group-item choice">' + choice + '</li>';
     }
     choicesEl.innerHTML = html;
     //Find all els with choice class ie use querySelectorAll
     var choicesBtns = document.querySelectorAll('.choice');
     for (var j = 0; j < choicesBtns.length; j++) {
         var choiceBtn = choicesBtns[j];
         choiceBtn.addEventListener('click', function(event) {
            console.log(event.target.innerText);
            var currentQuestion = questions[questionIndex];
            var currentCorrectAnswer = currentQuestion.choices[currentQuestion.answerIndex];
            var userSelectedText = event.target.innerText;
            var answeredCorrectly = userSelectedText === currentCorrectAnswer;
            if(answeredCorrectly) {
                console.log('This is correct ans');
                //Increment some variable that lets us know a question was answered correctly
                correct++;
            }
            else {
                console.log('Incorrect');
                //Increment some variable that lets us know a question was answeed incorrectly
                incorrect++;
                time-=10;
            }
            //Generate a new question
            generateQuestion();
         });
         
     }
}

function generateTimer() {
    //Create our html elements
     var timeEl = getEl('#time');
     var headerContainer = getEl('.header')
     timer = setInterval(function() {
         timeEl.innerText = time;
         time--;
         //Create some condition that stops this timer
         if(time < 0) {
            finishGame();
             clearInterval(timer);
        }
    }, 1000);
    headerContainer.classList.remove('hide');
    //create interval functoin
    //add to dom

}

function finishGame(){
    var questionContainer = getEl('.card');
    questionContainer.classList.add('hide');
    var finalAnswersContainer = getEl('.final-answers');
    var incorrectEl = getEl('.incorrect');
    var correctEl = getEl('.correct');
    var unansweredEl = getEl('.unanswered');
    var submitBtn = getEl('#submit');
    incorrectEl.textContent = incorrect;
    correctEl.textContent = correct;
    unansweredEl.textContent = questions.length - (incorrect + correct);
    finalAnswersContainer.classList.remove('hide');
    submitBtn.addEventListener('click', resetGame);


}

function resetGame(){
    incorrect = 0;
    correct = 0;
    questionIndex = -1;
    time=60;
    var finalAnswersContainer = getEl('.final-answers');
    finalAnswersContainer.classList.add('hide');
    generateTimer();
    generateQuestion();
    var questionContainer = getEl('.card');
    questionContainer.classList.remove('hide');
}

});