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
                    <Route path="/" element={<Log/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/profil" element={<Profil/>}/>
                    <Route path="/recette" element={<Recette/>}/>
                </Routes>
            </BrowserRouter>
    );
}

export default App;
