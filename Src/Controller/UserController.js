const MongoClient = require("mongodb").MongoClient;
const { db_config } = require("../Utils/utils");
ObjectID = require("mongodb").ObjectID;

const addUser = (req, res) => {
  MongoClient.connect(db_config.url, { useNewUrlParser: true })
    .then(client => {
      const db = client.db(db_config.database);
      db.collection("User")
        .insertOne(req.body)
        .then(result => {
          res.send(result);
          client.close();
        })
        .catch(err => {
          client.close();
        });
    })
    .catch(err => {
      res.send(err);
    });
};

const getAllUsers = (req, res) => {
  MongoClient.connect(db_config.url, { useNewUrlParser: true })
    .then(async client => {
      const db = client.db(db_config.database);
      try {
        const result = await db
          .collection("User")
          .find({})
          .toArray();
        res.send(result);
      } catch {
        client.close();
      } finally {
        client.close();
      }
    })
    .catch(err => {
      res.send(err);
      console.log(err);
    });
};

const getSingleUser = (req, res) => {
  MongoClient.connect(db_config.url, { useNewUrlParser: true })
    .then(async client => {
      const db = client.db(db_config.database);
      try {
        const id = new ObjectID(req.params.id);
        const result = await db
          .collection("User")
          .find({ _id: id })
          .toArray();
        if (result.length) res.send(result);
        else res.status("404").send({ error: "User not found" });
      } catch (err) {
        res.status("404").send({ error: "User not found" });
        console.log(err);
      } finally {
        client.close();
      }
    })
    .catch(err => {
      res.send("ERROR");
    });
};

const updateUser = (req, res) => {
  MongoClient.connect(
    db_config.url,
    { useNewUrlParser: true },
    async (err, client) => {
      if (err) {
        res.send("ERROR");
      } else {
        try {
          const id = new ObjectID(req.params.id);
          const db = client.db(db_config.database);
          const result = await db.collection("User").findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            {
              returnOriginal: false,
              upsert: false //if true add new doc if requested doc not found
            }
          );

          res.send(result);
        } catch (err) {
          res.status("404").send({ error: "User not found" });
          console.log(err);
        } finally {
          client.close();
        }
      }
    }
  );
};

const deleteUser = (req, res) => {
  MongoClient.connect(
    db_config.url,
    { useNewUrlParser: true },
    async (err, client) => {
      if (err) {
        res.send("ERROR");
      } else {
        try {
          const id = new ObjectID(req.params.id);
          const db = client.db(db_config.database);
          const result = await db
            .collection("User")
            .findOneAndDelete({ _id: id });

          res.send(result);
        } catch (err) {
          res.status("404").send({ error: "User not found" });
          console.log(err);
        } finally {
          client.close();
        }
      }
    }
  );
};

module.exports = {
  addUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
};
