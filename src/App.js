import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./app.scss";
import Signin from "./components/Signin";
import CreateAdmin from "./components/CreateAdmin";
import Dashboard from "./components/Dashboard";
import ForOFor from "./components/ForOFor";
import ProtectedAdminRoute from "./HOC";
function App() {
  return (
    <div className="App">
      <Router>
        {/* <Home /> */}
        <Switch>
          <Route exact path="/" component={Signin} />
          <Route path="/admin/create/admin" component={CreateAdmin} />
          <ProtectedAdminRoute path="/admin" component={Dashboard} />
          <Route path="*" component={ForOFor} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
