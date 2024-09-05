const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const userRouter = require("./users");
const itemRouter = require("./clothingItem");
const { createUser, loginUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use("/items", itemRouter);
router.post("/signin", loginUser);
router.post("/signup", createUser);

router.use(auth);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Resource not found" });
});

module.exports = router;
