# Aymen Sellaouti Advanced Training

## M6 - Lazy loading and defer

### Baseline bundle

- Before optimization: initial total **4.80 MB** (raw) / **977.61 kB** estimated transfer.
- Before optimization, lazy chunks:
  - `products-filter-component`: 6.52 kB raw
  - `country-currency-selector-component`: 2.00 kB raw

- After optimization: initial total **882.32 kB** (raw) / **195.05 kB** estimated transfer.
- After optimization, lazy chunks:
  - `rh-component`: 3.04 MB raw / 744.51 kB estimated transfer
  - `ttc-component`: 6.99 kB raw
  - `products-filter-component`: 6.65 kB raw
  - `todo-component`: 4.46 kB raw
  - `mini-word-component`: 3.27 kB raw
  - `add-cv-component`: 2.85 kB raw
  - `country-currency-selector-component`: 2.12 kB raw
  - `color-component`: 1.14 kB raw
  - `embauche-component`: 1.09 kB raw (created by `@defer`)
- Result: the initial raw bundle decreased from 4.80 MB to 882.32 kB. The larger RH chunk was removed from startup because its Chart.js dependencies are now downloaded only with the RH route.

### Route strategy

| Route | Strategy | Justification |
| --- | --- | --- |
| `/login` | Eager | Authentication is a first-access page and must be available immediately. The small initial cost is acceptable. |
| `/cv` | Eager | It is the application's central page and preserves the existing M5 CV/list behavior. It is a likely first destination after login. |
| `/cv/:id` | Eager | Kept with the CV feature, since navigation follows the eager CV list and avoiding extra CV-route chunks keeps this flow simple. |
| `/cv/add` | Lazy | It is restricted by authentication and only used for a secondary CV action, so it should not increase the initial bundle. |
| `/todo` | Lazy | The Todo feature is secondary and infrequently needed compared with CV. It is downloaded only on navigation. |
| `/word` | Lazy | Word styling is a training/demo page, not part of the first display. Lazy loading reduces initial work. |
| `/admin/color` | Lazy | Color is a child demo page behind an administration layout and does not belong in the initial bundle. |
| `/rh` | Lazy | RH analytics includes heavy chart code and is a rarely visited secondary page, so isolation substantially limits initial cost. |
| `/ttc` | Lazy | The TTC calculator is not needed on the initial page and has a compact standalone implementation. Lazy loading avoids unnecessary startup work. |
| `/currency` | Lazy | It was already lazy and remains lazy because it is a training tool rather than a primary landing page. |
| `/products-filter` | Lazy | It was already lazy and remains lazy because it is isolated, infrequently visited demo functionality. |
| `/` layouts | Eager | `FrontComponent` and `AdminComponent` are layout shells for routed child pages. Keeping their small RouterOutlet shells eager avoids layout delays. |
| `**` | Eager | The compact not-found page is kept eager so an unknown URL always has a local fallback. |

### Preloading choice

A custom `SelectivePreloadingStrategy` is used. Routes marked `data: { preload: true }` are downloaded after the initial bundle becomes idle. This is preferable to `PreloadAllModules` because likely-next pages such as CV add, RH, TTC, currency and products-filter benefit from a fast visit, while demonstration routes without the flag remain downloaded only on demand. It is a trade-off: marked routes consume network bandwidth in the background, but the initial JavaScript response remains smaller.

### `EmbaucheComponent` defer

`EmbaucheComponent` is below the main CV content, so `@defer (on viewport; prefetch on idle)` is used. `on viewport` delays both rendering and activation until the placeholder enters the viewport. `prefetch on idle` downloads its code earlier when the browser is idle, without rendering the component. The placeholder is the observed element, while `@loading`, `minimum 500ms`, and `@error` provide loading and failure states. The component is standalone and is registered in `CvComponent.imports` only so Angular can type-check the template; it is referenced only inside the `@defer` block, allowing Angular to create a deferred dependency chunk rather than include it in the eager main bundle.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
