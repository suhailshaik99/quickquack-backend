import express from "express";
import SearchController from "./search.controller.js";
import jwtAuthorizer from "../../middlewares/jwtAuthorizer.js";

const router = express.Router();

router.get("/", jwtAuthorizer, SearchController.searchUsers);

export {router};
