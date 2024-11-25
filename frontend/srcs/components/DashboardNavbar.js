import styles from "../../styles/DashboardNavbar.module.scss";
import { useState } from "react";
import { useRouter } from "next/router";
import ModalExport from "./ModalExport";
import axiosService from "../hooks/axiosService";
import { addDays } from "date-fns";
import Cookies from "js-cookie";
import fileDownload from "js-file-download";
import {
  TbSettings,
  TbDatabaseExport,
  TbUsers,
  TbDashboard,
  TbSearch,
  TbHammer
} from "react-icons/tb";
import { AiOutlineFileSearch } from "react-icons/ai";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const HEADER_HEIGHT = 70;

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
    backgroundColor: "transparent",
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "10px 10px",
    // borderRadius: theme.radius.md,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.sm,
    },
  },

  linkActive: {
    "&, &:hover": {
      //   backgroundColor: theme.fn.variant({
      //     variant: "light",
      //     color: theme.primaryColor,
      //   }).background,
      //   color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
      //     .color,
      borderBottom: `1px solid ${theme.colors.gray[5]}`,
    },
  },
}));

export default function DashboardNavbar({ active }) {
  const [isAdmin, setIsAdmin] = useState(Cookies.get("is_admin"));
  const [isStaff, setIsStaff] = useState(Cookies.get("is_staff"));
  const [showExportModal, setShowExportModal] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [dateRangeExport, setDateRangeExport] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const links = [
    {
      link: "/dashboard",
      label: "Dashboard",
      icon: <TbDashboard size={18} />,
    },
    {
      link: "/dashboard/persons",
      label: "Persons",
      icon: <TbUsers size={18} />,
    },
    {
      link: "",
      label: "Export",
      icon: <TbDatabaseExport size={18} />,
    },
    {
      link: "/dashboard/search",
      label: "Search",
      icon: <TbSearch size={18} />,
    },
    {
      link: "/dashboard/closes",
      label: "Closes",
      icon: <TbHammer size={18} />,
    },
    {
      link: "/dashboard/logs",
      label: "Logs",
      icon: <AiOutlineFileSearch size={18} />,
    },

    {
      link: "/dashboard/settings",
      label: "Settings",
      icon: <TbSettings size={18} />,
    },
  ];
  const [opened, { toggle, close }] = useDisclosure(false);
  const { classes, cx } = useStyles();
  const router = useRouter();

  const items = links.map((link, key) => (
    <UnstyledButton
      key={key}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.label,
      })}
      onClick={(event) => {
        event.preventDefault();
        if (link.label === "Export") {
          setShowExportModal(true);
        } else {
          router.push(link.link);
        }
      }}
    >
      <Group spacing={8}>
        {link.icon}
        <a
          key={link.label}
          href={link.link}
          style={{ textDecoration: "none", color: "rgb(73, 80, 87)" }}
        >
          {link.label}
        </a>
      </Group>
    </UnstyledButton>
  ));

  const dateRangeParsed = (date, is_end) => {
    if (is_end) {
      let new_date = new Date();
      new_date.setDate(date.getDate() + 1);
      date = new_date;
    }
    const optionsDate = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return date
      .toLocaleDateString("zh-Hans-CN", optionsDate)
      .replaceAll("/", "-");
  };

  const handleExport = async () => {
    setLoadingExport(true);
    const data = await axiosService(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }dashboard/meals/analytics/export/?__start_time=${dateRangeParsed(
        dateRangeExport[0].startDate
      )}&__end_time=${dateRangeParsed(dateRangeExport[0].endDate, true)}`,
      Cookies.get("token"),
      "get",
      null,
      true
    );

    const { status } = data;

    if (status === 200) {
      // setDataFound(data.data.entries);
      fileDownload(
        data.data,
        `Statistics_${dateRangeParsed(
          dateRangeExport[0].startDate
        )}_${dateRangeParsed(dateRangeExport[0].endDate)}.csv`
      );
    }
    if (status === 400) {
      Cookies.remove("token");
      Cookies.remove("is_admin");
      router.push("/login");
    }
    setLoadingExport(false);
    if (!loadingExport) {
      setShowExportModal(false);
    }
  };

  return (
    <>
      {showExportModal && (
        <ModalExport
          dateRange={dateRangeExport}
          setDateRange={setDateRangeExport}
          show={showExportModal}
          onHide={() => setShowExportModal(false)}
          handleExport={handleExport}
          loadingExport={loadingExport}
        />
      )}
      <Header height={HEADER_HEIGHT} mb={50} className={classes.root}>
        <Container className={classes.header}>
          <h1>Cantina KH</h1>
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>

          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />

          <Transition
            transition="pop-top-right"
            duration={200}
            mounted={opened}
          >
            {(styles) => (
              <Paper className={classes.dropdown} withBorder style={styles}>
                {items}
              </Paper>
            )}
          </Transition>
        </Container>
      </Header>
    </>
  );
}
