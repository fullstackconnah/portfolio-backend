import {Request, Response} from "express";
import cors from "cors";

const corsHandler = cors({
  origin: ["https://connah.dev", "https://www.connah.dev"],
  methods: ["POST"],
});

/**
 * Middleware to handle CORS and enforce HTTPS.
 * 
 * @param {Function} handler - The request handler function to be wrapped.
 * @returns {Function} - A new function that applies CORS and HTTPS checks.
 */
export function withCorsAndHttps(
  handler: (req: Request, res: Response) => void
): (req: Request, res: Response) => void {
  return (req, res) => {
    corsHandler(req, res, () => {
      if (req.headers["x-forwarded-proto"] !== "https") {
        res.status(403).send("Please use HTTPS");
        return;
      }

      handler(req, res);
    });
  };
}
