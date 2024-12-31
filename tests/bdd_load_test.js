import http from "k6/http";
import { sleep } from "k6";
import { randomString } from "https://jslib.k6.io/k6-utils/1.0.0/index.js";
import { describe, expect } from "https://jslib.k6.io/k6chaijs/4.3.4.3/index.js";

const BASE_URL = "http://localhost:5000";
const TOTAL_VUS = 10; // Total number of virtual users
const DURATION = "1m"; // Duration of the test

// Function to generate random user data for testing
function generateRandomUserData() {
  return {
    fullName: `fn_${randomString(10)}`,
    userName: `un_${randomString(8)}`,
    email: `${randomString(5)}@loadtest.com`,
    password: `pswd_${randomString(12)}`,
    phone: `${Math.floor(Math.random() * 1000000000)}`,
  };
}

export let options = {
  vus: TOTAL_VUS,
  duration: DURATION,
  thresholds: {
    http_req_failed: [{ threshold: "rate == 0.00", abortOnFail: true }],
    http_req_duration: ["p(95)<50"], // 95% of requests must complete below 50ms
  },
};
export default function testSuite() {
  describe("Should Register User and Login", () => {
    const userData = generateRandomUserData();

    // First register the user
    const registerResponse = http.post(`${BASE_URL}/client_registeration`, userData);

    // Use expect for assertions
    expect(registerResponse.status, "client_registeration response status").to.equal(200);
    expect(registerResponse).to.have.validJsonBody();
    expect(registerResponse.json(), "client_registeration").to.have.property("msg", "User Registered");

    // Now attempt to log in with same user
    const loginResponse = http.post(`${BASE_URL}/client_login`, {
      userName: userData.userName,
      email: userData.email,
      password: userData.password,
    });

    // Use expect for assertions
    expect(loginResponse.status, "client_login response status").to.equal(200);
    expect(loginResponse.json(), "client_login response").to.have.property("token");

    sleep(2); // Think time
  });
}
