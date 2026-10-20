import { ChangeDetectionStrategy, Component } from "@angular/core";
import { catchError, Observable, of, startWith } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { LoggerService } from "../../services/logger.service";
import { Cv } from "../model/cv";
import { CvService } from "../services/cv.service";

@Component({
  selector: "app-cv",
  templateUrl: "./cv.component.html",
  styleUrls: ["./cv.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvComponent {
  readonly date = new Date();
  readonly cvs$: Observable<Cv[]>;
  readonly selectedCv$: Observable<Cv | null>;

  constructor(
    private readonly logger: LoggerService,
    private readonly toastr: ToastrService,
    private readonly cvService: CvService
  ) {
    this.cvs$ = this.cvService.getCvs().pipe(
      catchError((error: unknown) => {
        this.logger.logger(error);
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
        return of(this.cvService.getFakeCvs());
      })
    );
    this.selectedCv$ = this.cvService.selectCv$.pipe(startWith(null));
    this.logger.logger("je suis le cvComponent");
    this.toastr.info("Bienvenu dans notre CvTech");
  }
}
