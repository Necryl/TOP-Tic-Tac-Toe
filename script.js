// elements
const playerFormElements = document.querySelectorAll('.configure-player');
const playBtnElement = document.querySelector('.playBtn');
const numOfRoundsInputElement = document.querySelector('#roundNumInput');
const homeElement = document.querySelector('.home');
const arenaElement = document.querySelector('.arena');
const statNameElements = document.querySelectorAll('.stats h3');
const statPicElements = document.querySelectorAll('.stats img');
const statWinElements = document.querySelectorAll('.stats p');
const statWaitElements = document.querySelectorAll('.stats span');
const resetBtnElement = document.querySelector('.resetBtn');
const menuBtnElement = document.querySelector('.menuBtn');
const picGalleryWrapperElement = document.querySelector('.pic-gallery-wrapper');
const picGalleryElement = document.querySelector('.pic-gallery');
let picGalleryImgElements;
const closeBtnElement = document.querySelector('.closeBtn');
const headerElement = document.querySelector('.heading');
const playAgainBtnElement = document.querySelector('.playAgainBtn');
// capture tiles
const tileElements = (() => {
    let result = [];

    document.querySelectorAll('.tile').forEach((tile) => {
        result[tile.getAttribute('data-index')-1] = tile;
    });

    return result;
})()
// capture strike elements
const strikeElements = (() => {
    let result = [];

    document.querySelectorAll('.strike').forEach((strike) => {
        result[strike.getAttribute('data-index')-1] = strike;
    });

    return result;
})()


// variables
const alphabets = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const avatarPics = ['profilePicM1.svg', 'profilePicM2.svg', 'profilePicM3.svg', 'profilePicF1.svg', 'profilePicF2.svg', 'profilePicF3.svg']
let player1;
let player2;
let selectAvatar;
let numOfPlayers = 0;
let resetBtnToggleStates = ['none', 'initial'];
let gameStatus=false;


// events
playBtnElement.addEventListener('click', event => {
    engine.play();
});
numOfRoundsInputElement.addEventListener('input', event => {
    if (event.target.value == 0) {
        event.target.value = '';
    } else if (String(event.target.value)[0] == 0) {
        event.target.value *= 1;
    }
});
numOfRoundsInputElement.addEventListener('focusout', event => {
    if (event.target.value < 1) {
        event.target.value = 1;
    }
});
closeBtnElement.addEventListener('click', event => {
    picGalleryWrapperElement.style.display = 'none';
});
menuBtnElement.addEventListener('click', event => {
    engine.menuEventFunc();
});
resetBtnElement.addEventListener('click', event => {
    engine.game.round.start();
});
playAgainBtnElement.addEventListener('click', event => {
    engine.playAgain();
});


// ensuring compatibility
Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" && 
           isFinite(value) && 
           Math.floor(value) === value;
};


// tool functions
function removeTextNodes (nodeList) {
    return [...nodeList].reduce((result, element) => {
        if (element.nodeName !== '#text') {
            result.push(element);
        }
        return result;
    }, []);
}

function randomBotName() {
    result = '';
    for (let i = 0; i < (Math.floor(Math.random() * 2) + 1); i++) {
        result += alphabets[Math.floor(Math.random() * alphabets.length)];
    }
    result += '-';
    for (let i = 0; i < (Math.floor(Math.random() * 2) + 2); i++) {
        if (i === 0) {
            result += Math.floor(Math.random() * 9) + 1;
        } else {
            result += Math.floor(Math.random() * 10);
        }
    }
    return result;
}

function players() {
    return [player1, player2];
}

function createElement(tag, attributes={}, text=undefined) {
    result = document.createElement(tag);
    Object.entries(attributes).forEach(entry => {
        result.setAttribute(`${entry[0]}`, `${entry[1]}`);
    })
    if (text !== undefined) {
        result.textContent = text;
    }
    return result;
}

function compareAsEqual(item1, item2, item3) {
    let result = true;
    [...arguments].reduce((item, nextItem) => {
        if (item !== nextItem || item === null) {
            result = false;
        }
        item = nextItem;
        return item;
    });
    return result;
}

