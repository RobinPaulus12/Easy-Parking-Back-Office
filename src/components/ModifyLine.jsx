import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useUser} from '../ApiCalls/User.js';
import { useParking} from '../ApiCalls/Parkings.js';
import { useLocality } from '../ApiCalls/Locality.js';
import { useCar } from '../ApiCalls/Car.js';
import { usePlace } from '../ApiCalls/Place.js';
import {toast} from 'react-toastify';

function ModifyLine({ idToDeleteModifyRef, title, selectedRow, onUpdate, show, handleClose }) {
  const formFields = useSelector((state) => state.form.formFields);

  const { updateUserByAdmin } = useUser();
  const { updateParking } = useParking();
  const { updateLocality } = useLocality();
  const { updateCar } = useCar();
  const { updatePlace } = usePlace();

  const modify = async (e) => {
    e.preventDefault();
    const idModify = idToDeleteModifyRef.current;

    try {
      const formData = {};
      formFields.forEach((field) => {

        let fieldValue;
        if (field.type === "checkbox") {
           fieldValue = e.target[field.name].checked;
        } else {
          fieldValue = e.target[field.name].value.trim();
        }

        if (fieldValue !== "" && fieldValue !== undefined) {
          formData[field.name] = fieldValue;
        }

      });

      switch (title) {
        case "utilisateurs":
          await updateUserByAdmin({
            user_id: idModify,
            name: formData.Nom,
            firstname: formData.Prenom,
            date_of_birth: formData.Date_de_Naissance,
            username: formData.Pseudo,
            password: formData.Mot_de_passe,
            isAdmin: formData.Admin
          });
          break;

        case "parkings":
          await updateParking({
            parking_id: idModify,
            name: formData.Nom,
            coordinates: formData.Coordonnées,
            places: formData.Places,
            telephone: formData.Telephone,
            opening: formData.Heure_ouverture,
            place_width: formData.Largeur_Place,
            fk_locality: formData.Localité
          });
          break;

        case "localités":
          await updateLocality({
            locality_id: idModify,
            city: formData.Ville,
            country: formData.Pays,
            postal_code: formData.Code_Postale,
            street_name: formData.Rue
          });
          break;

        case "voitures":
          await updateCar({
            car_id: idModify,
            license_plate: formData.Plaque_Immatriculation,
            model: formData.Modele,
            fk_user: parseInt(formData.Utilisateur)
          });
          break;

        case "places":
          await updatePlace({
            place_id: idModify,
            arrival_time: formData.Heure_arrive,
            departure_time: formData.Heure_depart,
            fk_parking: formData.Parking
          });
          break;
      }

      await onUpdate();
      handleClose();
    } catch (error) {
      if (error.response?.status === 500) {
        toast.error("Erreur : données déjà existantes ou inexistante");
      } else if (error.response?.status === 400) {
       toast.error("données mal formé ou invalide:", error);
      }
      
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Form onSubmit={modify}>
        <Modal.Header closeButton>
          <Modal.Title>Modification d'une ligne</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formFields.map((field, index) => (
            <Form.Group className="mb-3" controlId={field.name} key={index}>
               {field.type === "checkbox" ? (
                 <Form.Check
                   type="checkbox"
                   name={field.name}
                   label={field.label}
                   defaultChecked={selectedRow && field.name === "Admin" ? (selectedRow[field.name] === true || selectedRow[field.name] === "Oui" || selectedRow[field.name] === "true") : false}
                 />
              ) : (
                <>
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Control
                    type={field.type || "text"}
                    name={field.name}
                    placeholder={field.placeholder}
                    defaultValue={selectedRow ? selectedRow[field.name] : ""}
                  />
               </>
             )}
           </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            Enregistrer
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ModifyLine;
