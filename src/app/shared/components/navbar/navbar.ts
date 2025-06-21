import { Component, effect, inject, signal } from "@angular/core";
import { UiService } from "../ui.service";
import { MenuItem } from "primeng/api";
import { Menubar } from "primeng/menubar";

@Component({
  selector: "navbar-component",
  imports: [Menubar],
  templateUrl: "./navbar.html",
  styleUrl: "./navbar.css",
})
export class Navbar {
  private readonly uiService = inject(UiService);
  readonly items = signal<MenuItem[]>([]);

  constructor() {
    effect(() => {
      this.items.set([
        ...(!this.uiService.drawerState
          ? [
              {
                icon: "pi pi-menu",
                command: () => this.uiService.setDrawerState(true),
              },
            ]
          : []),
        {
          label: "Home",
          icon: "pi pi-book",
        },
        {
          label: "Authors",
          icon: "pi pi-user",
        },
      ]);
    });
  }
}
