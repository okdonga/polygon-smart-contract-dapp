import * as React from "react";

export const useContractRead = () => {
  const [readError, setReadError] = React.useState();

  const readMethod = React.useCallback(async (contract, method, args) => {
    if (contract) {
      try {
        setReadError();
        return await method(contract, args);
      } catch (error) {
        alert(error);
        setReadError(error);
      }
    }
  }, []);

  return {
    readMethod,
    readError,
  };
};
