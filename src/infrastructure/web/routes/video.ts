import { Router } from "express";
import { VideoFactory } from "../../factories/VideoFactory";
import { TokenMiddlewareFactory } from "../../factories/TokenMiddlewareFactory";

const videoRoutes = Router();
const videoController = VideoFactory();
const tokenMiddleware = TokenMiddlewareFactory(); 

videoRoutes.post("/createVideo", tokenMiddleware.verifyToken, (req, res) => videoController.create(req, res));

videoRoutes.put("/updateVideo/:id", tokenMiddleware.verifyToken, (req, res) => videoController.update(req, res));

videoRoutes.delete("/deleteVideo/:id", tokenMiddleware.verifyToken, (req, res) => videoController.delete(req, res));

videoRoutes.get("/getAllVideos", tokenMiddleware.verifyToken, (req, res) => videoController.getAll(req, res));

export { videoRoutes };