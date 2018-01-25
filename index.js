var aliensHeadCount = 0;
var cycleNumber = 2;
var gameRounds = 1;
var gameRoundLength = 7000;
var id = 0;
var idmaker;
var score = 0;
var died = false;
let countingClock;
let clockSeconds = 00;
let clockMinutes = 00;
var mobile = false;
const clock = document.getElementById("clock");
var mobileSpawnHeight = 93;

window.onorientationchange = function() { window.location.reload(); };
window.addEventListener("resize", function(event) {
    if (document.body.offsetWidth > 600) {
        document.getElementsByClassName("wrapper")[0].style.height = "100vh";
    }
    if (died == false) {
        widthFix();
    }
});
//

function loadGame() {
    var startContainer = document.getElementsByClassName("starting-element-container")[0];
    startContainer.style.display = 'none';
    mobileIdentifyier();
    gameStart();
}

function widthFix() {
    mobileIdentifyier();
    var parent = document.getElementById("area");
    children = document.getElementsByClassName("detect-this");
    childrenN = children.length;
    for (var i = 0; i < childrenN; i++) {
        parent.removeChild(children[0]);
    }
    for (var j = 0; j < aliensHeadCount; j++) {
        spawnAlien();
    }
}

function mobileIdentifyier() {
    if (document.body.offsetWidth < 601) {
        mobile = true;
        var sheet = window.document.styleSheets[1];
        var rule;
        if (navigator.userAgent.search("Chrome") != -1) {
            var agent = navigator.userAgent;
            agent = agent.slice(agent.search("Chrome"), agent.search("Safari"));
            if (agent.search("Mobile") > 0) {
                document.getElementsByClassName("wrapper")[0].style.height = "92vh";
            }
        }
    } else {
        mobile = false;
    }
}

function gameStart() {
    countingClock = setInterval(gameClock, 1000);
    clock.innerHTML = "00:00";
    cycle();
    var timer = setInterval(function(){
        died = gameCheck();
        if (died) {
            clearInterval(timer);
            gameFinish();
        } else {
            cycle();
            roundSetter();
        } }, gameRoundLength);
}

function gameCheck() {
    if (aliensHeadCount == 0) {
        return false;
    } else {
        return true;
    }
}

function roundSetter() {
    var roundbox = document.getElementById('level-count');
    gameRounds++;
    roundbox.innerHTML = `Level: <b>${gameRounds}</b>`;
    roundbox.classList.add("scaleAnimation");
    setTimeout(function(){ roundbox.classList.remove("scaleAnimation");}, 102);
}

// ADD CORRECT NUMBER OF ALIENS
function cycle() {
    cycleNumber += 1;
    aliensHeadCount += cycleNumber;
    for (var i = 0; i < cycleNumber; i++) {
        spawnAlien();
    }
}

function spawnAlien() {
    var area = document.getElementById("area");
    var alienNumber = Math.floor((Math.random() * 10) + 1); // 1 to 10
    var alienPath = "img/space/invader"+alienNumber+".png";
    var top = positionRandomizer(0);
    var left = positionRandomizer(1);
    birthAlien(alienPath, top, left);
    idmaker = "a" + id;
    boxidmaker = "b" + id;
    document.getElementById(idmaker).classList.add("visible");
    document.getElementById(boxidmaker).classList.add("visible");
    alienMovement(idmaker, top, left);
    id += 1;
}

function positionRandomizer(identifyier) {
    var output = Math.floor((Math.random() * 100) + 1);
    // first if checks if the website is on a mobile device
    if (mobile) {
        if (identifyier == 0) {
            while (16 > output || output > mobileSpawnHeight) {
                output = Math.floor((Math.random() * 100) + 1);
            }
        } else {
            while (output > 92) {
                output = Math.floor((Math.random() * 100) + 1);
            }
        }
        //the following is for desktops
    } else {
        if (identifyier == 0) {
            while (output > 91) {
                output = Math.floor((Math.random() * 100) + 1);
            }
        } else {
            while (26 > output || output > 70) {
                output = Math.floor((Math.random() * 100) + 1);
            }
        }
    }
    return output;
}

function birthAlien(alienPath, top, left) {
    var box = document.createElement("div");
    box.setAttribute('id', "b" + id);
    box.setAttribute('class', "detect-this");
    area.appendChild(box);
    var alien = document.createElement("img");
    alien.setAttribute('class', 'alien');
    alien.setAttribute('style', 'top: '+ top + '%; left: '+left+'%;');
    alien.setAttribute('onclick', 'deleteAlien(this)');
    alien.setAttribute('src', alienPath);
    alien.setAttribute('id', "a" + id);
    box.appendChild(alien);
}

