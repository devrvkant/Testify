import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5500,
  nodeEnv: process.env.NODE_ENV,
  clientUrl: process.env.CLIENT_URL,
  testifyApiKey: process.env.TESTIFY_API_KEY,
  githubToken: process.env.GITHUB_TOKEN,
};
