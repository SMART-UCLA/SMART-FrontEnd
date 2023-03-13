import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {/* <li>
            <Link to="/Data">Data</Link>
          </li> */}
          <li>
            <Link to="/SearchPage">SearchPage</Link>
          </li>
          <li>
            <Link to="/TestGraph">TestGraph</Link>
          </li>
        </ul>
      </nav>
      <div>
          <h1>Welcome to SMART Project!</h1>
      </div>
      <Outlet />
    </>
  )
};

export default Layout;