function alienMovement(idmaker, top, left) {
    var movingAlien = document.getElementById(idmaker);
    var topNew = positionRandomizer(0);
    var leftNew = positionRandomizer(1);
    var mover = setInterval(function(){
        setTimeout(function(){clearTimeout(mover);},7000);
        if (top != topNew || left != leftNew) {
            if (top != topNew) {
                if (top > topNew) {
                    top = (top * 100 - 1) / 100;
                    top = Math.round((top + 0.00001) * 100) / 100;
                    movingAlien.style.top = top + "%";
                } else {
                    top = (top * 100 + 1) / 100;
                    top = Math.round((top + 0.00001) * 100) / 100;
                    movingAlien.style.top = top + "%";
                }
            }
            if (left != leftNew) {
                if (left > leftNew) {
                    left = (left * 100 - 1) / 100;
                    left = Math.round((left + 0.00001) * 100) / 100;
                    movingAlien.style.left = left + "%";
                } else {
                    left = (left * 100 + 1) / 100;
                    left = Math.round((left + 0.00001) * 100) / 100;
                    movingAlien.style.left = left + "%";
                }
            }
        } else {
            topNew = positionRandomizer(0);
            leftNew = positionRandomizer(1);
        }
    }, 2);
}

// ALIEN FUNCTION

function deleteAlien(alien) {
    aliensHeadCount -= 1;
    score += Math.floor( (10*Math.pow( gameRounds,1.01) ) / 3 + Math.random() );
    dyingAnimation(alien);
    document.getElementById('score').innerHTML = `Score: <b>${score}</b>`;
    document.getElementById('score').classList.add("scaleAnimation");
    setTimeout(function(){ document.getElementById('score').classList.remove("scaleAnimation");}, 102);
    return;
}

function dyingAnimation(alien) {
    alien.classList.add("deathAnimation");
    var box = document.getElementById("b" + alien.id.slice(1))
    var circle = document.createElement("div");
    circle.setAttribute('class', "deathCircle");
    circle.setAttribute('style', 'top: '+ alien.style.top + '; left: ' + alien.style.left + ';');
    box.appendChild(circle);
    setTimeout(function(){ var parent = document.getElementById("area"); parent.removeChild(box); }, 200);
    return;
}

function gameFinish() {
    died = true;
    clearTimeout(countingClock);

    var parent = document.getElementById("area");
    children = document.getElementsByClassName("detect-this");
    childrenN = children.length;
    for (var i = 0; i < childrenN; i++) {
        parent.removeChild(children[0]);
    }
    document.getElementById("score").innerHTML = `<i> &nbsp;DIED</i> <br><br> Score: <b>${score}</b>`;
    displayEndscreen();
}

function displayEndscreen() {
    var area = document.getElementById("area");
    var endtext = document.createElement("div");
    endtext.setAttribute('class', 'endtext');
    area.appendChild(endtext);
    document.getElementsByClassName("endtext")[0].innerHTML = `Thank you for playing! Try again:<br>`;
    var endbutton = document.createElement("button");
    endbutton.setAttribute('class', 'endbutton');
    endbutton.setAttribute('onclick', 'newGameInitiator()');
    endtext.appendChild(endbutton);
    document.getElementsByClassName("endbutton")[0].innerHTML = `New Game`;
}

function newGameInitiator() {
    resetGlobalVariables();
    mobileIdentifyier();
    var parent = document.getElementById("area");
    child = document.getElementsByClassName("endtext");
    parent.removeChild(child[0]);
    document.getElementById('score').innerHTML = `Score: <b>${score}</b>`;
    document.getElementById('level-count').innerHTML = `Level: <b>${gameRounds}</b>`;
    gameStart();
}

function resetGlobalVariables() {
    aliensHeadCount = 0;
    cycleNumber = 2;
    gameRounds = 1;
    id = 0;
    score = 0;
    died = false;
    clockSeconds = 00;
    clockMinutes = 00;
}

// CLOCK FUNCTION
function gameClock() {
    clockSeconds++;

    if (clockMinutes < 10 && clockSeconds < 10) {
        clock.innerHTML = `0${clockMinutes}:0${clockSeconds}`;
    }
    else if (clockMinutes > 9 && clockSeconds < 10) {
        clock.innerHTML = `${clockMinutes}:0${clockSeconds}`;
    }
    else if (clockMinutes < 10 && clockSeconds > 9) {
        clock.innerHTML = `0${clockMinutes}:${clockSeconds}`;
    }
    else {
        clock.innerHTML = `${clockMinutes}:${clockSeconds}`;
    }
    if (clockSeconds > 59) {
        clockMinutes++;
        clockSeconds = 0;
    }
    clock.classList.add("scaleAnimation");
    setTimeout(function(){ clock.classList.remove("scaleAnimation");}, 102);
}
