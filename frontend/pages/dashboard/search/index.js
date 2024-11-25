import { useState } from "react";
import Layout from "../../../srcs/hooks/Layout";
import cookie from "cookie";
import requireAuthentication from "../../../srcs/hooks/requiredAuthentication";
import axiosService from "../../../srcs/hooks/axiosService";
import Error from "next/error";
import DashboardNavbar from "../../../srcs/components/DashboardNavbar";
import {
  Container,
  Grid,
  Button,
  ScrollArea,
  TextInput,
  Group,
  Table,
} from "@mantine/core";
import { TbSearch } from "react-icons/tb";
import { useForm } from "@mantine/form";
import { DateRangePicker } from "@mantine/dates";

export default function index({ data, token }) {
  const [searchData, setSearchData] = useState([]);
  const { status } = data;
  if (status === 503) {
    return <Error statusCode={status} title="Service not available" />;
  }
  if (status === 403) {
    return <Error statusCode={status} title="You are not authorized" />;
  }

  const form = useForm({
    initialValues: {
      login: "",
      date_range: [null, null],
    },

    validate: {
      login: (value) => (value.length > 4 ? null : ""),
    },
  });

  const getRecordsData = async (values) => {
    const { login, date_range } = values;
    let [start_date, end_date] = date_range;

    start_date = start_date ? start_date.toISOString().split("T")[0] : "null";
    end_date = end_date ? end_date.toISOString().split("T")[0] : "null";

    const data = await axiosService(
      `${process.env.NEXT_PUBLIC_API_URL}dashboard/records/?login=${login}&start_date=${start_date}&end_date=${end_date}`,
      token
    );
    setSearchData(data.data);
  };

  const rows = searchData.map((element, key) => (
    <tr key={key}>
      <td>{element.time}</td>
      <td>{element.full_name}</td>
      <td>{element.login}</td>
      <td>{element.meal}</td>
      <td>{element.cashier}</td>
    </tr>
  ));

  return (
    <Layout title={"1337 Restaurant | Search"}>
      <DashboardNavbar active={"Search"} />
      <Container>
        <form onSubmit={form.onSubmit((values) => getRecordsData(values))}>
          <Grid align="flex-end">
            <Grid.Col span={10}>
              <Group grow align="flex-start">
                <TextInput
                  placeholder="Student login"
                  description="Search by student login"
                  icon={<TbSearch size={14} />}
                  radius="md"
                  size="md"
                  {...form.getInputProps("login")}
                />
                <DateRangePicker
                  placeholder="Pick dates range"
                  description="keep it empty to search all dates"
                  radius="md"
                  size="md"
                  error=""
                  {...form.getInputProps("date_range")}
                />
              </Group>
            </Grid.Col>
            <Grid.Col span={2}>
              <Button variant="light" radius="md" size="md" type="submit">
                Search
              </Button>
            </Grid.Col>
          </Grid>
        </form>

        <ScrollArea style={{ height: 500, marginTop: "20px" }}>
          <Table>
            <thead>
              <tr>
                <th>Date/Time</th>
                <th>Full Name</th>
                <th>Login</th>
                <th>Meal</th>
                <th>Cashier</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = requireAuthentication(async (context) => {
  const cookies = cookie.parse(
    context.req ? context.req.headers.cookie || "" : document.cookie
  );

  if (cookies.token === undefined) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  const data = await axiosService(
    `${process.env.NEXT_PUBLIC_SERVER_API_URL}dashboard/meals/`,
    cookies.token
  );

  if (data.status === 401) {
    context.res.setHeader("Set-Cookie", [
      `token=deleted; Max-Age=0`,
      `is_admin=deleted; Max-Age=0`,
    ]);

    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: { data, token: cookies.token },
  };
});
