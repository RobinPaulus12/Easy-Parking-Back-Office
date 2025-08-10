import Navbar from "../components/Navbar.jsx";
import '../assets/styles/pages.css';
import ContainerCrud from "../components/ContainerCrud.jsx";
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFormFields} from '../store/slice/form.js';
import { useLocality } from "../ApiCalls/Locality.js";

function LocalityPage() {
  const dispatch = useDispatch();

  const localityPerPages = 10;
  const [locality, setLocality] = useState([]);
  const [totalLocalitiy, setTotalLocality] = useState(0);
  const { getAllLocalitiesPagination } = useLocality();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = ["ID", "Ville", "Pays", "Code_Postale", "Rue", ""];

  const formFields = [
    { name: "Ville", label: "Ville", type: "text", placeholder: "Ville" },
    { name: "Pays", label: "Pays", type: "text", placeholder: "Pays" },
    { name: "Code_Postale", label: "Code_Postale", type: "text", placeholder: "Code_Postale" },
    { name: "Rue", label: "Rue", type: "text", placeholder: "Rue" },
  ];


  useEffect(() => {
    dispatch(setFormFields(formFields));
  }, [dispatch, formFields]);

  const fetchLocality = async (page, search = '') => {
    const result = await getAllLocalitiesPagination(page, search);
    if (!result || !result.rows) return;

    const formatted = result.rows.map((locality) => ({
      ID: locality.locality_id,
      Ville: locality.city,
      Pays: locality.country,
      Code_Postale: locality.postal_code,
      Rue: locality.street_name,
    }));
    setLocality(formatted);
    setTotalLocality(parseInt(result.total));
  };

  useEffect(() => {
    fetchLocality(currentPage, searchTerm);
  }, [currentPage, searchTerm]);


  const addToList = async () => {
    const newTotal = totalLocalitiy + 1;
    const newPage = Math.ceil(newTotal / localityPerPages);
    setTotalLocality(newTotal);
    setCurrentPage(newPage); 
    await fetchLocality(newPage, searchTerm);
  };

  const handleUpdate = async () => {
    await fetchLocality(currentPage, searchTerm);
  };
   const deleteFromList = async () => {
  const newTotal = totalLocalitiy - 1;
  const newPage = Math.max(1, Math.ceil(newTotal / localityPerPages));

  setTotalLocality(newTotal);
  setCurrentPage(newPage);

  await fetchLocality(newPage, searchTerm);
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
            data={locality}
            title="localités"
            button="localité"
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={Math.ceil(totalLocalitiy / localityPerPages)}
            addToList={addToList}
            onSearch={(page, search) => {
              setSearchTerm(search);
              setCurrentPage(page);
            }}
            setData={setLocality}
            onUpdate={handleUpdate}
            deleteFromList = {deleteFromList}
          />
        </div>
      </div>
    </>
  );
}


export default LocalityPage;
