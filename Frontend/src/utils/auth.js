// Decode the payload of a JWT token
export function getUserFromToken(token) {

  // If there is no token, there is no logged-in user
  if (!token) {
    return null;
  }

  try {

    // JWT has three parts:
    // header.payload.signature
    const payload = token.split(".")[1];

    // Convert the Base64URL payload into normal text
    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");

    const decodedPayload = atob(normalizedPayload);

    // Convert the decoded text into a JavaScript object
    return JSON.parse(decodedPayload);

  } catch (error) {

    // Return null if the token cannot be decoded
    console.error("Invalid JWT token:", error);

    return null;
  }
}
