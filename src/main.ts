import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { importProvidersFrom } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";

import { AppComponent } from "./app/app.component";
import { APP_ROUTES } from "./app/app.routes";

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(APP_ROUTES),
    importProvidersFrom([
      MatIconModule,
      MatButtonModule,
      MatToolbarModule,
      MatSidenavModule,
    ]),
  ],
}).catch((err) => console.error(err));
