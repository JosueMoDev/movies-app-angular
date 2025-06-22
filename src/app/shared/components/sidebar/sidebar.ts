import { Component } from "@angular/core";
import { DrawerModule } from "primeng/drawer";
import { ButtonModule } from "primeng/button";
import { Ripple } from "primeng/ripple";
import { AvatarModule } from "primeng/avatar";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
@Component({
  selector: "sidebar-componet",
  imports: [
    DrawerModule,
    ButtonModule,
    Ripple,
    AvatarModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: "./sidebar.html",
})
export class Sidebar {
  visible: boolean = true;
}
