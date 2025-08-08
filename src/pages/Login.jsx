import { useState, useContext } from 'react';
import '../assets/styles/login.css';
import { login } from "../auth/authentification.js";
import { useNavigate } from 'react-router-dom';
import Auth from "../auth/authProvider";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

function Login() {
  const [username, setUser] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { setIsAuthenticated, setUserConnected, isAuthenticated } = useContext(Auth);

  const handleConnexion = (e) => {
    e.preventDefault();
    login({ username: username.trim(), password:password.trim() })
      .then((data) => {
        if (data.status !== "admin") {
          toast.error("Accès réservé aux administrateurs.");
          setIsAuthenticated(false);
          return;
        }
        setUserConnected(data);
        setIsAuthenticated(true);
        navigate('/accueil');
      })
      .catch((e) => {
        if (e.response && e.response.status === 404) {
          toast.error("Nom d'utilisateur ou mot de passe incorrect");
        }
        setIsAuthenticated(false);
        console.error('Login failed:', e);
      });
  };

  return (
    <>
      <div className="header">
        <p id="name">
          <img src="src/assets/images/logoParking.png" alt="image" />
          Easy Parking
        </p>
      </div>
      <br />
      <form onSubmit={handleConnexion}>
        <div className="form-group">
          <label htmlFor="usernameInput" id="label">Nom d'utilisateur</label>
          <input
            className="username"
            id="usernameInput"
            value={username}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="passwordInput" id="label">Mot de passe</label>
          <input
            id="passwordInput"
            type="password"
            className="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <div className="form-group">
          <button type="submit">Se connecter</button>
          <ToastContainer /> {/* fait appel à la toast qui permet d'afficher un message d'erreur */}
        </div>
      </form>
    </>
  );
}

export default Login;
