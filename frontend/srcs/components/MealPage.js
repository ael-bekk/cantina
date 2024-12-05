import styles from "../../styles/MealPage.module.scss";
import { FaUsers } from "react-icons/fa";
import { BsCaretLeftFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { ParseTime } from "../hooks/heplers";
import { ImWarning } from "react-icons/im";
import { useEffect, useRef, useState } from "react";
import ModalComponent from "./Modal";
import Cookies from "js-cookie";
import axios from "axios";
import axiosService from "../hooks/axiosService";
import { useToasts } from "react-toast-notifications";

export default function MealPage({ mealName, data }) {
  const [dataSet, setDataSet] = useState(data);
  const focusDiv = useRef();

  const router = useRouter();
  const { addToast } = useToasts();

  useEffect(() => {
    if (focusDiv.current) focusDiv.current.focus();
  }, [focusDiv]);

  const [userData, setUserData] = useState({
    badge: 0,
    first_name: "",
    image_url: "",
    last_name: "",
    login: "",
    profile: "",
    response: true,
    state: "",
  });

  const [openModal, setOpenModal] = useState(false);

  const [login, setLogin] = useState("");

  const handleSendLogin = () => {
    if (login !== "") {
      socket.current.send(
        JSON.stringify({
          login: login.trim(),
          meal: mealName,
          event: "LOGIN",
        })
      );
    }
    setLogin("");
  };

  const getData = async () => {
    const data = await axiosService(
      `${process.env.NEXT_PUBLIC_API_URL}meals/${mealName}/`,
      Cookies.get("token")
    );
    setDataSet(data.data);
  };

  const [loading, setLoading] = useState(false);

  const createregistry = () => {
    setLoading(true);
    axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_API_URL}create-registry/`,
      data: {
        badge: userData.badge,
        first_name: userData.first_name,
        image_url: userData.image_url,
        last_name: userData.last_name,
        login: userData.login,
        profile: userData.profile,
        response: userData.response,
        state: userData.state,
        meal: mealName,
      },
      headers: {
        Authorization: `Token ${Cookies.get("token")}`,
      },
    }).then((response) => {
      console.log('eeee');
      console.log(response.data);
      setLoading(false);
    }).catch((error) => {
      if (!error.response) return;
      if (error.response.data.detail === 'USER_LIMIT_REACHED') {
        addToast("Cette personne a atteint son quota de repas", {
          appearance: "warning",
          autoDismiss: true,
        });
      }
      setLoading(false);
    }).finally(() => {

    })
  };

  const socket = useRef(null);

  const CloseConnection = () => {
    if (socket.current !== null) {
      socket.current.close();
      socket.current = null;
    }
  };

  const SetupConnection = () => {
    let baseURL = process.env.NEXT_PUBLIC_WS_URL;
    if (window.location.protocol === "https:") {
      baseURL = `wss://${window.location.hostname}/ws/`;
    }
    socket.current = new WebSocket(
      `${baseURL}manager?token=${typeof window !== undefined && Cookies.get("token")
      }`
    );
    console.log("Setup Connection...");
    socket.current.onopen = function open() {
      console.log("Connection Opened");
    };

    socket.current.onerror = function error() {
      console.log("Connection Error");
    };

    socket.current.onclose = function (e) {
      console.log("Connection Closed");
      setTimeout(function () {
        SetupConnection();
      }, 1000);
    };

    // Sending the info about the room
    socket.current.onmessage = function (e) {
      let data = JSON.parse(e.data);

      if (data.event === "EVENT_USER_NOT_AUTHORIZED") {
        addToast("Cette personne n'est pas autorisée à prendre ce repas", {
          appearance: "warning",
          autoDismiss: true,
        });
        return;
      }

      if (data.event === "USER" && data.res) {
        if (data.res.reponse === false) {
          addToast("Ce personne n'a pas autorisé pour ce service", {
            appearance: "error",
            autoDismiss: true,
          });
        } else {
          setOpenModal(true);
          setUserData(data.res);
        }
      }

      if (data.event === "USER_ALREADY") {
        addToast("Ce personne a déjà pris son repas", {
          appearance: "warning",
          autoDismiss: true,
        });
      }
      if (data.event === "USER_LIMIT_REACHED") {
        addToast("Cette personne a atteint son quota de repas", {
          appearance: "warning",
          autoDismiss: true,
        });
      }

      if (data.event === "USER_NOT_FOUND") {
        addToast("Ce login n'est pas valide", {
          appearance: "warning",
          autoDismiss: true,
        });
      }

      if (data.event === "ENDPOINT_ERROR") {
        addToast("Erreur de serveur, veuillez contacter le staff technique", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    };

    if (socket.current.readyState == WebSocket.OPEN) {
      socket.current.onopen();
    }
  };

  useEffect(() => {
    SetupConnection();
  }, []);

  return (
    <>
      <ModalComponent
        show={openModal}
        onHide={() => setOpenModal(false)}
        setOpenModal={setOpenModal}
        data={userData}
        createregistry={createregistry}
        getData={getData}
        setLogin={setLogin}
        loading={loading}
      />
      <main className={styles.mealPage}>
        <section className={styles.header}>
          <div className={styles.previous} onClick={() => router.push("/")}>
            <BsCaretLeftFill size={50} />
            <span>Accueil</span>
          </div>
          <div className={styles.logo}>
            <h2>Welcome to </h2>
            <h1>1337 Restaurant</h1>
            <h2>{mealName === "lunch" && "lunch | الغداء"}</h2>
            {/* <h2>{mealName === "lunch" && "Ramadan Ftour | إفطار رمضان"}</h2>
            <h2>{mealName === "dinner" && "Dinner & Suhoor | العشاء و السحور"}</h2> */}
            <h2>{mealName === "dinner" && "dinner | العشاء"}</h2>
            <h2>{mealName === "breakfast" && "breakfast | الفطور"}</h2>
          </div>

          <div className={styles.mealInfo}>
            <div className={styles.studentsNumber}>
              <FaUsers size={50} />
              <span>{dataSet.count}</span>
            </div>
          </div>
        </section>

        {!dataSet.is_available && (
          <section className="row justify-content-center my-3">
            <div className="col-lg-6 myAlert" role="alert">
              <ImWarning size={30} /> Vous n'êtes pas à l'heure du{" "}
              {mealName === "breakfast" && "petit-déjeuner"}{" "}
              {mealName === "lunch" && "déjeuner"}{" "}
              {mealName === "dinner" && "dîner"}
            </div>
          </section>
        )}

        <section className={styles.body}>
          {dataSet.is_available && (
            <form
              className={styles.loginInput}
              onSubmit={(e) => {
                e.preventDefault();
                handleSendLogin();
              }}
            >
              <input
                type="password"
                placeholder="1337 login"
                value={login}
                onChange={(e) => {
                  !openModal && setLogin(e.target.value);
                }}
                onBlur={() => focusDiv.current.focus()}
                ref={focusDiv}
              />
              <button type="submit">Submit</button>
            </form>
          )}
          <div className={styles.logs}>
            {dataSet.history.map((item, i) => (
              <div className={styles.log} key={i}>
                <img src={item.image_url} />
                <div className={styles.meta}>
                  <div>
                    <p>
                      {item.first_name} {item.last_name}
                    </p>
                    <p>{ParseTime(item.time)}</p>
                  </div>
                  <p className={styles.login}>{item.login}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}