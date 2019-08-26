const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");

const { getToken, db_config } = require("../Utils/utils");

const saltRounds = 10;

const login = (req, res) => {
  if (req.body.userName == "" || req.body.password == "") {
    res.send({ error: "Invalid Data" });
    throw new Error("Invalid Data");
  }

  MongoClient.connect(
    db_config.url,
    { useNewUrlParser: true },
    async (err, client) => {
      if (err) {
        res.send("ERROR");
      } else {
        try {
          const db = client.db(db_config.database);
          const result = await db
            .collection("Login")
            .find({ userName: req.body.userName })
            .toArray();
          if (result.length > 0) {
            let match = await bcrypt.compare(
              req.body.password,
              result[0].password
            );

            if (match) {
              let token = await getToken(req.body.userName);
              res.status(200).json(token);
            } else {
              res.send({ error: "Invalid Password" });
              throw new Error("Invalid Password");
            }
          } else {
            res.send({ error: "Invalid User Name" });
            throw new Error("Invalid User Name");
          }
        } catch (err) {
          console.log(err);
        } finally {
          client.close();
        }
      }
    }
  );
};

const signup = async (req, res) => {
  if (req.body.userName == "" || req.body.password == "") {
    res.send({ error: "INVALID DATA" });
    throw new Error("INVALID DATA");
  }

  let hashPassword = await bcrypt.hash(req.body.password, saltRounds);
  MongoClient.connect(
    db_config.url,
    { useNewUrlParser: true },
    async (err, client) => {
      if (err) {
        res.send("ERROR");
      } else {
        const db = client.db(db_config.database);
        try {
          const result = await db
            .collection("Login")
            .find({ userName: req.body.userName })
            .toArray();
          if (result.length == 0) {
            await db.collection("Login").insertOne({
              userName: req.body.userName,
              password: hashPassword
            });
            let token = await getToken(req.body.userName);
            res.status(200).json(token);
          } else {
            res.send({ error: "User Already exists" });
            throw new Error("User Already exists");
          }
        } catch (err) {
          console.log(err);
        } finally {
          client.close();
        }
      }
    }
  );
};

module.exports = { login, signup };
