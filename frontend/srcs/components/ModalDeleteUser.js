import styles from '../../styles/ModalDeleteUser.module.scss';
import { Modal } from "react-bootstrap";
import cn from 'classnames';
import { BsExclamationCircle } from 'react-icons/bs';


export default function ModalDeleteUser(props) {
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            className={styles.modal}
        >
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body className={styles.cardBody}>
                <div className={styles.warning_message}>
                    <BsExclamationCircle size={80} color={"#ee5e52"} className={styles.icon} />
                    <p>Do you really want to delete this user?</p>
                    <p>This proccess cannot be undone.</p>
                </div>
                <div className={styles.buttons}>
                    <button className={styles.ok} onClick={props.onHide}>Cancel</button>
                    <button className={styles.cancel} onClick={() => props.handleDeleteUser()}>Delete</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}