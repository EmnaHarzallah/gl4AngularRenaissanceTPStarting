import { NgModule } from "@angular/core";
import {
  PreloadingStrategy,
  Route,
  RouterModule,
} from "@angular/router";
import { FrontComponent } from "./templates/front/front.component";
import { AdminComponent } from "./templates/admin/admin.component";
import { LoginComponent } from "./auth/login/login.component";
import { NF404Component } from "./components/nf404/nf404.component";
import { AuthGuard } from "./auth/guards/auth.guard";
import { CvComponent } from "./cv/cv/cv.component";
import { DetailsCvComponent } from "./cv/details-cv/details-cv.component";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: "root" })
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return route.data?.["preload"] === true ? load() : of(null);
  }
}

const routes: Route[] = [
  { path: "login", component: LoginComponent },
  {
    path: "rh",
    data: { preload: true },
    loadComponent: () =>
      import("./optimizationPattern/rh/rh.component").then(
        (m) => m.RhComponent,
      ),
  },
  {
    path: "ttc",
    data: { preload: true },
    loadComponent: () =>
      import("./ttc/ttc.component").then((m) => m.TtcComponent),
  },
  {
    path: "currency",
    loadComponent: () =>
      import("./tp2/currency-selector/country-currency-selector.component").then(
        (m) => m.CountryCurrencySelectorComponent,
      ),
  },
  {
    path: "products-filter",
    data: { preload: true },
    loadComponent: () =>
      import("./tp2/products-filter/products-filter.component").then(
        (m) => m.ProductsFilterComponent,
      ),
  },
  {
    path: "cv",
    component: CvComponent,
  },
  {
    path: "cv/add",
    data: { preload: true },
    canActivate: [AuthGuard],
    loadComponent: () =>
      import("./cv/add-cv/add-cv.component").then(
        (m) => m.AddCvComponent,
      ),
  },
  { path: "cv/:id", component: DetailsCvComponent },
  {
    path: "",
    component: FrontComponent,
    children: [
      {
        path: "todo",
        loadComponent: () =>
          import("./todo/todo/todo.component").then((m) => m.TodoComponent),
      },
      {
        path: "word",
        loadComponent: () =>
          import("./directives/mini-word/mini-word.component").then(
            (m) => m.MiniWordComponent,
          ),
      },
    ],
  },
  {
    path: "admin",
    component: AdminComponent,
    children: [
      {
        path: "color",
        loadComponent: () =>
          import("./components/color/color.component").then(
            (m) => m.ColorComponent,
          ),
      },
    ],
  },
  { path: "**", component: NF404Component },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: SelectivePreloadingStrategy,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
