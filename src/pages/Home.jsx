import '../assets/styles/container.css'; 
import Navbar from "../components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; 
import '../assets/styles/Home.css';
import { useEffect,useState } from 'react';
import { useUser } from '../ApiCalls/User.js';
import { usePlace } from '../ApiCalls/Place.js';
function Home() {

  const {getUsers} = useUser(); 
  const {getAllPlacesPagination} = usePlace();

  const [totalUsers, setTotalUsers] = useState(0);

  // Fonction pour récupérer le nombre total d'utilisateurs
  const getTotalUsersCount = async () => {
    try {
      const response = await getUsers(1); // page 1, peu importe ici
      if (response && response.total) {
        setTotalUsers(parseInt(response.total));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
    }
  };

  useEffect(() => {
    getTotalUsersCount(); 
  }, []);

  // calculer la durée moyenne d'occupation d'une place
  const [averageDuration, setAverageDuration] = useState(0);

  const calculateDurationInMinutes = (arrivee, depart) => {
    const arriveeDate = new Date(arrivee);
    const departDate = new Date(depart);
    const durationInMillis = departDate - arriveeDate; // Durée en millisecondes
    const durationInMinutes = durationInMillis / (1000 * 60); // Convertir en minutes
    return durationInMinutes;
  };

  const getAverageOccupationDuration = async () => {
    try {
      const places = await getAllPlacesPagination();
      const durations = places.rows.map(place => 
        calculateDurationInMinutes(place.arrival_time, place.departure_time)
      );
      const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);
      const average = durations.length > 0 ? totalDuration / durations.length : 0;

    setAverageDuration(average); 

    } catch(error) {
      console.error("Erreur lors de la récuperation des places")
    }
  }

  useEffect(() => {
    getAverageOccupationDuration();
  }, []);

  // Fonction pour formater la durée en "h:mm"
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h${mins < 10 ? '0' + mins : mins}`;
  };


    return (
        <>
         <div className="dashboard-layout">
      <div id="navbar-container">
        <Navbar />
      </div>
      <div id="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Bienvenue dans l'administration </h1>  
        <div>
          <h2 className="dashboard-subtitle">Aperçu</h2>
          <div className="dashboard-stats">
            <div className="dashboard-stat">
              <div className="stat-value">{totalUsers}</div>
              <p className="stat-label">Utilisateurs</p>
            </div>
            <div className="dashboard-stat">
              <div className="stat-value">{formatDuration(averageDuration)}</div>
              <p className="stat-label">Durée moyenne d'occupation d'une place</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
        </>
    );

}

export default Home;