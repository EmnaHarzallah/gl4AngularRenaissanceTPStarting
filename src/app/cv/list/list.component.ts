import { Component, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Cv } from "../model/cv";
import { NgClass } from "@angular/common";
import { ItemComponent } from "../item/item.component";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"],
  imports: [NgClass, ItemComponent, RouterLink, RouterLinkActive],
})
export class ListComponent {
  cvs = input<Cv[]>([]);
  detailsPath = input<string | null>(null);
}
