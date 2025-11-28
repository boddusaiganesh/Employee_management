import {useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import {useAuthStore} from './store/authStore';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import LoginNew from './pages/LoginNew';
import DashboardNew from './pages/DashboardNew';
import EmployeesNew from './pages/EmployeesNew';
import EmployeeDetails from './pages/EmployeeDetails';
import TasksNew from './pages/TasksNew';

function App() {
    const {isAuthenticated, checkAuth} = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <ErrorBoundary>
            <Router>
                <Toaster position="top-right" reverseOrder={false}/>
                <Routes>
                    <Route path="/" element={!isAuthenticated ? <Welcome/> : <Navigate to="/dashboard"/>}/>
                    <Route path="/login" element={!isAuthenticated ? <LoginNew/> : <Navigate to="/dashboard"/>}/>

                    <Route
                        path="/dashboard"
                        element={isAuthenticated ? <Layout/> : <Navigate to="/login"/>}
                    >
                        <Route index element={<DashboardNew/>}/>
                        <Route path="employees" element={<EmployeesNew/>}/>
                        <Route path="employees/:id" element={<EmployeeDetails/>}/>
                        <Route path="tasks" element={<TasksNew/>}/>
                    </Route>
                </Routes>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
