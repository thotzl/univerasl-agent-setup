const stopReduxRecording = () => {
  try {
    if (!window.__REDUX_AGENT_RECORDING__)
      return { status: "Not currently recording" };

    const storeKey = window.__REDUX_AGENT_STORE_KEY__;
    const store = window[storeKey];

    // Restore original dispatch
    if (store && window.__REDUX_AGENT_ORIGINAL_DISPATCH__) {
      store.dispatch = window.__REDUX_AGENT_ORIGINAL_DISPATCH__;
    }

    window.__REDUX_AGENT_RECORDING__ = false;
    const historyLength = (window.__REDUX_AGENT_HISTORY__ || []).length;
    return {
      success: true,
      message: `Stopped recording on window.${storeKey}. Captured ${historyLength} actions.`,
    };
  } catch (e) {
    return { error: e.message };
  }
};

return stopReduxRecording();
