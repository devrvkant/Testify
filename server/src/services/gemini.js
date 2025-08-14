import { config } from "../config/env.js";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: config.testifyApiKey});

export default ai;