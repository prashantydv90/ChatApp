import { io } from "socket.io-client";
const socket = io("http://localhost:3333", { withCredentials: true });
export default socket;