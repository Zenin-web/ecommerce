import { Navigate, Route, Routes } from "react-router-dom";
import { UserLayout } from "@/components/layout/UserLayout";
import Home from "@/pages/user/Home";

function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;