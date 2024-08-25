import { useState } from "react";
import Home from "./page/Home";
import userContext from "./utils/userContext";
import { Provider } from 'react-redux'
import store from "./app/store";
function App() {
  const [user, setUser] = useState({
    name: "Shree Radhey",
    email: "radhanikunjexpress@shyaamsundar.com",
    jaykara: "Jay Jay Shree Radhey....... Shyaam",
    sharangat_mantra: "Radha Vallabh Shri Harivansha",
    powerfull_manter: "Radha... Radha... Radha..."


  })
  return (
    <div className="App">
      <Provider store={store}>
        <userContext.Provider value={{ user, setUser }}>
          <Home />
        </userContext.Provider>
      </Provider>
    </div>
  );
}

export default App;
