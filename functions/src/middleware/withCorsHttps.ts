import {Request, Response} from "express";
import cors from "cors";

const allowedOrigins = ["https://connah.com.au", "https://www.connah.com.au"];

const corsHandler = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
});

/**
 * Middleware to handle CORS and enforce HTTPS in production.
 *
 * @param {Function} handler - The actual request handler function.
 * @return {Function} A middleware function that applies CORS and HTTPS checks.
 */
export function withCorsAndHttps(
  handler: (req: Request, res: Response) => void
): (req: Request, res: Response) => void {
  return (req, res) => {
    corsHandler(req, res, () => {
      if (req.method === "OPTIONS") {
        return res.status(204).send("");
      }

      if (
        req.headers["x-forwarded-proto"] !== "https" &&
        process.env.NODE_ENV === "production"
      ) {
        return res.status(403).send("Please use HTTPS");
      }

      return handler(req, res);
    });
  };
}
