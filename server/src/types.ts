// Define the type for our custom context variable
export type Bindings = {
  Variables: {
    wiki: (path: string) => Promise<any>;
  };
};
