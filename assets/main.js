// Establish the deck
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
const deck = [];

for (let suit of suits) {
  for (let value of values) {
    deck.push({ suit, value });
  }
}

// Function to shuffle the deck
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Function to extract the numeric value from a card's value
function getValue(cardValue) {
  // Assuming 'A' is the highest value, and '2' is the lowest
  const valueOrder = [
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
  return valueOrder.indexOf(cardValue);
}

// Function to deal cards to two players in alternating pattern
const player1Hand = [];
const player2Hand = [];

function dealCards() {
  for (let i = 0; i < deck.length; i++) {
    if (i % 2 === 0) {
      player1Hand.push(deck[i]);
    } else {
      player2Hand.push(deck[i]);
    }
  }
  updatePlayerDeckCounts();
}
let roundsPlayed = 0;
let wars = 0;
let gameOver = false;

// Update deck counts after each round
function updatePlayerDeckCounts() {
  const player1DeckCountElement = document.querySelector('.player1-deck');
  const player2DeckCountElement = document.querySelector('.player2-deck');

  player1DeckCountElement.textContent = `Deck: ${player1Hand.length}`;
  player2DeckCountElement.textContent = `Deck: ${player2Hand.length}`;
}

// Update round count
function updateRoundsPlayed() {
  const roundsPlayedElement = document.getElementById('rounds-played');
  roundsPlayedElement.textContent = `Rounds Played: ${roundsPlayed}`;
}
// Update war count
function updateWarsCount() {
  const warsCountElement = document.getElementById('wars-count');
  warsCountElement.textContent = `Wars: ${wars}`;
}

// Play a round
let gameStarted = false;

function playRound() {
  if (player1Deck.length === 0 || player2Deck.length === 0) {
    endGame();
    return;
  }

  let playerOneCard = player1Deck.shift();
  let playerTwoCard = player2Deck.shift();

  if (playerOneCard > playerTwoCard) {
    player1Deck.push(playerOneCard, playerTwoCard);
  } else if (playerOneCard < playerTwoCard) {
    player2Deck.push(playerTwoCard, playerOneCard);
  } else {
    // War scenario
    let warCardsOne = [playerOneCard];
    let warCardsTwo = [playerTwoCard];

    let war = true;
    while (war && player1Deck.length >= 4 && player2Deck.length >= 4) {
      for (let i = 0; i < 4; i++) {
        warCardsOne.push(player1Deck.shift());
        warCardsTwo.push(player2Deck.shift());
      }
      let cardOne = warCardsOne[warCardsOne.length - 1];
      let cardTwo = warCardsTwo[warCardsTwo.length - 1];

      if (cardOne > cardTwo) {
        player1Deck = player2Deck.concat(warCardsOne, warCardsTwo);
        war = false;
      } else if (cardOne < cardTwo) {
        player2Deck = player2Deck.concat(warCardsTwo, warCardsOne);
        war = false;
      }
      // If it's still a tie, the loop continues, and another war is initiated.
    }

    // If a player doesn't have enough cards for a war, they lose
    if (player1Deck.length < 4 || player2Deck.length < 4) {
      endGame();
      return;
    }
  }

  updateDeckCounts();
}

function endGame() {
  if (playerOneDeck.length === 0) {
    alert('Player Two Wins!');
  } else if (playerTwoDeck.length === 0) {
    alert('Player One Wins!');
  }
}

function displayWinner(message) {
  const winnerElement = document.getElementById('winner-display');
  if (winnerElement) {
    winnerElement.textContent = message;
  }
}

// Check win condition
function checkWinCondition() {
  if (player1Hand.length === 0) {
    gameOver = true;
    displayWinner('Player 2 wins!');
    disablePlayButton();
  } else if (player2Hand.length === 0) {
    gameOver = true;
    displayWinner('Player 1 wins!');
    disablePlayButton();
  }
}
function disablePlayButton() {
  const playButton = document.getElementById('playButton');
  playButton.disabled = true;
}

function initiateWar(player1InitialCard, player2InitialCard) {
  wars++;
  const warPot = [player1InitialCard, player2InitialCard];
  // Display the initial state of war
  displayGameState();
  player1WarCard.classList.add('shake');
  player2WarCard.classList.add('shake');

  if (!addToWarPot(warPot)) return;

  // Determine the winner of the war based on the highest card in the warPot
  const warWinner = determineWarWinner(warPot);

  // Award the warPot to the winner
  awardWarPot(warWinner, warPot);

  // Update the game state display
  updateWarsCount();
  updatePlayerDeckCounts();
  displayGameState();
}

function addToWarPot(warPot) {
  for (let i = 0; i < 3; i++) {
    const player1NextCard = player1Hand.length > 0 ? player1Hand.shift() : null;
    const player2NextCard = player2Hand.length > 0 ? player2Hand.shift() : null;

    if (!resolveEmptyHands(player1NextCard, player2NextCard)) return false;

    if (player1NextCard) warPot.push(player1NextCard);
    if (player2NextCard) warPot.push(player2NextCard);
    displayGameState();
  }
  return true;
}

function resolveEmptyHands(player1Card, player2Card) {
  if (!player1Card || !player2Card) {
    gameOver = true;
    displayWinner(!player1Card ? 'Player 2 wins!' : 'Player 1 wins!');
    disablePlayButton();
    return false;
  }
  return true;
}

function awardWarPot(winner, warPot) {
  if (winner === 'Player 1') {
    player1Hand.push(...warPot);
  } else if (winner === 'Player 2') {
    player2Hand.push(...warPot);
  }
}

// Function to determine the winner of a war based on card values
function determineWarWinner(warPot) {
  const player1LastCardValue = getValue(warPot[warPot.length - 2].value);
  const player2LastCardValue = getValue(warPot[warPot.length - 1].value);

  if (player1CardValue > player2CardValue) {
    return 'Player 1';
  } else if (player2CardValue > player1CardValue) {
    return 'Player 2';
  } else {
    return 'Tie';
  }
}
// Display game state
function displayGameState() {
  // Update player hands
  const player1HandElement = document.querySelector('.player1-hand');
  const player2HandElement = document.querySelector('.player2-hand');

  player1HandElement.innerHTML = '';
  player2HandElement.innerHTML = '';

  // Display only the top card of player's hand
  if (player1Hand.length > 0) {
    const cardElement = document.createElement('div');
    cardElement.textContent = `${player1Hand[0].value}${player1Hand[0].suit}`;
    player1HandElement.appendChild(cardElement);
  }

  if (player2Hand.length > 0) {
    const cardElement = document.createElement('div');
    cardElement.textContent = `${player2Hand[0].value}${player2Hand[0].suit}`;
    player2HandElement.appendChild(cardElement);
  }
  // Clear the game board
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';

  // If there's a war, display the war cards
  function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.className = `card ${getCardColor(card)}`;
    cardElement.textContent = `${card.value}${card.suit}`;
    return cardElement;
  }

  if (wars > 0) {
    const warIndicator = document.createElement('div');
    warIndicator.textContent = 'WAR!';
    warIndicator.style.fontSize = '32px';
    warIndicator.style.color = 'red';
    gameBoard.appendChild(warIndicator);

    const player1WarCard = createCardElement(player1Hand[0]);
    gameBoard.appendChild(player1WarCard);

    const player2WarCard = createCardElement(player2Hand[0]);
    gameBoard.appendChild(player2WarCard);
  }
}
// Utility function to get card color based on its suit
function getCardColor(card) {
  if (card.suit === '♠' || card.suit === '♣') return 'spade';
  if (card.suit === '♥' || card.suit === '♦') return 'heart';
  return '';
}
// Update the deck count for each player
const player1DeckCountElement = document.querySelector('.player1-deck');
const player2DeckCountElement = document.querySelector('.player2-deck');
player1DeckCountElement.textContent = `Deck: ${player1Hand.length}`;
player2DeckCountElement.textContent = `Deck: ${player2Hand.length}`;

// Update rounds played
const roundsPlayedElement = document.querySelector('#rounds-played');
roundsPlayedElement.textContent = `Rounds Played: ${roundsPlayed}`;

// Initialize the game
const playButton = document.getElementById('playButton');
playButton.addEventListener('click', playRound);

// Reset Game

function resetGame() {
  // Reset variables
  player1Hand.length = 0;
  player2Hand.length = 0;
  roundsPlayed = 0;
  wars = 0;
  gameOver = false;
  gameStarted = false;

  // Reinitialize the deck and game view
  shuffleDeck(deck);
  dealCards();
  updatePlayerDeckCounts();
  updateRoundsPlayed();
  document.getElementById('winner-display').textContent = '';

  // Enable the play button
  document.getElementById('playButton').disabled = false;
}
