import {Request, Response} from "express";
import cors from "cors";

const corsHandler = cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://connah.com.au",
      "https://www.connah.com.au",
      "http://localhost:3000",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("Blocked by CORS:", origin);
      callback(null, false);
    }
  },
  methods: ["POST"],
});


/**
 * Middleware to handle CORS and enforce HTTPS for Firebase functions.
 *
 * @param {Function} handler - The main request handler function.
 * @return {Function} A wrapped handler that applies CORS and HTTPS checks.
 */
export function withCorsAndHttps(
  handler: (req: Request, res: Response) => void
): (req: Request, res: Response) => void {
  return (req, res) => {
    corsHandler(req, res, () => {
      if (req.headers["x-forwarded-proto"] !== "https" && process.env.NODE_ENV === "production") {
        return res.status(403).send("Please use HTTPS");
      }

      return handler(req, res);
    });
  };
}
