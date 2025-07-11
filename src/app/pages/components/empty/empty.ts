import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "empty",
  imports: [RouterLink],
  templateUrl: "./empty.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyComponent {}
