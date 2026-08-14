const getReduxRecording = (clearAfterRead = true) => {
  try {
    const history = window.__REDUX_AGENT_HISTORY__ || [];
    const result = [...history]; // Make a copy

    if (clearAfterRead) {
      window.__REDUX_AGENT_HISTORY__ = [];
    }

    return {
      success: true,
      isRecording: !!window.__REDUX_AGENT_RECORDING__,
      count: result.length,
      actions: result,
    };
  } catch (e) {
    return { error: e.message };
  }
};

// USAGE: The agent can modify this. Set to false to keep history after reading.
const clearHistoryAfterRead = true;
return getReduxRecording(clearHistoryAfterRead);
