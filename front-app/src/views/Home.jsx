import Footer from "../Components/Footer";
import Header from "../Components/Header";
import React, {useState} from "react";
import {SearchRecipe} from "../services/recetteService";
// import {useUser} from "../Context/userContext";

function Home() {
    const [prompt, setPrompt] = useState();
    // const { authState } = useUser();
    const token = localStorage.getItem('token');
    const handlePrompt = async e => {
        e.preventDefault();
        SearchRecipe(prompt, token)
            .then(response => {
                console.log('RESPONSE', response);
                // Reste du code pour gérer la réponse
            })
            .catch(error => {
                console.error('Erreur lors de la recherche de recettes :', error.message);
                // Gérer l'erreur ici
            });
    }
    return (
        <div className="d-flex flex-column vh-100">
            <Header/>

            <h1 className="text-center mt-4">Bienvenue!</h1>

            <form className="m-auto form-group d-block">
                <input className="form-control-lg"
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}/>

                <button type="submit" className="m-auto btn btn-primary" onClick={handlePrompt}>
                   Rechercher votre recette
                </button>
            </form>

            <div className="col-lg-6 m-auto rounded bg-info p-2">
                Aucunes recommandation pour le moment
            </div>
            <Footer/>
        </div>
    )
}

export default Home;