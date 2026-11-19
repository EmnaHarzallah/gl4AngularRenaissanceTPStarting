import { Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { RouterOutlet } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { catchError, of } from "rxjs";
import { APP_ROUTES } from "../../../config/routes.config";
import { ListComponent } from "../list/list.component";
import { Cv } from "../model/cv";
import { CvService } from "../services/cv.service";

@Component({
  selector: "app-master-details-cv",
  templateUrl: "./master-details-cv.component.html",
  styleUrls: ["./master-details-cv.component.css"],
  imports: [ListComponent, RouterOutlet],
})
export class MasterDetailsCvComponent {
  private cvService = inject(CvService);
  private toastr = inject(ToastrService);

  /** Chemin de base des liens : /cv/list/<id> */
  readonly detailsPath = `/${APP_ROUTES.cv}/list`;

  /** Master : la liste des cvs (Observable HTTP converti en signal) */
  cvs = toSignal(
    this.cvService.getCvs().pipe(
      catchError(() => {
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
        return of(this.cvService.getFakeCvs());
      })
    ),
    { initialValue: [] as Cv[] }
  );
}
