const express = require("express");
const router = express.Router();
const Admin = require("../../controllers/admins");

// register Admin

router.post("/", Admin.create);

// login Admin

router.post("/login", Admin.login);

// get all admins listing

router.get("/", Admin.listAdmins);

module.exports = router;
