import '../assets/styles/containerCrud.css'; 
import '../assets/styles/search.css';
import EditIcon from '../assets/images/vector.png';
import DeleteIcon from '../assets/images/trash 1.png';
import DeleteLine from './DeleteLine';
import AddLine from './AddLine';
import ModifyLine from './ModifyLine';
import { useState, useRef } from 'react';
import Pagination from '@mui/material/Pagination';

function ContainerCrud({ title, button, columns, data, addToList, currentPage, setCurrentPage, totalPages, onSearch, onUpdate, deleteFromList }) {
  const idToDeleteModifyRef = useRef(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showModify, setShowModify] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleDeleteAndModify = (id, action) => {
    const row = data.find((row) => row.ID === id);
    setSelectedRow(row);
    idToDeleteModifyRef.current = id;

    if (action === 'edit') {
      setShowModify(true);
    } else if (action === 'delete') {
      setShowDelete(true);
    }
  };

  return (
    <>
      <div className="dashboard-card">
        <h1 className="dashboard-title">Liste des {title}</h1>

        <div className="form-container">
          <form
            className="form-inline barSearch"
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
              onSearch(1, searchTerm);
            }}
          >
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Rechercher..."
              aria-label="Search"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <button className="button" onClick={() => setShowAdd(true)}>
            Ajouter nouvel {button}
          </button>
        </div>
        <br />

        <div>
          <table className="table custom-table">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td className="dashboard-info" id="tdcolor" key={colIndex}>
                      {column === "" ? (
                        <div style={{ display: "flex", gap: "15px", backgroundColor: "#212637" }}>
                          <img
                            src={EditIcon}
                            alt="Modifier"
                            style={{ cursor: "pointer", width: "20px", height: "20px" }}
                            onClick={() => handleDeleteAndModify(row.ID, 'edit')}
                          />
                          <img
                            src={DeleteIcon}
                            alt="Supprimer"
                            style={{ cursor: "pointer", width: "20px", height: "20px" }}
                            onClick={() => handleDeleteAndModify(row.ID, 'delete')}
                          />
                        </div>
                      ) : (
                        row[column]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => {
              setCurrentPage(value);
              onSearch(value, searchTerm);
            }}
            color="primary"
          />
      </div>
      <AddLine title={title} onAdd={addToList} show={showAdd} handleClose={() => setShowAdd(false)} />
      <ModifyLine title={title} idToDeleteModifyRef={idToDeleteModifyRef} selectedRow={selectedRow} onUpdate={onUpdate} show={showModify} handleClose={() => setShowModify(false)} />
      <DeleteLine title={title} idToDeleteModifyRef={idToDeleteModifyRef} deleteFromList={deleteFromList} show={showDelete} handleClose={() => setShowDelete(false)} />
    </>
  );
}
export default ContainerCrud;
