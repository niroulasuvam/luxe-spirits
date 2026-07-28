import { jest } from "@jest/globals";

process.env.DOTENV_CONFIG_QUIET = "true";
process.env.SECRET_KEY = process.env.SECRET_KEY || "luxespirits_secret_2026";
process.env.MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/luxe-spirits-db-test";

jest.setTimeout(15000);

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});
