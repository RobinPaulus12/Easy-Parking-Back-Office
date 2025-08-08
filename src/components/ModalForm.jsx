import { Modal, Button, Form } from "react-bootstrap";

function ModalForm({ show, handleClose, modalTitle, fields, onSubmit }) {
  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {fields.map((field, index) => (
            <Form.Group className="mb-3" controlId={field.id || field.name} key={index}>
              {/* SI c'est une checkbox et qu'on est dans le formulaire voiture */}
              {field.type === "checkbox" && modalTitle.includes("voiture") ? (
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
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            Enregistrer
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ModalForm;
