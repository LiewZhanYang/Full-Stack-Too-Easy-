const express = require("express");
const router = express.Router();
const programtypeController = require("../controllers/programtypeController");

router.get("/:id", programtypeController.getTypeByID); 

module.exports = router;