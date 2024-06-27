const express = require('express')
const app = express();
const port =3000;
const MainRouter = require('./routes/index')
const cors = require ('cors');
const bodyParser = require('body-parser');
app.use(express.json())
app.use(cors())

app.use("/api/v1", MainRouter)

app.listen(port, ()=> {
    console.log("Started at port")
})


