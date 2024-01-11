import Footer from "../Components/Footer";
import Header from "../Components/Header";

function Home() {
    return (
        <div className="d-flex flex-column vh-100 bg-info">
            <Header/>

            <h1 className="text-center">Bienvenue!</h1>

            <div className="col-lg-6 m-auto">
                Aucunes recette favorites pour le moment, n'hésitez pas à en liker!
            </div>

            <div className="col-lg-6 m-auto">
                Aucunes recommandation pour le moment
            </div>
            <Footer/>
        </div>
    )
}

export default Home;