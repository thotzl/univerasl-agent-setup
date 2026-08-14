const findReduxStores = () => {
  try {
    const foundStores = [];
    // Iterate over all window properties safely
    for (const key in window) {
      try {
        const val = window[key];
        // Check if it looks like a Redux store: an object with getState, dispatch, and subscribe methods.
        if (
          val &&
          typeof val === "object" &&
          typeof val.getState === "function" &&
          typeof val.dispatch === "function" &&
          typeof val.subscribe === "function"
        ) {
          foundStores.push(key);
        }
      } catch (e) {
        // Ignore DOM exceptions (e.g. cross-origin frame access exceptions)
      }
    }
    return {
      success: true,
      foundGlobals: foundStores,
      message:
        foundStores.length > 0
          ? `Potential Redux stores found on window: ${foundStores.join(", ")}`
          : "No Redux stores found on the window object. The application must expose it explicitly.",
    };
  } catch (e) {
    return { error: e.message };
  }
};
return findReduxStores();
