import { useState } from "react";
import {
  createStyles,
  Table,
  Checkbox,
  ScrollArea,
  Group,
  Avatar,
  Text,
  Box,
  Loader,
  ActionIcon,
  useMantineTheme,
  Modal,
  Button,
  LoadingOverlay,
  Grid,
  TextInput,
  Select,
  Badge,
  Pagination,
} from "@mantine/core";
import { TbChevronRight, TbTrash, TbEdit } from "react-icons/tb";
import axiosService from "../hooks/axiosService";
import Cookies from "js-cookie";
import { useToasts } from "react-toast-notifications";
import { useForm } from "@mantine/form";

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
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

const DeleteModal = ({
  opened,
  setOpened,
  deletedObjects,
  setDeletedObjects,
  handleDeletePersons,
  deleteOverlay,
}) => {
  const theme = useMantineTheme();
  return (
    <Modal
      size="md"
      opened={opened}
      centered
      closeOnClickOutside={false}
      onClose={() => {
        setOpened(false);
        setDeletedObjects([]);
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
      <LoadingOverlay visible={deleteOverlay} overlayBlur={2} />
      <Group>
        <Text>Are you sure you want to do this action?</Text>
        <Text size={"sm"}>
          This action will cause delete {deletedObjects.length} persons
          permanently from the database.
        </Text>
        <Button
          color="red"
          leftIcon={<TbTrash />}
          sx={{ fontSize: "13px" }}
          fullWidth
          onClick={() => {
            handleDeletePersons();
          }}
        >
          Confirm
        </Button>
      </Group>
    </Modal>
  );
};
const UpdateModal = ({ updatedObject, setUpdatedObject, getPersonsList }) => {
  const theme = useMantineTheme();
  const { addToast } = useToasts();
  const { classes } = useStyles();
  const [updateOverlay, setUpdateOverlay] = useState(false);
  const form = useForm({
    initialValues: {
      id: updatedObject.id,
      full_name: updatedObject.full_name,
      login: updatedObject.login,
      badge: updatedObject.badge,
      kind: updatedObject.kind,
      authorized: updatedObject.authorized,
      superuser: updatedObject.superuser,
      limit: updatedObject.limit,
    },

    validate: {
      full_name: (value) =>
        value.length > 0 ? null : "This field should not be empty",
      login: (value) =>
        value.length > 0 ? null : "This field should not be empty",
      badge: (value) =>
        value.length > 0 ? null : "This field should not be empty",
      kind: (value) =>
        value.length > 0 ? null : "This field should not be empty",
      authorized: (value) =>
        value !== true || value !== false || value === null
          ? null
          : "This field should not be empty",
      superuser: (value) =>
        value !== true || value !== false || value === null
          ? null
          : "This field should not be empty",
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

  const handleUpdatePerson = async (values) => {
    setUpdateOverlay(true);
    const res = await axiosService(
      `${process.env.NEXT_PUBLIC_API_URL}dashboard/persons/`,
      Cookies.get("token"),
      "PATCH",
      values
    );
    if (res.status === 200) {
      getPersonsList();
      setUpdatedObject(null);
      addToast("Person updated successfully.", {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      form.setErrors(res.data);
    }
    setUpdateOverlay(false);
  };

  return (
    <Modal
      size="lg"
      opened={updatedObject !== null}
      centered
      closeOnClickOutside={false}
      title={
        <Text>
          {`Update `}
          <span style={{ fontWeight: "600", textTransform: "capitalize" }}>
            {String(updatedObject.full_name)}
          </span>
          {` information`}
        </Text>
      }
      onClose={() => {
        setUpdatedObject(null);
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
      <LoadingOverlay visible={updateOverlay} overlayBlur={2} />
      <form onSubmit={form.onSubmit((values) => handleUpdatePerson(values))}>
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
            onClick={() => {
              handleUpdatePerson();
            }}
          >
            Submit
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export function DashboardPersonsList({ data, getPersonsList, loading, page, numberOfPages, setPage }) {
  const { classes, cx } = useStyles();
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);
  const [deleteOverlay, setDeleteOverlay] = useState(false);
  const [deletedObjects, setDeletedObjects] = useState([]);
  const [updatedObject, setUpdatedObject] = useState(null);
  const [selection, setSelection] = useState([]);
  const { addToast } = useToasts();

  const toggleRow = (id) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) =>
      current.length === data.length ? [] : data.map((item) => item.id)
    );

  const handleDeletePersons = async () => {
    setDeleteOverlay(true);
    const res = await axiosService(
      `${process.env.NEXT_PUBLIC_API_URL}dashboard/persons/`,
      Cookies.get("token"),
      "DELETE",
      deletedObjects
    );
    if (res.status === 200) {
      getPersonsList();
      setDeleteModalStatus(false);
      setDeletedObjects([]);
      setSelection([]);
      addToast("Person deleted successfully.", {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      addToast("something went wrong please try again.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    setDeleteOverlay(false);
  };

  if (data === null || loading) {
    return (
      <Box
        sx={{
          borderRadius: "15px",
          padding: "15px",
        }}
      >
        <Text size="sm" weight={400} align="center">
          <Loader variant="dots" />
        </Text>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box
        sx={{
          borderRadius: "15px",
          padding: "15px",
        }}
      >
        <Text size="sm" weight={400} align="center">
          No persons found
        </Text>
      </Box>
    );
  }

  const rows = data.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
        <td>
          <Checkbox
            checked={selection.includes(item.id)}
            onChange={() => toggleRow(item.id)}
            transitionDuration={0}
          />
        </td>
        <td>
          <Group spacing="sm">
            <Avatar
              size={40}
              //   src={`https://cdn.intra.42.fr/users/${item.login}.jpg`}
              radius={40}
            />
            <Text size="sm" weight={500}>
              {item.full_name}
            </Text>
          </Group>
        </td>
        <td>{item.kind}</td>
        <td>{item.login}</td>
        <td>{item.badge}</td>
        <td>
          {item.authorized ? (
            <Badge color="teal" size="md" radius="md" variant="fieled">
              YES
            </Badge>
          ) : (
            <Badge color="red" size="md" radius="md" variant="fieled">
              NO
            </Badge>
          )}
        </td>
        <td>
          <Group>
            <ActionIcon
              color="red"
              radius="md"
              variant="light"
              onClick={() => {
                setDeletedObjects([item.id]);
                setDeleteModalStatus(true);
              }}
            >
              <TbTrash />
            </ActionIcon>
            <ActionIcon
              color="teal"
              radius="md"
              variant="light"
              onClick={() => setUpdatedObject(item)}
            >
              <TbEdit />
            </ActionIcon>
          </Group>
        </td>
      </tr>
    );
  });

  return (
    <>
      <ScrollArea>
        <DeleteModal
          opened={deleteModalStatus}
          setOpened={setDeleteModalStatus}
          deletedObjects={deletedObjects}
          setDeletedObjects={setDeletedObjects}
          handleDeletePersons={handleDeletePersons}
          deleteOverlay={deleteOverlay}
        />
        {updatedObject && (
          <UpdateModal
            updatedObject={updatedObject}
            setUpdatedObject={setUpdatedObject}
            getPersonsList={getPersonsList}
          />
        )}
        <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <Checkbox
                  onChange={toggleAll}
                  checked={selection.length === data.length}
                  indeterminate={
                    selection.length > 0 && selection.length !== data.length
                  }
                  transitionDuration={0}
                />
              </th>
              <th>
                PERSON
                {selection.length > 0 && (
                  <Button
                    color="red"
                    compact
                    sx={{ marginLeft: "10px" }}
                    leftIcon={<TbTrash />}
                    onClick={() => {
                      setDeletedObjects(selection);
                      setDeleteModalStatus(true);
                    }}
                  >
                    Delete {selection.length}
                  </Button>
                )}
              </th>
              <th>KIND</th>
              <th>LOGIN</th>
              <th>BADGE ID</th>
              <th>AUTHORIZED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20px"
      }}>
        <Pagination page={page} onChange={setPage} total={numberOfPages} color="red" />
      </div>
    </>
  );
}
