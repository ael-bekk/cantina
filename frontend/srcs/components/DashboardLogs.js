import { Container, ScrollArea, Table } from "@mantine/core";
import { useRouter } from "next/router";
import DashboardNavbar from "./DashboardNavbar";
import Cookies from "js-cookie";
import { useEffect } from "react";

export default function DashboardLogs({ token, data }) {

    const router = useRouter();
    useEffect(() => {
        if (Cookies.get('is_admin') !== "true") {
            router.push('/dashboard');
        }
    }, [])

    const rows = data.logs.map((element, key) => (
        <tr key={key}>
            <td>{element.badge_id}</td>
            <td>{element.login}</td>
            <td>{element.kind}</td>
            <td>{element.meal}</td>
            <td>{new Date(element.time).toLocaleString()}</td>
        </tr>
    ));

    return (
        <>
            <DashboardNavbar active={"Logs"} />
            <Container size="lg">
                <ScrollArea style={{ height: 500, marginTop: "20px" }}>
                    <Table>
                        <thead>
                            <tr>
                                <th>Badge id</th>
                                <th>Login</th>
                                <th>Kind</th>
                                <th>Meal</th>
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