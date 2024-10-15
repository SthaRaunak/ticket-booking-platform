import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validation.middleware";
import { loginUserSchema, registerUserSchema } from "../schemas/auth.schemas";
import { asyncHandler } from "../utils/asyncHandler";
import { authMiddleware } from "../middlewares/auth.middleware";
import { RBAC } from "../middlewares/rbac.middleware";

const router = Router();

router
  .route("/sign-up")
  .post(
    validateRequest(registerUserSchema),
    asyncHandler(authController.registerUser)
  );

router
  .route("/login")
  .post(
    validateRequest(loginUserSchema),
    asyncHandler(authController.loginUser)
  );

router
  .route("/logout")
  .get(authMiddleware, asyncHandler(authController.logoutUser));

router.route("/me").get(authMiddleware, asyncHandler(authController.me));

router.route("/refresh").post(asyncHandler(authController.refresh));

//temp test
router.route("/rbacTest").get(authMiddleware, RBAC("ADMIN"), (req, res) => {
  res.json({
    sucess: true,
  });
});
export default router;
