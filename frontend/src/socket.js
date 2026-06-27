import { io } from "socket.io-client";
export const socket = io("https://agile-management-tool.vercel.app", {
  autoConnect: false,
});
