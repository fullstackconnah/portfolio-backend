import * as functions from 'firebase-functions';
import { uplinkHandler } from './controllers/uplinkController';
import { withCorsAndHttps } from './middleware/withCorsHttps';

export const uplinkMessage = functions.https.onRequest(withCorsAndHttps(uplinkHandler));
