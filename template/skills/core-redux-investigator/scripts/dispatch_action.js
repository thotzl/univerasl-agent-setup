const dispatchReduxAction = (action, customGlobals = []) => {
  try {
    const defaultGlobals = [
      "store",
      "__STORE__",
      "reduxStore",
      "__REDUX_STORE__",
    ];
    const globalsToTry = [...customGlobals, ...defaultGlobals];

    let store = null;
    let foundKey = null;
    for (const key of globalsToTry) {
      if (window[key] && typeof window[key].dispatch === "function") {
        store = window[key];
        foundKey = key;
        break;
      }
    }

    if (!store) {
      return {
        error: `Redux store not found. Checked globals: ${globalsToTry.join(", ")}`,
      };
    }

    store.dispatch(action);
    return { success: true, storeKey: foundKey, newState: store.getState() };
  } catch (e) {
    return { error: e.message };
  }
};

// USAGE: The agent can modify these variables before execution
const actionToDispatch = { type: "YOUR_ACTION_TYPE", payload: {} };
const myCustomGlobals = []; // e.g. ['myAppStore']
return dispatchReduxAction(actionToDispatch, myCustomGlobals);
