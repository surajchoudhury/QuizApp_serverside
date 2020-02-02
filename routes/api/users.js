const express = require("express");
const Users = require("../../controllers/users");
const auth = require("../../modules/auth");
const router = express.Router();

// register user

router.post("/", Users.create);

// login user

router.post("/login", Users.login);

/* GET users listing. */

router.get("/", Users.listUsers);

//get a user

router.get("/:id", Users.getUser);

router.use(auth.verifyToken);

// update user

router.put("/:id", Users.update);

// update some info of user

router.patch("/:id", Users.updatePortion);

// delete a user

router.delete("/:id", Users.delete);

module.exports = router;
