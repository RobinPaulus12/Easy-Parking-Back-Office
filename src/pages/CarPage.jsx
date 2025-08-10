import Navbar from "../components/Navbar.jsx";
import ContainerCrud from "../components/ContainerCrud.jsx";
import { useDispatch } from 'react-redux';
import { setFormFields, setTransaction} from '../store/slice/form.js';
import { useCar } from "../ApiCalls/Car.js";
import { useUser } from "../ApiCalls/User.js";

function CarPage() {
  const dispatch = useDispatch();

  const carPerPage = 10;
  const [totalCars, setTotalCars] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [car, setCar] = useState([]);
  const [users, setUsers] = useState([]);
  const { getAllcars } = useCar();
  const { getUsers } = useUser();
  const [searchTerm, setSearchTerm] = useState('');

  const columns = ["ID", "Plaque_Immatriculation", "Modele", "Utilisateur", ""];

  const formFields = [
    { name: "Plaque_Immatriculation", label: "Plaque_Immatriculation", type: "text", placeholder: "Plaque_Immatriculation" },
    { name: "Modele", label: "Modele", type: "text", placeholder: "Modele" },
    { name: "Utilisateur", label: "Utilisateur", type: "text", placeholder: "Utilisateur (entrez l'id de l'utilisateur)" },
  ];

  const transaction = "utilisateur";

  useEffect(() => {
    dispatch(setFormFields(formFields));
    dispatch(setTransaction(transaction));
  }, [dispatch, formFields]);

  useEffect(() => {
    const loadUsers = async () => {
      const usersData = await getUsers();
      setUsers(usersData.rows);
    };
    loadUsers();
  }, []); 

  const fetchCar = async (page, search = '') => {
    const result = await getAllcars(page, search);
    
    if (!result || !result.rows) return;

    const formatted = result.rows.map((car) => {
      const user = users.find((u) => u.user_id === car.fk_user);
      const username = user ? user.username : "Utilisateur inconnu";

      return {
        ID: car.car_id,
        Plaque_Immatriculation: car.license_plate,
        Modele: car.model,
        Utilisateur: username,
      };
    });
    setCar(formatted);
    setTotalCars(parseInt(result.total));
  };

  useEffect(() => {
    if (users.length > 0) {
      fetchCar(currentPage, searchTerm);
    }
  }, [currentPage, users, searchTerm]); 

  const addToList = async () => {
    const newTotal = totalCars + 1;
    const newPage = Math.ceil(newTotal / carPerPage);
    setTotalCars(newTotal);
    setCurrentPage(newPage);
    await fetchCar(newPage, searchTerm);
  };

  const handleUpdate = async () => {
    await fetchCar(currentPage, searchTerm);
  };

  const deleteFromList = async (car_id) => {
  const newTotal = totalCars - 1;
  const newPage = Math.max(1, Math.ceil(newTotal / carPerPage));

  setTotalCars(newTotal);
  setCurrentPage(newPage);

  await fetchCar(newPage, searchTerm);
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
            data={car}
            title="voitures"
            button="voiture"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={Math.ceil(totalCars / carPerPage)}
            addToList={addToList}
            onSearch={(page, search) => {
              setSearchTerm(search);
              setCurrentPage(page);
            }}
            setData={setCar}
            onUpdate={handleUpdate}
            deleteFromList = {deleteFromList}
          />
        </div>
      </div>
    </>
  );
}

export default CarPage;
