import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignUpPage } from './pages/SignUpPage/SignUpPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage/AccountSettingsPage';
import { SignInPage } from './pages/SignInPage/SignInPage';
import { HomePage } from './pages/HomePage/HomePage';
import { PostPage } from './pages/PostPage/PostPage';
import { UserContextProvider } from './context/UserContext';

const App = () => {
  return (
      <BrowserRouter>
        <UserContextProvider>
          <Routes>
            <Route path="/" element={<SignInPage/>}/>
            <Route path="/signup" element={<SignUpPage/>}/>
            <Route path="/home" element={<HomePage/>}/>
            <Route path="/settings" element={<AccountSettingsPage/>}/>
            <Route path="/post/:id" element={<PostPage/>}/>
          </Routes>  
        </UserContextProvider>
      </BrowserRouter>
  );
}

export default App;
