import { Component, ViewChild, inject } from "@angular/core";
import { DrawerModule } from "primeng/drawer";
import { ButtonModule } from "primeng/button";
import { Ripple } from "primeng/ripple";
import { AvatarModule } from "primeng/avatar";
import { StyleClass } from "primeng/styleclass";
import { Drawer } from "primeng/drawer";
import { CommonModule } from "@angular/common";
import { UiService } from "../ui.service";
@Component({
  selector: "sidebar-componet",
  imports: [
    DrawerModule,
    ButtonModule,
    Ripple,
    AvatarModule,
    StyleClass,
    CommonModule,
  ],
  templateUrl: "./sidebar.html",
  styleUrl: "./sidebar.css",
})
export class Sidebar {
  @ViewChild("drawerRef") drawerRef!: Drawer;
  private readonly uiService: UiService = inject(UiService);
  visible: boolean = false;

  closeCallback(e: Event): void {
    this.uiService.setDrawerState(false);
    this.drawerRef.close(e);
  }
  get drawerState(): boolean {
    return (this.visible = this.uiService.drawerState);
  }
}
