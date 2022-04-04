'use strict';

const message=document.querySelector('#message');
const panelControl= document.querySelector('#panel-control');
const panelGame=document.querySelector('#panel-game');
const btLevel=document.querySelector('#btLevel');
const btPlay=document.querySelector('#btPlay');
const gameStarted = panelControl.querySelectorAll('.gameStarted');
const pointsDom = document.querySelector('#points');
const labelGameTime = document.querySelector('#gameTime');
const btTop = document.getElementById("btTop");
const okTop = document.getElementById("okTop");
const timeOutGame=20;
let timer;
let timerID;
let timeOutGameID;
let  flippedCards = [];
let totalFlippedCards;
let totalPoints=0;
let cardsLogos= ['angular', 'bootstrap', 'html', 'javascript', 'vue', 'svelte', 'react', 'css', 'backbone', 'ember'];
let cards = document.querySelectorAll('.card');
let topGamers = [{
                Nickname: "Hugo", Points: 100
                },{
                Nickname: "Gil", Points: 99
                }];
                 
const dimTopGamers = () => { return Object.keys(topGamers).length };

(function getLocalStorage(){
    localStorage.getItem('Nickname');
    localStorage.getItem(topGamers);
})();

function reset()
{
    createPanelGame();
    panelGame.style.display = 'none';
    message.classList.remove('hide');
    
    gameStarted.forEach((escondido) =>{
            escondido.classList.add('hide');
    })
    
    if(btLevel.value == '0')
    {
        btPlay.disabled = true;
        panelGame.style.display = 'none';
        
    }
    else
    {
        btPlay.disabled = false; 
        panelGame.style.display = 'grid';
    }
    labelGameTime.removeAttribute('style');
}

function startGame()
{
    getTopPoints();
    totalPoints=0;
    btPlay.textContent = 'Stop Game';
    btLevel.disabled = true;
    flippedCards = new Array();
    totalFlippedCards=0;
    totalPoints=0;
    timer = timeOutGame;
    timerID = setInterval(updateGameTime, 1000);
    timeOutGameID = setTimeout(stopGame, timeOutGame * 1000);


    const elementos = panelControl.querySelectorAll(".gameStarted");
    elementos.forEach((elemento) =>{
        elemento.classList.remove('hide')
    })

    message.classList.add('hide');

    cards.forEach((card) =>{
        const randomNumber = Math.floor(Math.random() * cards.length) + 1;
        card.style.order = `${randomNumber}`;
    })

    shuffleArray(cardsLogos);

    let dim = (cards.length/2)-1;
    let indice = 0;

    cards.forEach((card, index) =>{

        const nomeCarta = cardsLogos[indice];
        card.dataset.logo = nomeCarta;
        card.querySelector("img.card-front").src=`images/${nomeCarta}.png`;
        if(indice === dim){
            indice = 0;
        }else{
            indice++;
        }

        card.addEventListener("click", function(e){
            flipCard(e.currentTarget);

        }, {once : true});

    })
}

function updateGameTime(){
    labelGameTime.textContent = timer;
    timer--;
    if(timer < 10)
        labelGameTime.style.backgroundColor = "red";
}

function gameOver(){return totalFlippedCards == cards.length;}

function checkPair(card){
    console.log("Checking pairs");
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];
    const card1Logo = card1.dataset.logo;
    const card2Logo = card2.dataset.logo;

    console.log(card1, card2);

    if(card1Logo === card2Logo){
        console.log("Pair found!");
        card1.classList.add("inative")
        card2.classList.add("inative")
        
        setTimeout(()=>{
            const card1Front = card1.querySelector(".card-front");
            const card2Front = card2.querySelector(".card-front");
            card1Front.classList.add("grayscale")
            card2Front.classList.add("grayscale")
            totalFlippedCards+=2;
            
            const isGameOver = gameOver();
            
            if(isGameOver==true)
                stopGame();
        },500);
        updatePoints("+");
    }else{
        setTimeout(()=>{
        console.log("Pair not found");
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1.addEventListener("click", () =>{
            flipCard(card1);
        },{once:true});
        card2.addEventListener("click", () =>{
            flipCard(card2);
        },{once:true});
        
        },500);
        updatePoints("-");
    }
    flippedCards=[];
}

function stopGame()
{
    btPlay.textContent = 'Start Game';
    btLevel.disabled = false;
    modalGameOver.style.display = 'block';
    clearInterval(timerID);
    clearTimeout(timeOutGameID);

   
    
    cards.forEach(card =>{
        card.classList.remove("flipped", "inative");
        const cardFront = card.querySelector(".card-front");
        cardFront.classList.remove("grayscale");
    })
    
    document.querySelector('#messageGameOver').textContent = "Points: " + totalPoints;
    checkTop10();
    pointsDom.textContent = totalPoints;
    flippedCards = [];
    reset();
}

