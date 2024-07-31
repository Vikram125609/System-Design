window.onload = function () {
    const name = prompt('Enter your name', 'Shyaam Sundar');
    localStorage.setItem('name', name);
};

function handleDropdown(event) {
    const { name, value } = event.target;
    console.log(name, value)
}

function handleInput(event) {
    const inputTag = document.getElementById('input');
    const { value } = event.target;
    inputTag.value = value;
}

window.onkeyup = function (event) {
    if (event.keyCode === 13) {
        const inputTag = document.getElementById('input');
        const message = inputTag.value;
        ws.send(message);
        const divTag = document.createElement('div');
        divTag.className = 'flex flex-end  w-100 font-size-1-5-rem';
        const pTag = document.createElement('p');
        pTag.style.padding = '5px';
        pTag.textContent = message;
        divTag.appendChild(pTag);
        document.querySelector('.chat-container').appendChild(divTag);
        inputTag.value = '';
    }
}

const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
    console.log('Connection established!');
};

ws.onmessage = (event) => {
    const divTag = document.createElement('div');
    divTag.className = 'flex flex-start';
    divTag.innerHTML = `<p>${event.data}</p>`;
    document.querySelector('.chat-container').appendChild(divTag);
}