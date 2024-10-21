const router = require("express").Router();
const inventoryController = require("../controllers/inventoryController");
const { verifyToken } = require("../utils/jwtAuth");

router.get("/issue/:labId", inventoryController.getIssuedInventoryHandler);
router.get(
  "/:labId",
  //need to include verifyToken middleware
  inventoryController.getInventoryHandler
);
router.post("/notify", inventoryController.notifyHandler);
router.post("/return", inventoryController.returnHandler);
router.put("/:labId", inventoryController.updateInventoryHandler);
router.post("/issue", inventoryController.issueHandler);
router.post("/:labId", inventoryController.addInventoryHandler);
// console.log(inventoryController.updateInventoryHandler);

module.exports = router;
