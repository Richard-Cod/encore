// pages/api/finance/getProviders.ts

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { GetProvidersResponse } from "@/logic/services/financeService";
import { NextResponse } from "next/server";
import { getCookie } from "cookies-next";
import { AppConstants } from "@/constants";
import { headers } from "next/headers";

import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { APP_ENVS } from "@/config/envs";

// let io: SocketIOServer | undefined;

// const backendApiUrl = process.env.BACKEND_API_URL; // Assurez-vous de définir cette URL dans .env.local

async function sendToSocketServer(data: any) {
  // Make a POST request to the Socket.IO server to trigger a broadcast
  const response = await fetch(APP_ENVS.socketUrl + "/broadcast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to send data to Socket.IO server");
  }

  return response;
}

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  console.log("body webhook ", body);

  console.log("Received data to broadcast:", body);

  // Send data to the Socket.IO server to broadcast it to connected clients
  await sendToSocketServer(body);

  return NextResponse.json({
    message: "Data broadcasted to WebSocket clients",
  });

  // return new NextResponse("data: Hello from SSE\n\n", {
  //   headers: {
  //     "Content-Type": "text/event-stream",
  //     "Cache-Control": "no-cache",
  //     Connection: "keep-alive",
  //     "Content-Encoding": "none",
  //   },
  // });

  // return NextResponse.json({ status: "WebSocket initialized" });
}

// export async function GET(req: Request, res: Response) {
//   // const body = await req.json();
//   // console.log("body webhook ", body);

//   // if (!io) {
//   //   console.log("Initializing Socket.io server");
//   //   io = new SocketIOServer((process as any).server as NetServer);

//   //   io.on("connection", (socket) => {
//   //     console.log("Client connected");

//   //     const emited = socket.emit("hello", { message: "Hello from server!" });
//   //     console.log(emited);

//   //     socket.on("messageFromClient", (data) => {
//   //       console.log("Received from client:", data);
//   //     });

//   //     socket.on("disconnect", () => {
//   //       console.log("Client disconnected");
//   //     });
//   //   });
//   // }
//   return new NextResponse("data: Hello from SSE\n\n", {
//     headers: {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//       "Content-Encoding": "none",
//     },
//   });

// return NextResponse.json({ status: "WebSocket initialized" });
// }
