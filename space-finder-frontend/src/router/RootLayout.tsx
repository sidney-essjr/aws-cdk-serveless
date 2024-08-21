import { Outlet } from "react-router-dom";
import Navbar from "../features/navbar/Navbar";


export default function RootLayout() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
