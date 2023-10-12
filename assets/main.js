// Constants
const suits = ['♠', '♥', '♦', '♣'];
const values = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
];

// Game State Variables
let deck = [];
let player1Hand = [];
let player2Hand = [];
let roundsPlayed = 0;
let wars = 0;
let gameOver = false;
let gameStarted = false;

function initializeGame() {
  initDeck();
  shuffleDeck(deck);
  dealCards();
  updatePlayerDeckCounts();
}

document.addEventListener('DOMContentLoaded', (event) => {
  initializeGame();
  document.getElementById('playButton').addEventListener('click', playRound);
  document.getElementById('resetButton').addEventListener('click', resetGame);
});

// Initialize the deck
function initDeck() {
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
}

// Shuffle the deck
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Get numeric value of a card
function getValue(cardValue) {
  return values.indexOf(cardValue);
}

// Deal cards to players
function dealCards() {
  player1Hand = deck.filter((_, idx) => idx % 2 === 0);
  player2Hand = deck.filter((_, idx) => idx % 2 !== 0);
}

// Game utility functions
function disablePlayButton() {
  document.getElementById('playButton').disabled = true;
}

function displayWinner(message) {
  document.getElementById('display-winner').textContent = message;
}

function getCardColor(card) {
  return ['♠', '♣'].includes(card.suit) ? 'spade' : 'heart';
}

// War Logic

function handleConsecutiveWar(warPot) {
  // Add three more cards to the pot for each player
  for (let i = 0; i < 3; i++) {
    if (player1Hand.length > 0) warPot.push(player1Hand.shift());
    if (player2Hand.length > 0) warPot.push(player2Hand.shift());
  }

  const player1LastCard = warPot[warPot.length - 2];
  const player2LastCard = warPot[warPot.length - 1];

  if (getValue(player1LastCard.value) > getValue(player2LastCard.value)) {
    player1Hand = player1Hand.concat(warPot);
  } else if (
    getValue(player1LastCard.value) < getValue(player2LastCard.value)
  ) {
    player2Hand = player2Hand.concat(warPot);
  } else {
    handleConsecutiveWar(warPot);
  }
}

function initiateWar(player1InitialCard, player2InitialCard) {
  wars++;
  updateWarCount();

  let warPot = [player1InitialCard, player2InitialCard];
  while (true) {
    if (player1Hand.length < 4 || player2Hand.length < 4) {
      // A player cannot continue the war, so the other player wins
      if (player1Hand.length > player2Hand.length) {
        player1Hand = player1Hand.concat(warPot, player2Hand);
        player2Hand = [];
      } else {
        player2Hand = player2Hand.concat(warPot, player1Hand);
        player1Hand = [];
      }
      break;
    }

    // Draw three cards from each player into the pot
    for (let i = 0; i < 3; i++) {
      warPot.push(player1Hand.shift(), player2Hand.shift());
    }

    let playerOneCard = player1Hand.shift();
    let playerTwoCard = player2Hand.shift();
    warPot.push(playerOneCard, playerTwoCard);

    displayTopCards(playerOneCard, playerTwoCard);

    if (getValue(playerOneCard.value) > getValue(playerTwoCard.value)) {
      player1Hand = player1Hand.concat(warPot);
      break;
    } else if (getValue(playerOneCard.value) < getValue(playerTwoCard.value)) {
      player2Hand = player2Hand.concat(warPot);
      break;
    }
  }
}

function updateWarCount() {
  const warCountElement = document.getElementById('war-count');
  if (warCountElement) {
    warCountElement.textContent = `Wars Occurred: ${wars}`;
  }
}

function updatePlayerDeckCounts() {
  const player1DeckCountElement = document.querySelector('.player1-deck');
  const player2DeckCountElement = document.querySelector('.player2-deck');

  player1DeckCountElement.textContent = `Deck: ${player1Hand.length}`;
  player2DeckCountElement.textContent = `Deck: ${player2Hand.length}`;
}
function updateRoundsPlayed() {
  const roundsPlayedElement = document.getElementById('rounds-played');
  roundsPlayedElement.textContent = `Rounds Played: ${roundsPlayed}`;
}

function checkWinCondition() {
  if (player1Hand.length === 0) {
    gameOver = true;
    displayWinner('Player 2 wins!');
  } else if (player2Hand.length === 0) {
    gameOver = true;
    displayWinner('Player 1 wins!');
  }
}

function endGame() {
  if (player1Hand.length === 0) {
    alert('Player Two Wins!');
  } else if (player2Hand.length === 0) {
    alert('Player One Wins!');
  }
}

function displayTopCards(playerOneCard, playerTwoCard) {
  const player1HandDiv = document.querySelector('.player1-hand');
  const player2HandDiv = document.querySelector('.player2-hand');

  // Clear previously displayed cards
  player1HandDiv.innerHTML = '';
  player2HandDiv.innerHTML = '';

  const card1Element = createCardElement(playerOneCard);
  const card2Element = createCardElement(playerTwoCard);

  player1HandDiv.appendChild(card1Element);
  player2HandDiv.appendChild(card2Element);
}

function createCardElement(card) {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card', getCardColor(card));
  cardElement.textContent = `${card.value} ${card.suit}`;
  return cardElement;
}
// Main game logic
function playRound() {
  if (player1Hand.length === 0 || player2Hand.length === 0) {
    endGame();
    return;
  }

  let playerOneCard = player1Hand.shift();
  let playerTwoCard = player2Hand.shift();

  displayTopCards(playerOneCard, playerTwoCard);

  const playerOneCardValue = getValue(playerOneCard.value);
  const playerTwoCardValue = getValue(playerTwoCard.value);

  if (playerOneCardValue > playerTwoCardValue) {
    player1Hand.push(playerOneCard, playerTwoCard);
  } else if (playerOneCardValue < playerTwoCardValue) {
    player2Hand.push(playerTwoCard, playerOneCard);
  } else {
    initiateWar(playerOneCard, playerTwoCard);
  }
  roundsPlayed++;
  updatePlayerDeckCounts();
  updateRoundsPlayed();
  checkWinCondition();
}
// Reset Game
function resetGame() {
  deck = [];
  player1Hand = [];
  player2Hand = [];
  roundsPlayed = 0;
  wars = 0;
  gameOver = false;
  gameStarted = false;

  initDeck();
  shuffleDeck(deck);
  dealCards();
  document.getElementById('display-winner').textContent = '';
  document.getElementById('playButton').disabled = false;
}
