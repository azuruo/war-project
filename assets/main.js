// Establish the deck
const suits = ["♠", "♥", "♦", "♣"];
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
const deck = [];

for (let suit of suits) {
    for (let value of values) {
        deck.push({ suit, value });
    }
}

// Function to shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j =Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}  


// function startGame()
//     shuffle both decks

// playBtn.addEventListener('click,', function()){
//     the game to start (startgame)
//     the start button to disappear
// }


