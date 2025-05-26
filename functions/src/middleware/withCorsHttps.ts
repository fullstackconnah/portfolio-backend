import { Request, Response } from 'express';
import cors from 'cors';

const corsHandler = cors({
  origin: ['https://connah.dev', 'https://www.connah.dev'],
  methods: ['POST'],
});

export function withCorsAndHttps(
  handler: (req: Request, res: Response) => void
    ): (req: Request, res: Response) => void {
    return (req, res) => {
        corsHandler(req, res, () => {
            if (req.headers['x-forwarded-proto'] !== 'https') {
                res.status(403).send('Please use HTTPS');
                return;
            }

        handler(req, res);
        });
    };
}