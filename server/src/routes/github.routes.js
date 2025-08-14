import { Router } from "express";

import { createPrWithTestCaseFile, getRepoFiles } from "../controllers/github.controller.js";

const githubRouter = Router();

// for getting the repoFiles
githubRouter.get('/repo-files', getRepoFiles)

// for creating pr with generate testCaseFile
githubRouter.post('/create-pr', createPrWithTestCaseFile);

export default githubRouter;
