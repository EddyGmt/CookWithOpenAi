const URL = "http://localhost:5000/api/user/login";

// Service
export async function loginUser(username, password) {
    const data = { username, password };
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('token', userData.token);
            return userData;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
    } catch (error) {
        throw new Error(`Erreur lors de la requête : ${error.message}`);
    }
}


export default loginUser;