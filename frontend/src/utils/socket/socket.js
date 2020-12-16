import socketIOClient from "socket.io-client";

const ENDPOINT = "localhost:3001";
export const socket = gameName => {
  return socketIOClient(ENDPOINT, {query: `gameName=${gameName}`});
};
