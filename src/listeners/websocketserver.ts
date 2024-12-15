import { WebSocketServer, WebSocket } from "ws";

interface EventData {
    userAction: string;
    timestamp: Date;
    payload: Record<string, any>;
}

export const startWebSocketServer = (server: any) => {
    const wss = new WebSocketServer({ server });

    console.log("WebSocket server started.");

    // Mock data sender to connected clients
    const sendMockEvent = (ws: WebSocket) => {
        const mockEvent: EventData = {
            userAction: "click",
            timestamp: new Date(),
            payload: {
                userId: Math.floor(Math.random() * 1000),
                action: "navigate",
            },
        };

        ws.send(JSON.stringify(mockEvent));
    };

    wss.on("connection", (ws) => {
        console.log("Client connected to WebSocket.");

        // Send mock events every 5 seconds
        const intervalId = setInterval(() => sendMockEvent(ws), 5000);

        // Cleanup when a client disconnects
        ws.on("close", () => {
            console.log("Client disconnected from WebSocket.");
            clearInterval(intervalId);
        });

        // Handle client messages (optional)
        ws.on("message", (message) => {
            console.log("Received from client:", message.toString());
        });
    });
};
