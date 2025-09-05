@@ .. @@
 import React from 'react';
-import { Link } from 'react-router-dom';
+import { Link, useLocation } from 'react-router-dom';
 import { useAuth } from '../contexts/AuthContext';
 import { useTranslation } from 'react-i18next';
-import { Home, Search, Calendar, User, Plus, BarChart3 } from 'lucide-react';
+import { Home, Search, Calendar, User, Plus, BarChart3, LogOut } from 'lucide-react';

 export default function Header() {
   const { user, logout } = useAuth();
   const { t } = useTranslation();
+  const location = useLocation();
+
+  const isActive = (path: string) => {
+    return location.pathname === path;
+  };

   if (!user) {
     return (
       <header className="bg-white shadow-sm border-b">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center py-4">
             <Link to="/" className="text-2xl font-bold text-blue-600">
               Monasabati
             </Link>
             <div className="flex items-center space-x-4">
               <Link
                 to="/login"
                 className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
               >
                 {t('login')}
               </Link>
               <Link
                 to="/register"
                 className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
               >
                 {t('register')}
               </Link>
             </div>
           </div>
         </div>
       </header>
     );
   }

   return (
     <header className="bg-white shadow-sm border-b sticky top-0 z-40">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex justify-between items-center py-4">
           <Link to="/" className="text-2xl font-bold text-blue-600">
             Monasabati
           </Link>
           
           <nav className="hidden md:flex items-center space-x-8">
             <Link
               to="/"
-              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
+              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
+                isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
+              }`}
             >
               <Home size={18} />
               <span>{t('home')}</span>
             </Link>
             <Link
               to="/search"
-              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
+              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
+                isActive('/search') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
+              }`}
             >
               <Search size={18} />
               <span>{t('search')}</span>
             </Link>
             <Link
               to="/bookings"
-              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
+              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
+                isActive('/bookings') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
+              }`}
             >
               <Calendar size={18} />
               <span>{t('bookings')}</span>
             </Link>
             
             {user.userType === 'owner' && (
               <>
                 <Link
                   to="/dashboard"
-                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
+                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
+                    isActive('/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
+                  }`}
                 >
                   <BarChart3 size={18} />
                   <span>{t('dashboard')}</span>
                 </Link>
                 <Link
                   to="/add-venue"
-                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
+                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
+                    isActive('/add-venue') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
+                  }`}
                 >
                   <Plus size={18} />
                   <span>{t('addVenue')}</span>
                 </Link>
               </>
             )}
           </nav>

           <div className="flex items-center space-x-4">
             <Link
               to="/profile"
-              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
+              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
+                isActive('/profile') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
+              }`}
             >
               <User size={18} />
               <span className="hidden sm:inline">{user.name}</span>
             </Link>
             <button
               onClick={logout}
-              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
+              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
             >
+              <LogOut size={16} />
               <span>{t('logout')}</span>
             </button>
           </div>
         </div>
       </div>
     </header>
   );
 }