import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.jsx";
import ContainerCrud from "../components/ContainerCrud.jsx";
import { useDispatch } from 'react-redux';
import { setFormFields} from '../store/slice/form.js';
import { useUser } from '../ApiCalls/User.js';

function UserPage() {
  const dispatch = useDispatch();
  const { getUsers } = useUser();

  const userPerPages = 10;
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = ["ID", "Nom", "Prenom", "Date_de_Naissance", "Pseudo", "Admin",""];

  const formFields = [
    { name: "Nom", label: "Nom", type: "text", placeholder: "Nom de l'utilisateur" },
    { name: "Prenom", label: "Prénom", type: "text", placeholder: "Prénom de l'utilisateur" },
    { name: "Date_de_Naissance", label: "Date de naissance", type: "date", placeholder: "" },
    { name: "Pseudo", label: "Pseudo", type: "text", placeholder: "Pseudo" },
    { name: "Mot_de_passe", label: "Mot de passe", type: "password", placeholder: "Mot de passe" },
    { name: "Admin", label: "Administrateur ?", type: "checkbox" }

  ];

  useEffect(() => {
    dispatch(setFormFields(formFields));
  }, [dispatch]);

  const fetchUsers = async (page, search = '') => {
    const result = await getUsers(page, search);
    if (!result || !result.rows) return;

  const formatted = result.rows.map((user) => {
  
  
  const birthDate = new Date(user.date_of_birth);
  const formattedDate = birthDate.toLocaleDateString('fr-FR');

  return {
    ID: user.user_id,
    Nom: user.name,
    Prenom: user.firstname,
    Date_de_Naissance: formattedDate,
    Pseudo: user.username,
    Admin: user.isadmin ? "Oui" : "Non"
  };
});

    setUsers(formatted);
    setTotalUsers(parseInt(result.total));
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const addToList = async () => {
    const newTotal = totalUsers + 1;
    const newPage = Math.ceil(newTotal / userPerPages);
    setTotalUsers(newTotal);
    setCurrentPage(newPage);

    await fetchUsers(newPage, searchTerm);
  };

  const handleUpdate = async () => {
    await fetchUsers(currentPage, searchTerm);
  };
  const deleteFromList = async (user_id) => {
  const newTotal = totalUsers - 1;
  const newPage = Math.max(1, Math.ceil(newTotal / userPerPages));

  setTotalUsers(newTotal);
  setCurrentPage(newPage);

  await fetchUsers(newPage, searchTerm);
  };

  return (
    <div className="dashboard-layout">
      <div id="navbar-container">
        <Navbar />
      </div>
      <div id="dashboard-container">
        <ContainerCrud
          columns={columns}
          data={users}
          title="utilisateurs"
          button="utilisateur"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={Math.ceil(totalUsers / userPerPages)}
          addToList={addToList}
          onSearch={(page, search) => {
            setSearchTerm(search);
            setCurrentPage(page);
          }}
          setData={setUsers}
          onUpdate={handleUpdate}
          deleteFromList={deleteFromList}
        />
      </div>
    </div>
  );
}

export default UserPage;
