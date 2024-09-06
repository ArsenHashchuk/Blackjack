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

  updateUI(); // Update the UI first to render cards

  // Animate dealer's first and second card
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
    img.className = "card-image"; // Removed the fadeIn class here for now

    cardElement.appendChild(img);
    dealerCardsElement.appendChild(cardElement);
  });

  playerCards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.className = "card";

    const img = document.createElement("img");
    img.src = `deck/${card.value}-of-${card.suit.toLowerCase()}.png`;
    img.alt = `${card.value} of ${card.suit}`;
    img.className = "card-image"; // Removed the fadeIn class here for now

    cardElement.appendChild(img);
    playerCardsElement.appendChild(cardElement);
  });

  dealerScoreElement.textContent = `Score: ${
    dealerHasRevealed ? calculateScore(dealerCards) : "?"
  }`;
  playerScoreElement.textContent = `Score: ${calculateScore(playerCards)}`;
}

function hitCard() {
  const newCard = drawCard(); // Draw a new card
  playerCards.push(newCard);
  updateUI();

  // Apply fadeIn animation to the newly drawn card
  const newCardElement =
    playerCardsElement.lastElementChild.querySelector("img");
  newCardElement.classList.add("fadeIn");

  // Remove the animation class after the animation ends
  newCardElement.addEventListener("animationend", () => {
    newCardElement.classList.remove("fadeIn");
  });

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

  let dealerCardIndex = 0;

  function revealDealerCard() {
    if (calculateScore(dealerCards) < 17) {
      const newDealerCard = drawCard();
      dealerCards.push(newDealerCard);
      updateUI();

      // Apply fadeIn animation to the newly drawn dealer card
      const newDealerCardElement =
        dealerCardsElement.lastElementChild.querySelector("img");
      newDealerCardElement.classList.add("fadeIn");

      // Remove the animation class after the animation ends
      newDealerCardElement.addEventListener("animationend", () => {
        newDealerCardElement.classList.remove("fadeIn");
      });

      // Set a timeout to reveal the next card after this one has faded in
      dealerCardIndex++;
      setTimeout(revealDealerCard, 600); // 600ms is the length of the fade-in animation
    } else {
      updateUI(); // After all cards are drawn, update the UI
      determineWinner(); // Determine the winner once all cards are dealt
    }
  }

  revealDealerCard(); // Start the process of revealing dealer cards one by one
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
  // Add fadeOut effect to both card and card-image
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.add("fade-out");
    const cardImage = card.querySelector(".card-image");
    if (cardImage) {
      cardImage.classList.add("fade-out");
    }
  });

  // Wait for fade-out to complete before clearing the cards
  setTimeout(() => {
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
  }, 500); // 500ms to match the fadeOut animation duration
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
//add audio
//add animations
//add timer
