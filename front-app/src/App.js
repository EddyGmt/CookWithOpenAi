import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Log from "./views/Log";
import Home from "./views/Home";
import Profil from "./views/Profil";
import Recette from "./views/Recette";
// import {UserProvider} from "./Context/userContext";

function App() {
    return (
            <BrowserRouter>
                <Routes>
                    <Route name="login" path="/" element={<Log/>}/>
                    <Route name="home" path="/home" element={<Home/>}/>
                    <Route name="profil" path="/profil" element={<Profil/>}/>
                    <Route name="recette" path="/recette" element={<Recette/>}/>
                </Routes>
            </BrowserRouter>
    );
}

export default App;
