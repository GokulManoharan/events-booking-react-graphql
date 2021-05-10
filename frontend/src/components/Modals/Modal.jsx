import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const MyVerticallyCenteredModal = (props) => {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.children}
            </Modal.Body>
            <Modal.Footer>
                <Button className="app-btn-outline" onClick={props.onHide}>Close</Button>
                <Button className="app-btn" onClick={props.handleSubmit}>Create</Button>
            </Modal.Footer>
        </Modal>
    );
}

const AppModal = ({ children, title, show, setModalShow, handleSubmit }) => {

    return (
        <MyVerticallyCenteredModal
            show={show}
            onHide={() => setModalShow(false)}
            title={title}
            setModalShow={setModalShow}
            handleSubmit={handleSubmit}
        >
            {children}
        </MyVerticallyCenteredModal>
    );
}

export default AppModal;