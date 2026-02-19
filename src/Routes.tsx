import Layout from "./components/Layout";
import { ArticleRoutes } from "./features/Article";
import Feed from "./features/Feed";

export const AppRoutes = [
  {
    path: "/",
    element: <Layout />,
    children: [{ index: true, element: <Feed /> }, ArticleRoutes],
  },
];
