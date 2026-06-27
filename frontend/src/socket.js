import { io } from "socket.io-client";
export const socket = io("https://agile-management-tool.onrender.com", {
  autoConnect: false,
});
