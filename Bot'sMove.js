
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

export {hasWon,CPU_MOVE};