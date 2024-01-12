const URL = "http://localhost:5000/api/recette";


export async function SearchRecipe(nom, token) {
    const data = {nom};
    try {
        const response = await fetch(URL + '/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        });
        console.log('SERVICES', response)
        if (response.ok) {
            const aiResponse = await response.json();
            return aiResponse;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
    } catch (error) {
        throw new Error(`Erreur lors de la requête : ${error.message}`)
    }
}

export async function GenerateIngredient(_recetteId) {
    try {
        const response = await fetch(URL + '/generer-liste-de-course/' + _recetteId);
        if (response.ok) {
            const body = await response.json();
            return Array.isArray(body) ? body : [body];
        } else {
            throw new Error("Error fetch recipes");
        }
    } catch (error) {
        throw new Error(`Erreur lors de la requête : ${error.message}`)
    }
}

export async function GenerateAccompagnement(_recetteId) {
    try {
        const response = await fetch(URL + '/generer-accompagnements/' + _recetteId);
        if (response.ok) {
            const body = await response.json();
            return Array.isArray(body) ? body : [body];
        } else {
            throw new Error("Error fetch recipes");
        }
    } catch (error) {
        throw new Error(`Erreur lors de la requête : ${error.message}`)
    }
}

export async function NoteRecipe(_recetteId, note, comment, _token) {
    const data = {note, comment}
    try {
        const response = await fetch(URL + '/' + _recetteId + '/notation-commentary', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + _token
            },
            body: JSON.stringify(data)
        })
    } catch (error) {
        throw new Error(`Erreur lors de la requête : ${error.message}`)
    }
}

export default {SearchRecipe, GenerateIngredient, GenerateAccompagnement, NoteRecipe}


