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

  const dealerFirstCard = dealerCardsElement.children[0].querySelector("img");
  dealerFirstCard.classList.add("fadeIn");
  dealerFirstCard.addEventListener("animationend", () => {
    dealerFirstCard.classList.remove("fadeIn");
  });

  const dealerSecondCard = dealerCardsElement.children[1].querySelector("img");
  dealerSecondCard.classList.add("fadeIn");
  dealerSecondCard.addEventListener("animationend", () => {
    dealerSecondCard.classList.remove("fadeIn");
  });

  // Animate player's first and second card
  const playerFirstCard = playerCardsElement.children[0].querySelector("img");
  playerFirstCard.classList.add("fadeIn");
  playerFirstCard.addEventListener("animationend", () => {
    playerFirstCard.classList.remove("fadeIn");
  });

  const playerSecondCard = playerCardsElement.children[1].querySelector("img");
  playerSecondCard.classList.add("fadeIn");
  playerSecondCard.addEventListener("animationend", () => {
    playerSecondCard.classList.remove("fadeIn");
  });

  checkForBlackjack();
}

function createDeck() {
  let deck = [];
  const suits = ["hearts", "diamonds", "clubs", "spades"]; // черва, бубна, хреста, піка
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
    "jack",
    "queen",
    "king",
    "ace",
  ];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
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
      img.src = `images/deck/back.png`;
    } else {
      img.src = `images/deck/${card.value.toLowerCase()}-of-${card.suit.toLowerCase()}.png`;
    }

    img.alt = `${card.value} of ${card.suit}`;
    img.className = "card-image";

    cardElement.appendChild(img);
    dealerCardsElement.appendChild(cardElement);
  });

  playerCards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.className = "card";

    const img = document.createElement("img");
    img.src = `images/deck/${card.value}-of-${card.suit.toLowerCase()}.png`;
    img.alt = `${card.value} of ${card.suit}`;
    img.className = "card-image";

    cardElement.appendChild(img);
    playerCardsElement.appendChild(cardElement);
  });

  dealerScoreElement.textContent = `Рахунок: ${
    dealerHasRevealed ? calculateScore(dealerCards) : "?"
  }`;
  playerScoreElement.textContent = `Рахунок: ${calculateScore(playerCards)}`;
}

function hitCard() {
  const newCard = drawCard();
  playerCards.push(newCard);
  updateUI();

  const newCardElement =
    playerCardsElement.lastElementChild.querySelector("img");
  newCardElement.classList.add("fadeIn");

  newCardElement.addEventListener("animationend", () => {
    newCardElement.classList.remove("fadeIn");
  });

  if (calculateScore(playerCards) > 21) {
    messageElement.textContent = "Ви перебрали! Дилер перемагає!";
    generalScoreDealer++;

    updateGeneralScores();
    disableButtons();
    enableResetButton();
  }
}

function stand() {
  dealerHasRevealed = true;

  let dealerCardIndex = 0;

  function revealDealerCard() {
    if (calculateScore(dealerCards) < 17) {
      const newDealerCard = drawCard();
      dealerCards.push(newDealerCard);
      updateUI();

      const newDealerCardElement =
        dealerCardsElement.lastElementChild.querySelector("img");
      newDealerCardElement.classList.add("fadeIn");

      newDealerCardElement.addEventListener("animationend", () => {
        newDealerCardElement.classList.remove("fadeIn");
      });

      dealerCardIndex++;
      setTimeout(revealDealerCard, 600);
    } else {
      updateUI();
      determineWinner();
    }
  }

  revealDealerCard();
}

function determineWinner() {
  const playerScore = calculateScore(playerCards);
  const dealerScore = calculateScore(dealerCards);

  if (dealerScore > 21 || playerScore > dealerScore) {
    messageElement.textContent = "Ви перемогли!";
    generalScorePlayer++;
  } else if (playerScore === dealerScore) {
    messageElement.textContent = "Нічия!";
    generalScoreDealer++;
  } else {
    messageElement.textContent = "Дилер переміг!";
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
    dealerHasRevealed = true;
    updateUI();
    messageElement.textContent = "Блекджек! Ви перемогли!";
    generalScorePlayer++;
    updateGeneralScores();
    disableButtons();
    enableResetButton();
  } else if (dealerScore === 21) {
    dealerHasRevealed = true;
    updateUI();
    messageElement.textContent = "У Дилера блекджек! Дилер переміг!";
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
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.add("fade-out");
    const cardImage = card.querySelector(".card-image");
    if (cardImage) {
      cardImage.classList.add("fade-out");
    }
  });

  setTimeout(() => {
    dealerCards = [];
    playerCards = [];
    messageElement.textContent = "";
    dealerHasRevealed = false;
    document.getElementById("deal-button").disabled = false;
    document.getElementById("reset-button").disabled = true;

    dealerScoreElement.textContent = "Рахунок: 0";
    playerScoreElement.textContent = "Рахунок: 0";

    dealerCardsElement.innerHTML = "";
    playerCardsElement.innerHTML = "";
  }, 500);
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

//audio
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPauseBtn");
const speakerIcon = document.getElementById("speakerIcon");
audio.volume = 0.07;

playPauseBtn.addEventListener("click", function () {
  if (audio.paused) {
    audio.play();
    speakerIcon.classList.remove("fa-volume-mute");
    speakerIcon.classList.add("fa-volume-up");
  } else {
    audio.pause();
    speakerIcon.classList.remove("fa-volume-up");
    speakerIcon.classList.add("fa-volume-mute");
  }
});
