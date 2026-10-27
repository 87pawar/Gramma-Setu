const test = require("node:test");
const assert = require("node:assert/strict");

const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const authController = require("../Controller/authController");
const { validateRegistration } = require("../Middleware/validationMiddleware");

const makeResponse = () => ({
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
});

const registrationBody = (role) => ({
    name: "Rural User",
    email: `${role.toLowerCase()}@example.test`,
    phone: "9876543210",
    password: "valid-password",
    role,
    location: "Village"
});

test("registration persists canonical user, farmer, and worker roles accepted by the User schema", async (t) => {
    const originalFindOne = User.findOne;
    const originalSave = User.prototype.save;
    const originalHash = bcrypt.hash;
    const savedRoles = [];
    User.findOne = async () => null;
    bcrypt.hash = async (password) => `hashed:${password}`;
    User.prototype.save = async function saveAndValidate() {
        await this.validate();
        savedRoles.push(this.role);
        return this;
    };
    t.after(() => {
        User.findOne = originalFindOne;
        User.prototype.save = originalSave;
        bcrypt.hash = originalHash;
    });

    for (const role of ["user", "farmer", "worker"]) {
        const req = { body: registrationBody(role) };
        let validationPassed = false;
        validateRegistration(req, makeResponse(), () => { validationPassed = true; });
        assert.equal(validationPassed, true, `${role} should pass registration validation`);

        const res = makeResponse();
        await authController.registerUser(req, res);
        assert.equal(res.statusCode, 201, `${role} should save successfully`);
        assert.equal(res.body.user.role, role);
    }

    assert.deepEqual(savedRoles, ["user", "farmer", "worker"]);
});

test("legacy Farmer and Worker registration spellings persist canonical roles", async (t) => {
    const originalFindOne = User.findOne;
    const originalSave = User.prototype.save;
    const originalHash = bcrypt.hash;
    const savedRoles = [];
    User.findOne = async () => null;
    bcrypt.hash = async (password) => `hashed:${password}`;
    User.prototype.save = async function saveAndValidate() {
        await this.validate();
        savedRoles.push(this.role);
        return this;
    };
    t.after(() => {
        User.findOne = originalFindOne;
        User.prototype.save = originalSave;
        bcrypt.hash = originalHash;
    });

    for (const [submittedRole, canonicalRole] of [["Farmer", "farmer"], ["Worker", "worker"]]) {
        const req = { body: registrationBody(submittedRole) };
        const validationRes = makeResponse();
        let validationPassed = false;
        validateRegistration(req, validationRes, () => { validationPassed = true; });
        assert.equal(validationPassed, true);

        const res = makeResponse();
        await authController.registerUser(req, res);
        assert.equal(res.statusCode, 201);
        assert.equal(res.body.user.role, canonicalRole);
    }

    assert.deepEqual(savedRoles, ["farmer", "worker"]);
});

test("public registration rejects canonical and legacy administrator roles", async () => {
    for (const role of ["admin", "Admin"]) {
        const req = { body: registrationBody(role) };
        const res = makeResponse();
        let proceeded = false;
        validateRegistration(req, res, () => { proceeded = true; });
        assert.equal(proceeded, false);
        assert.equal(res.statusCode, 400);

        const controllerRes = makeResponse();
        await authController.registerUser(req, controllerRes);
        assert.equal(controllerRes.statusCode, 400);
    }
});
