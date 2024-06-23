import { BrowserRouter } from "react-router-dom";
import { Router } from "./routes/routes";

import "@fontsource-variable/inter";
import "./styles/globals.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./libs/react-query/query-client";

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Router />

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
