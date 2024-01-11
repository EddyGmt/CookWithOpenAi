import AuthService from "../services/authService";
import {loginUser} from "../services/authService";
import React, {useState} from "react";
import router from "../router";

function Log(){
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const handleLogin = async ()=>{
        try{
            const userData = await loginUser(username, password);

        }catch(error){
            console.error('Erreur lors de la connexion :', error.message)
        }
    }
    return (
        <div className="Auth-form-container col-lg-4 m-auto mt-5">
            <form className="Auth-form">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title text-center">Bienvenue sur Cook With OpenAi</h3>
                    <div className="form-group mt-3">
                        <label>Username</label>
                        <input
                            type="username"
                            className="form-control mt-1"
                            placeholder="Username"
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Mot de passe"
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary">
                            Se connecter
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Log;