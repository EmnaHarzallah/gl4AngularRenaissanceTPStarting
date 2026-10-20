import { CommonModule } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, convertToParamMap, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { of, throwError } from "rxjs";
import { AuthService } from "../../auth/services/auth.service";
import { Cv } from "../model/cv";
import { DefaultImagePipe } from "../pipes/default-image.pipe";
import { CvService } from "../services/cv.service";
import { DetailsCvComponent } from "./details-cv.component";

describe("DetailsCvComponent", () => {
  let fixture: ComponentFixture<DetailsCvComponent>;
  let cvService: jasmine.SpyObj<CvService>;
  let router: jasmine.SpyObj<Router>;
  let toastr: jasmine.SpyObj<ToastrService>;
  const cv = new Cv(1, "Ada", "Lovelace", "Analyst");

  beforeEach(async () => {
    cvService = jasmine.createSpyObj<CvService>("CvService", [
      "getCvById",
      "deleteCvById",
    ]);
    cvService.getCvById.and.returnValue(of(cv));
    cvService.deleteCvById.and.returnValue(of(null));
    router = jasmine.createSpyObj<Router>("Router", ["navigate"]);
    router.navigate.and.resolveTo(true);
    toastr = jasmine.createSpyObj<ToastrService>("ToastrService", [
      "success",
      "error",
    ]);

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [DetailsCvComponent, DefaultImagePipe],
      providers: [
        { provide: CvService, useValue: cvService },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: "1" })) },
        },
        { provide: Router, useValue: router },
        { provide: ToastrService, useValue: toastr },
        { provide: AuthService, useValue: { isAuthenticated: () => false } },
      ],
    }).compileComponents();
  });

  it("loads the CV for the id in the route", () => {
    fixture = TestBed.createComponent(DetailsCvComponent);
    fixture.detectChanges();

    expect(cvService.getCvById).toHaveBeenCalledWith(1);
    expect(fixture.nativeElement.textContent).toContain("Ada");
    expect(fixture.nativeElement.textContent).toContain("Lovelace");
  });

  it("notifies and redirects when loading the CV fails", () => {
    cvService.getCvById.and.returnValue(
      throwError(() => new Error("Server unavailable"))
    );
    fixture = TestBed.createComponent(DetailsCvComponent);
    fixture.detectChanges();

    expect(toastr.error).toHaveBeenCalledWith(
      "Impossible de charger ce CV."
    );
    expect(router.navigate).toHaveBeenCalled();
  });
});
