import express from "express";
import { identifyContact } from "../controller/contactController.js";

const router = express.Router();


router.post("/identify", identifyContact);

export default router;
