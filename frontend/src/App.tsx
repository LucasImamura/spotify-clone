import { Route, Routes } from "react-router-dom";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import HomePage from "./pages/home/HomePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/auth-callback" element={<AuthCallbackPage />}></Route>
      </Routes>
    </>
  );
}

export default App
