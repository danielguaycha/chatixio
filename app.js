const path = require('path');
const express = require('express');
const app = express();
const SocketIO = require('socket.io');
const fileUpload = require('express-fileupload');
const server = app.listen(3000, () => {
    console.log('servidor corriendo en el puerto: 3000');
});
app.use(express.static(path.join(__dirname, 'public')));
const io = SocketIO(server);
io.on('connection', (socket) => {
    console.log('Nueva Conexión');
    app.use(fileUpload());
    app.post('/upload', (req, res) => {
        if (!req.files) { return res.status(400).send({ menssage: 'Sube un archivo ' }) }
        let file = req.files.file;
        let fileNameSplit = file.name.split('.');
        let ext = fileNameSplit[fileNameSplit.length - 1];
        let fileName = Math.floor(new Date() / 1000) + '.' + ext;
        file.mv(`public/images/${fileName}`, (err) => {
            if (err)
                return res.status(500).send(err);
            return res.status(200).send({ menssage: 'Subido con exito', file: fileName })
        });
    });

    //Sockets
    socket.on('mensaje', (data) => {
        io.sockets.emit('mensaje', data);
    });
    socket.on('archivo', (data) => {
        io.sockets.emit('archivo', data);
    });
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });
});