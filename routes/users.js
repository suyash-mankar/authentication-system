const express = require("express");
const router = express.Router();
const passport = require("passport");

const usersController = require("../controllers/users_controller");

router.get("/sign-in", usersController.signIn);
router.get("/sign-up", usersController.signUp);
router.get("/sign-out", usersController.destroySession);
router.post("/create", usersController.create);
router.get("/profile", passport.checkAuthentication, usersController.profile);

// use passport as a middleware to authenticate
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

router.post(
  "/create-forgot-password-token",
  usersController.createForgotPasswordToken
);

router.get("/forgot-password", usersController.forgotPasswordPage);
router.get(
  "/forgot-password-reset/:accessToken",
  usersController.resetPasswordPage
);
router.post("/forgot-password-reset/:accessToken", usersController.forgotPasswordReset);

router.get("/change-password/:id", usersController.changePasswordPage);
router.post("/change-password/:id", usersController.changePassword);

module.exports = router;
