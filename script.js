// elements
const playerFormElements = document.querySelectorAll('.configure-player');
const playBtnElement = document.querySelector('.playBtn');
const numOfRoundsInputElement = document.querySelector('#roundNumInput');
const homeElement = document.querySelector('.home');
const arenaElement = document.querySelector('.arena');
const statNameElements = document.querySelectorAll('.stats h3');
const statPicElements = document.querySelectorAll('.stats img');
const menuBtnElement = document.querySelector('.menuBtn');
const picGalleryWrapperElement = document.querySelector('.pic-gallery-wrapper');
const picGalleryElement = document.querySelector('.pic-gallery');
let picGalleryImgElements;
const closeBtnElement = document.querySelector('.closeBtn');


// variables
const alphabets = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
const avatarPics = ['profilePicM1.svg', 'profilePicM2.svg', 'profilePicM3.svg', 'profilePicF1.svg', 'profilePicF2.svg', 'profilePicF3.svg']
let player1;
let player2;
let selectAvatar;
let numOfPlayers = 0;


// events
playBtnElement.addEventListener('click', event => {
    player1 = createPlayer(player1);
    player2 = createPlayer(player2);
    problems = null;

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
        homeElement.style.display = 'none';
        arenaElement.style.display = 'grid';
    }
})
numOfRoundsInputElement.addEventListener('input', event => {
    if (event.target.value == 0) {
        event.target.value = '';
    } else if (String(event.target.value)[0] == 0) {
        event.target.value *= 1;
    }
})
numOfRoundsInputElement.addEventListener('focusout', event => {
    if (event.target.value < 1) {
        event.target.value = 1;
    }
})
menuBtnElement.addEventListener('click', event => {
    homeElement.style.display = 'grid';
    arenaElement.style.display = 'none';
});
closeBtnElement.addEventListener('click', event => {
    picGalleryWrapperElement.style.display = 'none';
})


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

// engine functions
function initialise() {
    player1 = initiatePlayer(playerFormElements[0]);
    player2 = initiatePlayer(playerFormElements[1]);

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
}

// other functions
function error (message) {
    alert(message);
}

// run on start
initialise();