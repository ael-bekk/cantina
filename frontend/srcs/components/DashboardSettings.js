import styles from "../../styles/DashboardSettings.module.scss";
import { BsCaretLeftFill, BsFillTrashFill } from "react-icons/bs";
import { VscTrash, VscEdit, VscAdd } from "react-icons/vsc";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Router from 'next/router'
import ModalUser from "./ModalUser";
import cn from "classnames";
import Cookies from "js-cookie";
import axiosService from "../hooks/axiosService";
import ModalDeleteUser from "./ModalDeleteUser";
import DashboardNavbar from "./DashboardNavbar";

export default function DashboardSettings({ data, identity }) {
  const router = useRouter();
  const [userData, setUsersData] = useState(data);
  const [showUserModal, setShowUserModal] = useState(false);

  const [addUserData, setAddUserData] = useState({
    id: 0,
    first_name: "",
    last_name: "",
    username: "",
    user_type: "admin",
    password1: "",
    password2: "",
  });

  const [userDataErrors, setUserDataErrors] = useState({});

  const is_admin = Cookies.get("is_admin");
  if (is_admin === "false") {
    Router.push('/dashboard');
  }


  const getUsers = async () => {
    const data = await axiosService(
      `${process.env.NEXT_PUBLIC_API_URL}dashboard/users/`,
      Cookies.get("token")
    );
    setUsersData(data.data);
  };

  const handleAddUser = async (method) => {
    setUserDataErrors({});
    const data = await axiosService(
      `${process.env.NEXT_PUBLIC_API_URL}dashboard/users/`,
      Cookies.get("token"),
      method,
      addUserData
    );
    if (data.status === 400) {
      setUserDataErrors(data.data);
    } else {
      setShowUserModal(false);
      setShowEditModal(false);
      getUsers();
      setAddUserData({
        id: 0,
        first_name: "",
        last_name: "",
        username: "",
        user_type: "admin",
        password1: "",
        password2: "",
      });
    }
  };

  const [showEditModal, setShowEditModal] = useState(false);

  const handleClickEdit = (_id) => {
    const user = userData.find((usr) => usr.id === _id);
    setAddUserData(user);
    setShowEditModal(true);
  };

  const [identityField, setIdentityField] = useState(identity.identity);

  const getIdentity = async () => {
    const data = await axiosService(
      `${process.env.NEXT_PUBLIC_API_URL}dashboard/identity/`,
      Cookies.get("token"),
      "patch",
      JSON.stringify({ identity: identityField })
    );
  };

  useEffect(() => {
    getIdentity();
  }, [identityField]);

  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [id, setId] = useState(0);

  const handleDeleteUser = async () => {
    const data = await axiosService(
      `${process.env.NEXT_PUBLIC_API_URL}dashboard/users/`,
      Cookies.get("token"),
      "delete",
      JSON.stringify({ id: id })
    );
    getUsers();
    setShowDeleteUser(false);
  };

  return (
    <>
      {showUserModal && (
        <ModalUser
          show={showUserModal}
          onHide={() => setShowUserModal(false)}
          setAddUserData={setAddUserData}
          addUserData={addUserData}
          handleAddUser={handleAddUser}
          userDataErrors={userDataErrors}
          type={"add"}
        />
      )}
      {showEditModal && (
        <ModalUser
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          setAddUserData={setAddUserData}
          addUserData={addUserData}
          handleAddUser={handleAddUser}
          userDataErrors={userDataErrors}
          type={"edit"}
        />
      )}
      {showDeleteUser && (
        <ModalDeleteUser
          show={showDeleteUser}
          onHide={() => setShowDeleteUser(false)}
          handleDeleteUser={handleDeleteUser}
        />
      )}
      <main className={styles.settings}>
        <DashboardNavbar active={"Settings"} />
        <section className="container">
          <div className="row">
            <div className="col-12">
              <div className={styles.users}>
                <h2>Platform Identity</h2>
                <select
                  className={cn("form-select", styles.select)}
                  value={identityField}
                  onChange={(e) => setIdentityField(e.target.value)}
                >
                  <option value="benguerir">Benguerir</option>
                  <option value="khouribga">Khouribga</option>
                  <option value="titouan">Titouan</option>
                </select>
              </div>
            </div>
            <div className="col-lg-12">
              <div className={styles.users}>
                <h2>Users Accounts</h2>
                <h2
                  className={styles.addUser}
                  onClick={() => setShowUserModal(true)}
                >
                  {" "}
                  <VscAdd size={20} /> Add User
                </h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">username</th>
                      <th scope="col">first name</th>
                      <th scope="col">last name</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.detail === undefined && userData.map((user, i) => {
                      return (
                        <tr key={i}>
                          <td>{user.username}</td>
                          <td>{user.first_name}</td>
                          <td>{user.last_name}</td>
                          <td type={user.is_superuser ? "admin" : "cashier"}>
                            <span>
                              {user.is_superuser ? "admin" : ""}
                              {!user.is_superuser && !user.is_staff
                                ? "cashier"
                                : ""}
                              {!user.is_superuser && user.is_staff
                                ? "Manager"
                                : ""}
                            </span>
                          </td>
                          <td>
                            {user.username !== Cookies.get("username") && (
                              <VscTrash
                                size={25}
                                type="delete"
                                onClick={() => {
                                  setShowDeleteUser(true);
                                  setId(user.id);
                                }}
                              />
                            )}
                            <VscEdit
                              size={25}
                              type="edit"
                              onClick={() => handleClickEdit(user.id)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
