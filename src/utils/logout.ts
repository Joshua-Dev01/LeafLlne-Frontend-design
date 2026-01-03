// utils/logout.ts
export const logout = () => {
  localStorage.removeItem("token"); // remove JWT
  localStorage.removeItem("user");  // if you store user info
  localStorage.removeItem("isVerified");
};
