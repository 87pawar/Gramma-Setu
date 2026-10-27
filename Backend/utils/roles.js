const roleAliases = require("../../shared/roleAliases.json");
const ROLE_ALIASES = new Map(
    Object.entries(roleAliases).flatMap(([canonicalRole, aliases]) =>
        aliases.map((alias) => [alias, canonicalRole])
    )
);

const canonicalizeRole = (role, { isAdminVerified = false } = {}) => {
    const canonicalRole = ROLE_ALIASES.get(role);

    if (canonicalRole === "admin") {
        return isAdminVerified === true ? "admin" : null;
    }

    return canonicalRole || null;
};

const canonicalizePublicRole = (role) => {
    const canonicalRole = canonicalizeRole(role);

    return ["user", "farmer", "worker"].includes(canonicalRole)
        ? canonicalRole
        : null;
};

module.exports = {
    canonicalizeRole,
    canonicalizePublicRole
};
