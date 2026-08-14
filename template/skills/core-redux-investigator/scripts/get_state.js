const getReduxState = (customGlobals = []) => {
  try {
    const defaultGlobals = [
      "store",
      "__STORE__",
      "reduxStore",
      "__REDUX_STORE__",
    ];
    const globalsToTry = [...customGlobals, ...defaultGlobals];

    for (const key of globalsToTry) {
      if (window[key] && typeof window[key].getState === "function") {
        return {
          success: true,
          storeKey: key,
          state: window[key].getState(),
        };
      }
    }

    return {
      error: `Redux store not found. Checked globals: ${globalsToTry.join(", ")}`,
    };
  } catch (e) {
    return { error: e.message };
  }
};

// USAGE: The agent can modify these variables before execution
const myCustomGlobals = []; // e.g. ['myAppStore', 'liveStore']
return getReduxState(myCustomGlobals);
