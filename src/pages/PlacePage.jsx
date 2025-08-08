import Navbar from "../components/Navbar.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/pages.css';
import ContainerCrud from "../components/ContainerCrud.jsx";
import { useEffect,useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFormFields, setTransaction} from '../store/slice/form.js';
import { usePlace } from "../ApiCalls/Place.js";
import { useParking } from "../ApiCalls/Parkings.js";
function PlacePage() {

  const dispatch = useDispatch();

  const placePerPage = 10;
  const [place, setPlace] = useState([]);
  const [parkings,setParking] = useState([]);
  const [totalPlaces,setTotalPlaces] = useState(0)
  const {getAllPlacesPagination} = usePlace();
  const [currentPage, setCurrentPage] = useState(1);
  const {getAllParkingsPagination} = useParking();
  const [searchTerm, setSearchTerm] = useState('');
  const [parkingReady, setParkingReady] = useState(false);
  

    const columns = ["ID","Heure_arrive","Heure_depart","Parking",""];

    const formFields = [
      { name: "Heure_arrive", label: "Heure d'arrivé (yyyy-mm-jj hh:mm:ss)", type: "timestamp", placeholder: "Date_Heure_Arrivé" },
      { name: "Heure_depart", label: "Heure de départ (yyyy-mm-jj hh:mm:ss)", type: "timestamp", placeholder: "Date_Heure_Départ" },
      { name: "Parking", label: "Parking", type: "text", placeholder: "Parking (entrez l'id du parking)" }
      ];
    const transaction = "parking";

    useEffect(() => {
      // Charger les formFields dans le store Redux
      dispatch(setFormFields(formFields));
      dispatch(setTransaction(transaction));
    }, [dispatch, formFields,transaction]);

    useEffect(() => {
          // Au tout début, on charge les users une seule fois
          const loadParking = async () => {
            const parkingData = await getAllParkingsPagination(1, '');
            setParking(parkingData.rows);
            setParkingReady(true);
          };
          loadParking();
        }, []); // ⬅️ [] pour que ce soit seulement au montage du composant

    
    const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
};
    const fetchPlace= async (page,search = '') => {
      const result = await getAllPlacesPagination(page,search);
      if (!result || !result.rows) return;
      const formatted = result.rows.map((place) => {
        
      const parking = parkings.find((p) => p.parking_id === place.fk_parking);
      const parkingName = parking ? parking.name : "parking introuvable";

      return {
        ID:place.place_id,
        Heure_arrive: formatDateTime(place.arrival_time),
        Heure_depart: formatDateTime(place.departure_time),
        Parking:parkingName
      };
    });
      setPlace(formatted);
      setTotalPlaces(parseInt(result.total))
  };

    useEffect(() => {
      if(parkingReady) {
      fetchPlace(currentPage,searchTerm);
      }
    }, [currentPage,searchTerm,parkingReady]);
    
    // Lors de l'ajout, recharger la dernière page
    const addToList = async () => {
      const newTotal = totalPlaces+ 1;
      const newPage = Math.ceil(newTotal / placePerPage);
      setTotalPlaces(newTotal);
      setCurrentPage(newPage); // Cela déclenchera useEffect → fetchUsers
      await fetchPlace(newPage,searchTerm);
    };
   
    const handleUpdate = async () => {
  // Recharge la liste des voitures à la page actuelle avec le filtre de recherche actuel
  await fetchPlace(currentPage, searchTerm);
};

const deleteFromList = async (place_id) => {
  const newTotal = totalPlaces - 1;
  const newPage = Math.max(1, Math.ceil(newTotal / placePerPage));

  setTotalPlaces(newTotal);
  setCurrentPage(newPage);

  // Ne supprime pas localement, on laisse fetchCar faire la mise à jour
  await fetchPlace(newPage, searchTerm);
  };
  
    return (
        <>
         <div className="dashboard-layout">
      <div id="navbar-container">
        <Navbar />
      </div>
      <div id="dashboard-container">
      <ContainerCrud 
      columns={columns} 
      data={place}
      title="places"
      button="place"
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={Math.ceil(totalPlaces / placePerPage)}
      addToList={addToList}
      onSearch={(page, search) => {
        setSearchTerm(search);
        setCurrentPage(page);
      }}
      setData={setPlace}
      onUpdate={handleUpdate}
      deleteFromList={deleteFromList}
      />
      </div>
    </div>
        </>
    );
  }

export default PlacePage;

