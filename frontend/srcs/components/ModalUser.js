import styles from '../../styles/ModalUser.module.scss';
import { Modal } from "react-bootstrap";
import cn from 'classnames';

export default function ModalUser(props) {
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
                <form onSubmit={(e) => { e.preventDefault(); props.handleAddUser(props.type === 'add' ? 'post' : 'patch') }}>
                    <div className="mb-3 row">
                        <div className='col-lg-6'>
                            <label className="form-label">Firstname <span className='text-danger'>*</span></label>
                            <input type="text" className="form-control" value={props.addUserData.first_name} onChange={(e) => props.setAddUserData({ ...props.addUserData, first_name: e.target.value })} required />
                            {props.userDataErrors.first_name && <span className={styles.error}>{props.userDataErrors.first_name[0]}</span>}
                        </div>
                        <div className='col-lg-6'>
                            <label className="form-label">Lastname <span className='text-danger'>*</span></label>
                            <input type="text" className="form-control" value={props.addUserData.last_name} onChange={(e) => props.setAddUserData({ ...props.addUserData, last_name: e.target.value })} required />
                            {props.userDataErrors.last_name && <span className={styles.error}>{props.userDataErrors.last_name[0]}</span>}
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Username <span className='text-danger'>*</span></label>
                        <input type="text" className="form-control" value={props.addUserData.username} onChange={(e) => props.setAddUserData({ ...props.addUserData, username: e.target.value })} required />
                        {props.userDataErrors.username && <span className={styles.error}>{props.userDataErrors.username[0]}</span>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Role <span className='text-danger'>*</span></label>
                        <select className="form-select" value={props.addUserData.user_type} onChange={(e) => props.setAddUserData({ ...props.addUserData, user_type: e.target.value })} disabled={props.type === 'edit'}>
                            <option value="admin">Admin</option>
                            <option value="cashier">Cashier</option>
                            <option value="staff">Restaurant Manager</option>
                        </select>
                        {props.userDataErrors.user_type && <span className={styles.error}>{props.userDataErrors.user_type[0]}</span>}
                    </div>
                    <div className="mb-3 row">
                        <div className='col-lg-6'>
                            <label htmlFor="exampleInputPassword1" className="form-label">Password {props.type === 'add' && <span className='text-danger'>*</span>}</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" value={props.addUserData.password1} onChange={(e) => props.setAddUserData({ ...props.addUserData, password1: e.target.value })} required={props.type === 'add'} />
                        </div>
                        <div className='col-lg-6'>
                            <label htmlFor="exampleInputPassword2" className="form-label">Retype password {props.type === 'add' && <span className='text-danger'>*</span>}</label>
                            <input type="password" className="form-control" id="exampleInputPassword2" value={props.addUserData.password2} onChange={(e) => props.setAddUserData({ ...props.addUserData, password2: e.target.value })} required={props.type === 'add'} />
                        </div>
                        {props.userDataErrors.password && <span className={styles.error}>{props.userDataErrors.password[0]}</span>}
                    </div>
                    <div className={styles.buttons}>
                        <button className={styles.cancel} onClick={props.onHide}>Annuler</button>
                        <button className={styles.ok} type="submit">Submit</button>
                    </div>
                </form>

            </Modal.Body>
        </Modal>
    )
}