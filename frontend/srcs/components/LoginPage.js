import { useState } from "react";
import styles from "../../styles/LoginPage.module.css";
import axios from "axios";
import Cookie from "js-cookie";
import cn from "classnames";
import { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToasts();

  const [input, setInputs] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_API_URL}auth/login/`,
      data: input,
    }).then(
      (response) => {
        Cookie.set("token", response.data.token, { expires: 30 });
        Cookie.set("is_admin", response.data.is_admin, { expires: 30 });
        Cookie.set("is_staff", response.data.is_staff, { expires: 30 });
        Cookie.set("username", response.data.username, { expires: 30 });
        router.push("/");
      },
      (error) => {
        addToast(error.response.data.non_field_errors[0], {
          appearance: "error",
          autoDismiss: true,
        });
      }
    );
  };

  return (
    <>
      <div className={cn("row", styles.form_row)}>
        <div className={cn("col-lg-4", styles.form_container)}>
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className={styles.loginInput}>
              <input
                type="text"
                placeholder="Username / E-mail"
                value={input.username}
                onChange={(e) =>
                  setInputs({ ...input, username: e.target.value })
                }
                required
              />
            </div>
            <div className={styles.loginInput}>
              <input
                type="password"
                placeholder="password"
                value={input.password}
                onChange={(e) =>
                  setInputs({ ...input, password: e.target.value })
                }
                required
              />
            </div>
            <button className={styles.loginBtn} type="submit">
              Login
            </button>

            <span className={styles.loginDevider}>or</span>
            <div className="row justify-content-center">
              <a className={styles.loginIntraBtn} href="/login">
                Sing in with
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0"
                  y="0"
                  version="1.1"
                  viewBox="0 -200 960 960"
                  xmlSpace="preserve"
                >
                  <path d="M32 412.6L362.1 412.6 362.1 578 526.8 578 526.8 279.1 197.3 279.1 526.8 -51.1 362.1 -51.1 32 279.1z"></path>
                  <path d="M597.9 114.2L762.7 -51.1 597.9 -51.1z"></path>
                  <path d="M762.7 114.2L597.9 279.1 597.9 443.9 762.7 443.9 762.7 279.1 928 114.2 928 -51.1 762.7 -51.1z"></path>
                  <path d="M928 279.1L762.7 443.9 928 443.9z"></path>
                </svg>
                Account
              </a>
            </div>

            <p className={styles.copyRight}>
              &copy; Association LEET Initiative {new Date().getFullYear()}
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
