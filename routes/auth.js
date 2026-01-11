const express = require("express");
const router = express.Router();
const rateLimiter = require("express-rate-limit");

const authenticateUser = require("../middleware/authentication");
const testUser = require("../middleware/testUser");
const { login, register, updateUser } = require("../controllers/auth");

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 15, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { msg: "Too many requests from this IP, please, try again in 15 minutes" },
});

router.post("/login", apiLimiter, login);
router.post("/register", apiLimiter, register);
router.patch("/updateUser", authenticateUser, testUser, updateUser);

module.exports = router;
