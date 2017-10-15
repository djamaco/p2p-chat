// <script src="./node_modules/socket.io-client/dist/socket.io.js"></script>

const io = require('socket.io-client');
const p2p = require('socket.io-p2p');

const socket = io();

const options = {autoUpgrade: false, peerOpts: {numClients: 10}};
const socketP2P = new p2p(socket, options, () => {
    console.log('robots are cool!');
});

socketP2P.on('p2p-message', function(data) {
    console.log(JSON.stringify(data, null, 2));
});

socketP2P.on('p2p-private', function () {
    socketP2P.upgrade();
});

socketP2P.on('socket connected', data => {
    console.log(data.message);
});

window.sendMessage = message => {
    socketP2P.emit('p2p-message', {message});
};

window.setAllPrivate = () => {
    socketP2P.emit('set all private');
};