const express = require("express");
const router = express.Router();

const { checkAuthorization } = require("../Utils/utils");
const {
  addUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
} = require("../Controller/UserController");

router.get("/", checkAuthorization, getAllUsers);

router.get("/:id", checkAuthorization, getSingleUser);

router.post("/", checkAuthorization, addUser);

router.put("/:id", checkAuthorization, updateUser);

router.delete("/:id", checkAuthorization, deleteUser);

module.exports = router;
