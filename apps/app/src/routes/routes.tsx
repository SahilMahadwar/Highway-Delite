import { Route, Routes } from "react-router-dom";

import { LoginPage } from "../pages/auth/login";
import { HomePage } from "../pages/home";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/auth/login" element={<LoginPage />} />

      <Route path="/*" element={<div>404</div>} />
    </Routes>
  );
};
