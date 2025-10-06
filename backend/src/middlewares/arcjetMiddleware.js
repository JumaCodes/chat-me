import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
  try {
    // ✅ If the user is authenticated, skip bot detection
    // (assuming verifyToken middleware attaches user info to req.user)
    if (req.user) {
      return next();
    }

    // 🔒 Otherwise, run Arcjet checks
    const decision = await aj.protect(req);

    if (decision.isDenied) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          message: "Too many requests. Please try again later.",
        });
      } else if (decision.reason.isBot) {
        return res.status(403).json({
          message: "Bots Access Denied.",
        });
      } else {
        return res.status(403).json({
          message: "Access denied by security policy",
        });
      }
    }

    // 🧠 Extra spoofed-bot detection
    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed Bot Detected",
        message: "Malicious bot activity detected",
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet Protection Error:", error);
    next();
  }
};
