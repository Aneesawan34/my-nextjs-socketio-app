import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  const mySpace = io.of('/custom-namespace');

  mySpace.on("connection", (socket) => {
    console.log("User is connected...");

    socket.on('client-message', (message) => {
        console.log("message from client", message);
        socket.emit('server-messages', message);
    });

    // socket.broadcast.emit('broadcast-message', 'message for all')
    
    // mySpace.emit('emit-message', 'message for all');

    socket.on('disconnect', ()=>{
    console.log("User is disconnected");
    })
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});