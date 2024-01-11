const URL = "http://localhost:5000/api/user/login";

export async function loginUser(_username, _password){
    const data = {_username, _password}
    try{
        const response = await fetch(URL,{
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        })

        if (response.ok){
            const userData = await response.json();
            localStorage.setItem('token', userData.token);
        }else{
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
    }catch(error){
        throw new Error(`Erreur lors de la requête : ${error.message}`)
    }
}

export default loginUser;