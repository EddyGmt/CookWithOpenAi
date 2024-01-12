import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { GetAllFavs } from '../services/userService'; 
import { AddContreIndication } from '../services/userService'; 


function Profil() {
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [contreIndication, setContreIndication] = useState('');
    const [errorMessage, setErrorMessage] = useState('');



   
    useEffect(() => {
        async function fetchFavoriteRecipes() {
            try {
                const {data} = await GetAllFavs();
                setFavoriteRecipes(data); 
            } catch (error) {
                console.error(error.message);
                // Gérer les erreurs de manière appropriée, par exemple, afficher un message d'erreur à l'utilisateur
            }
        }

        fetchFavoriteRecipes();
    }, []);

    const handleContreIndicationChange = (event) => {
        setContreIndication(event.target.value);
    };

    const handleAddContreIndication = async (event) => {
        event.preventDefault();

        try {
            await AddContreIndication(contreIndication);
            setContreIndication('');
            setErrorMessage(''); 
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

  return (
        <div className="d-flex flex-column vh-100">
            <Header />
            <h1 className="text-center mt-4">Profil</h1>
            <div className="col-lg-6 rounded bg-light">
                <h3>Vos favoris</h3>

                {favoriteRecipes && favoriteRecipes.length > 0 ? (
                    favoriteRecipes.map((recipe) => (
                        <div key={recipe.id}>
                            <p>{recipe.nom}</p>
                        </div>
                    ))
                ) : (
                    <p>Aucune recette favorite pour le moment.</p>
                )}
            </div>

            <div className="col-lg-6 rounded bg-light">

            <h3>Ajouter une contre-indication alimentaire</h3>
                <form onSubmit={handleAddContreIndication}>
                    <label>
                        Contre-indication :
                        <input
                            type="text"
                            value={contreIndication}
                            onChange={handleContreIndicationChange}
                        />
                    </label>
                    <button type="submit">Ajouter</button>
                </form>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                </div>
            <Footer />
        </div>
    );
}

export default Profil;
