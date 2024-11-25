import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { Button, Center, Modal } from "@mantine/core";
import styles from '../../styles/ModalDateRange.module.scss';
import { TailSpin } from "react-loader-spinner";


export default function ModalExport(props) {
    return (
        <Modal
            opened={props.show}
            centered
            onClose={props.onHide}
            size="lg"
            radius="md"
            title="Export data"
        >
            <DateRangePicker
                onChange={(item) => props.setDateRange([item.selection])}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={1}
                ranges={props.dateRange}
                direction="horizontal"
                className={styles.picker}
            />
            <Center>
                <Button color="cyan" onClick={() => props.handleExport()}>
                    {props.loadingExport ?
                        <TailSpin
                            ariaLabel="loading"
                            width={25}
                            height={30}
                            color={"#fff"}
                        />
                        : 'Export'}
                </Button>
            </Center>
        </Modal>
    )
}