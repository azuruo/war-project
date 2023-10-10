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

// Deal function


// Round logic function



// War Scenario:
// If there's a tie in rank:
//     Each player places three cards face down (as a "pot").
//     Each player then places one card face up.
//     Compare the face-up cards, and the player with the higher-ranked card wins all the cards in the "pot" and adds them to their hand.
//     Continue this process until one player wins the war and takes all the cards.

// Check Win Condition:

//     After each round, check if one player has all the cards. If so, declare that player as the winner, and end the game.

// Display Game State:

//     Continuously update and display the game state, showing each player's hand and the cards played in the current round.

// User Interaction:

//     Implement user interface elements for players to start the game, see the current state, and interact with the game 
// (e.g., clicking a "Play" button to play a round).
// playBtn.addEventListener('click,', function()){
//     the game to start (startgame)
//     the start button to disappear
// }

// End Game:

//     Once the game is over, display the winner and allow the option to restart or quit the game.

// Error Handling:

//     Implement error handling for edge cases, such as attempting to play when there are not enough cards left for a war.

// Randomness:

//     Ensure that the game uses proper randomness for shuffling and selecting cards.



