console.log('loaded')

let socket = new WebSocket(window.location.href.replace('http','ws'));
let clientNetcode = new ClientNetcode(socket)