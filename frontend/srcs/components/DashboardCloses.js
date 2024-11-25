import { Container, ScrollArea, Table } from "@mantine/core";
import { useRouter } from "next/router";
import DashboardNavbar from "./DashboardNavbar";
import Cookies from "js-cookie";
import { useEffect } from "react";

export default function DashboardCloses({ token, data }) {

    const router = useRouter();
    useEffect(() => {
        if (Cookies.get('is_admin') !== "true") {
            router.push('/dashboard');
        }
    }, [])

    const rows = data.closes.map((element, key) => (
        <tr key={key}>
            <td>{element.kind}</td>
            <td>{element.login}</td>
            <td>{element.reason}</td>
            <td>{element.state}</td>
            <td>{new Date(element.time).toLocaleString()}</td>
        </tr>
    ));

    return (
        <>
            <DashboardNavbar active={"Closes"} />
            <Container size="lg">
                <ScrollArea style={{ height: 500, marginTop: "20px" }}>
                    <Table>
                        <thead>
                            <tr>
                                <th>Kind</th>
                                <th>Login</th>
                                <th>Reason</th>
                                <th>State</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </Table>
                </ScrollArea>
            </Container>
        </>
    )
}