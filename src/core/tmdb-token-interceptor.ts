import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { devEnv } from "@env/env.dev";

export function theMoviDBBearerInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const newReq = req.clone({
    headers: req.headers.append(
      "Authorization",
      `Bearer ${devEnv.bearerToken}`
    ),
  });
  return next(newReq);
}
