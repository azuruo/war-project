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

// Function to deal cards to two players in alternating pattern
const player1Hand = [];
const player2Hand = [];

for (let i = 0; i < deck.length; i++) {
  if (i % 2 === 0) {
    player1Hand.push(deck[i]);
  } else {
    player2Hand.push(deck[i]);
  }
}

let roundsPlayed = 0;
let wars = 0;
let gameOver = false;

// Play a round
function playRound() {
  if (gameOver) {
    return;
  }

  const player1Card = player1Hand.shift();
  const player2Card = player2Hand.shift();

  // Comparing card values to determine round winner
  function compareCards(player1Card, player2Card) {
    if (player1Card.value > player2Card.value) {
      player1Hand.push(player1Card, player2Card);
    } else if (player1Card.value < player2Card.value) {
      player2Hand.push(player1Card, player2Card);
    } else {
      initiateWar(player1Card, player2Card);
    }
  }
  compareCards(player1Card, player2Card);

  roundsPlayed++;

  updateGameState();
  checkWinCondition();

  // Display the game state
  // ...
}

// Check win condition
function checkWinCondition() {
  if (player1Hand.length === 0) {
    gameOver = true;
    const displayWinner = document.getElementById('displayWinner');
    displayWinner.textContent = 'You win!';
  } else if (player2Hand.length === 0) {
    gameOver = true;
    const displayWinner = document.getElementById('displayWinner');
    displayWinner.textContent = 'CPU wins!';
  }
}

// Handle the "war" scenario
function initiateWar() {
  wars++;
  const warPot = [player1FaceUpCard, player2FaceUpCard];

  for (let i = 0; i < 3; i++) {
    [player1Hand, player2Hand].forEach((playerHand, index) => {
      if (playerHand.length > 0) {
        const card = playerHand.shift();
        warPot.push(card);
        warPot.push(playerHand.shift());
      }
    });
  }

  return warPot;
}

// Display game state
function displayGameState() {
  // Update player hands
  const player1HandElement = document.getElementById('playerhand');
  const player2HandElement = document.getElementById('cpuhand');

  player1HandElement.innerHTML = ''; // Clear the previous content
  player2HandElement.innerHTML = ''; // Clear the previous content

  for (const card of player1Hand) {
    const cardElement = document.createElement('div');
    cardElement.textContent = `${card.value}${card.suit}`;
    player1HandElement.appendChild(cardElement);
  }

  for (const card of player2Hand) {
    const cardElement = document.createElement('div');
    cardElement.textContent = `${card.value}${card.suit}`;
    player2HandElement.appendChild(cardElement);
  }

  // Update rounds played
  const roundsPlayedElement = document.getElementById('roundsPlayed');
  roundsPlayedElement.textContent = `Rounds Played: ${roundsPlayed}`;
}

// Initialize the game
const playButton = document.getElementById('playButton');
playButton.addEventListener('click', playRound);
