// routes/childRoutes.js
const express = require("express");
const router = express.Router();
const childController = require("../controllers/childController");

router.get("/:id", childController.getChildByAccountID);
router.post("/", childController.postChild);
router.delete("/:id", childController.deleteChild);
router.put("/:id", childController.updateChild);
router.put("/notes/:id", childController.updateChildNotes);
router.get("/session/:id", childController.getChildBySessionID)
router.get("/customer-by-child/:childID", childController.getCustomerByChildID);

module.exports = router;
