import request from "supertest";
import app from "../../app";
import { UserCollection } from "../../models/user.model";

// top-level -> suite
describe(
    "Integration: Auth Routes", // name of suite,
    () => {
        beforeAll(
            async () => {
                await UserCollection.deleteMany({}); // clear users collection before tests
            }
        );
        // same can be afterAll

        // group/nested
        describe(
            "POST /api/v1/auth/register", // name of group
            () => {
                
            }
        )
    }
)
