const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let matches = 0;
let score = 0;

// Link the sound file here
const flipSound = new Audio('/sounds/uwu.mp3');
const matchSound = new Audio('/sounds/match.mp3');
const gameEndSound = new Audio('/sounds/finish.mp3');
const wrongPairSound = new Audio('/sounds/wrong.mp3');

flipSound.loop = false;
matchSound.loop = false;
wrongPairSound.loop = false;
gameEndSound.loop = false;

document.querySelector(".score").textContent = score;

fetch("/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  // Play the sound effect when a card is clicked
  flipSound.play();

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
matchSound.play();
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  matches++;
  checkForGameEnd()
  resetBoard();
}
function checkForGameEnd() {
    if (matches === cards.length / 2) {
      // Play the game end sound when all cards are matched
      gameEndSound.play();
      alert("Game Over! You've matched all cards!"); // Optional: show an alert or message
    }
  }

function unflipCards() {
    wrongPairSound.play();
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

function restart() {
    matches = 0;  // Reset the match count
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
}
