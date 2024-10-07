const router = require("express").Router();
const NotFoundError = require("../errors/NotFoundError");
const userRouter = require("./users");
const itemRouter = require("./clothingItem");
const { createUser, loginUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {validateUserLogIn, validateUserSignUp} = require("../middlewares/validation")

router.use("/items", itemRouter);
router.post("/signin", validateUserLogIn, loginUser);
router.post("/signup", validateUserSignUp, createUser);

router.use(auth);
router.use("/users", userRouter);

router.use((req, res, next) => {
  next (new NotFoundError ("Resource not found"));
});

module.exports = router;
