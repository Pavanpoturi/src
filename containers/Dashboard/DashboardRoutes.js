import { lazy, Suspense } from "react";
import { Route, useRouteMatch, Switch } from "react-router-dom";
import Loader from "@components/utility/loader";

const routes = [
  {
    path: "",
    component: lazy(() => import("@containers/Widgets/Widgets")),
    exact: true,
  },
  {
    path: "new-firs",
    component: lazy(() => import("@containers/Firs")),
  },
  {
    path: "new-fir",
    component: lazy(() => import("@containers/NewFir")),
  },
  {
    path: "draft-fir/:firId/",
    component: lazy(() => import("@containers/NewFir")),
  },
  {
    path: "generated-fir/:firId/",
    component: lazy(() => import("@containers/NewFir")),
  },
  {
    path: "pt-cases",
    component: lazy(() => import("@containers/Firs")),
  },
  {
    path: "ui-cases",
    component: lazy(() => import("@containers/Firs")),
  },
  {
    path: "transfer-of-cases",
    component: lazy(() => import("@containers/Firs")),
  },
  {
    path: "disposed",
    component: lazy(() => import("@containers/Firs")),
  },
  {
    path: "trial-of-cases",
    component: lazy(() => import("@containers/Firs")),
  },
  {
    path: "cc-nos-awaited",
    component: lazy(() => import("@containers/Firs")),
  },
  {
    path: "draft-cases",
    component: lazy(() => import("@containers/Firs")),
  },
  {
    path: "dsr-reports",
    component: lazy(() => import("@containers/Reports/DSRReports")),
  },
  {
    path: "accident-information-report",
    component: lazy(() =>
      import("@containers/Reports/AccidentInformationReport")
    ),
  },
  {
    path: "notifications-from-superior-officers",
    component: lazy(() =>
      import("@containers/NotificationsFromSuperiorOfficers")
    ),
  },
  {
    path: "icjs-report",
    component: lazy(() =>
      import("@containers/IcjsReport/index")
    ),
  },
  {
    path: "case-transfer",
    component: lazy(() => import("@containers/CaseTransfer")),
  },
  {
    path: "fsl-status-report",
    component: lazy(() => import("@containers/Reports/FSLStatusReport")),
  },
  {
    path: "fir/:firId/",
    component: lazy(() => import("@containers/FirDetails")),
  },
  {
    path: "settings",
    component: lazy(() => import("@containers/Settings/Settings")),
  },
  {
    path: "crime-core-dashboard",
    component: lazy(() => import("../HigherOfficerModule/ContentList")),
    exact: true,
  },
  {
    path: "myPersonalInvestigation",
    component: lazy(() =>
      import("../HigherOfficerModule/MyPersonalInvestigation/index")
    ),
    exact: true,
  },
];

export default function AppRouter() {
  const { url } = useRouteMatch();
  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        {routes.map((route, idx) => (
          <Route exact={route.exact} key={idx} path={`${url}/${route.path}`}>
            <route.component />
          </Route>
        ))}
      </Switch>
    </Suspense>
  );
}
