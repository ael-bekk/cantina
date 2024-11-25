import styles from "../../styles/DashboardPage.module.scss";
import cn from "classnames";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axiosService from "../hooks/axiosService";
import { useToasts } from "react-toast-notifications";
import { TailSpin } from "react-loader-spinner";
import { Bar } from "react-chartjs-2";
import { addDays } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ModalDateRange from "./ModalDateRange";
import fileDownload from "js-file-download";
import DashboardNavbar from "./DashboardNavbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const MealsComponent = (props) => {
  const { addToast } = useToasts();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const { mealtime, setmealtime } = props;

  const handleConfirm = async () => {
    setShowLoading(true);
    const data = await axiosService(
      `${process.env.NEXT_PUBLIC_API_URL}dashboard/meals/${mealtime.name}/`,
      Cookies.get("token"),
      "patch",
      (data = mealtime)
    );

    const { status } = data;

    if (status === 400) {
      let errors = [];
      for (const property in data.data) {
        errors.push(data.data[property][0]);
      }
      addToast(errors, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    setShowLoading(false);
    setShowConfirm(false);
  };

  return (
    <div className={styles.meal}>
      <h2>{mealtime.name}</h2>
      <div className={styles.content}>
        <label htmlFor="">Start Time</label>
        <input
          type="time"
          value={mealtime.start_time}
          onChange={(e) => {
            setmealtime({ ...mealtime, start_time: e.target.value });
            setShowConfirm(true);
          }}
        />
      </div>
      <div className={styles.content}>
        <label htmlFor="">End Time</label>
        <input
          type="time"
          value={mealtime.end_time}
          onChange={(e) => {
            setmealtime({ ...mealtime, end_time: e.target.value });
            setShowConfirm(true);
          }}
        />
      </div>
      <div className={styles.content}>
        <label htmlFor="">Status</label>
        <div className={styles["switch-container"]}>
          <input
            type="checkbox"
            id={"switch" + mealtime.name}
            className={styles.switch}
            hidden
            checked={mealtime.is_active ? true : false}
            onChange={(e) => {
              setmealtime({ ...mealtime, is_active: e.target.checked });
              setShowConfirm(true);
            }}
          />
          <label
            htmlFor={"switch" + mealtime.name}
            className={styles["switch-label"]}
          >
            <div className={styles["switch-rail"]}>
              <div className={styles["switch-slider"]}></div>
            </div>
          </label>
        </div>
      </div>
      <div className={styles.confirm}>
        {showConfirm && (
          <button onClick={handleConfirm}>
            {!showLoading ? (
              "confirm"
            ) : (
              <TailSpin
                ariaLabel="loading-indicator"
                width={66}
                height={20}
                color={"#fff"}
              />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default function DashboardPage({
  data,
  dataAnalytics,
  dataAnalyticsDefaultDate,
}) {
  const [showDateRange, setShowDateRange] = useState(false);

  const [dataFound, setDataFound] = useState([]);

  const [loadingFind, setLoadingFind] = useState(false);
  const [isAdmin, setIsAdmin] = useState(Cookies.get("is_admin"));
  const [isStaff, setIsStaff] = useState(Cookies.get("is_staff"));

  useEffect(() => {
    setDataFound(dataAnalyticsDefaultDate.entries);
  }, [dataAnalyticsDefaultDate]);

  const dateRangeParsed = (date, is_end) => {
    if (is_end) {
      let new_date = new Date(date);
      new_date.setDate(new_date.getDate() + 1);
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

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const [breakfastTime, setBreakfastTime] = useState({
    start_time: data.breakfast.start_time,
    end_time: data.breakfast.end_time,
    is_active: data.breakfast.is_active,
    name: data.breakfast.name,
  });
  const [lunchTime, setLunchTime] = useState({
    start_time: data.lunch.start_time,
    end_time: data.lunch.end_time,
    is_active: data.lunch.is_active,
    name: data.lunch.name,
  });
  const [dinnerTime, setDinnerTime] = useState({
    start_time: data.dinner.start_time,
    end_time: data.dinner.end_time,
    is_active: data.dinner.is_active,
    name: data.dinner.name,
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
  };

  const labels = [""];

  const dataToday = {
    labels,
    datasets: [
      {
        label: "Breakfast",
        data: [dataAnalytics.today.breakfast],
        backgroundColor: "#4BC0C0",
      },
      {
        label: "Lunch",
        data: [dataAnalytics.today.lunch],
        backgroundColor: "#FFB2C1",
      },
      {
        label: "Dinner",
        data: [dataAnalytics.today.dinner],
        backgroundColor: "#A0D1F5",
      },
    ],
  };
  const dataYesterday = {
    labels,
    datasets: [
      {
        label: "Breakfast",
        data: [dataAnalytics.yesterday.breakfast],
        backgroundColor: "#4BC0C0",
      },
      {
        label: "Lunch",
        data: [dataAnalytics.yesterday.lunch],
        backgroundColor: "#FFB2C1",
      },
      {
        label: "Dinner",
        data: [dataAnalytics.yesterday.dinner],
        backgroundColor: "#A0D1F5",
      },
    ],
  };

  const handleFind = async () => {
    setLoadingFind(true);
    const data = await axiosService(
      `${process.env.NEXT_PUBLIC_API_URL
      }dashboard/meals/analytics/?__start_time=${dateRangeParsed(
        dateRange[0].startDate
      )}&__end_time=${dateRangeParsed(dateRange[0].endDate, true)}`,
      Cookies.get("token"),
      "get"
    );

    const { status } = data;

    if (status === 200) {
      setDataFound(data.data.entries);
    }

    if (status === 400) {
      Cookies.remove("token");
      Cookies.remove("is_admin");
      router.push("/login");
    }
    setLoadingFind(false);
    if (!loadingFind) {
      setShowDateRange(false);
    }
  };


  console.log('dates', dateRange[0].startDate, dateRange[0].endDate);

  const handleDownload = async () => {
    setLoadingFind(true);
    const data = await axiosService(
      `${process.env.NEXT_PUBLIC_API_URL
      }dashboard/meals/analytics/download/?__start_time=${dateRangeParsed(
        dateRange[0].startDate
      )}&__end_time=${dateRangeParsed(dateRange[0].endDate, true)}`,
      Cookies.get("token"),
      "get",
      null,
      true
    );

    const { status } = data;

    if (status === 200) {
      fileDownload(
        data.data,
        `Statistics_${dateRangeParsed(
          dateRange[0].startDate
        )}_${dateRangeParsed(dateRange[0].endDate)}.xlsx`
      );
    }

    if (status === 400) {
      Cookies.remove("token");
      Cookies.remove("is_admin");
      router.push("/login");
    }
    setLoadingFind(false);
    if (!loadingFind) {
      setShowDateRange(false);
    }
  };

  const router = useRouter();
  return (
    <>
      {showDateRange && (
        <ModalDateRange
          dateRange={dateRange}
          setDateRange={setDateRange}
          show={showDateRange}
          onHide={() => setShowDateRange(false)}
          handleFind={handleFind}
          handleDownload={handleDownload}
          loadingFind={loadingFind}
        />
      )}

      <main className={cn("container", styles.dashboardPage)}>
        <DashboardNavbar active={"Dashboard"} />

        <section className={styles.body}>
          {isAdmin === "true" && isStaff === "true" && (
            <div className={styles.mealsConfig}>
              <MealsComponent
                mealtime={breakfastTime}
                setmealtime={setBreakfastTime}
              />
              <MealsComponent mealtime={lunchTime} setmealtime={setLunchTime} />
              <MealsComponent
                mealtime={dinnerTime}
                setmealtime={setDinnerTime}
              />
            </div>
          )}
        </section>

        <section className="row">
          <div className="col-lg-6">
            <div className={styles.chart_content}>
              <h2 className={styles.chart_title}>Today analytics</h2>
              <Bar options={options} data={dataToday} />
            </div>
          </div>

          <div className="col-lg-6">
            <div className={styles.chart_content}>
              <h2 className={styles.chart_title}>Yesterday analytics</h2>
              <Bar options={options} data={dataYesterday} />
            </div>
          </div>

          <div className="col-12 ">
            <div className={styles.analytics_table}>
              <h2>Date Range Analytics</h2>
              <span
                className={styles.rangeSelect}
                onClick={() => setShowDateRange(true)}
              >
                Select
              </span>

              <table className={cn("table", styles.table)}>
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Breakfast</th>
                    <th scope="col">Lunch</th>
                    <th scope="col">Dinner</th>
                  </tr>
                </thead>
                <tbody>
                  {dataFound.map((dt, i) => {
                    return (
                      <tr key={i}>
                        <td>{dt.date}</td>
                        <td>{dt.data.breakfast}</td>
                        <td>{dt.data.lunch}</td>
                        <td>{dt.data.dinner}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
