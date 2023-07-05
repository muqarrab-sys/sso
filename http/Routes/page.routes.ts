import PagesController from "@http/Controllers/PagesController";
import { Router } from "express";

const router = Router();
const controller = new PagesController();

router.get("/login", controller.login);
router.get("/logout", controller.logout);
router.get("/signup", controller.signup);
router.get("/authorize", controller.authorize);

export default router;
