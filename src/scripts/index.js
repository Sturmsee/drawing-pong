var color

window.onload = function() {
    const playerColorButtons = document.querySelectorAll('.color-button');
    for (const button of playerColorButtons) {
        button.addEventListener('click', submitPlayerColor);
        console.log(`Button ${button.dataset.color} added event listener`);
        //console.log(`Button text: ${button.innerHTML}`);
    }
}

function submitPlayerColor(event) {
    color = event.target.dataset.color;
    /*
    if (event.target.innerHTML === 'Red') {
        color = 'red';
    }
    else if (event.target.innerHTML === 'Blue') {
        color = 'blue';
    }
    */
    
    //console.log(`Player color set to: ${color}`);

    //const ws = new WebSocket('ws://localhost:8080');
    
    sessionStorage.setItem('playerColor', color);
    window.location.href = 'game.html';
}

