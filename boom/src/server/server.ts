import express, { Express } from "express";
import http, { Server as HTTPServer } from "http";
import path from "path";
import { Socket, Server as SocketIOServer } from "socket.io";

const app: Express = express();
const server: HTTPServer = http.createServer(app);
const io: SocketIOServer = new SocketIOServer(server);

// Serve static files from Vite build in production
const distPath: string = path.join(__dirname, "../../dist");
app.use(express.static(distPath));

let currentCounter: number = 0;

io.on("connection", (socket: Socket): void => {
  console.log("A client connected.");
  socket.emit("counterUpdate", currentCounter);

  socket.on("counterUpdate", (newCounter: number): void => {
    currentCounter = newCounter;
    socket.broadcast.emit("counterUpdate", currentCounter);
    socket.emit("counterUpdate", currentCounter);
  });

  socket.on("disconnect", (): void => {
    console.log("A client disconnected.");
  });
});

const PORT: number = Number(process.env.PORT) || 3000;
server.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});
