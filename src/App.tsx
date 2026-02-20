import { createBrowserRouter, RouterProvider } from "react-router";
import { AppRoutes } from "./Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AppRouter = createBrowserRouter(AppRoutes);

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={AppRouter} />
    </QueryClientProvider>
  );
}

export default App;
