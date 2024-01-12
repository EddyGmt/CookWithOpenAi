import {loginUser} from "../services/authService";
import React, {useState} from "react";
import swal from 'sweetalert';


function Log() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const handleLogin = async e => {
        e.preventDefault();
        const response = await loginUser(username, password);
        console.log('RESPONSE', response)
        if ('token' in response) {
            localStorage.setItem('token', response['token']);
            localStorage.setItem('user', JSON.stringify(response['user']));
            window.location.href = "/home";
        } else {
            swal("Failed", response.message, "error");
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
                            type="text"
                            className="form-control mt-1"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}

                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" onClick={handleLogin}>
                            Se connecter
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Log;