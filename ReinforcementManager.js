const ReinforcementManager = (() => {
  let ratio = 1;
  let responseCount = 0;

  const init = (params = {}) => {
    ratio = params.ratio || 1;
    responseCount = 0;
  };

  const registerOperantResponse = () => {
    responseCount++;
    if (responseCount >= ratio) {
      responseCount = 0;
      return true; // renforçateur délivré
    }
    return false; // pas encore délivré
  };

  const reset = () => {
    responseCount = 0;
  };

  return {
    init,
    registerOperantResponse,
    reset
  };
})();
