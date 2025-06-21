import { Injectable, signal, WritableSignal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UiService {
  state: WritableSignal<boolean> = signal<boolean>(true);

  constructor() {}

  get drawerState(): boolean {
    return this.state();
  }

  setDrawerState(state: boolean) {
    this.state.update(() => state);
  }
}
