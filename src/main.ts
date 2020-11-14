import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Sentry from "@sentry/angular";
import { Integrations } from "@sentry/tracing";


Sentry.init({
  dsn: "https://7dc3c4b511db4c71b80a1dda2e761d86@o476731.ingest.sentry.io/5516789",
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ["localhost", "https://relovely.com"],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
