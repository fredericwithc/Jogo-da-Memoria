
// lista dos animais para o jogo
let animals = [
    'cat', 'dog', 'horse', 'cow', 'fish',
    'frog', 'dove', 'spider', 'hippo', 'dragon'
];

// Variáveis para controlar o estado do jogo

let flippedCards = [];    // Quais cards estão virados agora (máximo 2)
let isChecking = false;   // Estamos verificando um par?
let pairsFound = 0;       // Quantos pares foram encontrados

// Criação dos Cards

function createGameCards() {

    let allCards = [];  // Array vazio que vai receber todos os cards

    // Para cada animal na lista, 2 cards iguais

    for (let i = 0; i < animals.length; i++) {
        let animal = animals[i];

        // Primeiro card do par
        let card1 = {
            id: `card-${animal}-1`,
            animal: animal,
            flipped: false,
            matched: false
        };

        // Segundo card do par (mesmo animal)
        let card2 = {
            id: `card-${animal}-2`,
            animal: animal,
            flipped: false,
            matched: false
        };

        // Adicionar ambos os cards ao array
        allCards.push(card1);
        allCards.push(card2);
    }

    return allCards;
}

//  Embaralhar os Cards

function shuffleCards(cards) {

    // 100x para garantir que está embaralhado

    for (let i = 0; i < 100; i++) {
        // Escolher duas posições aleatórias
        let pos1 = Math.floor(Math.random() * cards.length);
        let pos2 = Math.floor(Math.random() * cards.length);

        // Trocar os cards dessas posições
        let temp = cards[pos1];
        cards[pos1] = cards[pos2];
        cards[pos2] = temp;
    }

}

// Posicionando Cards no Tabuleiro

function putCardsOnPage(cards) {

    // Localização

    let gameBoard = document.getElementById('gameBoard');

    // Limpar tudo que estava lá antes

    gameBoard.innerHTML = '';

    // Criando o HTML para cada Card

    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];

        let cardHTML = `
            <div class="card" id="${card.id}">
                <div class="card_front">
                    <i class="fa-solid fa-${card.animal}"></i>
                </div>
                <div class="card_back">
                    <i class="fa-solid fa-diamond"></i>
                </div>
            </div>
        `;

        // Colocar este HTML dentro do gameBoard
        gameBoard.innerHTML += cardHTML;
    }

}

// Cards reagindo ao Click

function makeCardsClickable(cards) {

    for (let i = 0; i < cards.length; i++) {
        let cardData = cards[i];

        // Encontrar o elemento HTML correspondente

        let cardElement = document.getElementById(cardData.id);

        // Adicionar um "ouvinte" de clique

        cardElement.addEventListener('click', function () {
            handleCardClick(cardData, cardElement);
        });
    }

}

// O que acontece depois do Click

function handleCardClick(cardData, cardElement) {
    // Primeiro, verificar se posso virar o card

    // Não pode virar se já está virado

    if (cardData.flipped) {
        console.log('Este card já está virado!');
        return;
    }

    // Não pode virar se já foi combinado

    if (cardData.matched) {
        console.log('Este card já foi combinado!');
        return;
    }

    // Não pode virar se já temos 2 cards virados
    if (flippedCards.length >= 2) {
        console.log('Já temos 2 cards virados!');
        return;
    }

    // Não pode virar se estamos verificando um par
    if (isChecking) {
        console.log('Aguarde, estou verificando!');
        return;
    }

    // Se tudo bem,
    // Marcar que este card está virado
    cardData.flipped = true;

    // Fazer o card virar visualmente
    cardElement.classList.add('flipped');

    // Adicionar este card à lista de cards virados
    flippedCards.push({
        data: cardData,
        element: cardElement
    });

    // Se temos 2 cards virados, vamos verificar se são iguais
    if (flippedCards.length === 2) {

        // Tempo para o vermos os cards
        setTimeout(function () {
            checkIfMatch();
        }, 800);
    }
}

// Verficar se os Cards virados são iguais

function checkIfMatch() {

    // Bloquear novos cliques enquanto verifica
    isChecking = true;

    // Pegar os dois cards que estão virados
    let firstCard = flippedCards[0];
    let secondCard = flippedCards[1];

    // Verificar se os animais são iguais
    if (firstCard.data.animal === secondCard.data.animal) {
        handleMatch(firstCard, secondCard);
    } else {
        handleNoMatch(firstCard, secondCard);
    }
}

// O que fazer quando é um par

function handleMatch(firstCard, secondCard) {

    // Marcar os cards como combinados
    firstCard.data.matched = true;
    secondCard.data.matched = true;

    // Mudar aparência de cards combinados
    firstCard.element.classList.add('matched');
    secondCard.element.classList.add('matched');

    // Contar mais um par encontrado
    pairsFound++;

    // Atualizar o número na tela
    updatePairsDisplay();

    // Limpar a lista de cards virados
    flippedCards = [];

    // Permitir novos cliques
    isChecking = false;

    // Verificar se o jogo terminou (10 pares = vitória)
    if (pairsFound === 10) {
        console.log('🎊 PARABÉNS! VOCÊ GANHOU!');
        setTimeout(function () {
            alert('🎉 Parabéns! Você encontrou todos os pares!');
        }, 500);
    }
}

// O que fazer quando não for um par:

function handleNoMatch(firstCard, secondCard) {

    // Dar tempo para o jogador memorizar onde estão os ícones
    setTimeout(function () {

        // Marcar como não virados
        firstCard.data.flipped = false;
        secondCard.data.flipped = false;

        // Tirar a aparência de virado
        firstCard.element.classList.remove('flipped');
        secondCard.element.classList.remove('flipped');

        // Limpar a lista de cards virados
        flippedCards = [];

        // Permitir novos cliques
        isChecking = false;

    }, 100);
}

// Atualizar a tela

function updatePairsDisplay() {
    let pairsElement = document.getElementById('pairsCount');
    if (pairsElement) {
        pairsElement.textContent = pairsFound;
    }
}

// Começar um novo jogo

function startNewGame() {

    // Resetar todas as variáveis
    flippedCards = [];
    isChecking = false;
    pairsFound = 0;

    // Criar todos os cards
    let gameCards = createGameCards();

    // Embaralhar os cards
    shuffleCards(gameCards);

    // Colocar na página
    putCardsOnPage(gameCards);

    // Fazer reagir ao clique
    makeCardsClickable(gameCards);

    // Atualizar a tela
    updatePairsDisplay();

}

// Botões

function setupButtons() {

    let newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) {
        newGameBtn.addEventListener('click', function () {
            startNewGame();
        });
    }
}

// Começar quando a página carregar

document.addEventListener('DOMContentLoaded', function () {

    // Primeiro, configurar os botões
    setupButtons();

    // Depois, começar o primeiro jogo
    startNewGame();

});