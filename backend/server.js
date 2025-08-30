require('dotenv').config()
const app = require('./src/app')
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require('./src/service/ai.service');

const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors:{
        origin:"http://localhost:5173"
    }
});


const chatHistory = [

]


io.on("connection", (socket) => {
    console.log("A user is connected");

    socket.on("disconnect", () => {
        console.log("A user is Disconnected");

    })

    socket.on("ai-message", async (data) => {

        console.log("Recived prompt", data)

        chatHistory.push({
            role:"user",
            parts:[{text:data}]
        });
        const response = await generateResponse(chatHistory)
   
        chatHistory.push({
            role:"model",
            parts:[{text: response}]
        })

        socket.emit("ai-message-response",  response )

    })

});

httpServer.listen(3000, () => {
    console.log("server is runing on port 3000")
})