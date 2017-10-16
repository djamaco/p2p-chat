require ('../scss/index.scss');
const io = require('socket.io-client');
const p2p = require('socket.io-p2p');
const Vue = require('vue');

const socket = io();

const options = {autoUpgrade: false, peerOpts: {numClients: 10}};
const socketP2P = new p2p(socket, options, () => {
    console.log('robots are cool!');
});

const forwardZero = (value) => {
    return (parseInt(value) < 10 ? '0' : '') + value
};

const p2pApp = new Vue({
    el: '#p2p-app',
    data: {
        messages: [],
        nick: 'You',
        message: '',
        private: false,
    },
    methods: {
        sendMessage: function () {
            if ('' === this.message) return;
            const message = {
                message: this.message,
                id: socketP2P.peerId,
            };
            this.message = '';
            socketP2P.emit('p2p-message', message);
            if (this.private) this.addMessage(message);
        },
        switchP2P: function () {
            if (this.private) {
                socketP2P.emit('p2p-public');
                this.goPublic();
            } else {
                socketP2P.emit('set all private');
            }
        },
        addMessage: function (data) {
            this.messages.push({
                message: data.message,
                date: new Date(),
                nick: data.id === socketP2P.peerId ? this.nick : data.id,
                self: data.id === socketP2P.peerId,
            });
        },
        goPublic: function () {
            socketP2P.usePeerConnection = false;
            this.private = false;
        },
    },
    filters: {
        date: function(value) {
            const date = new Date(value);
            return `${forwardZero(date.getHours())}:${forwardZero(date.getMinutes())}:${forwardZero(date.getSeconds())}`
        },
    },
    mounted: function () {
        socketP2P.on('p2p-message', this.addMessage);

        socketP2P.on('p2p-private', () => {
            socketP2P.upgrade();
            this.private = true;
        });

        socketP2P.on('p2p-public', () => {
            this.goPublic();
        });

        socketP2P.on('socket connected', this.addMessage)

    },
});