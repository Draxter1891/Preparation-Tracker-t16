import { NavLink, Outlet, useNavigate } from "react-router";
import { Download, Plus } from "lucide-react";
import { usePractice } from "../context/PracticeContext.jsx";
import QuestionForm from "./QuestionForm.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";



export default function Layout() {
  const { openForm, formTarget } = usePractice();

  

  return (
    <div className="flex min-h-screen flex-col">
      
      <Navbar/>


      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <div className="mb-6 hidden justify-end gap-2 lg:flex">
          <button className="btn-primary" onClick={() => openForm(null)}>
            <Plus size={16} /> Add Practice Problem
          </button>
        </div>
        <Outlet />
      </main>

      <Footer/>

      {formTarget !== undefined && <QuestionForm />}
    </div>
  );
}