function getArrayItems(source) { // returns items from source in a new array based on specified indexes
    let result = [];
    for (let i = 1; i < arguments.length; i++) {
        result.push(source[arguments[i]]);
    }
    return result;
}

function randomNum(max=undefined, min=0) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delay(ms) {return new Promise(resolve => setTimeout(resolve, ms))}; // this function only works inside an async function with the await keyword

// engine
let engine = (() => {

    // factory functions
    function initiatePlayer (playerFormElem) {
        playerFormElem = removeTextNodes(playerFormElem.childNodes)
    
        numOfPlayers++
        let num = numOfPlayers;
        
        let humanFormElem = playerFormElem[1];
        let aiFormElem = playerFormElem[2];
    
        let playerTypeElem = removeTextNodes(playerFormElem[0].childNodes)[0];
        let avatarElem = removeTextNodes(removeTextNodes(removeTextNodes(humanFormElem.childNodes))[0].childNodes)[0];
        let nameElem = removeTextNodes(removeTextNodes(humanFormElem.childNodes)[1].childNodes)[1];
        let difficultyElem = removeTextNodes(removeTextNodes(aiFormElem.childNodes)[0].childNodes)[0];
    
        let toggleForm = (element) => {
            if (element.checked) {
                if (avatarElem.getAttribute('pic') === 'bot.png') {
                    avatarElem.setAttribute('pic', 'profilePicM2.svg');
                    removeTextNodes(avatarElem.childNodes)[0].setAttribute('src', 'images/profilePicM2.svg');
                    nameElem.value = '';
                }
                humanFormElem.style.display = 'grid';
                aiFormElem.style.display = 'none';
            } else {
                humanFormElem.style.display = 'none';
                aiFormElem.style.display = 'grid';
            }
        }
    
        playerTypeElem.addEventListener('click', event => {
            toggleForm(event.target);
        })
        toggleForm(playerTypeElem);
    
        let chooseAvatar = (element) => {
    
            picGalleryImgElements.forEach(img => {
                if (img.getAttribute('pic') === element.getAttribute('pic')) {
                    img.classList.add('selected-pic');
                } else {
                    img.classList.remove('selected-pic');
                }
            })
            picGalleryWrapperElement.style.display = 'grid';
        }
        
        avatarElem.addEventListener('click', event => {
            selectAvatar = num-1;
            chooseAvatar(avatarElem);
        })
        
        return {
            elements: {
                type: playerTypeElem,
                avatar: avatarElem,
                name: nameElem,
                difficulty: difficultyElem,
            },
        }
    }
    
    function createPlayer (player) {
        let type = player.elements.type.checked ? 'Human':'AI';
        let avatar = player.elements.avatar.getAttribute('pic');
        let name = player.elements.name.value;
        let difficulty = player.elements.difficulty.value;
    
        if (type==='AI') {
            name = randomBotName();
            avatar = 'bot.png';
            player.elements.avatar.setAttribute('pic', 'bot.png');
            removeTextNodes(player.elements.avatar.childNodes)[0].setAttribute('src', 'images/bot.png');
        }
        
        return {elements: player.elements, type, avatar, name, difficulty};
    }
    
    // game module
    let game = (() => {

        let tileAccess = [false];
        let roundCounter;
        let wins;

        async function roundOver(result) {
            roundCounter[0]++;
            console.log('Round ' + roundCounter[0] + ' out of ' + roundCounter[1]);
            if (result === 'DRAW') {
                console.log("It's a draw!");
                setHeader("It's a draw!");
                await delay(2000);
            } else {
                console.log('winner: ' + result[0]);
                let winner = players()[result[0]]
                wins[result[0]]++;
                let name = winner.name;
                if (winner.type === 'AI') {
                    name = 'Bot ' + name;
                }
                updateWinStats();
                setHeader(`${name} wins this round!`);
                for (let i = 1; i < result.length; i++) {
                    strikeThrough(result[i]);
                }
                await delay(2000);
            }
            if (roundCounter[0] < roundCounter[1]) {
                round.start();
            } else {
                end();
            }
        }
        
        let strikeThroughRevealed = [];
        let strikeThrough = (strikeNum, mode='reveal') => {
            // console.log('striking '+strikeNum);
            if (mode === 'reveal') {
                strikeThroughRevealed.push(strikeNum);
                strikeElements[strikeNum-1].classList.add('strikeThrough');
            } else if (mode === 'remove') {
                strikeElements[strikeNum-1].classList.remove('strikeThrough');
            }
        }

        let updateWinStats = () => {
            statWinElements.forEach((elem, index) => {
                elem.textContent = `(${wins[index]}/${roundCounter[1]})`
            });
        }

        let resetGameVars = () => {
            tileAccess[0] = false;
            roundCounter = [0, 0];
            wins = [0, 0];
            roundCounter[1] = Number(numOfRoundsInputElement.value);
        }
        resetGameVars();
        
        let board = (() => {
            let tiles;

            let symbols = ['X', 'O'];

            let reset = () => {
                tiles = [null, null, null, null, null, null, null, null, null];
                tileElements.forEach(tile => {
                    tile.textContent = '';
                });
                let strikeThroughRevealedLength = strikeThroughRevealed.length;
                for (let i = 0; i < strikeThroughRevealedLength; i++) {
                    strikeThrough(strikeThroughRevealed.pop(), 'remove');
                }
            }
            reset();

            let setCell = (cell, player) => {
                tileElements[cell-1].textContent = symbols[player];
                tiles[cell-1] = player;
            }

            let getCell = (cell) => {
                return tiles[cell-1];
            }

            let getTiles = () => {
                return tiles.slice(0);
            }

            return {
                reset,
                setCell,
                getCell,
                getTiles,
            };
        })()

        let round = (() => {
            let player;

            async function prepareForPlayerInput () {
                playerObj = players()[player]
                if (playerObj.type === 'AI' && gameStatus) {
                    await delay(1500);
                    processChoice(AI.play(playerObj.difficulty, player));
                } else {
                    tileAccess[0] = true;
                }
            }

            let start = () => {
                console.log('This is round.start');
                player = 0;
                board.reset();
                animateWaitStat('both', false);
                animateWaitStat(player);
                resetBtnElement.style.display = resetBtnToggleStates[1];
                setHeader(`Round ${roundCounter[0]+1}/${roundCounter[1]}`);
                prepareForPlayerInput();
            };

            let switchPlayer = () => {
                animateWaitStat(player, false);
                if (player === 0) {
                    player = 1;
                } else {
                    player = 0;
                }
                animateWaitStat(player);

            }

            let validateChoice = (cell) => {
                // console.log('This is round.validateChoice');
                if (board.getCell(cell) === null) {
                    console.log('Choice Validated');
                    return true;
                } else {
                    console.log('Choice not valid');
                    return false;
                }
            };

            let checkForWin = () => {
                // console.log('This is round.checkForWin');
                let tiles = board.getTiles();
                let result = []
                let register = (winner, pattern) => {
                    result[0] = winner;
                    result.push(pattern);
                };
                if (compareAsEqual(...getArrayItems(tiles, 0, 1, 2))) {
                    register(tiles[0], 1);
                }
                if (compareAsEqual(...getArrayItems(tiles, 3, 4, 5))) {
                    register(tiles[3], 2);
                }
                if (compareAsEqual(...getArrayItems(tiles, 6, 7, 8))) {
                    register(tiles[6], 3);
                }
                if (compareAsEqual(...getArrayItems(tiles, 0, 3, 6))) {
                    register(tiles[0], 4);
                }
                if (compareAsEqual(...getArrayItems(tiles, 1, 4, 7))) {
                    register(tiles[1], 5);
                }
                if (compareAsEqual(...getArrayItems(tiles, 2, 5, 8))) {
                    register(tiles[2], 6);
                }
                if (compareAsEqual(...getArrayItems(tiles, 0, 4, 8))) {
                    register(tiles[0], 7);
                }
                if (compareAsEqual(...getArrayItems(tiles, 2, 4, 6))) {
                    register(tiles[2], 8);
                }
                if (result.length === 0) {
                    if (!tiles.includes(null)) {
                        result = 'DRAW';
                    } else {
                        result = false;
                    }
                }
                return result;
            };

            async function processChoice (cellNum) {
                console.log('This is round.processChoice with choice: ' + cellNum);
                tileAccess[0] = false;
                if (validateChoice(cellNum)) {
                    board.setCell(cellNum, player);
                    let result = checkForWin();
                    if (result === false) {
                        switchPlayer();
                        prepareForPlayerInput();
                    } else {
                        resetBtnElement.style.display = resetBtnToggleStates[0];
                        animateWaitStat('both', false);
                        roundOver(result);
                    }
                } else {tileAccess[0] = true}
            };

            return {
                start,
                processChoice,
            }
        })();

        let start = () => {
            console.log('This is game.start');
            resetGameVars();
            updateWinStats();
            playAgainBtnElement.style.display = 'none';
            resetBtnElement.style.display = resetBtnToggleStates[1];
            round.start();
        };

        let end = () => {
            console.log('This is game.end');
            let winner;
            let name;
            if (wins[0] === wins[1]) {
                setHeader('This game is a draw!')
            } else {
                winner = wins[0] > wins[1] ? players()[0]:players()[1];
                name = winner.name
                if (winner.type === 'AI') {
                    name = 'Bot ' + name;
                }
                setHeader(`${name} wins the game!`);
            }
            playAgainBtnElement.style.display = 'initial';
            resetBtnElement.style.display = resetBtnToggleStates[0];
        };
        
        return {
            round,
            board,
            start,
            get tileAvailable() {return tileAccess[0]},
            set tileAvailable(data) {tileAccess[0] = data},
        };
    })()

    //AI module
    let AI = (() => {

        let tiles = (() => {
            let newTiles = [];
            let type;

            for (let i = 0; i < 9; i++) {
                if ([1,3,7,9].includes(i+1)) {
                    type = 'corner';
                } else if ([2,4,6,8].includes(i+1)) {
                    type = 'side';
                } else {
                    type = 'center';
                }
                newTiles.push({
                    occupied:undefined,
                    type,
                })
            };
            return newTiles;
        })();

        
        let emptyCells = [];
        let singleStrikable = false;
        let doubleStrikable = false;

        let updateTiles = () => { // updates emptyCells and strikableCells
            console.log('This is updateTiles inside AI module');
            let empty = [];
            singleStrikable = detectStrikes('list').reduce((final, current) => {
                if (current.length !== 0) {
                    final = true;
                }
                return final;
            }, false);
            doubleStrikable = detectFutureStrikes(2).reduce((final, current) => {
                if (current.length !== 0) {
                    final = true;
                }
                return final;
            }, false);
            console.log(doubleStrikable);
            let occupy;
            for (let i = 0; i < 9; i++) {
                occupy = game.board.getCell(i+1);
                if (occupy === null) {
                    empty.push(i);
                    tiles[i].occupied = false;
                } else {
                    tiles[i].occupied = occupy;
                }
            }
            emptyCells = empty.slice(0);
        }

        let customBoard = (...arguments) => { // boardTiles='default', player1=[], player2=[]
            let boardTiles = arguments[0].slice(0);
            if (boardTiles==='default') {
                boardTiles=game.board.getTiles();
            }
            let args = [...arguments].slice(1);
            for (let player = 0; player < args.length; player++) {
                args[player].forEach(cellNum => {
                    boardTiles[cellNum] = player;
                });
            }
            return boardTiles;
        }

        let detectStrikes = (boardTiles=game.board.getTiles(), mode='default', excludePattern=[]) => {
            if (typeof boardTiles === 'string' || boardTiles instanceof String) {
                if (boardTiles !== 'default') {
                    mode = boardTiles;
                } else if (Number.isInteger(mode)) {
                    excludePattern = [mode];
                    mode = boardTiles;
                } else if (Array.isArray(mode)) {
                    excludePattern = mode;
                    mode = boardTiles;
                }
                boardTiles = game.board.getTiles();
            } else if (Number.isInteger(mode)) {
                excludePattern = [mode];
                mode = 'default';
            } else if (Array.isArray(mode)) {
                excludePattern = mode;
                mode = 'default';
            }
            let patterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
            if (excludePattern.length !== 0) {
                excludePattern.forEach(patternNum => {
                    patterns[patternNum] = null;
                })
                patterns = patterns.reduce((finalResult, currentValue) => {
                    if (currentValue !== null) {
                        finalResult.push(currentValue);
                    }
                    return finalResult;
                }, [])
            }
            let result = [Array(9).fill(null), Array(9).fill(null)]; // each array for each player
            for (let cellNum = 0; cellNum < 9; cellNum++) {
                patterns.forEach((pattern, patternIndex) => {
                    if (pattern.includes(cellNum)) {
                        let potentialSrikeCells = getArrayItems(boardTiles, ...pattern);
                        if (potentialSrikeCells[pattern.indexOf(cellNum)] === null) {
                            for (let player = 0; player < 2; player++) {
                                potentialSrikeCells[pattern.indexOf(cellNum)] = player;
                                if (compareAsEqual(...potentialSrikeCells)) {
                                    result[player][cellNum] = [cellNum, patternIndex];
                                }
                            }
                        }
                    }
                });
            }
            if (mode === 'list') {
                result.forEach((player, index) => {
                    result[index] = player.reduce((finalResult, currentValue) => {
                        if (currentValue !== null) {
                            finalResult.push(currentValue);
                        }
                        return finalResult;
                    }, []);
                });
            }
            return result; // the format for result is: [PlayerOneStrikes, PlayerTwoStrikes] | format for each strike is: [cellNum, patternNum]
        }

        let detectFutureStrikes = (strikeNum='all', boardTiles=game.board.getTiles()) => {
            let result = [[], []];
            if (typeof boardTiles === 'string' || boardTiles instanceof String) {
                if (boardTiles !== 'default') {
                    mode = boardTiles;
                }
                boardTiles = game.board.getTiles();
            }
            let alreadyAvailableStrikePatterns = detectStrikes(boardTiles, 'list').reduce((finalArray, player) => {
                let newPlayerStrikes = player.reduce((finalPlayer, strike) => {
                    finalPlayer.push(strike[1]);
                    return finalPlayer;
                }, []);
                finalArray = finalArray.concat(newPlayerStrikes);
                return finalArray;
            }, []);
            boardTiles.forEach((cell, cellNum) => {
                if (cell === null) {
                    [0, 1].forEach(player => {
                        let args = [boardTiles, [], []];
                        args[player+1] = [cellNum];
                        let filledInBoard = customBoard(...args);
                        let strikes = detectStrikes(filledInBoard, 'list', alreadyAvailableStrikePatterns);
                        if (Number.isInteger(strikeNum) && strikes[player].length === strikeNum || strikeNum === 'all' && strikes[player].length > 0) {
                           result[player].push(cellNum);
                        }
                    })
                }
            });
            return result;
        }

        let strikeDown = (player, boardTiles=game.board.getTiles()) => {
            console.log('strikeDown');
            let prediction = detectStrikes(boardTiles, 'list');
            if (prediction[player].length !== 0) {
                console.log('gonna win');
                return prediction[player][randomNum(prediction[player].length-1)][0]+1;
            } else {
                console.log('gonna block');
                return prediction[player === 0 ? 1:0][randomNum(prediction[player === 0? 1:0].length-1)][0]+1;
            }
        }

        let doubleStrikeDown = (player, boardTiles=game.board.getTiles()) => {
            let prediction = detectFutureStrikes(2, boardTiles);
            if (prediction[player].length !== 0) {
                return prediction[player][randomNum(prediction[player].length-1)]+1;
            } else {
                let blockableCells = blockDoubleStrikes(player, boardTiles);
                return blockableCells[randomNum(blockableCells.length-1)]+1;
            }
        }

        let blockDoubleStrikes = (player, boardTiles=game.board.getTiles()) => {
            // expects at least one doublestrike to be available
            let getEnemyDoubleStrikes = (paramBoard) => {return detectFutureStrikes(2, paramBoard)[player === 0 ? 1:0]};
            let enemyDoubleStrikes = getEnemyDoubleStrikes(boardTiles);
            let enemyPlayer = player === 0 ? 1:0;
            let result = [];
            if (enemyDoubleStrikes.length > 1) {
                boardTiles.forEach((cell, cellNum) => {
                    if (cell === null) {
                        let = args = [boardTiles, [], []];
                        args[player+1] = [cellNum];
                        let tempBoard = customBoard(...args);
                        let verdict = getEnemyDoubleStrikes(tempBoard);
                        if (verdict.length === 0) {
                            result.push(cellNum);
                        } else {
                            args = [tempBoard, [], []];
                            let strike = strikeDown(enemyPlayer, tempBoard)-1;
                            args[enemyPlayer+1] = [strike];
                            tempBoard = customBoard(...args);
                            verdict = getEnemyDoubleStrikes(tempBoard);
                            if (verdict.length === 0) {
                                verdict = detectStrikes(tempBoard, 'list');
                                if (verdict[enemyPlayer].length < 2) {
                                    result.push(cellNum);
                                }
                            }
                        }
                    }
                });
            } else {
                result.push(enemyDoubleStrikes[0]);
            }
            return result;
        }

        let stupid = (player) => {}

        let normal = (player) => {
            let result = null;
            console.log('status is ' + singleStrikable);
            if (singleStrikable) {
                console.log('checking for win patterns');
                result = strikeDown(player);
            } else { // returns random empty cell
                result = emptyCells[Math.floor(Math.random()*emptyCells.length)]+1;
            }
            return result;
        }

        let impossible = (player) => {
            let result = null;
            console.log('Impossible AI on the job!');
            if (strikableStatus) {
                console.log('Impossible: Found a strike!');
                result = strikeDown(player);
            } else {
                if (emptyCells.length === 9) { // if all cells are empty
                    console.log('Impossible: Board is empty, making the first move');
                    result = getCellOfType('corner', 'random');
                } else {
                    let occupier;
                    game.board.getTiles().forEach((cell, index) => { // identify occupied enemy cell
                        if (cell !== null && cell !== player) {
                            occupier = [cell, index];
                        }
                    });
                    ['corner', 'side', 'center'].forEach(item => { // identify cell type
                        if (getCellOfType(item).includes(occupier[1])) {
                            occupier.push(item);
                        }
                    })
                    if (emptyCells.length === 8) {
                        console.log('Impossible: Got the second move');
                        if (occupier[2] === 'corner') {
                            result = 5; //center cell
                        }
                    } else if (emptyCells.length === 7) {
                        console.log('Impossible: On the third move');
                        if (occupier[2] === 'side') {
                            result = 5; // center cell
                        } else if (occupier[2] === 'corner') {
                            getCellOfType('corner').forEach(cell => {
                                if (emptyCells.includes(cell)) {
                                    result = cell+1; // any corner cell that is empty
                                }
                            });
                        } else { // center
                            let neutralCells = getCellOfFutureStrikes(0, player);
                            result = neutralCells[randomNum(neutralCells.length-1)]+1;
                        }
                    } else {
                        let doubleStrikable = getCellOfFutureStrikes(2, player);
                        if (doubleStrikable.length !== 0) {
                            console.log('Impossible: Doublestrike!!!');
                            result = doubleStrikable[randomNum(doubleStrikable.length-1)]+1;
                        } else {
                            let singleStrikable = getCellOfFutureStrikes(1, player);
                            if (singleStrikable.length !== 0) {
                                console.log('Impossible: rolling out a single strike');
                                result = singleStrikable[randomNum(singleStrikable.length-1)]+1;
                            }
                        }
                    }
                }
            }
            if (result === null || result.length === 0) {
                result = emptyCells[randomNum(emptyCells.length-1)]+1;
                console.log('Impossible: random empty cell');
            }
            return result;
        }

        let play = (mode, player) => {
            console.log('This is AI.play()');
            updateTiles();
            if (mode === 'stupid') {
                return stupid(player);
            } else if (mode === 'normal') {
                return normal(player);
            } else if (mode ==='impossible') {
                return impossible(player);
            } else {
                throw "AI.play() -> invalid value in mode parameter. Expected 'stupid', 'normal' or 'impossible'";
            }
        };


        return {
            play,
            updateTiles,
            detectStrikes,
            detectFutureStrikes,
            customBoard,
            strikeDown,
            doubleStrikeDown,
            blockDoubleStrikes,
            tiles,
            emptyCells,
        }
    })()

    // engine functions
    let initialise = () => {
        player1 = initiatePlayer(playerFormElements[0]);
        player2 = initiatePlayer(playerFormElements[1]);

        animateWaitStat('both', false);
    
        avatarPics.forEach(fileName => {
            img = createElement('img', {src: `images/${fileName}`, pic: fileName})
            img.addEventListener('click', event => {
                players()[selectAvatar].elements.avatar.setAttribute('pic', fileName);
                removeTextNodes(players()[selectAvatar].elements.avatar.childNodes)[0].setAttribute('src', `images/${fileName}`);
                picGalleryWrapperElement.style.display = 'none'
            })
            picGalleryElement.appendChild(img);
        })
        picGalleryImgElements = document.querySelectorAll('.pic-gallery > img');

        tileElements.forEach(tile => {
            tile.addEventListener('click', event => {
                if (game.tileAvailable) {
                    game.round.processChoice(event.target.getAttribute('data-index'));
                } else {
                    console.log('Tile not available');
                }
            });
        })
    }

    let play = () => {
        player1 = createPlayer(player1);
        player2 = createPlayer(player2);
        problems = null;
        gameStatus = true;

        players().forEach(player => {
            if (player.name === '') {
                error('Please fill in your name');
                problems = 'oops';
            }
        })
        if (problems === null) {
            statNameElements.forEach((element, index) => {
                element.textContent = players()[index].name;
            })
            statPicElements.forEach((element, index) => {
                element.setAttribute('src', `images/${players()[index].avatar}`);
            })
            game.start();
            homeElement.style.display = 'none';
            arenaElement.style.display = 'grid';
        }
    }

    let playAgain = () => {
        game.start();
    }

    let menuEventFunc = () => {
        homeElement.style.display = 'grid';
        arenaElement.style.display = 'none';
        gameStatus = false;
        setHeader('reset');
    }

    async function setHeader(data, mode='indefinite') {
        if (data === 'reset') {
            data = 'Tic-Tac-Toe';
        } else if (mode !== 'indefinite') {
            if (Number.isInteger(mode)) {
                setHeader(data);
                await delay(mode);
                setHeader('reset');
            } else {
                throw "setHeader() -> invalid parameter: mode | Expected an Integer(milliseconds for delay) or 'indefinite'(default value)";
            }
        }
        if (mode === 'indefinite') {
            headerElement.textContent = data;
        }
    }

    let animateWaitStat = (player, stateToApply=true) => {
        stateToApply = stateToApply ? 'animation-iteration-count: infinite':'animation-iteration-count: 0';
        player = player === 'both' ? [0, 1]:[player];
        player.forEach(elemIndex => {
            statWaitElements[elemIndex].style = stateToApply;
        });
    }

    return {game, initialise, play, setHeader, playAgain, menuEventFunc, AI};
})()

// other functions
function error (message) {
    alert(message);
}

// run on start
engine.initialise();