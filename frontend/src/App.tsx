import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/Header'

import HomePage from './pages/HomePage'
import ScorePage from './pages/ScorePage'
import AboutPage from './pages/AboutPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'

const App = () => {
    return (
        <BrowserRouter>
            <Header />

            <Routes>
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/scoreboard" element={<ScorePage />}></Route>
                <Route path="/about" element={<AboutPage />}></Route>
                <Route path="/register" element={<RegisterPage />}></Route>
                <Route path="/login" element={<LoginPage />}></Route>
                <Route path="/admin" element={<AdminDashboardPage />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
