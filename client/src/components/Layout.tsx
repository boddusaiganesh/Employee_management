import {Outlet, Link, useLocation, useNavigate} from 'react-router-dom';
import {useAuthStore} from '../store/authStore';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {user, logout} = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        {path: '/dashboard', label: 'Dashboard', icon: '📊'},
        {path: '/dashboard/employees', label: 'Employees', icon: '👥'},
        {path: '/dashboard/tasks', label: 'Tasks', icon: '✓'},
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-primary-600">
                                Employee MS
                            </h1>
                        </div>

                        <nav className="hidden md:flex space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                        location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                                            ? 'text-primary-600 bg-primary-50'
                                            : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className={`text-xs font-semibold ${
                                    user?.role === 'admin'
                                        ? 'text-primary-600'
                                        : 'text-gray-500'
                                }`}>
                                    {user?.role === 'admin' ? '👑 Administrator' : '👤 Regular User'}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
            <nav className="md:hidden bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-around py-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center px-3 py-2 text-xs font-medium rounded-md ${
                                    location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                                        ? 'text-primary-600 bg-primary-50'
                                        : 'text-gray-600'
                                }`}
                            >
                                <span className="text-xl mb-1">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet/>
            </main>
        </div>
    );
};

export default Layout;
