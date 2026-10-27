const test = require("node:test");
const assert = require("node:assert/strict");
const cors = require("cors");
const { createCorsOptions } = require("../utils/corsOptions");

const allowedOrigins = [
    "https://grama-setu.onrender.com",
    "http://localhost:5173"
];
const makeRequest = (method = "GET", headers = {}) => new Promise((resolve, reject) => {
    const values = new Map();
    const writes = [];
    const req = { method, headers };
    const res = {
        statusCode: 200,
        setHeader(name, value) {
            writes.push([name.toLowerCase(), value]);
            values.set(name.toLowerCase(), value);
        },
        getHeader(name) { return values.get(name.toLowerCase()); },
        end() { finish(); }
    };
    let settled = false;
    const finish = () => {
        if (settled) return;
        settled = true;
        resolve({ status: res.statusCode, headers: Object.fromEntries(values), writes });
    };
    cors(createCorsOptions(` ${allowedOrigins[0]} , ${allowedOrigins[1]} `))(req, res, (error) => {
        if (error) return reject(error);
        finish();
    });
});

const assertOneMatchingOrigin = (response, origin) => {
    const values = response.writes.filter(([name]) => name === "access-control-allow-origin").map(([, value]) => value);
    assert.deepEqual(values, [origin]);
    assert.equal(response.headers["access-control-allow-origin"], origin);
    assert.equal(origin.includes(","), false);
};

test("localhost receives exactly one matching allow-origin header", async () => {
    const response = await makeRequest("GET", { origin: allowedOrigins[1] });
    assert.equal(response.status, 200);
    assertOneMatchingOrigin(response, allowedOrigins[1]);
});

test("deployed frontend receives exactly one matching allow-origin header", async () => {
    const response = await makeRequest("GET", { origin: allowedOrigins[0] });
    assert.equal(response.status, 200);
    assertOneMatchingOrigin(response, allowedOrigins[0]);
});

test("unapproved browser origins receive no allow-origin header", async () => {
    const response = await makeRequest("GET", { origin: "https://untrusted.example" });
    assert.equal(response.status, 200);
    assert.equal(response.headers["access-control-allow-origin"], undefined);
});

test("allowed preflight succeeds and returns one exact allow-origin header", async () => {
    const response = await makeRequest("OPTIONS", {
        origin: allowedOrigins[1],
        "access-control-request-method": "PATCH",
        "access-control-request-headers": "authorization,content-type"
    });
    assert.equal(response.status, 204);
    assertOneMatchingOrigin(response, allowedOrigins[1]);
    assert.match(response.headers["access-control-allow-methods"], /PATCH/);
    assert.match(response.headers["access-control-allow-headers"], /authorization/i);
});

test("requests without an Origin header continue without CORS response headers", async () => {
    const response = await makeRequest();
    assert.equal(response.status, 200);
    assert.equal(response.headers["access-control-allow-origin"], undefined);
});
