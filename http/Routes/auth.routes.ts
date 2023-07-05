import AuthController from "@http/Controllers/AuthController";
import isAuthenticated from "@http/Middleware/isAuthenticated";
import { Router } from "express";

const router = Router();
const controller = new AuthController();

router.get("/authenticate", isAuthenticated, controller.authenticate);
router.get("/getIdentity", controller.getIdentity);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.post("/signup", controller.signup);

export default router;
