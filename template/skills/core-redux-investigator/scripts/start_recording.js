const startReduxRecording = (customGlobals = []) => {
  try {
    if (window.__REDUX_AGENT_RECORDING__)
      return { status: "Already recording" };

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

    if (!store)
      return {
        error: `Redux store not found. Checked: ${globalsToTry.join(", ")}`,
      };

    window.__REDUX_AGENT_HISTORY__ = [];
    window.__REDUX_AGENT_ORIGINAL_DISPATCH__ = store.dispatch;

    // Monkey-patch the dispatch function
    store.dispatch = function (action) {
      // Execute the original dispatch
      const result = window.__REDUX_AGENT_ORIGINAL_DISPATCH__.apply(
        this,
        arguments,
      );

      // Record the action
      window.__REDUX_AGENT_HISTORY__.push({
        time: new Date().toISOString(),
        action: action,
      });
      console.log(
        `[Redux Investigator] Action dispatched: ${action.type}`,
        action,
      );

      // Prevent memory leaks by keeping only the last 500 actions
      if (window.__REDUX_AGENT_HISTORY__.length > 500) {
        window.__REDUX_AGENT_HISTORY__.shift();
      }
      return result;
    };

    window.__REDUX_AGENT_RECORDING__ = true;
    window.__REDUX_AGENT_STORE_KEY__ = foundKey;

    return {
      success: true,
      message: `Started recording actions on window.${foundKey}. Max 500 actions kept in memory.`,
    };
  } catch (e) {
    return { error: e.message };
  }
};

// USAGE: The agent can modify these variables before execution
const myCustomGlobals = []; // e.g. ['myAppStore']
return startReduxRecording(myCustomGlobals);
