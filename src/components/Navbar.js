import logo from "../logo.png";
export default function Navbar({ onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow">
      <div className="container-fluid">

         <span className="navbar-brand d-flex align-items-center fw-bold">
          <img
            src={logo}
            alt="Drip Messaging"
            height="32"
            className="me-2"
          />
          Drip Tally
        </span>

        {/* ICON MENU */}
        <div className="d-flex align-items-center gap-3">

          <button
            className="btn btn-outline-light btn-sm"
            onClick={onLogout}
            title="Logout"
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>

        </div>
      </div>
    </nav>
  );
}
