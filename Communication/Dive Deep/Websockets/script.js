// const ws = new WebSocket("ws://localhost:8000");

// const ws = fetch("ws://localhost:8000", {
//     method: "GET",
//     headers: {
//         "accept-encoding": "gzip, deflate, br, zstd",
//         "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7",
//         "cache-control": "no-cache",
//         "connection": "Upgrade",
//         "host": "localhost:8000",
//         "origin": "http://127.0.0.1:5500",
//         "pragma": "no-cache",
//         "sec-websocket-extensions": "permessage-deflate; client_max_window_bits",
//         "sec-websocket-key": "NvsdCEK4CGhZMGXyNK/CCA==",
//         "sec-websocket-version": "13",
//         "upgrade": "websocket",
//         "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
//     }
// })


function handleDropdown(event) {
    const { name, value } = event.target;
    if (localStorage.getItem("room")) {
        ws.send(
            JSON.stringify({
                room: localStorage.getItem("room"),
                type: "leave",
            })
        );
        ws.send(JSON.stringify({ room: value, type: "join" }));
    } else {
        ws.send(JSON.stringify({ room: value, type: "join" }));
    }
    localStorage.setItem("room", value);
    document.querySelector(".chat-container").innerHTML = "";
}

function handleInput(event) {
    const inputTag = document.getElementById("input");
    const { value } = event.target;
    inputTag.value = value;
}

window.onkeyup = function (event) {
    if (event.keyCode === 13) {
        const inputTag = document.getElementById("input");
        const message = inputTag.value;
        ws.send(
            JSON.stringify({
                room: localStorage.getItem("room"),
                message: message,
                type: "message",
                user: localStorage.getItem("name"),
            })
        );
        const divTag = document.createElement("div");
        divTag.className = "flex flex-end  w-100 font-size-1-5-rem";
        const pTag = document.createElement("p");
        pTag.style.padding = "5px";
        pTag.textContent = message;
        divTag.appendChild(pTag);
        document.querySelector(".chat-container").appendChild(divTag);
        document.querySelector('.chat-container').scrollTop = document.querySelector('.chat-container').scrollHeight;
        inputTag.value = "";
    }
};

ws.onopen = () => {
    console.log("Connection established!");
};

ws.onerror = () => {
    ws.send(
        JSON.stringify({ room: localStorage.getItem("room"), type: "leave" })
    );
};

ws.onmessage = (event) => {
    const result = JSON.parse(event.data.toString("utf-8"));
    console.log(result);
    if (result.type === "message") {
        const divTag = document.createElement("div");
        divTag.className = "flex flex-col  w-100 font-size-1-5-rem";
        const pTag = document.createElement("p");
        const nameTag = document.createElement("p");
        nameTag.style.padding = "5px 5px 0px 5px";
        nameTag.className = "color-blueviolet font-size-1-rem";
        nameTag.textContent = result.user || "Guest";
        pTag.style.padding = "0px 5px 5px 5px";
        pTag.textContent = result.message;
        divTag.appendChild(nameTag);
        divTag.appendChild(pTag);
        document.querySelector(".chat-container").appendChild(divTag);
        document.querySelector('.chat-container').scrollTop = document.querySelector('.chat-container').scrollHeight;
    }
    if (result.type === "no_of_users") {
        document.querySelector(".color-red").textContent =
            result.totalUsersInChannel;
        document.querySelector(".color-blueviolet").textContent =
            result.totalUsersInApp;
    }
};

window.onload = function () {
    const name = prompt("Enter your name", "Shyaam Sundar");
    localStorage.setItem("name", name);
};

window.onbeforeunload = () => {
    ws.send(
        JSON.stringify({ room: localStorage.getItem("room"), type: "leave" })
    );
};