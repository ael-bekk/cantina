import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { Modal } from "react-bootstrap";
import styles from '../../styles/ModalDateRange.module.scss';
import { TailSpin } from "react-loader-spinner";
import { Button } from "@mantine/core";


export default function ModalDateRange(props) {
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

                <DateRangePicker
                    onChange={(item) => props.setDateRange([item.selection])}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={1}
                    ranges={props.dateRange}
                    direction="horizontal"
                    className={styles.picker}
                />

                <div className={styles.find}>
                    <div className={styles.find_btn} onClick={() => props.handleFind()}>
                        {props.loadingFind ?
                            <TailSpin
                                ariaLabel="loading"
                                width={25}
                                height={30}
                                color={"#fff"}
                            />
                            : 'Find'}
                    </div>
                    <div className={styles.download_btn} onClick={() => props.handleDownload()}>
                        {props.loadingFind ?
                            <TailSpin
                                ariaLabel="loading"
                                width={25}
                                height={30}
                                color={"#fff"}
                            />
                            : 'Download XLSX'}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}