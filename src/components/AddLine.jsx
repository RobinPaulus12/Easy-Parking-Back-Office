import { Modal, Button, Form } from 'react-bootstrap';
import "../assets/styles/addLine.css";
import 'react-toastify/dist/ReactToastify.css';
import { useSelector} from 'react-redux';
import { useUser} from '../ApiCalls/User.js';
import { useParking} from '../ApiCalls/Parkings.js';
import { useLocality } from '../ApiCalls/Locality.js';
import { useCar } from '../ApiCalls/Car.js';
import { usePlace } from '../ApiCalls/Place.js';
import ModalForm from './ModalForm.jsx';
import { useState } from "react";
function AddLine({ title, onAdd, show, handleClose }) {
  const formFields = useSelector((state) => state.form.formFields);
  const transaction = useSelector((state) => state.form.transaction);

  const parkingLocalityFields = [
    { name: "Ville", label: "Ville", placeholder: "Entrez la ville", type: "text", required: true },
    { name: "Pays", label: "Pays", placeholder: "Entrez le pays", type: "text", required: true },
    { name: "Code_Postale", label: "Code_Postale", placeholder: "Entrez le code postale", type: "text", required: true },
    { name: "Rue", label: "Rue", placeholder: "Entrez la rue", type: "text", required: true },
    { name: "Nom", label: "Nom", type: "text", placeholder: "Entrez le nom du parking", required: true },
    { name: "Coordonnées", label: "Coordonnées", placeholder: "Entrez les coordonnées", type: "text", required: true },
    { name: "Places", label: "Places", placeholder: "Entrez le nombre de places", type: "text", required: true },
    { name: "Telephone", label: "Telephone", placeholder: "Entrez le numero de telephone", type: "text", required: true },
    { name: "Heure_ouverture", label: "Heure_ouverture", placeholder: "Entrez l'heure d'ouverture", type: "text", required: true },
    { name: "Largeur_Place", label: "Largeur_Place", placeholder: "Entrez la largeur de la place", type: "text", required: true },
  ];
  const carUserFields = [
     { name: "Plaque_Immatriculation", label: "Plaque d'immatriculation", placeholder: "Entrez la plaque d'immatriculation", type: "text", required: true },
    { name: "Modele", label: "Modèle", placeholder: "Entrez le modèle de la voiture", type: "text", required: true },
    { name: "Nom", label: "Nom", placeholder: "Entrez le nom de l'utilisateur", type: "text", required: true },
    { name: "Prenom", label: "Prénom", placeholder: "Entrez le prénom", type: "text", required: true },
    { name: "Date_de_Naissance", label: "Date de naissance", placeholder: "Entrez la date de naissance", type: "date", required: true },
    { name: "Pseudo", label: "Pseudo", placeholder: "Entrez le pseudo", type: "text", required: true },
    { name: "Mot_de_passe", label: "Mot de passe", placeholder: "Entrez le mot de passe", type: "password", required: true },
    { name: "Admin", label: "Administrateur ?", type: "checkbox", required: false }

  ];
  const placeParkingField = [
     { name: "Nom", label: "Nom", type: "text", placeholder: "Entrez le nom du parking", required: true },
    { name: "Coordonnées", label: "Coordonnées", placeholder: "Entrez les coordonnées", type: "text", required: true },
    { name: "Places", label: "Places", placeholder: "Entrez le nombre de places", type: "text", required: true },
    { name: "Telephone", label: "Telephone", placeholder: "Entrez le numero de telephone", type: "text", required: true },
    { name: "Heure_ouverture", label: "Heure d'ouverture", placeholder: "Entrez l'heure d'ouverture", type: "text", required: true },
    { name: "Largeur_Place", label: "Largeur de la place", placeholder: "Entrez la largeur de la place", type: "text", required: true },
    { name: "Heure_arrive", label: "Heure d'arrivé", placeholder: "Entrez l'heure d'arrive", type: "datetime", required: true },
    { name: "Heure_depart", label: "Heure de départ", placeholder: "Entrez l'heure de départ", type: "datetime", required: true },
    { name: "Localité", label: "Localité", placeholder: "Entrez l'id de la localité", type: "text", required: true },
  ];

  const { addUser } = useUser();
  const { addParking, addParkingWithLocality } = useParking();
  const { addLocality } = useLocality();
  const { addCars, addCarWithRegistration } = useCar();
  const { addPlace, addPlaceWithParking } = usePlace();
  const [showTransaction, setShowTransaction] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {};
      formFields.forEach((field) => {
        if (field.type === "checkbox") {
           formData[field.name] = e.target[field.name].checked;
        } else {
          formData[field.name] = e.target[field.name].value;
        }
      });
      switch (title) {
        case "utilisateurs":
        await addUser({
            name: formData.Nom,
            firstname: formData.Prenom,
            date_of_birth: formData.Date_de_Naissance,
            username: formData.Pseudo,
            password: formData.Mot_de_passe,
            isAdmin: formData.Admin
          });
          await onAdd();
          handleClose();
          break;

        case "parkings":
            await addParking({
            coordinates: formData.Coordonnées,
            name: formData.Nom,
            places: formData.Places,
            telephone: formData.Telephone,
            opening: formData.Heure_ouverture,
            place_width: formData.Largeur_Place,
            fk_locality: formData.Localité,
          });
          await onAdd();
          handleClose();
          break;

        case "localités":
            await addLocality({
            city: formData.Ville,
            country: formData.Pays,
            postal_code: formData.Code_Postale,
            street_name: formData.Rue,
          });
          await onAdd();
          handleClose();
          break;

        case "voitures":
            await addCars({
            license_plate: formData.Plaque_Immatriculation,
            model: formData.Modele,
            fk_user: formData.Utilisateur,
          });
          await onAdd();
          handleClose();
          break;

        case "places":
            await addPlace({
            arrival_time: formData.Heure_arrive,
            departure_time: formData.Heure_depart,
            fk_parking: formData.Parking,
          });
        await onAdd();
        handleClose();
          break;
      }
    } catch (e) {
      if (e.response?.status === 500) {
        alert("Erreur : données déjà existantes ou inexistante");
      } else if (e.response?.status === 400) {
        alert("Erreur de structure dans les données.");
      } else if (e.response?.status === 404) {
        alert("Erreur : ressource non trouvée.");
      } else {
        alert("Une erreur inconnue est survenue.");
     }
     console.error("Erreur :", e);
    }
  };

  const getFormFieldsByTitle = (title) => {
    switch (title) {
      case "voitures": return carUserFields;
      case "parkings": return parkingLocalityFields;
      case "places": return placeParkingField;
      default: return [];
    }
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    try {
      const formDatas = {};
      const formFields = getFormFieldsByTitle(title);
      formFields.forEach((field) => {
        if (field.type === "checkbox") {
           formDatas[field.name] = e.target[field.name].checked;
        } else {
          formDatas[field.name] = e.target[field.name].value;
        }
      });

      switch (title) {
        case "voitures":
          await addCarWithRegistration({ 
            license_plate: formDatas.Plaque_Immatriculation, 
            model: formDatas.Modele,           
            firstname: formDatas.Prenom,      
            name: formDatas.Nom,          
            date_of_birth: formDatas.Date_de_Naissance, 
            username: formDatas.Pseudo,
            password: formDatas.Mot_de_passe,
            isAdmin:formDatas.Admin
          });
          await onAdd();
          setShowTransaction(false);
          handleClose();
          break;
        case "parkings":
          await addParkingWithLocality({
            city: formDatas.Ville,
            country: formDatas.Pays,
            postal_code: formDatas.Code_Postale,
            street_name: formDatas.Rue,
            name: formDatas.Nom,
            coordinates: formDatas.Coordonnées,
            places: formDatas.Places,
            telephone: formDatas.Telephone,
            opening: formDatas.Heure_ouverture,
            place_width: formDatas.Largeur_Place,

          });
          await onAdd();
          setShowTransaction(false);
          handleClose();
          break;
        case "places":
          await addPlaceWithParking({ 
            arrival_time : formDatas.Heure_arrive,
            departure_time:formDatas.Heure_depart,
            coordinates: formDatas.Coordonnées,
            name: formDatas.Nom,
            places: formDatas.Places,
            telephone: formDatas.Telephone,
            opening: formDatas.Heure_ouverture,
            place_width: formDatas.Largeur_Place,
            fk_locality:formDatas.Localité,

          });
          await onAdd();
          setShowTransaction(false);
          handleClose();
          break;
      }
    } catch (e) {
      if (e.response?.status === 500) {
        alert("Erreur : données déjà présentes.");
      } else if (e.response?.status === 400) {
        alert("Erreur dans les données.");
      }
      console.error("Erreur transaction", e);
    }
  };

  

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Ajout d'une ligne</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {formFields.map((field, index) => (
              <Form.Group className="mb-3" key={index}>
               {field.type === "checkbox" ? (
              <Form.Check
               type="checkbox"
               name={field.name}
               label={field.label}
               defaultChecked={false}
              />
           ) : (
             <>
               <Form.Label>{field.label}</Form.Label>
               <Form.Control
                 type={field.type || "text"}
                 name={field.name}
                 placeholder={field.placeholder}
                 required={field.required}
              />
           </>
        )}
      </Form.Group>
            ))}
            {(title === "voitures" || title === "parkings" || title === "places") && (
              <div className="form-check mb-3">
                <Button variant="secondary" onClick={() => setShowTransaction(true)}>
                  Ajouter dans la table {transaction}
                </Button>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Annuler</Button>
            <Button variant="primary" type="submit">Enregistrer</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Formulaire transactionnel */}
      {(title === "parkings") && (
        <ModalForm
          show={showTransaction}
          handleClose={() => setShowTransaction(false)}
          modalId="modalId"
          modalTitle="Ajouter un parking et sa localité"
          fields={parkingLocalityFields}
          onSubmit={handleSubmitTransaction}
        />
      )}
      {(title === "voitures") && (
        <ModalForm
          show={showTransaction}
          handleClose={() => setShowTransaction(false)}
          modalId="modalId"
          modalTitle="Ajouter une voiture et un utilisateur"
          fields={carUserFields}
          onSubmit={handleSubmitTransaction}
        />
      )}
      {(title === "places") && (
        <ModalForm
          show={showTransaction}
          handleClose={() => setShowTransaction(false)}
          modalId="modalId"
          modalTitle="Ajouter une place et un parking"
          fields={placeParkingField}
          onSubmit={handleSubmitTransaction}
        />
      )}
    </>
  );
}

export default AddLine;
