import React from "react";

export const useDepositList = () => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState();

  React.useEffect(() => {}, []);

  return { data, isLoading };
};
