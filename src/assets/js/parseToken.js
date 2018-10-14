export default ctx => {
  if (!ctx) {
    return "";
  }
  const isClient = typeof window !== "undefined";
  if (isClient && window.__JWT_TOKEN__) {
    return window.__JWT_TOKEN__;
  }
  let token = "";
  if (isClient) {
    token = ctx.$store
      ? ctx.$store.state.login
        ? ctx.$store.state.user.token
        : ""
      : ctx;
    window.__JWT_TOKEN__ = token;
    return token;
  }
  const cookies = ctx.header.cookie;
  if (!cookies) {
    return "";
  }
  cookies.split("; ").forEach(item => {
    const temp = item.split("=");
    if (temp[0] === "JWT-TOKEN") {
      token = temp[1];
    }
  });
  if (token) {
    return token;
  }
  const authHeader = ctx.header["authorization"];
  if (!authHeader) {
    return "";
  }
  return authHeader.split("Bearer ")[1];
};
