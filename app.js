const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.error(e));

app.use(express.json());
app.use("/", mainRouter);

app.use((req, res, next)=> {
  req.user= {
    _id: '66b3f85615171645cf2e8e59'
  };
  next();
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
