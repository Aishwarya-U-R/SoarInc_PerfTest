import http from "k6/http";
import { check, sleep } from "k6";
import { randomString } from "https://jslib.k6.io/k6-utils/1.0.0/index.js"; // for random data generation
import file from "k6/x/file";

const BASE_URL = "http://localhost:5000";
const TOTAL_VUS = 10; // Total number of virtual users
const DURATION = "1m"; // Duration of the test

export function setup() {
  const outputFile = `./users_json/generated_users_${Date.now()}.json`;
  file.writeString(outputFile, "[\n");
  return { outputFile: outputFile };
}

// Random Data Generator
function generateRandomUserData() {
  return {
    fullName: randomString(10),
    userName: randomString(8),
    email: `${randomString(5)}@example.com`,
    password: randomString(12),
    phone: `${Math.floor(Math.random() * 1000000000)}`,
  };
}

export let options = {
  vus: TOTAL_VUS,
  duration: DURATION,
};

// export let options = {
//   stages: [
//     { duration: "1m", target: 10 }, // Ramp up to 10 users over 1 minute
//     { duration: "3m", target: 10 }, // Stay at 10 users for 3 minutes
//     { duration: "1m", target: 0 }, // Ramp down to 0 users over 1 minute
//   ],
// };

export default function (data) {
  const userData = generateRandomUserData();

  // Send a POST request to register a new user
  let response = http.post(`${BASE_URL}/client_registeration`, userData);

  // Check if the response is successful
  check(response, {
    "status is 200": (r) => r.status === 200,
    "response contains User Registered": (r) => r.body.includes("User Registered"),
  });

  const output = {
    fullName: userData.fullName,
    userName: userData.userName,
    email: userData.email,
    password: userData.password,
    phone: userData.phone,
  };

  file.appendString(data.outputFile, JSON.stringify(output, null, 2) + ",\n");

  // Sleep between requests to simulate real user behavior
  sleep(1);
}

export function teardown(data) {
  file.appendString(data.outputFile, "]");
  console.log(`Users data has been written to: ${data.outputFile}`);
}
