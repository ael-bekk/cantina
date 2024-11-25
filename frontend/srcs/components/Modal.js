import { useEffect, useRef, useState } from "react";
import { TbCheck, TbCircleX } from "react-icons/tb";
import {
  Modal,
  useMantineTheme,
  Group,
  Button,
  Avatar,
  Text,
} from "@mantine/core";

import styles from "../../styles/Modal.module.scss";

export default function ModalComponent(props) {
  // const [disabled, setDisabled] = useState(false);
  const handleValidate = (event) => {
    event.currentTarget.disabled = true;
    props.createregistry();
    props.onHide();
    props.getData();
    props.setLogin("");
  };
  const theme = useMantineTheme();

  const capitalize = (str) => {
    const s = str.charAt(0).toUpperCase() + str.slice(1);
    if (s === "Undefined") return "";
    return s;
  };

  return (
    <>
      <Modal
        size="lg"
        opened={props.show}
        centered
        closeOnClickOutside={false}
        onClose={() => {
          props.onHide();
        }}
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        styles={{
          modal: {
            borderRadius: "12px",
          },
        }}
      >
        {/* <img src={props.data.image_url} /> */}
        <Group position="center">
          {/* <Avatar size={150} radius={150}> */}
          {props.data.response ? (
            <img src="/check.gif" width={300} />
          ) : (
            <img src="/cross.gif" width={300} />
          )}
          {/* </Avatar> */}
        </Group>
        <Group position="center" mt={"lg"}>
          <Text
            sx={{
              fontSize: "20px",
              fontWeight: "500",
              color: theme.colors.gray[7],
            }}
          >
            {capitalize(String(props.data.first_name))}{" "}
            {capitalize(String(props.data.last_name))}
          </Text>
        </Group>
        <Group position="center">
          <Text
            sx={{
              fontSize: "17px",
              fontWeight: "500",
              color: theme.colors.gray[6],
            }}
          >
            {props.data.login}
          </Text>
        </Group>
        <Group position="center" grow mt={"xl"}>
          <Button
            className={styles.cancel}
            onClick={props.onHide}
            color="red.5"
            radius="md"
            size="xl"
          >
            Annuler
          </Button>
          {props.data.response && (
            <Button
              className={styles.ok}
              onClick={handleValidate}
              color="teal.6"
              radius="md"
              size="xl"
            // disabled={props.loading}
            >
              Valider
            </Button>
          )}
        </Group>
      </Modal>
    </>
  );
}
