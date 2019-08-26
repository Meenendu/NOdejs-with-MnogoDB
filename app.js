const app = require("express")();
var bodyParser = require("body-parser");

const authRoutes = require("./Src/Routes/Auth");
const userRoutes = require("./Src/Routes/User");

var jsonParser = bodyParser.json();
app.use(jsonParser);

//Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.listen(3000, () => {
  console.log("server is running at port 3000");
});
