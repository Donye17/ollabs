import * as Sentry from '@sentry/nextjs';
import { scrubSentryEvent } from './lib/sentryScrub';

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
    beforeSend(event) {
        return scrubSentryEvent(event);
    },
    beforeSendTransaction(event) {
        return scrubSentryEvent(event);
    },
});
