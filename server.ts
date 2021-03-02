const { Socket } = require('dgram');

const express = require("express");
const app = require('express')();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Config 
app.set("views", "./views");
app.set("view engine", "ejs");


// Lista de productos
const productos = [
    {
        id: 1,
        title: 'Calculadora',
        price: 430,
        thumbnail: 'aa'
    }
]; 

// Lista de mensajes

const messages = [
    {
        email: 'xsawin@gmail.com',
        timestamp: '28/02/2021 10:15:22',
        message: 'Hola!'
    }
]

// Rutas

app.get('/', (req: any, res: { render: (arg0: string, arg1: { productos: { id: number; title: string; price: number; thumbnail: string; }[]; }) => void; }) => {
    res.render('pages/index', {productos: productos})
    //res.sendFile(__dirname + '/index.html');
})

// Connection Socket.io

io.on('connection', (socket: { broadcast: { emit: (arg0: string, arg1: string) => void; }; emit: (arg0: string, arg1: { id: number; title: string; price: number; thumbnail: string; }[] | { email: string; timestamp: string; message: string; }[]) => void; on: (arg0: string, arg1: { (data: any): void; (data: any): void; }) => void; }) => {
    socket.broadcast.emit('mensaje-user', 'Hola mundo');

    // emit
    socket.emit('products', productos);
    socket.emit('messages', messages);

    // products
    socket.on('new-product', function(data: { title: any; price: any; thumbnail: any; }){
        let myID = (productos.length)+1;

        let myTitle = data.title;
        let myPrice = data.price;
        let myThumbnail = data.thumbnail;

        const producto = {
            id: myID, 
            title: myTitle, 
            price: myPrice, 
            thumbnail: myThumbnail
        }

        productos.push(producto);

        io.sockets.emit('products', productos);
    })

    // message-center

    socket.on('new-message', function(data: { email: string; timestamp: string; message: string; }) {
        messages.push(data);
        io.sockets.emit('messages', messages);
    });

})

http.listen(3024, () => {
    console.log('Driving-driving on port 3024');
})