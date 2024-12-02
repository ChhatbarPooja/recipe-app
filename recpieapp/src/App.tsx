import React, { useEffect, useState, ReactNode, Suspense } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Chart from './pages/Chart';
import Profile from './pages/Profile';
import Tables from './pages/Tables';
import DefaultLayout from './layout/DefaultLayout';
import Homepage from './UserLayout/components/Homepage';
import Contact from './UserLayout/components/Pages/Contact';
import Aboutus from './UserLayout/components/Pages/Aboutus';
import Recpies from './UserLayout/components/Pages/Recpies';
import Login from './components/Admin/Login';
import UserLayout from './layout/UserLayout';
import { useAuth } from './hooks/useAuth';
import Calendar from './pages/Calendar';
import ListRecipe from './components/Admin/recipe/ListRecipe';
import AddRecipe from './components/Admin/recipe/AddRecipe';
import AddCategory from './components/Admin/category/AddCategory';
import ListCategory from './components/Admin/category/ListCategory';
import RecipeDetails from './UserLayout/components/Pages/RecipeDetails';
import Footer from './UserLayout/components/Footer';
import Navbar from './UserLayout/components/Navbar';
import MyRecipe from './UserLayout/components/MyRecipe';
import AddUserRecipe from './UserLayout/components/AddUserRecipe';
// import MyFavorite from './UserLayout/components/MyFavorite';
import NotFound from './UserLayout/components/NotFound';
import AdminReviews from './components/Admin/Review/AdminReview';
import ForgotPassword from './UserLayout/components/Pages/Forgotpassword';
import ResetPassword from './UserLayout/components/Pages/ResetPassword';
import AdminRecipeManagement from './components/Admin/recipe/ReviewRecipe';
import MyProfile from './UserLayout/components/MyProfile';
import ChangePassword from './UserLayout/components/ChangePassword';
import AdminContactUser from './components/Admin/Contact/AdminContactUser';
import AdminUserList from './components/Admin/User/AdminUserList';
const MyFavorite = React.lazy(() =>
  new Promise(resolve =>
    setTimeout(() => resolve(import('./UserLayout/components/MyFavorite') as any), 2000)
  )
);

// Private Route Component for Users
const UserPrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();

  return token && user?.role === 'user' ? (
    <>{children}</>
  ) : (
    <Navigate to="/" replace />
  );
};

