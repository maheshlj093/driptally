import { useEffect, useState } from "react";
import { url } from "./url";

export default function SendHistory({onBack}) {
  const [grouped, setGrouped] = useState({});
  const [selectedMobile, setSelectedMobile] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // fetch function
  const fetchHistory = () => {
    fetch(url.history)
      .then(res => res.json())
      .then(data => {
        const groupedData = data.reduce((acc, row) => {
          if (!acc[row.mobile]) acc[row.mobile] = [];
          acc[row.mobile].push(row);
          return acc;
        }, {});
        setGrouped(groupedData);
      });
  };

  // initial fetch + polling every 10 seconds
  useEffect(() => {
    fetchHistory(); // initial
    const interval = setInterval(fetchHistory, 10000); // every 10 sec
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="container my-5">
      <div className="card shadow border-0">
        <div className="card-header bg-success text-white fw-bold">
          <button
            className="btn btn-sm btn-light"
            onClick={onBack}
            title="Back"
          >
        <i className="bi bi-arrow-left"></i>
      </button> Send History
        </div>

        <div className="card-body table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Mobile</th>
                <th>Total Messages</th>
                <th>Last Status</th>
              </tr>
            </thead>

            <tbody>
              {Object.keys(grouped).map((mobile, i) => {
                const messages = grouped[mobile];
                const last = messages[messages.length - 1];

                return (
                  <tr key={i}>
                    <td>
                      <button
                        className="btn p-0 fw-semibold"
                        data-bs-toggle="modal"
                        data-bs-target="#historyModal"
                        onClick={() => setSelectedMobile(mobile)}
                      >
                        {mobile}
                      </button>
                    </td>

                    <td>{messages.length}</td>

                    <td>
                      <span
                        className={`badge ${
                          last.status === "sent"
                            ? "bg-success"
                            : last.status === "failed"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {last.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      <div
        className="modal fade"
        id="historyModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header bg-success text-white">
              <h5 className="modal-title">
                <i className="bi bi-phone me-2"></i>
                Message History — {selectedMobile}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              {selectedMobile && (
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Day</th>
                      <th>Date</th>
                      <th>Message</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {grouped[selectedMobile]
                      .slice()
                      .sort((a, b) => a.day_number - b.day_number)
                      .map((r, i) => (
                        <tr key={i}>
                          <td>Day {r.day_number}</td>
                          <td>{formatDate(r.send_date)}</td>
                          <td>{r.message}</td>
                          <td>
                            <span
                              className={`badge ${
                                r.status === "sent"
                                  ? "bg-success"
                                  : r.status === "failed"
                                  ? "bg-danger"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {r.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
