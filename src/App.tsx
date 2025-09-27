
import Header from './sub-components/header.tsx';
import Dashboard from './page/dashboard.tsx';
import Task from './page/task.tsx';
import Projects from './page/projects.tsx';
import TeamTasks from './page/team.tsx';
import UserManagement from './page/users.tsx';
import Notifications from './page/Notifications.tsx';
import LoginPage from "./page/login.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Header />
            <Dashboard />
       
          </>
        } />
        <Route path="/tasks" element={
          <>
            <Header />
            <Task />
          </>
        } />

        <Route path="/projects" element={
          <>
            <Header />
            <Projects />
          </>
        } />
        <Route path="/teams" element={
          <>
            <Header />
            <TeamTasks />
          </>
        } />


        <Route path="/users" element={
          <>
            <Header />
            <UserManagement />
          </>
        } />

        <Route path="/notifications" element={
          <>
            <Header />
            <Notifications />
          </>
        } />

        <Route path="/login" element={
          <>

            <LoginPage />
            <ToastContainer
            className="px-5 pt-1 text-sm"
              position="top-center"
              autoClose={3000}
              hideProgressBar={true}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />

          </>
        } />
      </Routes >
    </Router >


  )
}

export default App
