
// 1. select all elements 

const playerScoreEl = document.querySelector("#player-score"); // "Player's score: "
const botScoreEl = document.querySelector("#bot-score"); // "Bot's score: "
const turnEl = document.querySelector("#turn");  // player's turn
const boardItems = document.querySelectorAll(".board-grid-items");
const modal = document.querySelector("#modal");
const modalMsg = document.querySelector("#modal-msg");
const actionButton = document.getElementById("modal-action");
const overlay = document.querySelector("#overlay");

actionButton.addEventListener("click", () => {
    const modal = document.getElementById("modal");
    modal.classList.toggle("hidden");
})


// 2. store turn, score , board into variables
let turn = 0;           // 0 => player , 1 => bot 
let score = [0, 0];     // [player,bot]
let board = ['','','','','','','','',''];

// function to check draw 
const isDraw = async () =>{
    for(let i=0;i<9;i++)
    {
        if(board[i] === '')
        {
            return false;
        }
    }
    return true; 
}

// FUNCTION to check a player with its letter has won?
const hasWon = async (code, board) => {
    const winCombinations = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7],
    ];

    let consecCount = 0;
    for (let i = 0; i < 8; i++) {
        consecCount = 0;
        for (let j = 0; j < 3; j++) {
            if (board[winCombinations[i][j] - 1] === code) { consecCount += 1; }
        }
        if (consecCount === 3) { return true; }
    }
    return false;
}

// Returns the index no at which CPU would enter its next move in board array
const CPU_MOVE = async (board) => {
    let cloneBoard = JSON.parse(JSON.stringify(board));
    const corners = [1, 3, 7, 9];
    // const center = 5;
    const mids = [2, 4, 6, 8];
    //  check a winning move 
    for (let i = 0; i < 9; i++) {
        if (cloneBoard[i] === '') {
            cloneBoard[i] = 'O';
            let wonTheGame = await hasWon('O', cloneBoard);

            if ( wonTheGame === true)
                return i; // actual index
            cloneBoard[i] = '';
        }
    }
    // stop opponent 
    for (let i = 0; i < 9; i++) {
        if (cloneBoard[i] === '') {
            cloneBoard[i] = 'X';
            let wonTheGame = await hasWon('X', cloneBoard);

            if ( wonTheGame === true)
                return i; // actual index
            cloneBoard[i] = '';
        }
    }
    
    // if center is free
    if (cloneBoard[4] === '')
    return 4; // actual index 

    // check corners and return a random one
    let freePlaces = []
    for(let i=0; i< 4; i++)
    {
        if(cloneBoard[ corners[i] - 1] === '')
            freePlaces.push( corners[i] );
    }
    if(freePlaces.length > 0)    
        return freePlaces[Math.floor( Math.random() * (freePlaces.length) )] - 1; // true index value of board (start form 0)
        
    // check for mids return a random
        freePlaces = [];
        for(let i=0;  i < 4; i++)
        {
            if(cloneBoard[ mids[i] - 1 ] === '')
            freePlaces.push( mids[i] );
            
        }
    if(freePlaces.length > 0)
        return freePlaces[Math.floor( Math.random() * (freePlaces.length) )] - 1; // true index value of board (start form 0)

}

// bot's move
const botMove = async ()=>{
    const move = await CPU_MOVE(board);
    const targetId = '#board-item-' + String(move + 1);
    const targetEl = document.querySelector(targetId);
    overlay.classList.remove("active");
    targetEl.click();
}

const restartGame = async () =>{
    playerScoreEl.innerText = "Player's score : " + score[0];
    botScoreEl.innerText = "Bot's score : " + score[1];
    boardItems.forEach(el => {
        el.innerHTML = "&nbsp";
    });
    turn = 0;
    board = ['','','','','','','','',''];
    actionButton.click();
    // if bot has to move first
    if(turn === 1) await botMove();
}

// 3. add event listener to each board item and based on turn enter X or O 
boardItems.forEach(el => {
    el.addEventListener('click', async (e) => {
        if(e.target.innerText === 'X' || e.target.innerText === 'O')
        {
            return;
        }
        if (turn === 0) {
            e.target.innerText = 'X';
            const index = e.target.id.slice(11);
            board[parseInt(index) - 1] = 'X';
            let Draw = await isDraw();
            if(Draw === true)
            {
                modalMsg.innerHTML = "<h1> It's a draw <br> you played well <br>🤜🤛💪 </h1>";
                actionButton.innerText = "Next Game"
                actionButton.click();
                actionButton.style.visibility = "hidden";
                setTimeout(restartGame, 4000);
                Draw = false;
                return;
            }
            let wonTheGame = await hasWon('X',board);
            if(wonTheGame === true)
            {
                score[0] += 1;
                modalMsg.innerHTML = "<h1> Congratualations! <br> You Won <br>🏆🎉✌🌟 </h1>";
                actionButton.click();
                actionButton.style.visibility = "hidden";
                setTimeout(restartGame, 4000);
                wonTheGame = false;
                return;
            }
            turn = 1;
            // Prevent user form doing by putting an overlay
            overlay.classList.toggle("active");
            // call the CPU_MOVE function and 
            let bove = await botMove();

        }    
        else if (turn === 1) {
            e.target.innerText = 'O';
            const index = e.target.id.slice(11);
            board[parseInt(index) - 1] = 'O';
            let Draw = await isDraw();
            if(Draw === true)
            {
                modalMsg.innerHTML = "<h1> It's a draw. You played well 🤜🤛💪 </h1>";
                actionButton.innerText = "Next Game"
                actionButton.click();
                actionButton.style.visibility = "hidden";
                setTimeout(restartGame, 4000);
                Draw = false;
                return;
            }
            let wonTheGame = await hasWon('O',board);
            if(wonTheGame === true)
            {
                score[1] += 1;
                modalMsg.innerHTML = "<h1> BOT has defeated you. Try again 👍👐 <br>You will be able to play game again in 4 sec </h1>";
                actionButton.click();
                actionButton.style.visibility = "hidden";
                setTimeout(restartGame, 4000);
                wonTheGame = false;
                return;
            }
            turn = 0;
        }    
    })    
});    
