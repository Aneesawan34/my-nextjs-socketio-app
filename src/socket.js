"use client";

import { io } from "socket.io-client";

export const socket = io('/custom-namespace');