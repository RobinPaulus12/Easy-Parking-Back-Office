import { Modal, Button, Form } from 'react-bootstrap';
import { useUser} from '../ApiCalls/User.js';
import { useParking} from '../ApiCalls/Parkings.js';
import { useLocality } from '../ApiCalls/Locality.js';
import { useCar } from '../ApiCalls/Car.js';
import { usePlace } from '../ApiCalls/Place.js';
import {toast} from 'react-toastify';
function DeleteLine({ idToDeleteModifyRef, title, deleteFromList, show, handleClose }) {
  const { deleteCar } = useCar();
  const { deleteUser } = useUser();
  const { deleteParking } = useParking();
  const { deleteLocality } = useLocality();
  const { deletePlace } = usePlace();

  const handleDelete = async (e) => {
    e.preventDefault();
    const idToDelete = idToDeleteModifyRef.current;

    try {
      switch (title) {
        case "utilisateurs":
          await deleteUser(idToDelete);
          break;
        case "parkings":
          await deleteParking(idToDelete);
          break;
        case "localités":
          await deleteLocality(idToDelete);
          break;
        case "voitures":
          await deleteCar(idToDelete);
          break;
        case "places":
          await deletePlace(idToDelete);
          break;
        default:
          return;
      }

      deleteFromList(idToDelete);
      handleClose();
    } catch (error) {
      toast.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Form onSubmit={handleDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Supprimer une ligne</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Êtes-vous sûr de vouloir supprimer cette ligne ?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Non, annuler
          </Button>
          <Button type="submit" variant="danger">
            Oui, supprimer
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default DeleteLine;
