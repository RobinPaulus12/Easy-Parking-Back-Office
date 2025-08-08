
import '../assets/styles/navbar.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';
import { logout } from "../auth/authentification.js";
import { useNavigate } from 'react-router-dom';
import Auth from "../auth/authProvider";
import { useContext } from 'react';
import { useState } from 'react';



function Navbar() {
  const navigate = useNavigate();
  const {setIsAuthenticated} = useContext(Auth);

   // 👉 État pour afficher ou non la modale
   const [showModal, setShowModal] = useState(false);

  
  const handleLogout = () => {
       logout()
       .then(() => {
        setIsAuthenticated(false);
        navigate('/login');
       })
       .catch((e) => {
        console.log("error disconnect", e);
       })
    
      }
    return (
        <>
          <nav id="navbar" className="navbar navbar-light flex-column align-items-stretch p-3">
          <a className="navbar-brand" href="#"></a>
          <nav className="nav nav-pills flex-column">
            <Link className="nav-link" to="/accueil" id="header"><img src="src/assets/images/Home.png" alt="image"/>Accueil</Link>
            <Link className="nav-link" to="/utilisateur"id="header"><img src="src/assets/images/Chat.png" alt="image"/>Utilisateurs</Link>
            <Link className="nav-link" to="/parking"id="header"><img src="src/assets/images/parkings.png" alt="image"/>Parkings</Link>
            <Link className="nav-link" to="/voiture"id="header"><img src="src/assets/images/voitures.png" alt="image"/>Voitures</Link>
            <Link className="nav-link" to="/place"id="header"><img src="src/assets/images/Discount.png" alt="image"/>Places</Link>
            <Link className="nav-link" to="/localite"id="header"><img src="src/assets/images/Wallet.png" alt="image"/>Localités</Link>
          </nav>
        </nav><br/>
        <nav id="navbar2" className="navbar navbar-light  flex-column align-items-stretch p-3">
        <p className="disconnect-navbar" id="header2" onClick={() => setShowModal(true)}><img src="src/assets/images/Logout.png" alt="image"/>Se déconnecter</p>
        </nav>
        
    

    {/* ✅ MODALE DE CONFIRMATION */}
    {showModal && (
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmer la déconnexion</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
              <button type="button" className="btn btn-danger" onClick={handleLogout}>Se déconnecter</button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default Navbar;