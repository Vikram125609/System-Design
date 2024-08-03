const ws = new WebSocket("ws://localhost:80");

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