import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import runsRouter from "./runs";
import pipelineRouter from "./pipeline";
import slackRouter from "./slack";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/leads", leadsRouter);
router.use("/runs", runsRouter);
router.use("/pipeline", pipelineRouter);
router.use("/slack", slackRouter);

export default router;
