const state = {
    view: {
        squares:            document.querySelectorAll(".square"),
        timeLeft:           document.getElementById("time-left"),
        score:              document.getElementById("score"),
        lives:              document.getElementById("lives"),
        startButton:        document.getElementById("btn-start-game"),
        nameButton:         document.getElementById("btn-player"),
        playerName:         document.querySelector("#btn-player span"),
        levelRadios:        document.querySelectorAll("#btn-level input[name=rbLevel]"),
        levelButton:        document.getElementById("btn-level"),
        volumeButton:       document.getElementById("btn-volume"),
        volumeRange:        document.getElementById("rng-volume"),

        lastResult:         document.getElementById("last-result"),
        lastPlayerName:     document.querySelector("#last-player-name span"),
        lastPlayerScore:    document.querySelector("#last-player-score span"),
        lastPlayerLevel:    document.querySelector("#last-player-level span"),
    },
    values: {
        gameVelocity:       0,
        startGameVelocity:  0,
        fixedGameVelocity:  2500,
        hitPosition:        0,
        result:             0,
        startTime:          20,
        currenTime:         0,
        audioVolume:        0,
        lifeCount:          0,
        moveCount:          0,
        lastPosition:       null,
        playerName:         null,
        level:              1,
        levelDescription:   { 1: "Fácil", 2: "Normal", 3: "Difícil" },
    },
    actions: {
        countDownTimerId:   null,
    }
};


function addListenersButtons(){
    state.view.startButton.addEventListener("mousedown", () => {
        setDefaults();
        state.actions.countDownTimerId              = setInterval(countDown, 1000);
        setTimeout(randomSquare, state.values.startGameVelocity);
        state.view.startButton.style.visibility     = 'hidden';
        state.view.nameButton.disabled              = true;
        state.view.levelButton.style.visibility     = 'hidden';
        state.view.volumeButton.style.visibility    = 'hidden';
    });

    state.view.nameButton.addEventListener("mousedown", setPlayerName);

    state.view.levelRadios.forEach((el) => {
        el.addEventListener("change", (event) => {
            setLevel(event.target.value);
        });
    });

    state.view.volumeRange.addEventListener("mouseup", (event) => {
        setVolume(event.target.value);
    });
}

function addListenerHitBox(){
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if(isGameOver()){
                state.view.startButton.style.backgroundColor = "#f5bc54";
                setTimeout(() => { state.view.startButton.style.backgroundColor = "#74f3a0"; }, 200);
                playSound('Pickup_Coin4');
                
                return
            }

            if(square.id === state.values.hitPosition){
                playSound("hit");

                state.view.score.textContent    = ++state.values.result;
                state.values.hitPosition        = null;
            }else{
                //não perder vida com multiplos cliques após acerto
                if (state.values.hitPosition === null) return

                state.view.lives.textContent    = --state.values.lifeCount;

                playSound('Blip_Select15');
                
                if(state.values.lifeCount <= 0) gameOver();
            }
        });
    })    
}

function countDown(){
    state.view.timeLeft.textContent = --state.values.currenTime - 1;

    if(state.values.currenTime <= 0) gameOver();
}

function gameOver(){
    clearInterval(state.actions.countDownTimerId);

    let message = "";

    if(state.values.lifeCount > 0){
        message = "Tempo esgotado!"
            + "\nPontos: " + state.values.result 
            + "\nPorcentagem de acertos: " + Math.floor(((100 / state.values.moveCount) * state.values.result)) + "%";
        
        if(state.values.moveCount === state.values.result){
            message += "\nPERFEITO!!!";
            playSound('Pickup_Coin17');
        }
    }else{
        message = "Game over!"
            + "\nPontos: " + state.values.result;
    }

    alert(message);

    if(state.view.timeLeft.textContent < 0) state.view.timeLeft.textContent = 0;

    state.view.startButton.style.visibility     = 'visible';
    state.view.lastResult.style.display         = 'block';
    state.view.nameButton.disabled              = false;
    state.view.levelButton.style.visibility     = 'visible';
    state.view.volumeButton.style.visibility    = 'visible';

    state.view.lastPlayerName.textContent       = state.values.playerName;
    state.view.lastPlayerScore.textContent      = state.values.result;
    state.view.lastPlayerLevel.textContent      = state.values.levelDescription[state.values.level];
}

function playSound(audioName){
    let audio       = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume    = state.values.audioVolume;
    audio.play();
}

function isGameOver(){
    return state.values.currenTime <= 1 || state.values.lifeCount <= 0;
}

function randomSquare(){

    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    if(isGameOver()) return

    state.values.moveCount++;

    let randomNumber            = generateRandomNumber();
    let randomSquareElement     = state.view.squares[randomNumber];

    state.values.lastPosition   = randomNumber;

    randomSquareElement.classList.add("enemy");
    state.values.hitPosition    = randomSquareElement.id;

    setGameVelocity();

    setTimeout(randomSquare, state.values.gameVelocity);
}

function generateRandomNumber(){
    let randomNumber = Math.floor(Math.random() * 9);
    return (randomNumber === state.values.lastPosition) ? generateRandomNumber() : randomNumber 
}

function setValues(){
    state.values.moveCount      = 0;
    state.values.lastPosition   = null;
    state.values.lifeCount      = 3;
    state.values.result         = 0;
    state.values.currenTime     = state.values.startTime + 1;
}

function setViews(){
    state.view.lives.textContent    = state.values.lifeCount;
    state.view.score.textContent    = 0;
    state.view.timeLeft.textContent = state.values.startTime;
}

function setGameVelocity(){
    state.values.gameVelocity       = (state.values.currenTime / state.values.startTime) * state.values.startGameVelocity;
}

function setPlayerName(){
    state.values.playerName             = prompt("Digite o seu nome:") || "Anônimo";
    state.view.playerName.textContent   = state.values.playerName;
}

function setLevel(level){
    if(level > 3) return

    playSound('Blip_Select16');

    state.values.level                          = level;
    state.view.levelRadios[level - 1].checked   = true;
    state.values.startGameVelocity              = state.values.fixedGameVelocity / state.values.level;
}

function setVolume(volume){
    state.values.audioVolume        = volume;
    state.view.volumeRange.value    = volume;
    playSound('Pickup_Coin5');
}

function setDefaults(){
    setValues();
    setViews();
    setGameVelocity();
}

function init(){
    setPlayerName();

    addListenerHitBox();
    addListenersButtons();

    setLevel(1);
    setVolume(0.2);
}

init();