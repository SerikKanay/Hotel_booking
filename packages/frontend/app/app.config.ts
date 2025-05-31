import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideClientHydration } from "@angular/platform-browser";

import { routes } from "./app.routes";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { NavigationComponent } from "./components/navigation/navigation.component";
import { ViewHotelComponent } from "./components/view-hotel/view-hotel.component";
import { authInterceptor } from "./interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideClientHydration(),
    CommonModule,
    FormsModule,
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavigationComponent,
    ViewHotelComponent,
    provideAnimationsAsync(),
  ],
};
