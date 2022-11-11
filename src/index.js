const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const route = require('./route/route')

const app = express();

app.use(bodyParser.json());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://mahesh999333:mahesh999333@cluster0.tecej.mongodb.net/mockAssignment",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log(err));


  // Initial route
app.use("/", route);

// port
app.listen(5000, function () {
  console.log("Express app running on port " +  5000);
});