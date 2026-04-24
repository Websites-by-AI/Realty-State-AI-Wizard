import { Router, type IRouter } from "express";
import healthRouter from "./health";
import propertyRouter from "./property";
import openaiRouter from "./openai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(propertyRouter);
router.use(openaiRouter);

export default router;
