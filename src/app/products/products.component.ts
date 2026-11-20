
import { ChangeDetectionStrategy, Component } from "@angular/core";

import {
  Observable,
  Subject,
  catchError,
  exhaustMap,
  map,
  of,
  scan,
  shareReplay,
  startWith,
} from "rxjs";

import { Product } from "./dto/product.dto";
import { ProductApiResponse } from "./dto/product-api-response.dto";
import {
  ProductLoadEvent,
  ProductsViewModel,
} from "./dto/products-state.dto";
import { ProductService } from "./services/product.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {
  private readonly PAGE_SIZE = 12;

  // Déclenche le chargement de la page suivante
  private readonly loadMore$ = new Subject<void>();

  // État initial
  private readonly initialState: ProductsViewModel = {
    products: [],
    total: 0,
    loading: false,
    error: false,
    hasMore: true,
  };

  // Observable contenant tout l'état du composant
  readonly vm$: Observable<ProductsViewModel> = this.loadMore$.pipe(

    // Déclencher automatiquement le premier chargement
    startWith(undefined),

    // Calculer skip : 0, 12, 24, 36...
    scan((skip) => skip + this.PAGE_SIZE, -this.PAGE_SIZE),

    // Ignorer les clics pendant une requête en cours
    exhaustMap((skip) =>
      this.productService.getProducts({
        limit: this.PAGE_SIZE,
        skip,
      }).pipe(

        // Transformer la réponse en événement success
        map(
          (response: ProductApiResponse): ProductLoadEvent => ({
            type: "success",
            response,
          })
        ),

        // Gérer les erreurs
        catchError((error): Observable<ProductLoadEvent> => {
          console.error("Erreur :", error);

          this.toastr.error(
            "Erreur lors du chargement des produits"
          );

          return of({
            type: "error",
            response: null,
          });
        }),

        // Émettre loading avant la réponse HTTP
        startWith({
          type: "loading" as const,
          response: null,
        })
      )
    ),

    // Mettre à jour l'état du composant
    scan(
      (
        state: ProductsViewModel,
        event: ProductLoadEvent
      ): ProductsViewModel => {

        // Cas 1 : chargement en cours
        if (event.type === "loading") {
          return {
            ...state,
            loading: true,
            error: false,
          };
        }

        // Cas 2 : erreur
        if (event.type === "error") {
          return {
            ...state,
            loading: false,
            error: true,
          };
        }

        // Cas 3 : chargement réussi
        const products = [
          ...state.products,
          ...event.response.products,
        ];

        return {
          products,
          total: event.response.total,
          loading: false,
          error: false,
          hasMore:
            products.length < event.response.total &&
            event.response.products.length > 0,
        };
      },
      this.initialState
    ),

    // Partager le dernier état entre les abonnés
    shareReplay({
      bufferSize: 1,
      refCount: true,
    })
  );

  constructor(
    private readonly productService: ProductService,
    private readonly toastr: ToastrService
  ) {}

  // Demander le chargement de la page suivante
  loadMore(): void {
    this.loadMore$.next();
  }
}
