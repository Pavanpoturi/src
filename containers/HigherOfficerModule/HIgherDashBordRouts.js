import { lazy, Suspense } from "react";
import { Route, useRouteMatch, Switch } from "react-router-dom";
import Loader from "@components/utility/loader";

const routes = [
  {
    path: "",
    component: lazy(() => import("../HigherOfficerModule/ContentList")),
    exact: true,
  },
  {
    path: "crime-core-dashboard",
    component: lazy(() => import("../HigherOfficerModule/ContentList")),
    exact: true,
  },
  {
    path: "jurisdiction-dashboard",
    component: lazy(() =>
      import("../HigherOfficerModule/JudrisditionDashboard/index")
    ),
    exact: true,
  },
  {
    path: "generated-fir/:firId/",
    component: lazy(() => import("@containers/NewFir")),
  },
  {
    path: "advisory-and-ack",
    component: lazy(() => import("./AdvisoryAckDashboard/index")),
    exact: true,
  },
  {
    path: "dsr-reports",
    component: lazy(() => import("../../containers/Reports/DSRReports")),
    exact: true,
  },
  {
    path: "fsl-reports",
    component: lazy(() => import("../../containers/Reports/FSLStatusReport")),
    exact: true,
  },
  {
    path: "myPersonalInvestigation",
    component: lazy(() => import("./MyPersonalInvestigation/index")),
    exact: true,
  },
  {
    path: "grave-crimes",
    component: lazy(() => import("./GraveCrimeDashboard/index")),
    exact: true,
  },
  {
    path: "Fir/:firId/",
    component: lazy(() => import("../FirDetails/index")),
  },
  {
    path: "icjs-report",
    component: lazy(() => import("@containers/IcjsReport/index")),
  },
];

export default function AppRouter() {
  const { url } = useRouteMatch();
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        {routes.map((route, idx) => (
          <Route
            exact={route.exact}
            key={idx}
            path={`/dashboard/${route.path}`}
          >
            <route.component />
          </Route>
        ))}
      </Switch>
    </Suspense>
  );
}
