const socket = io()
let mensaje = document.getElementById('message');
let usuario = document.getElementById('username');
let salida = document.getElementById('salida');
let img = document.getElementById('imag')
let actions = document.getElementById('actions');
message.addEventListener('keypress', function() {
    socket.emit('typing', username.value);
});
socket.on('typing', function(data) {
    actions.innerHTML = `<p><em> <strong>${data} </strong> :esta escribiendo un mensaje...</em></p>`
});
socket.on('mensaje', function(data) {
    actions.innerHTML = '';
    salida.innerHTML += `<p> <strong>${data.usuario}: </strong> ${data.mensaje} ${data.men} </p>`
});
let form = document.getElementById('uploadFile').onsubmit = function(e) {
    e.preventDefault();
    let formData = new FormData()
    let imagefile = document.querySelector('#file')
    formData.append('file', imagefile.files[0])
    axios.post('/upload', formData).then(resp => {
        if (resp.data.file) {
            let image = `<img src="/images/${resp.data.file}"  width ="80px"/>`;
            socket.emit('mensaje', {
                men: image,
                usuario: usuario.value,
                mensaje: mensaje.value
            });
        }
    })
}