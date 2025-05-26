import {Request, Response} from "express";
import cors from "cors";

const corsHandler = cors({
  origin: (origin, callback) => {
    const allowedOrigins = ["https://connah.dev", "https://www.connah.dev"];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
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
