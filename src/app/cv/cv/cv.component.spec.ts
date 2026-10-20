import { CommonModule } from "@angular/common";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ToastrService } from "ngx-toastr";
import { of, Subject, throwError } from "rxjs";
import { LoggerService } from "../../services/logger.service";
import { Cv } from "../model/cv";
import { CvService } from "../services/cv.service";
import { CvComponent } from "./cv.component";

describe("CvComponent", () => {
  let component: CvComponent;
  let fixture: ComponentFixture<CvComponent>;
  let cvService: jasmine.SpyObj<CvService>;
  let toastr: jasmine.SpyObj<ToastrService>;
  let logger: jasmine.SpyObj<LoggerService>;
  const fakeCvs = [new Cv(1, "Ada", "Lovelace", "Analyst")];

  beforeEach(async () => {
    cvService = jasmine.createSpyObj<CvService>(
      "CvService",
      ["getCvs", "getFakeCvs"],
      { selectCv$: new Subject<Cv>() }
    );
    cvService.getCvs.and.returnValue(of(fakeCvs));
    cvService.getFakeCvs.and.returnValue(fakeCvs);
    toastr = jasmine.createSpyObj<ToastrService>("ToastrService", [
      "info",
      "error",
    ]);
    logger = jasmine.createSpyObj<LoggerService>("LoggerService", ["logger"]);

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [CvComponent],
      providers: [
        { provide: CvService, useValue: cvService },
        { provide: LoggerService, useValue: logger },
        { provide: ToastrService, useValue: toastr },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("loads CVs through an observable for the async pipe", (done) => {
    component.cvs$.subscribe((cvs) => {
      expect(cvs).toEqual(fakeCvs);
      done();
    });
  });

  it("uses fake CVs and displays an error notification when loading fails", (done) => {
    cvService.getCvs.and.returnValue(
      throwError(() => new Error("Server unavailable"))
    );

    const componentWithError = new CvComponent(
      logger,
      toastr,
      cvService
    );

    componentWithError.cvs$.subscribe((cvs) => {
      expect(cvs).toEqual(fakeCvs);
      expect(toastr.error).toHaveBeenCalled();
      done();
    });
  });
});
