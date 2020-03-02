$(document).ready(function() {
    // set timer to 60 seconds
    var time = 60;
    var timer;

    // questions your going to ask on the quiz with the index of correct answers
var questions = 
    [{question: 'What does JS stand for?',
    choices:['June Solstice', 'Jerry Seinfeld', 'Java Script', 'Jelly Sandwich'], 
    answerIndex: 2},
    {question: 'What does DOM stand for?',
    choices:['Day of mourning', 'Doom of Man', 'Dog or Man', 'Document Object Model'], 
    answerIndex: 3},
    {question: 'In Git, what command do you use to see what branches you have?',
    choices: ['Git blanch', 'Git branch', 'Get branch', 'Git fetch'],
    answerIndex: 1},
    {question: 'What does CDN stand for?',
    choices: ['Canadian Dollar', 'Computer Designated Notation', 'Content Delivery Network', 'Computative Data Normalized'],
    answerIndex: 2},
    {question: 'What do I need to cite in order to get Bootstrap to work?',
    choices: ['The proper CDN', 'The footer section', 'The header section', 'Query selector'],
    answerIndex: 0}
    ];

    // gathers the array of high scores from local storage
var scores = JSON.parse(localStorage.getItem('highScores')) || [];
    
    // create an index for the questions asked
var questionIndex = -1;

    // define what happens when you press the start button; we want to hide the answers initially and then add them back so that they are visible when the start button is clicked
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
// set the number of correct and incorrect
var correct = 0;
var incorrect = 0;
// generate the questions
function generateQuestion() {
    questionIndex++;
    if(questionIndex >= questions.length){
        finishGame();
        clearInterval(timer);
        return;
        //Here the questions are over and the user is done
    }
    // presents the questions as html
    var qEl = getEl('#question');
    qEl.innerText = questions[questionIndex].question;
    var choicesEl = getEl('#choices');
     var html = '';
     for (var i = 0; i < questions[questionIndex].choices.length; i++) {
         var choice = questions[questionIndex].choices[i];
         html+='<li class="list-group-item choice">' + choice + '</li>';
     }
     choicesEl.innerHTML = html;
     //Find all els with choice class ...use querySelectorAll
     var choicesBtns = document.querySelectorAll('.choice');
     for (var j = 0; j < choicesBtns.length; j++) {
         var choiceBtn = choicesBtns[j];
         choiceBtn.addEventListener('click', function(event) {
            console.log(event.target.innerText);
            // create a variable that tells us which question is being acted on
            var currentQuestion = questions[questionIndex];
            // creates a variable that tells us the correct answer
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
    //create interval function
    //add to dom
}
    // create an 'p' element that holds the high scores and pulls those scores from local storage and allows the user to input their initials
 getEl(".view-high-scores").addEventListener("click", function(){
    var resultScores = localStorage.getItem("highScores")
        if (resultScores){
            resultScores = JSON.parse(resultScores);
        }
        else {
            resultScores = [];
        }
        var highScoreContainer = getEl(".high-scores");
        highScoreContainer.innerHTML = '';
    for (let i = 0; i < resultScores.length; i++) {
        const element = resultScores[i];
        var initials = document.createElement("p");
        // Userinitials - score
        initials.innerText = element.initials + " - " + element.score;
        highScoreContainer.append(initials);
    }

    var finalAnswersContainer = getEl('.final-answers');
    finalAnswersContainer.classList.add("hide");
    var highScoreContainer = getEl(".high-scores");
    highScoreContainer.classList.remove("hide");
    var submitBtn = getEl('#submit-two');
    submitBtn.addEventListener('click', resetGame);
 });


const scoreCacheAmount = 5

const isHighScore = newScore => {
  if(scores.length !== scoreCacheAmount) {
    return true;
  }
  let flagged = false;
  for(let i = 0; i < scores.length; i++){
    if(newScore > scores[i].score){
      flagged = true;
    }
  }
  
  return flagged;
}

const addToHighScore = user => {
    if(scores.length === 0) {
        scores.push(user);
        localStorage.setItem('highScores', JSON.stringify(scores))
        return;
    }
     for(let i = 0; i < scores.length; i++){
    if(user.score > scores[i].score){
      scores.splice(i, 0, user);
      break;
    }
  }
  
  if(scores.length >= scoreCacheAmount) {
    scores = scores.slice(0, scoreCacheAmount);
  }

  localStorage.setItem('highScores', JSON.stringify(scores))
}


function finishGame(){
    var questionContainer = getEl('.card');
    questionContainer.classList.add('hide');
    var finalAnswersContainer = getEl('.final-answers');
    var incorrectEl = getEl('.incorrect');
    var correctEl = getEl('.correct');
    var unansweredEl = getEl('.unanswered');
    incorrectEl.textContent = incorrect;
    correctEl.textContent = correct;
    unansweredEl.textContent = questions.length - (incorrect + correct);
    finalAnswersContainer.classList.remove('hide');
    var submitBtn = getEl('#submit-two');
    submitBtn.addEventListener('click', resetGame);

    var currentScore = correct + time;
    var scoreShouldBeAdded = isHighScore(currentScore);
    if(scoreShouldBeAdded){
        const html = `
        <div>
            
            <input type="text" id="initials">
            <p>Enter your initials</p>
            <button id="addScore">Submit</button>
            
            
        </div>`;
        var finalAnswersContainer = getEl('.final-answers');
        finalAnswersContainer.innerHTML+=html;
        var submitInitialsBtn = getEl('#addScore');
        submitInitialsBtn.addEventListener('click', function(){
            const initialsEL = getEl('#initials');
            const initials = initialsEL.value;
            const score = currentScore;
            if(initials.length > 0 && initials.length < 4) {
                addToHighScore({initials, score});
            }else {
                alert('You must enter at least one initial but no more than three')
            }
        });
    }
}

function resetGame(){
    incorrect = 0;
    correct = 0;
    questionIndex = -1;
    time=60;
    var finalAnswersContainer = getEl('.final-answers');
    var highScoreContainer = getEl('.high-scores');
    finalAnswersContainer.classList.add('hide');
    highScoreContainer.classList.add('hide');
    generateTimer();
    generateQuestion();
    var questionContainer = getEl('.card');
    questionContainer.classList.remove('hide');
}

});