// Private Route Component for Admins
const AdminPrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();

  return token && user?.role === 'admin' ? (
    <>{children}</>
  ) : (
    <Navigate to="/" replace />
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const { token, user } = useAuth();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!token) {
    return (
      <UserLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" index element={
            <>
              <PageTitle title="Home page" />
              <Homepage />
            </>
          } />
          <Route
            path="/admin/login"
            element={
              <>
                <PageTitle title="login" />
                <Login />
              </>
            }
          />
          <Route
            path="/auth/signin"
            element={
              <>
                <PageTitle title="Signin" />
                <SignIn />
              </>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <>
                <PageTitle title="Signup" />
                <SignUp />
              </>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <>
                <PageTitle title="forgotPassword" />
                <ForgotPassword />
              </>
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/contact"
            element={
              <>
                <PageTitle title="Contact" />
                <Contact />
              </>
            }
          />
          <Route
            path="/aboutus"
            element={
              <>
                <PageTitle title="About" />
                <Aboutus />
              </>
            }
          />
           <Route
            path="/recipe/details/:id"
            element={
              <>
                <PageTitle title="recipeDetails" />
                <Navbar/>
                <RecipeDetails />
              </>
            }
          />

          <Route
            path="/user-recpie"
            element={
              <>
                <PageTitle title="Recipe" />
                <Recpies />
              </>
            }
          />
          {/* recipe details route which is going to be private in user deshboard */}
          <Route
            path="/recipe/details"
            element={
              <>
                <PageTitle title="Recipe Detail" />
                <Recpies />
              </>
            }
          />
          <Route path="/notfound" element={<NotFound />} />
        </Routes>
      </UserLayout>
    );
  }

  if (token && user?.role === 'user') {
    return (
      <UserLayout>
        {/* User Private Routes */}
        <Routes>
          <Route path="/" index element={
            <>
              <PageTitle title="homepage" />
              <Homepage />
            </>
          } />
          <Route
            path="/contact"
            element={
              <>
                <PageTitle title="contact" />
                <Contact />
              </>
            }
          />
          <Route
            path="/aboutus"
            element={
              <>
                <PageTitle title="about" />
                <Aboutus />
              </>
            }
          />
          <Route
            path="/recipes"
            element={
              <UserPrivateRoute>
                <PageTitle title="Recipe" />
                <Chart />
              </UserPrivateRoute>
            }
          />
          <Route
            path="/myrecipe"
            element={
              <>
                <PageTitle title="myrecipe" />
                <Navbar />
                <MyRecipe />
              </>
            }
          />
            <Route
            path="/myprofile"
            element={
              <>
                <PageTitle title="myprofile" />
                <Navbar/>
                <MyProfile />
              </>
            }
          />
          <Route
            path="/favorites"
            element={
              <>
                <PageTitle title="Favorites" />
                <Navbar />
                <Suspense fallback={<div className='text-red-500'>Loading from suspense</div>}>
                <MyFavorite />
                </Suspense>
              </>
            }
          />
           <Route
            path="/changepassword"
            element={
              <>
                <PageTitle title="Changepassword" />
                <Navbar />
                <ChangePassword />
              </>
            }
          />
          <Route
            path="/add-recipe"
            element={
              <>
                <PageTitle title="addRecipe" />
                <Navbar />
                <AddUserRecipe />
              </>
            }
          />

          <Route
            path="/recipe/details/:id"
            element={
              <>
                <PageTitle title="recipeDetails" />
                <Navbar />
                <RecipeDetails />
              </>
            }
          />
          <Route path="/notfound" element={<NotFound />} />
        </Routes>
      </UserLayout>
    );
  }

  return (
    <DefaultLayout>
      <Routes>
        {/* Admin Private Routes */}
        {/* <Route
          path="/admin/dashboard"
          element={
            <AdminPrivateRoute>
              <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <ECommerce />
            </AdminPrivateRoute>
          }
        /> */}
        <Route
          path="/admin/users"
          element={
            <AdminPrivateRoute>
              <PageTitle title="Users" />
              <AdminUserList />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/add-category"
          element={
            <AdminPrivateRoute>
              <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <AddCategory />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/add-category/:id"
          element={
            <AdminPrivateRoute>
              <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <AddCategory />
            </AdminPrivateRoute>
          }
        />
         <Route
          path="/admin/contact"
          element={
            <AdminPrivateRoute>
              <PageTitle title="contact" />
              <AdminContactUser />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/list-category"
          element={
            <AdminPrivateRoute>
              <PageTitle title="categoryList" />
              <ListCategory />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/subcategory"
          element={
            <AdminPrivateRoute>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Calendar />
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/admin/list-recipe"
          element={
            <AdminPrivateRoute>
              <PageTitle title="recipe" />
              <ListRecipe />
            </AdminPrivateRoute>
          }
        />
           <Route
            path="/admin/recipe/details/:id"
            element={
              <>
                <AdminPrivateRoute>
                <PageTitle title="recipeDetails" />
                <RecipeDetails />
                </AdminPrivateRoute>

              </>
            }
          />

        <Route
          path="/admin/add-recipe"
          element={
            <AdminPrivateRoute>
              <PageTitle title="addRecipe" />
              <AddRecipe />
            </AdminPrivateRoute>
          }
        />

        <Route
          path="/admin/review"
          element={
            <AdminPrivateRoute>
             <PageTitle title="review" />
              <AdminReviews />
            </AdminPrivateRoute>
          }
        />

        <Route
          path="/admin/recipe/review"
          element={
            <AdminPrivateRoute>
              <PageTitle title="recipeReview" />
              <AdminRecipeManagement />
            </AdminPrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <AdminPrivateRoute>
              <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Profile />
            </AdminPrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/admin/list-recipe" replace />} />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
