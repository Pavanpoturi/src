import { useEffect } from "react";
import { Provider } from "react-redux";
import moment from "moment-timezone";
import GlobalStyles from "./assets/styles/globalStyle";
import { store } from "./redux/store";
import Routes from "./router";
import AppProvider from "./AppProvider";

const App = () => {
  useEffect(() => {
    moment.tz.setDefault("Asia/Kolkata");
  }, []);

  return (
    <Provider store={store}>
      <AppProvider>
        <>
          <GlobalStyles />
          <Routes />
        </>
      </AppProvider>
    </Provider>
  );
};

export default App;
