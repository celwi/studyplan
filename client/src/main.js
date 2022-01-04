import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";

const app = createApp(App);

import PulseLoader from "vue-spinner/src/PulseLoader.vue";
app.component("pulse-loader", PulseLoader);

import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faRedo,
  faPlusCircle,
  faArrowLeft,
  faUser,
  faBars,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faRedo, faPlusCircle, faArrowLeft, faUser, faBars, faSignOutAlt);
app.component("font-awesome-icon", FontAwesomeIcon);

//registering BaseComponents globall
const requireComponent = require.context(
  // The relative path of the components folder
  "./components",
  // Whether or not to look in subfolders
  false,
  // The regular expression used to match base component filenames
  /Base[A-Z]\w+\.(vue|js)$/
);

requireComponent.keys().forEach((fileName) => {
  // Get component config
  const componentConfig = requireComponent(fileName);

  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Gets the file name regardless of folder depth
      fileName
        .split("/")
        .pop()
        .replace(/\.\w+$/, "")
    )
  );

  //Register component globally
  app.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  );
});

store.subscribe((mutation, state) => {
  // Store the state object as a JSON string
  localStorage.setItem("store", JSON.stringify(state));
});

app.use(router);
app.use(store);
router.isReady().then(() => {
  app.mount("#app");
});
