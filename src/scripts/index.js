
window.onload = function() {
    const playerColorButtons = document.querySelectorAll('.color-button');
    for (const button of playerColorButtons) {
        button.addEventListener('click', submitPlayerColor);
        console.log(`Button ${button.dataset.color} added event listener`);
        //console.log(`Button text: ${button.innerHTML}`);
    }
}

function submitPlayerColor(event) {
    let color = event.target.dataset.color;
    sessionStorage.setItem('playerColor', color);
    window.location.href = 'game.html';
}

