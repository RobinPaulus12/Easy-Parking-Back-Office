import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Navbar from "../components/Navbar.jsx";
import ContainerCrud from "../components/ContainerCrud.jsx";
import '../assets/styles/pages.css';
import { setFormFields, setTransaction } from '../store/slice/form.js';
import { useParking } from '../ApiCalls/Parkings.js';

function ParkingPage() {
  const dispatch = useDispatch();

  const parkingPerPages = 6;
  const [parking, setParking] = useState([]);
  const [totalParkings, setTotalParking] = useState(0);
  const { getAllParkingsPagination } = useParking();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    "ID",
    "Nom",
    "Coordonnées",
    "Places",
    "Telephone",
    "Heure_ouverture",
    "Largeur_Place",
    "Localité",
    ""
  ];

  const formFields = [
    { name: "Nom", label: "Nom", type: "text", placeholder: "Nom" },
    { name: "Coordonnées", label: "Coordonnées", type: "text", placeholder: "Coordonées" },
    { name: "Places", label: "Places", type: "text", placeholder: "Places" },
    { name: "Telephone", label: "Telephone", type: "text", placeholder: "Telephone" },
    { name: "Heure_ouverture", label: "Heure_ouverture", type: "text", placeholder: "Heure_ouverture" },
    { name: "Largeur_Place", label: "Largeur_Place", type: "text", placeholder: "Largeur_Place" },
    { name: "Localité", label: "Localité", type: "text", placeholder: "Localité (entrez l'id de la localité)" },
  ];

  const transaction = "localités";

  useEffect(() => {
    dispatch(setFormFields(formFields));
    dispatch(setTransaction(transaction));
  }, [dispatch, formFields]);

  const fetchParking = async (page, search = '') => {
    const result = await getAllParkingsPagination(page, search);
    if (!result || !result.rows) return;

    const formatted = result.rows.map((parking) => ({
      ID: parking.parking_id,
      Nom: parking.name,
      Coordonnées: parking.coordinates,
      Places: parking.places,
      Telephone: parking.telephone,
      Heure_ouverture: parking.opening,
      Largeur_Place: parking.place_width,
      Localité: parking.fk_locality,
    }));

    setParking(formatted);
    setTotalParking(parseInt(result.total));
  };

  useEffect(() => {
    fetchParking(currentPage, searchTerm); 
  }, [currentPage, searchTerm]);

  
  const addToList = async () => {
    const newTotal = totalParkings + 1;
    const newPage = Math.ceil(newTotal / parkingPerPages);
    setTotalParking(newTotal);
    setCurrentPage(newPage); 
    await fetchParking(newPage, searchTerm);
  };

  const handleUpdate = async () => {
    await fetchParking(currentPage, searchTerm);
  };

  const deleteFromList = async (parking_id) => {
  const newTotal = totalParkings - 1;
  const newPage = Math.max(1, Math.ceil(newTotal / parkingPerPages));

  setTotalParking(newTotal);
  setCurrentPage(newPage);

  await fetchParking(newPage, searchTerm);
  
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
            data={parking}
            title="parkings"
            button="parking"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={Math.ceil(totalParkings / parkingPerPages)}
            addToList={addToList}
            onSearch={(page, search) => {
              setSearchTerm(search);
              setCurrentPage(page);
            }}
            setData={setParking}
            onUpdate={handleUpdate}
            deleteFromList={deleteFromList}
          />
        </div>
      </div>
    </>
  );
}


export default ParkingPage;
