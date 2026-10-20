import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import {
  EMPTY,
  Observable,
  catchError,
  switchMap,
  tap,
  throwError,
} from "rxjs";
import { APP_ROUTES } from "../../../config/routes.config";
import { AuthService } from "../../auth/services/auth.service";
import { Cv } from "../model/cv";
import { CvService } from "../services/cv.service";

@Component({
  selector: "app-details-cv",
  templateUrl: "./details-cv.component.html",
  styleUrls: ["./details-cv.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsCvComponent implements OnInit {
  cv$!: Observable<Cv>;

  constructor(
    private readonly cvService: CvService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly toastr: ToastrService,
    public readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cv$ = this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get("id"));
        const cv$ =
          Number.isInteger(id) && id > 0
            ? this.cvService.getCvById(id)
            : throwError(() => new Error("Identifiant de CV invalide."));

        return cv$.pipe(
          catchError(() => {
            this.toastr.error("Impossible de charger ce CV.");
            void this.router.navigate([APP_ROUTES.cv]);
            return EMPTY;
          })
        );
      })
    );
  }

  deleteCv(cv: Cv): void {
    this.cvService
      .deleteCvById(cv.id)
      .pipe(
        tap(() => {
          this.toastr.success(`${cv.name} supprimé avec succès`);
          void this.router.navigate([APP_ROUTES.cv]);
        }),
        catchError(() => {
          this.toastr.error(
            "Problème avec le serveur, veuillez contacter l'admin."
          );
          return EMPTY;
        })
      )
      .subscribe();
  }
}
