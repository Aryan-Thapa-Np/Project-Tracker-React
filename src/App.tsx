
import Header from './sub-components/header.tsx';
import Dashboard from './page/dashboard';
import Task from './page/task.tsx';
import Projects from './page/projects.tsx';
import TeamTasks from './page/team.tsx';
import UserManagement from './page/users.tsx';
import Notifications from './page/Notifications.tsx';
import LoginPage from "./page/login.tsx";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./sub-components/protected.tsx";
import PasswordResetPage from "./page/passwordReset.tsx";
import SettingsPage from "./page/settings.tsx";
import LogsPage from "./page/logs.tsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageNotFound from "./page/404.tsx";
import InternalServerError from "./page/500.tsx";

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
            <ToastContainer
              className="px-5 pt-1 text-sm "
              position="top-center"
              autoClose={2500}
              hideProgressBar={true}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />

          </PrivateRoute>
        } />
        <Route path="/tasks" element={
          <PrivateRoute>
            <Header />
            <Task />
            <ToastContainer
              className="px-5 pt-1 text-sm "
              position="top-center"
              autoClose={2500}
              hideProgressBar={true}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </PrivateRoute>
        } />

        <Route path="/projects" element={
          <PrivateRoute>
            <Header />
            <Projects />
            <ToastContainer
              className="px-5 pt-1 text-sm "
              position="top-center"
              autoClose={2500}
              hideProgressBar={true}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </PrivateRoute>
        } />
        <Route path="/teams" element={
          <PrivateRoute>
            <Header />
            <TeamTasks />
            <ToastContainer
              className="px-5 pt-1 text-sm "
              position="top-center"
              autoClose={2500}
              hideProgressBar={true}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </PrivateRoute>
        } />


        <Route path="/users" element={
          <PrivateRoute>
            <Header />
            <UserManagement />
            <ToastContainer
              className="px-5 pt-1 text-sm "
              position="top-center"
              autoClose={2500}
              hideProgressBar={true}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />

          </PrivateRoute>
        } />

        <Route path="/settings" element={
          <PrivateRoute>
            <Header />
            <SettingsPage />
            <ToastContainer
              className="px-5 pt-1 text-sm "
              position="top-center"
              autoClose={2500}
              hideProgressBar={true}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              transition={Bounce}
            />
          </PrivateRoute>
        } />


        <Route path="/logs" element={
          <PrivateRoute>
            <Header />
            <LogsPage />
            <ToastContainer
              className="px-5 pt-1 text-sm "
              position="top-center"
              autoClose={2500}
              hideProgressBar={true}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />

          </PrivateRoute>

        } />

        <Route path="/notifications" element={
          <PrivateRoute>
            <Header />
            <Notifications />
            <ToastContainer
              className="px-5 pt-1 text-sm "
              position="top-center"
              autoClose={2500}
              hideProgressBar={true}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </PrivateRoute>
        } />
        <Route path="/resetPassword" element={
          <>

            <PasswordResetPage />
            <ToastContainer
              className="px-5 pt-1 text-sm "
              position="top-center"
              autoClose={2500}
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
              autoClose={2500}
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
        <Route path="/InternalServerError" element={

          <InternalServerError />
        } />

        <Route path="*" element={

          <PageNotFound />
        } />


      </Routes >


    </Router >


  )
}

export default App
