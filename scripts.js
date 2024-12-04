document.addEventListener('DOMContentLoaded', () => {
  let masquer = localStorage.getItem('masquer') || 0; 
  const dialog = document.getElementById('main-dialog');
  const jamais = document.getElementById('jamais');

  if (masquer == 1) {
    dialog.remove(); //cache dialog si le boutton a été cliquer
  } else {
    dialog.showModal();//sinon l'Affiche
  }

  jamais.addEventListener('cliccck', () => {
    localStorage.setItem('masquer', 1);//met a 1 pour dire que le bouton jamais a été cliquer
    dialog.close(); 
  });
});





const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;


function flipCard() {
//appler ma fonction
premiereCarte();

  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
 resetBoard();

verifierFin();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];

  
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));







let timer = null;
let startTime = null;
let bestTime = localStorage.getItem('bestTime') || null; // charger le meilleur temps
let matchedPairs = 0;
let carteTrouver = 0;


//lance le chrono et le met a jour
function debutChrono() {
  startTime = Date.now();
  timer = setInterval(updateTimer, 100);//actualiser le chrono tout les 100ms
}



//arrete daccutaliser le chrono
function stopTimer() {
  clearInterval(timer);
}

function updateTimer() {
  const ecouler = ((Date.now() - startTime) / 1000).toFixed(1);//la date a laquel le timer a debuter - la date du moment = le temps ecouler
  document.getElementById('timer').textContent = `Temps : ${ecouler}s`;//met a jour affichage
}


function verifierRecord() {
  const ecouler = (Date.now() - startTime) / 1000;
  if (!bestTime || ecouler < bestTime) {
    bestTime = ecouler;
    localStorage.setItem('bestTime', bestTime);
    alert(`Nouveau meilleur temps : ${bestTime.toFixed(1)} secondes !`);
    displayBestTime();
  } else {
    alert(`Temps écoulé : ${ecouler.toFixed(1)} secondes. Meilleur temps : ${bestTime.toFixed(1)} secondes.`);
  }
  
}

function displayBestTime() {
  const recordAffichage = bestTime ? `Meilleur temps : ${bestTime}s` : "Aucun record.";
  document.getElementById('best-time').textContent = recordAffichage;
}

// pour detecter la fin du jeu selon nombre de carte trouver
function verifierFin() {
  carteTrouver++;
  if (carteTrouver == 6) {
    stopTimer();
    verifierRecord();
  } 
}

// pour detecter le debut du jeu si le timer n'est pas partie et que une carte a été tourner
function premiereCarte() {
    if (!timer) {
      debutChrono();
    }
}

window.addEventListener('load', displayBestTime);//affiche le record au chargemnt de la page