import { useEffect, useState } from "react";
import DashboardNavbar from "./DashboardNavbar";
import {
  Container,
  Grid,
  Button,
  Tabs,
  Badge,
  Input,
  Text,
  Group,
  TextInput,
} from "@mantine/core";
import { TbSearch, TbUserPlus } from "react-icons/tb";
import axiosService from "../hooks/axiosService";
import Cookies from "js-cookie";
import { DashboardPersonsList } from "./DashboardPersonsList";
import DashboardAddPersonsModal from "./DashboardAddPersonsModal";
import { useRouter } from "next/router";
import { GrClose } from "react-icons/gr";

export default function DashboardPersons() {
  // query
  const router = useRouter()
  const { type } = router.query

  useEffect(() => {
    if (!type) return;
  }, [])

  const [page, setPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);

  const [search, setSearch] = useState("");
  const [personsList, setPersonsList] = useState(null);
  const [personsListBackup, setPersonsListBackup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counters, setCounters] = useState({
    total: 0,
    staff: 0,
    students: 0,
    poolers: 0,
    prestataires: 0,
  });

  // modals
  const [addPersonStatus, setAddPersonStatus] = useState(false);

  const [kind, setKind] = useState("");

  const getPersonsList = async () => {
    setSearch("");
    setLoading(true);
    const res = await axiosService(`${process.env.NEXT_PUBLIC_API_URL}dashboard/persons/?kind=${kind}&page=${page}`, Cookies.get("token"));
    if (res.status === 200) {
      if (counters.total === 0) {
        setCounters({
          total: res.data.count,
          staff: res.data.staff,
          students: res.data.student,
          poolers: res.data.pooler,
          prestataires: res.data.prestataire,
        });
      }
      setPersonsList(res.data.results);
      setPersonsListBackup(res.data.results);
      setLoading(false);
      setNumberOfPages(res.data.num_pages);
    } else {
      setPersonsList(null);
      setLoading(false);
    }
  };

  const searchInThePersonsList = async () => {
    // if (search.length > 0) {
    //   setPersonsList(
    //     personsList.filter((person) => {
    //       return (
    //         String(person.full_name.toLowerCase()).includes(search.toLowerCase()) ||
    //         String(person.login.toLowerCase()).includes(search.toLowerCase()) ||
    //         String(person.badge.toLowerCase()).includes(search.toLowerCase())
    //       );
    //     })
    //   );
    // }
    // setTimeout(() => {
    //   setLoading(false);
    // }, 500)
    const res = await axiosService(`${process.env.NEXT_PUBLIC_API_URL}dashboard/persons/search/?search=${search}`, Cookies.get("token"));
    if (res.status === 200) {
      setPersonsList(res.data.results);
      setLoading(false);
      setNumberOfPages(res.data.num_pages);
    }
  };

  useEffect(() => {
    getPersonsList();
  }, [page, kind]);

  // useEffect(() => {
  //   searchInThePersonsList();
  // }, [search]);
  // useEffect(() => {
  //   searchInThePersonsList();
  // }, [search === '']);


  console.log(page, numberOfPages);
  // console.log(setPage)


  return (
    <div>
      <DashboardNavbar active={"Persons"} />
      <DashboardAddPersonsModal
        opened={addPersonStatus}
        setOpened={setAddPersonStatus}
        getPersonsList={getPersonsList}
      />
      <Container>
        <Grid
          sx={{
            backgroundColor: "white",
            borderRadius: "15px",
            padding: "15px",
          }}
        >
          <Grid.Col sm={12} md={8} lg={8}>
            <Tabs defaultValue="all">
              <Tabs.List>
                <Tabs.Tab
                  onClick={() => {
                    setPage(1);
                    setKind("");
                  }}
                  value="all"
                >
                  <Group spacing={4}>
                    All
                    <Text size="sm" color={"blue"} weight="700">
                      {counters.total}
                    </Text>
                  </Group>
                </Tabs.Tab>
                <Tabs.Tab
                  value="Staff"
                  onClick={() => {
                    setPage(1);
                    setKind("staff");
                  }}
                >
                  <Group spacing={4}>
                    Staff
                    <Text size="sm" color={"blue"} weight="700">
                      {counters.staff}
                    </Text>
                  </Group>
                </Tabs.Tab>
                <Tabs.Tab
                  value="Students"
                  onClick={() => {
                    setPage(1);
                    setKind("student");
                  }}
                >
                  <Group spacing={4}>
                    Students
                    <Text size="sm" color={"blue"} weight="700">
                      {counters.students}
                    </Text>
                  </Group>
                </Tabs.Tab>
                <Tabs.Tab
                  value="prestataires"
                  onClick={() => {
                    setPage(1);
                    setKind("prestataire");
                  }}
                >
                  <Group spacing={4}>
                    Prestataires
                    <Text size="sm" color={"blue"} weight="700">
                      {counters.prestataires}
                    </Text>
                  </Group>
                </Tabs.Tab>
                <Tabs.Tab
                  value="poolers"
                  onClick={() => {
                    setPage(1);
                    setKind("pooler");
                  }}
                >
                  <Group spacing={4}>
                    Poolers
                    <Text size="sm" color={"blue"} weight="700">
                      {counters.poolers}
                    </Text>
                  </Group>
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </Grid.Col>
          <Grid.Col
            sm={12}
            md={4}
            lg={4}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              leftIcon={<TbUserPlus />}
              variant="light"
              onClick={() => {
                setAddPersonStatus(true);
              }}
            >
              Add New Person
            </Button>
          </Grid.Col>
          <Grid.Col sm={12} md={12} lg={12}>
            <form onSubmit={(e) => {
              setLoading(true);
              e.preventDefault()
              searchInThePersonsList();
            }}>
              <TextInput
                styles={(theme) => ({
                  input: {
                    backgroundColor: theme.colors.gray[0],
                    borderRadius: "8px",
                    padding: "15px",
                    border: "none",
                    fontSize: "14px",
                  },
                })}
                icon={<TbSearch />}
                placeholder="search with LOGIN or NAME"
                size="md"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                rightSection={
                  search ? (
                    <GrClose
                      size={18}
                      style={{
                        display: 'block',
                        opacity: 0.5,
                        cursor: 'pointer',
                      }}
                      onClick={() => { setSearch(''); setPersonsList(personsListBackup) }}
                    />
                  ) : null
                }
                value={search}
              />
            </form>
          </Grid.Col>

          <Grid.Col sm={12} md={12} lg={12}>
            <DashboardPersonsList
              data={personsList}
              getPersonsList={getPersonsList}
              loading={loading}
              numberOfPages={numberOfPages}
              setPage={setPage}
              page={page}
            />
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}
