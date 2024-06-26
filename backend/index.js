const express = require('express')
const app = express();
const port =3001;
const MainRouter = require('./routes/index')
const cors = require ('cors');
const bodyparser = require('body-parser')

app.use(cors());
app.use("/api/v1", MainRouter)

app.listen(port, ()=> {
    console.log("Started at port")
})


