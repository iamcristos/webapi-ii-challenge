const express = require('express');
const server = express();
const PORT = process.env.PORT || 5000;
const route = require('./routes/routes');
server.set('port', PORT);

server.use(express.json())
server.use('/api/posts', route)

server.get('/',(req,res)=>{
    res.send("Welcome")
})
server.listen(PORT, ()=>{
    console.log(`server is listening at ${PORT}`)
});