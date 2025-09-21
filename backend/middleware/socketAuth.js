// middlewares/socketAuth.js
import jwt from "jsonwebtoken";
export const verifySocketToken = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = payload.id;
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
};
