const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors');
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET","POST","DELETE","PUT"]
  })
);

connectToMongo();
const port = 5000;

app.use(cors())

app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})