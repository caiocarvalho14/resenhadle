import { characters } from './characters.js';

const dailyCharacter = characters[Math.floor(Math.random() * characters.length)];

const guessInput = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');
const resultsContainer = document.getElementById('results-container');
const suggestionsList = document.getElementById('suggestions-list');
let attempts = 0;

const characterNames = characters.map(char => char.name);

function initGame() {
    console.log("Jogo iniciado! Personagem do dia:", dailyCharacter.name);
    guessButton.addEventListener('click', handleGuess);
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGuess();
        }
    });

    guessInput.addEventListener('input', handleSuggestions);
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.autocomplete-container')) {
            suggestionsList.style.display = 'none';
        }
    });
}

function handleGuess() {
    const userGuess = guessInput.value.trim().toLowerCase();

    if (!userGuess) {
        return;
    }

    const guessedCharacter = characters.find(char => char.name.toLowerCase() === userGuess);

    if (!guessedCharacter) {
        return;
    }

    attempts++;
    displayGuessResult(guessedCharacter);
    guessInput.value = '';
    suggestionsList.innerHTML = '';
    suggestionsList.style.display = 'none';

    if (userGuess === dailyCharacter.name.toLowerCase()) {
        endGame(true);
    } else if (attempts >= 6) {
        endGame(false);
    }
}

function handleSuggestions() {
    const inputValue = guessInput.value.toLowerCase();
    suggestionsList.innerHTML = '';

    if (inputValue.length > 0) {
        const filteredNames = characterNames.filter(name => name.toLowerCase().startsWith(inputValue));
        
        if (filteredNames.length > 0) {
            filteredNames.forEach(name => {
                const li = document.createElement('li');
                li.textContent = name;
                li.addEventListener('click', () => {
                    guessInput.value = name;
                    suggestionsList.innerHTML = '';
                    suggestionsList.style.display = 'none';
                    guessInput.focus();
                });
                suggestionsList.appendChild(li);
            });
            suggestionsList.style.display = 'block';
        } else {
            suggestionsList.style.display = 'none';
        }
    } else {
        suggestionsList.style.display = 'none';
    }
}

function displayGuessResult(guessedCharacter) {
    const guessRow = document.createElement('div');
    guessRow.className = 'row result-row';

    const imageBox = document.createElement('div');
    imageBox.className = 'col result-box d-flex flex-column justify-content-center';
    
    const imagePath = guessedCharacter.fotodir ? `images/${guessedCharacter.fotodir}` : 'images/placeholder.jpg';
    imageBox.innerHTML = `<a href="https://caiocarvalho14.github.io/resenhadle/${imagePath}" target="_blank"><img src="${imagePath}" alt="${guessedCharacter.name}" title="${guessedCharacter.name}" class="img-fluid"></a>`;
    
    guessRow.appendChild(imageBox);

    const attributes = ['gender', 'type', 'corDePele', 'habilidades', 'origin', 'firstAppearanceYear'];

    attributes.forEach(attr => {
        const attributeBox = document.createElement('div');
        attributeBox.className = 'col result-box d-flex flex-column justify-content-center';
        
        let valueToDisplay = Array.isArray(guessedCharacter[attr]) ? guessedCharacter[attr].join(', ') : guessedCharacter[attr];
        attributeBox.textContent = valueToDisplay;

        let isCorrect = false;
        let isPartial = false;

        if (attr === 'habilidades') {
            const guessedSkills = guessedCharacter.habilidades.map(skill => skill.toLowerCase());
            const dailySkills = dailyCharacter.habilidades.map(skill => skill.toLowerCase());

            const hasPartialMatch = guessedSkills.some(guessedSkill => dailySkills.includes(guessedSkill));
            const isExactMatch = guessedSkills.every(guessedSkill => dailySkills.includes(guessedSkill)) &&
                                 dailySkills.every(dailySkill => guessedSkills.includes(dailySkill));
            
            if (isExactMatch) {
                isCorrect = true;
            } else if (hasPartialMatch) {
                isPartial = true;
            }
        } 
        else if (attr === 'firstAppearanceYear') {
            if (guessedCharacter[attr] === dailyCharacter[attr]) {
                isCorrect = true;
            } else {
                const icon = document.createElement('div');
                icon.className = `arrow-${guessedCharacter[attr] < dailyCharacter[attr] ? 'up' : 'down'}`;
                icon.textContent = guessedCharacter[attr] < dailyCharacter[attr] ? '⬆️' : '⬇️';
                attributeBox.append(icon);
            }
        } 
        else {
            if (guessedCharacter[attr] === dailyCharacter[attr]) {
                isCorrect = true;
            }
        }

        if (isCorrect) {
            attributeBox.classList.add('correct');
        } else if (isPartial) {
            attributeBox.classList.add('partial');
        } else {
            attributeBox.classList.add('incorrect');
        }

        guessRow.appendChild(attributeBox);
    });

    // MUDANÇA: Adiciona a nova linha de palpite no início da lista.
    resultsContainer.prepend(guessRow);
}

function endGame(isWinner) {
    guessInput.disabled = true;
    guessButton.disabled = true;
    
    let message = isWinner 
        ? `Acertou em ${attempts} tentativa(s)`
        : `Fim de jogo! A pessoa do dia era: ${dailyCharacter.name}.`;

    setTimeout(() => {
        alert(message)
        window.location.href="index.html"
    }, 500);
}

document.addEventListener('DOMContentLoaded', initGame);