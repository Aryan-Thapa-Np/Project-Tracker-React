
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
import PrivateRoute from "./sub-components/protected.tsx";
import PasswordResetPage from "./page/passwordReset.tsx";
import SettingsPage from "./page/settings.tsx";
import LogsPage from "./page/logs.tsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CheckPerm from "./sub-components/checkPerm.tsx";
import PageNotFound from "./page/404.tsx";

import InsufficientPermissionPage from "./page/permisiion.tsx";


import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PrivateRoute>

            <Header />
            <Dashboard />


          </PrivateRoute>
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
          <CheckPerm>
            <PrivateRoute>
              <Header />
              <UserManagement />
            </PrivateRoute>
          </CheckPerm>
        } />

        <Route path="/settings" element={
          <PrivateRoute>
            <Header />
            <SettingsPage />
          </PrivateRoute>
        } />


        <Route path="/logs" element={
          <CheckPerm>
            <PrivateRoute>
              <Header />
              <LogsPage />
              <ToastContainer
                className="px-5 pt-1 text-sm "
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
            </PrivateRoute>
          </CheckPerm>

        } />

        <Route path="/notifications" element={
          <>
            <Header />
            <Notifications />
          </>
        } />
        <Route path="/resetPassword" element={
          <>

            <PasswordResetPage />
            <ToastContainer
              className="px-5 pt-1 text-sm "
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


        <Route path="/InsufficientPermission" element={

          <InsufficientPermissionPage />
        } />

        <Route path="*" element={

          <PageNotFound />
        } />


      </Routes >


    </Router >


  )
}

export default App
