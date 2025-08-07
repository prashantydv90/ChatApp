import { io } from "socket.io-client";
const socket = io("https://chatapp-rtvj.onrender.com", { withCredentials: true });
export default socket;