function flipCard(card){
    card.classList.add("flipped");
    flippedCards.push(card);

    if(flippedCards.length == 2){
        checkPair(card);
    }
}

function updatePoints(operator){
    if(operator === "+")
    {
        totalPoints += (6-totalFlippedCards)*timer;
        pointsDom.textContent = totalPoints;  
    }
    else
    {
        if(totalPoints >= 5)
            totalPoints -= 5;
        else
            totalPoints = 0;
        pointsDom.textContent = totalPoints;
    }
}

function showCards(cards){
    cards.forEach((card) =>{
        card.classList.add("flipped");
    })
}

function createPanelGame(){
    panelGame.innerHTML = '';
    panelGame.className = '';
    let div = document.createElement('div');
    let imgBack = document.createElement('img');
    let imgFront = document.createElement('img');
    div.setAttribute('class', 'card');
    imgBack.setAttribute('src', 'images/ls.png');
    imgBack.setAttribute('class', 'card-back');
    imgFront.setAttribute('class', 'card-front');
    div.appendChild(imgBack);
    div.appendChild(imgFront); 

    if(btLevel.value == 1)
    {
        for(let i=0; i<6; i++)
            panelGame.appendChild(div.cloneNode(true));
    }

    if(btLevel.value == 2)
    {
        for(let i=0; i<12; i++)
            panelGame.appendChild(div.cloneNode(true));
        panelGame.classList.add('intermedio');
        
    }

    if(btLevel.value == 3)
    {
        for(let i=0; i<20; i++)
            panelGame.appendChild(div.cloneNode(true));
        panelGame.classList.add('avancado');
    }
    cards = panelGame.childNodes;

}

function getTop10(){
    const infoTop = document.getElementById("infoTop");
    infoTop.innerHTML = '';
    let div = document.createElement('div');
    let p_nickname = document.createElement('p');
    p_nickname.textContent = "Nickname";
    let p_points = document.createElement('p');
    p_points.textContent = "Points";
    div.appendChild(p_nickname);
    div.appendChild(p_points);

    infoTop.appendChild(div.cloneNode(true));

    topGamers.forEach(gamer =>{
        div.firstChild.textContent = gamer.Nickname;
        div.lastChild.textContent = gamer.Points;
        infoTop.appendChild(div.cloneNode(true));
    }); 
}

function getTopPoints(){
    const topPoints = document.getElementById("pointsTop");
    topPoints.textContent = topGamers[0].Points;
}

function getLastPoints(){
    return topGamers[dimTopGamers() - 1].Points;
}

function checkTop10(){
    let nick = document.getElementById("nickname");
    const dimeTopGamers = dimTopGamers();
    const lastGamerPoints = getLastPoints();
    nick.style.display = 'none';
    if( totalPoints > 0 && (dimeTopGamers < 10 || lastGamerPoints < totalPoints))
    {
        nick.style.display = 'block';
        document.getElementById("messageGameOver").innerHTML += "<br>Congrats! You entered in top10!";
    }
}

function saveTop10(){
    const nickname = document.getElementById("inputNick").value;
    localStorage.setItem('Nickname', nickname);
    const newPoints = {Nickname: nickname, Points: totalPoints};
    const dimeTopGamers = dimTopGamers();
    let userExists = false;
    topGamers.forEach((gamer,index) =>{
        if(gamer.Nickname === nickname){
            userExists = true;
            topGamers[index].Points = totalPoints;
        }
    
    })

    if(userExists === false){
        topGamers.push(newPoints);
    }

    topGamers.sort(function (a, b) { return b.Points - a.Points });

    if(dimeTopGamers > 10){
        topGamers.pop();
    }

    localStorage.setItem(topGamers, JSON.stringify({Nickname:nickname, Points: totalPoints}));
}



const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;  
    }
}

btLevel.addEventListener('change', () =>{
    reset();
});

btPlay.addEventListener('click', () => {
    if(btPlay.textContent == 'Stop Game')
        stopGame();
    else
        startGame();
});

btTop.addEventListener('click', ()=>{
    getTop10();
})


panelGame.addEventListener('click', function(){
    if(message.textContent === "")
        message.textContent = "Click in Start Game!";
    else
        message.textContent = "";
}) 

okTop.addEventListener('click', function(){
    saveTop10();
    modalGameOver.style.display = "none";
    reset();
})


cards.forEach(card =>{
    card.addEventListener('mouseover',()=>{
        card.classList.add("cardHover");
    })

    card.addEventListener('mouseout',()=>{
        card.classList.remove("cardHover");
    })
})

reset();