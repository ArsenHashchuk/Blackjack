let deck = [];
let dealerCards = [];
let playerCards = [];
let generalScorePlayer = 0;
let generalScoreDealer = 0;
let dealerHasRevealed = false;

const dealerScoreElement = document.getElementById("dealer-score");
const playerScoreElement = document.getElementById("player-score");
const dealerCardsElement = document.getElementById("dealer-cards");
const playerCardsElement = document.getElementById("player-cards");
const messageElement = document.getElementById("message");

document.getElementById("deal-button").addEventListener("click", startGame);
document.getElementById("hit-button").addEventListener("click", hitCard);
document.getElementById("stand-button").addEventListener("click", stand);
document.getElementById("reset-button").addEventListener("click", resetGame);

function startGame() {
  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [drawCard(), drawCard()];
  playerCards = [drawCard(), drawCard()];

  document.getElementById("hit-button").disabled = false;
  document.getElementById("stand-button").disabled = false;
  document.getElementById("deal-button").disabled = true;

  updateUI();
  checkForBlackjack();
}

function createDeck() {
  let deck = [];
  const suits = ["Hearts", "Diamonds", "Clubs", "Spades"]; // черва, бубна, хреста, піка
  const values = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "Jack",
    "Queen",
    "King",
    "Ace",
  ];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
      console.log(suit, value);
    }
  }
  return deck;
}

//Fisher–Yates shuffle
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function drawCard() {
  return deck.pop();
}

function calculateScore(cards) {
  let score = 0;
  let hasAce = false;

  for (let card of cards) {
    if (card.value === "ace") {
      hasAce = true;
      score += 11;
    } else if (["king", "queen", "jack"].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value);
    }
  }

  if (hasAce && score > 21) {
    score -= 10;
  }

  return score;
}

function updateUI() {
  dealerCardsElement.innerHTML = "";
  playerCardsElement.innerHTML = "";

  dealerCards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.className = "card";

    const img = document.createElement("img");

    if (index === 1 && !dealerHasRevealed) {
      img.src = `deck/back.png`;
    } else {
      img.src = `deck/${card.value.toLowerCase()}-of-${card.suit.toLowerCase()}.png`;
    }

    img.alt = `${card.value} of ${card.suit}`;
    img.className = "card-image";

    cardElement.appendChild(img);
    dealerCardsElement.appendChild(cardElement);
  });

  playerCards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.className = "card";

    const img = document.createElement("img");
    img.src = `deck/${card.value}-of-${card.suit.toLowerCase()}.png`;
    img.alt = `${card.value} of ${card.suit}`;
    img.className = "card-image";

    cardElement.appendChild(img);
    playerCardsElement.appendChild(cardElement);
  });

  dealerScoreElement.textContent = `Score: ${
    dealerHasRevealed ? calculateScore(dealerCards) : "?"
  }`;
  playerScoreElement.textContent = `Score: ${calculateScore(playerCards)}`;
}

function hitCard() {
  playerCards.push(drawCard());
  updateUI();
  if (calculateScore(playerCards) > 21) {
    messageElement.textContent = "You bust! Dealer wins!";
    generalScoreDealer++;

    updateGeneralScores();
    disableButtons();
    enableResetButton();
  }
}

function stand() {
  dealerHasRevealed = true;

  while (calculateScore(dealerCards) < 17) {
    dealerCards.push(drawCard());
  }

  updateUI();
  determineWinner();
}

function determineWinner() {
  const playerScore = calculateScore(playerCards);
  const dealerScore = calculateScore(dealerCards);

  if (dealerScore > 21 || playerScore > dealerScore) {
    messageElement.textContent = "You win!";
    generalScorePlayer++;
  } else if (playerScore === dealerScore) {
    messageElement.textContent = "It's a tie!";
    generalScorePlayer++;
    generalScoreDealer++;
  } else {
    messageElement.textContent = "Dealer wins!";
    generalScoreDealer++;
  }

  updateGeneralScores();
  disableButtons();
  enableResetButton();
}

function updateGeneralScores() {
  document.querySelector(".generalScorePlayer").textContent =
    generalScorePlayer;
  document.querySelector(".generalScoreDealer").textContent =
    generalScoreDealer;
}

function checkForBlackjack() {
  const playerScore = calculateScore(playerCards);
  const dealerScore = calculateScore(dealerCards);

  if (playerScore === 21) {
    messageElement.textContent = "Blackjack! You win!";
    generalScorePlayer++;
    updateGeneralScores();
    disableButtons();
    enableResetButton();
  } else if (dealerScore === 21) {
    messageElement.textContent = "Dealer has Blackjack! Dealer wins!";
    generalScoreDealer++;
    updateGeneralScores();
    disableButtons();
    enableResetButton();
  }
}

function disableButtons() {
  document.getElementById("hit-button").disabled = true;
  document.getElementById("stand-button").disabled = true;
}

function enableResetButton() {
  document.getElementById("reset-button").disabled = false;
}

function resetGame() {
  dealerCards = [];
  playerCards = [];
  messageElement.textContent = "";
  dealerHasRevealed = false;
  document.getElementById("deal-button").disabled = false;
  document.getElementById("reset-button").disabled = true;

  dealerScoreElement.textContent = "Score: 0";
  playerScoreElement.textContent = "Score: 0";

  dealerCardsElement.innerHTML = "";
  playerCardsElement.innerHTML = "";
}

//modals
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnOpenModal = document.querySelectorAll(".show-modal");

const closeModal = () => {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const openModal = () => {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

for (let i = 0; i < btnOpenModal.length; i++) {
  btnOpenModal[i].addEventListener("click", openModal);
}

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//add favicon
