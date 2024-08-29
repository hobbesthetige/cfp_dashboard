import { io, Socket } from "socket.io-client";

const token = localStorage.getItem("token"); // Retrieve the token from localStorage or your preferred storage
const socket: Socket = io("http://server:3001", {
  query: { token },
});

export default socket;