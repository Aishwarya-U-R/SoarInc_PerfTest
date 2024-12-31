import http from "k6/http";
import { check, sleep } from "k6";
import { fail } from "k6";

const BASE_URL = "http://localhost:5000";
const TOTAL_VUS = 10; // Total number of virtual users
const DURATION = "1m"; // Duration of the test

const randomUsersFile = open("../users_json/generated_users_50Vus.json");
const users = JSON.parse(randomUsersFile);

// export let options = {
//   vus: TOTAL_VUS,
//   duration: DURATION,
//   thresholds: {
//     http_req_duration: ["p(95)<200"], // 95% of requests must complete below 200ms
//   },
// };

//stress test options:
export let options = {
  stages: [
    { duration: "30s", target: 10 }, // Ramp up to 10 VUs in 30 seconds
    { duration: "1m", target: 50 }, // Stay at 50 VUs for 1 minute
    { duration: "1m", target: 100 }, // Ramp up to 100 VUs in 1 minute
    { duration: "2m", target: 100 }, // Stay at 100 VUs for 2 minutes
    { duration: "1m", target: 0 }, // Ramp down to 0 VUs in 1 minute
  ],
  thresholds: {
    http_req_duration: ["p(95)<200"], // 95% of requests must complete below 200ms
  },
};

export default function () {
  try {
    const randomUser = users[Math.floor(Math.random() * users.length)]; //picking random user
    const payload = {
      userName: randomUser.userName,
      email: randomUser.email,
      password: randomUser.password,
    };

    // Send a POST request to login the new user
    let loginResponse = http.post(`${BASE_URL}/client_login`, payload);
    const loginResponseJson = loginResponse.json();

    //Check login response and handle potential errors
    if (loginResponse.status !== 200 || (loginResponseJson.msg && (loginResponseJson.msg === "In correct email or password" || loginResponseJson.msg === "In correct username or password" || loginResponseJson.msg === "Failed"))) {
      throw new Error("Login failed due to :" + loginResponseJson.msg);
    }

    // Validate successful login
    check(loginResponse, {
      "status is 200": (r) => r.status === 200,
      "contains token": (r) => r.json().hasOwnProperty("token") || r.body.includes("token"),
    });

    sleep(2);
  } catch (error) {
    fail("Stopping execution due to error: " + error); // stop this failing VU's execution
  }
}
