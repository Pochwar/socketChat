//set host, change it if needed
const host = 'http://localhost:8080';

//connect to socket
let socket = io.connect(host);

//ask pseudo
let pseudo = prompt('Quel est votre pseudo ?');
socket.emit('newUser', pseudo);

//display info msg
socket.on('info', message => {
    document.querySelector('#info').style.visibility = 'visible';
    document.querySelector('#info').innerText = message;
    setTimeout(()=>{
        document.querySelector('#info').style.visibility = 'hidden';
    },2000)
});

//display connected users
socket.on('users', users => {
    document.querySelector('#users').innerHTML = "";
    users.forEach(user => {
        let p = document.createElement('p');
        p.innerText = user
        document.querySelector('#users').appendChild(p);
    })

});

//send msg
document.querySelector('#send').onclick = () => {
    sendMsg();
};

//detect typing
document.querySelector("#msg").addEventListener("keydown", () =>{
    socket.emit('typing');
}, false);

//build self msg
socket.on('selfMsg', msg => {
    buildMsg('selfMsg', 'You', msg)
});

//build users msg
socket.on('userMsg', obj => {
    buildMsg('userMsg', obj.pseudo, obj.msg);
});

//build msg
let buildMsg = (userClassName, pseudo, msg) => {
    let div = document.createElement('div');
    div.className = userClassName;
    let pUser = document.createElement("p");
    pUser.innerText = pseudo;
    pUser.className = 'userName';
    let pMsg = document.createElement("p");
    pMsg.innerText = msg;
    pMsg.className = 'msg';
    div.appendChild(pUser);
    div.appendChild(pMsg);
    document.querySelector('#chat').appendChild(div);
    document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
};

//send msg
let sendMsg = () => {
    if(document.querySelector('#msg').value !== ''){
        const msg = document.querySelector('#msg').value;
        socket.emit('msg', msg);
        document.querySelector('#msg').value = '';
    }
};

//Fonction pour valider le formulaire avec la touche Enter et pour faire un saut de ligne avec Shift + Enter
let validForm = (e) => {
    if (e.keyCode == 13 && !e.shiftKey) {
        sendMsg()
        return false;
    } else {
        return true;
    }
}
