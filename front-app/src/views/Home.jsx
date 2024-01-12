// Importez React, useState et les composants nécessaires
import React, {useState} from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import {SearchRecipe} from "../services/recetteService";

function Home() {
    const [nom, setNom] = useState("");
    const [recipes, setRecipes] = useState([]);
    const token = localStorage.getItem('token');

    const handlePrompt = async (e) => {
        e.preventDefault();
        SearchRecipe(nom, token)
            .then((response) => {
                console.log('RESPONSE', response.ideas[0]);

            })
            .catch((error) => {
                console.error('Erreur lors de la recherche de recettes :', error.message);
            });

    };
    return (
        <div className="d-flex flex-column vh-100">
            <Header/>
            <h1 className="text-center mt-4">Bienvenue!</h1>
            <form className="m-auto form-group d-block">
                <input
                    className="form-control-lg"
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                />
                <button type="submit" className="m-auto btn btn-primary" onClick={handlePrompt}>
                    Rechercher votre recette
                </button>
            </form>

            <div className="col-lg-6 m-auto rounded bg-info p-2">
                {/* Utilisez map pour parcourir les résultats et afficher chaque recette */}
                {recipes.map((recipe) => (
                    <div key={recipe.id} className="recipe-card">
                        <img src={recipe.img} alt={recipe.nom}/>
                        <h3>{recipe.nom}</h3>
                        <p>Nb de personnes : {recipe.nb_personnes}</p>
                        {/* Ajoutez d'autres détails de la recette selon vos besoins */}
                    </div>
                ))}
            </div>

            <Footer/>
        </div>
    );
}

export default Home;
