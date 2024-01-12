import Header from "../Components/Header";
import Footer from "../Components/Footer";

function Profil(){

    return(
        <div className="d-flex flex-column vh-100">
            <Header/>
            <h1 class="text-center mt-4">Profil</h1>
            <div className="col-lg-6 rounded bg-light">
                Aucunes listes favorites
            </div>
            <Footer/>
        </div>
    )
}

export default Profil;