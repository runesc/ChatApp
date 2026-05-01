import type { RouteObject } from "react-router-dom";
import type { ReactNode } from "react";
import { Route } from "react-router-dom";

const renderRoutes = (routes: RouteObject[]): ReactNode =>
  routes.map((route, idx) =>
    route.index ? (
      <Route key={idx} index element={route.element} />
    ) : (
      <Route key={route.path || idx} path={route.path} element={route.element}>
        {route.children ? renderRoutes(route.children) : null}
      </Route>
    )
  );

export default renderRoutes;