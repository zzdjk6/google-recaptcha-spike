import React from "react";
import "./App.css";
import FormWithCheckbox from "./FormWithCheckbox";
import FormWithInvisibleRecaptcha from "./FormWithInvisibleRecaptcha";

const App = () => {
  return (
    <div className="App">
      <div>
        <h2>Checkbox</h2>
        <div>
          <FormWithCheckbox />
        </div>
      </div>

      <div>
        <h2>Invisible</h2>
        <div>
          <FormWithInvisibleRecaptcha />
        </div>
      </div>
    </div>
  );
};

export default App;
