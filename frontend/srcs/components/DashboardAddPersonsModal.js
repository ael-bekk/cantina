import {
  Modal,
  Button,
  Group,
  TextInput,
  useMantineTheme,
  Tabs,
  Grid,
  createStyles,
  Select,
  Text,
  LoadingOverlay,
  List,
  ThemeIcon,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  TbUserPlus,
  TbDatabaseImport,
  TbUpload,
  TbFileLike,
  TbFileDislike,
  TbChevronRight,
  TbX,
} from "react-icons/tb";
import axiosService from "../hooks/axiosService";
import Cookies from "js-cookie";
import { Dropzone, DropzoneProps, MIME_TYPES } from "@mantine/dropzone";
import { useToasts } from "react-toast-notifications";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
  },

  input: {
    height: "auto",
    paddingTop: 18,
    border: "1px solid " + theme.colors.gray[2],
    fontSize: "13px",
    borderRadius: "8px",
  },

  label: {
    position: "absolute",
    pointerEvents: "none",
    fontSize: theme.fontSizes.sm,
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    color: theme.colors.gray[6],
    zIndex: 1,
  },
}));

export default function DashboardAddPersonsModal({
  opened,
  setOpened,
  getPersonsList,
}) {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const { addToast } = useToasts();
  const [fileUpload, setFileUpload] = useState(null);
  const [fileUploadState, setFileUploadState] = useState(null);
  const [fileUploadLogs, setFileUploadLogs] = useState([]);
  const [overlay, setOverlay] = useState(false);

  const form = useForm({
    initialValues: {
      full_name: "",
      login: "",
      badge: "",
      kind: "",
      authorized: true,
      superuser: false,
      limit: 1,
    },

    validate: {
      full_name: (value) => value.length > 0 ? null : "This field should not be empty",
      login: (value) => value.length > 0 ? null : "This field should not be empty",
      badge: (value) => value.length > 0 ? null : "This field should not be empty",
      kind: (value) => value.length > 0 ? null : "This field should not be empty",
      authorized: (value) => value !== true || value !== false || value === null ? null : "This field should not be empty",
      superuser: (value) => value !== true || value !== false || value === null ? null : "This field should not be empty",
    },
  });

  const setBadge = (value) => {
    form.setFieldValue("badge", String(parseInt(value)));
  };
  const setKind = (value) => {
    form.setFieldValue("kind", value);
  };
  const setAuthorized = (value) => {
    form.setFieldValue("authorized", value);
  };
  const setSuperuser = (value) => {
    form.setFieldValue("superuser", value);
  };
  const setLimit = (value) => {
    form.setFieldValue("limit", value);
  };

  const handleSubmitPersonEntry = async (values) => {
    setOverlay(true);
    const res = await axiosService(`${process.env.NEXT_PUBLIC_API_URL}dashboard/persons/`, Cookies.get("token"), "POST", values);
    if (res.status === 200) {
      //   setOpened(false);
      addToast("Person added successfully.", {
        appearance: "success",
        autoDismiss: true,
      });
      form.reset();
      getPersonsList();
    } else if (res.status === 400) {
      form.setErrors(res.data);
    }
    setOverlay(false);
  };

  const onDropPersonsFile = async (file) => {
    if (String(file.name).split(".")[1] !== "csv") {
      setFileUploadState("rejected");
      return;
    }
    setFileUploadState("accepted");
    setFileUpload(file);
  };

  const handleSubmitPersonsFile = async () => {
    setOverlay(true);
    const formData = new FormData();
    formData.append("file", fileUpload);
    const res = await axiosService(`${process.env.NEXT_PUBLIC_API_URL}dashboard/persons/`, Cookies.get("token"), "POST", formData, null, true);
    if (res.status === 200) {
      setFileUploadState(null);
      setFileUpload(null);
      setFileUploadLogs([]);
      getPersonsList();
      addToast("Persons list added successfully.", {
        appearance: "success",
        autoDismiss: true,
      });
    } else if (res.status === 400) {
      setFileUploadLogs(res.data.errors);
    }
    setOverlay(false);
  };

  return (
    <Modal
      size="xl"
      opened={opened}
      centered
      closeOnClickOutside={false}
      onClose={() => {
        setOpened(false);
        setFileUploadState(null);
        setFileUpload(null);
        setFileUploadLogs([]);
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
      <LoadingOverlay visible={overlay} overlayBlur={2} />
      <Tabs defaultValue="mauall">
        <Tabs.List grow position="center">
          <Tabs.Tab value="mauall" icon={<TbUserPlus size={14} />}>
            Manually Add Persons
          </Tabs.Tab>
          <Tabs.Tab value="file" icon={<TbDatabaseImport size={14} />}>
            Upload Persons from Excel File
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="mauall" pt="md">
          <form
            onSubmit={form.onSubmit((values) =>
              handleSubmitPersonEntry(values)
            )}
          >
            <Grid
              sx={{
                padding: "15px",
              }}
            >
              <Grid.Col md={12} lg={6}>
                <TextInput
                  withAsterisk
                  label="FULL NAME"
                  classNames={classes}
                  error={form.errors.full_name}
                  value={form.values.full_name}
                  onChange={(event) =>
                    form.setFieldValue("full_name", event.currentTarget.value)
                  }
                />
              </Grid.Col>
              <Grid.Col md={12} lg={6}>
                <TextInput
                  withAsterisk
                  label="LOGIN"
                  classNames={classes}
                  error={form.errors.login}
                  value={form.values.login}
                  onChange={(event) =>
                    form.setFieldValue("login", event.currentTarget.value)
                  }
                />
              </Grid.Col>
              <Grid.Col md={12} lg={6}>
                <TextInput
                  withAsterisk
                  label="BADGE ID"
                  classNames={classes}
                  error={form.errors.badge}
                  type="number"
                  value={form.values.badge}
                  onChange={(event) => setBadge(event.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col md={12} lg={6}>
                <Select
                  withAsterisk
                  classNames={classes}
                  label="KIND"
                  error={form.errors.kind}
                  value={form.values.kind}
                  onChange={setKind}
                  data={[
                    { value: "staff", label: "Staff" },
                    { value: "student", label: "Student" },
                    { value: "pooler", label: "Pooler" },
                    { value: "prestataire", label: "Prestataire" },
                  ]}
                />
              </Grid.Col>
              <Grid.Col md={12} lg={6}>
                <Select
                  withAsterisk
                  classNames={classes}
                  label="AUTHORIZED"
                  error={form.errors.authorized}
                  value={form.values.authorized}
                  onChange={setAuthorized}
                  data={[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ]}
                />
              </Grid.Col>
              <Grid.Col md={12} lg={6}>
                <Select
                  withAsterisk
                  classNames={classes}
                  label="SUPERUSER"
                  error={form.errors.superuser}
                  value={form.values.superuser}
                  onChange={setSuperuser}
                  data={[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ]}
                />
              </Grid.Col>
              {form.values.superuser && <Grid.Col md={12} lg={12}>
                <TextInput
                  withAsterisk
                  label="LIMIT"
                  classNames={classes}
                  error={form.errors.limit}
                  type="number"
                  value={form.values.limit}
                  onChange={(event) => setLimit(event.currentTarget.value)}
                />
              </Grid.Col>}
            </Grid>
            <Group position="right" sx={{ padding: "15px" }}>
              <Button
                variant="light"
                radius="md"
                type="submit"
                rightIcon={<TbChevronRight size={20} />}
                sx={{ width: "100%" }}
              >
                Submit
              </Button>
            </Group>
          </form>
        </Tabs.Panel>

        <Tabs.Panel value="file" pt="md">
          <Center>
            <Text my="md">Download an example for the file to upload from here <b style={{
              color: "#7b79ff"
            }}><a href="/example.csv" target="_blank" download>example.csv</a></b></Text>
          </Center>
          <Dropzone
            onDrop={(files) => onDropPersonsFile(files[0])}
            onReject={(files) => setFileUploadState("rejected")}
            accept={["text/csv"]}
            maxFiles={1}
            multiple={false}
          >
            <Group
              position="center"
              spacing="xl"
              style={{ minHeight: 200, pointerEvents: "none" }}
            >
              <Dropzone.Idle>
                <Group>
                  {fileUploadState === null && (
                    <>
                      <TbUpload size={50} color={theme.colors.gray[6]} />
                      <div>
                        <Text size="md" inline color={theme.colors.gray[7]}>
                          Drag here or click to select an CSV file
                        </Text>
                        <Text size="sm" color="dimmed" inline mt={7}>
                          Attach an CSV file with persons data to add to the
                          database
                        </Text>
                      </div>
                    </>
                  )}
                  {fileUploadState === "rejected" && (
                    <>
                      <TbFileDislike size={50} color={theme.colors.red[6]} />
                      <div>
                        <Text size="md" inline color={theme.colors.red[7]}>
                          Drag here or click to select an CSV file
                        </Text>
                        <Text size="sm" color="red" inline mt={7}>
                          Ypur attached file is not a valid CSV file
                        </Text>
                      </div>
                    </>
                  )}
                  {fileUploadState === "accepted" && (
                    <>
                      <TbFileLike
                        TbFileDislike
                        size={70}
                        color={theme.colors.green[4]}
                      />
                      <div>
                        <Text size="md" inline color={theme.colors.green[7]}>
                          Drag here or click to select a CSV file
                        </Text>
                        <Text
                          size="sm"
                          color={theme.colors.green[6]}
                          inline
                          mt={7}
                        >
                          Your attached file is{" "}
                          <strong>{fileUpload?.name}</strong>
                        </Text>
                      </div>
                    </>
                  )}
                </Group>
              </Dropzone.Idle>
            </Group>
          </Dropzone>
          {fileUploadLogs.length > 0 && (
            <>
              <Text sx={{ margin: "10px 0" }}>Errors Logs:</Text>
              <List withPadding size="sm">
                {fileUploadLogs.map((log, index) => (
                  <List.Item
                    key={index}
                    icon={
                      <ThemeIcon color="red" size={13} radius="xl">
                        <TbX size={13} />
                      </ThemeIcon>
                    }
                  >
                    {log}
                  </List.Item>
                ))}
              </List>
            </>
          )}
          <Group position="right" sx={{ padding: "15px" }}>
            <Button
              variant="light"
              radius="md"
              type="submit"
              rightIcon={<TbChevronRight size={20} />}
              sx={{ width: "100%" }}
              disabled={fileUpload !== null ? false : true}
              onClick={handleSubmitPersonsFile}
            >
              Submit
            </Button>
          </Group>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}
