import Cookies from "js-cookie";
import Head from "next/head";
import { useRouter } from "next/router";
import { AiOutlineLogout } from "react-icons/ai";

const Layout = ({ title, content, children }) => {
  const router = useRouter();

  const handleLougout = () => {
    Cookies.remove("token");
    Cookies.remove("is_admin");
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={content} />
      </Head>
      <div className="global_background">
        {children}
        {Cookies.get("token") && (
          <>
            <div className="logOut" onClick={handleLougout}>
              <AiOutlineLogout size={40} />
              <span>Logout</span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

Layout.defaultProps = {
  title: "Leet Food",
  content: "Copyright 1337 2022",
};

export default Layout;
