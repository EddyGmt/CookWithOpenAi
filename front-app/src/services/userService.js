const URL = "http://localhost:5000/api/user";

export async function AddFavorite(_recetteId, _token) {
    try {
        const response = await fetch(URL + '/addFavorite/' + _recetteId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + _token
            },
        });
        if (response.ok) {
            const favResponse = await response.json();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
    } catch (error) {
        throw new Error(`Erreur lors de la requête : ${error.message}`)
    }
}

export async function AddContreIndication(_type, _token) {
    const data = {_type}
    try {
        const response = await fetch(URL + '/add-contre-indication', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + _token
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const aiResponse = await response.json();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
    } catch (error) {
        throw new Error(`Erreur lors de la requête : ${error.message}`)
    }
}

export async function GetAllFavs(_token) {
    try {
        const response = await fetch(URL + '/getAllUserFavoris', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + _token
            }
        });
        if (response.ok) {
            const body = await response.json();
            console.log(body)
            return body;
        }
    } catch (error) {
        throw new Error(`Erreur lors de la requête : ${error.message}`)
    }
}

export default {AddFavorite, AddContreIndication, GetAllFavs}