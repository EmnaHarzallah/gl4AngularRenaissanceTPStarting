import { Component, inject } from "@angular/core";
import { FormBuilder, AbstractControl } from "@angular/forms";
import { catchError , debounceTime, distinctUntilChanged, switchMap, map, of, tap } from "rxjs";
import { CvService } from "../services/cv.service";
import { Cv } from "../model/cv";

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.css"],
})
export class AutocompleteComponent {
  formBuilder = inject(FormBuilder);
  cvService = inject(CvService);
  get search(): AbstractControl {
    return this.form.get("search")!;
  } 
  form = this.formBuilder.group({ search: [""] });
  cvs$ = this.search.valueChanges.pipe(
    debounceTime(300),
    map((value) => (value ?? "").trim()),
    distinctUntilChanged(),
    switchMap((name) =>
      name
        ? this.cvService.selectByName(name).pipe(catchError(() => of([] as Cv[])))
        : of([] as Cv[])
    ),
  );
  select(cv: Cv) {
  this.cvService.selectCv(cv);
}
trackById(index: number, cv: Cv) {
  return cv.id;
}
  
}
