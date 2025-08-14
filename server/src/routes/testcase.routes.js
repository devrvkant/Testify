import { Router } from "express";

import { generateSummaries, generateTestCaseCode } from "../controllers/testcase.controller.js";


const testcaseRouter = Router();

// generate summaries for selected files
testcaseRouter.post('/summaries', generateSummaries);

// generate test code
testcaseRouter.post('/generate', generateTestCaseCode);


export default testcaseRouter;
