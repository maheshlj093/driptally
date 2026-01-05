import { useEffect, useState } from "react";
import { url } from "./url";

export default function CampaignMessagesEdit({ onBack }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(url.GetCampaignMessages)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setRows(
            data.data.map(r => ({
              ...r,
              isEditing: false,
              originalMessage: r.message,
              statusMsg: "",
              statusType: "" // success | error
            }))
          );
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError("Failed to load messages"))
      .finally(() => setLoading(false));
  }, []);

  const enableEdit = index => {
    const copy = [...rows];
    copy[index].isEditing = true;
    copy[index].statusMsg = "";
    setRows(copy);
  };

  const cancelEdit = index => {
    const copy = [...rows];
    copy[index].message = copy[index].originalMessage;
    copy[index].isEditing = false;
    copy[index].statusMsg = "";
    setRows(copy);
  };

  const saveMessage = index => {
    const row = rows[index];

    if (!row.message.trim()) {
      updateStatus(index, "Message cannot be empty", "error");
      return;
    }

    const fd = new FormData();
    fd.append("id", row.id);
    fd.append("message", row.message);

    fetch(url.UpdateCampaignMessage, {
      method: "POST",
      body: fd
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          const copy = [...rows];
          copy[index].originalMessage = row.message;
          copy[index].isEditing = false;
          updateStatus(index, "Saved successfully", "success");
          setRows(copy);
        } else {
          updateStatus(index, data.message, "error");
        }
      })
      .catch(() =>
        updateStatus(index, "Server error", "error")
      );
  };

  const updateStatus = (index, msg, type) => {
    const copy = [...rows];
    copy[index].statusMsg = msg;
    copy[index].statusType = type;
    setRows(copy);
  };

  if (loading) return <p>Loading...</p>;

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
      </button> Campaign Messages
        </div>

        <div className="card-body p-0">
          <table className="table table-bordered mb-0">
            <thead className="table-light">
              <tr>
                <th className="align-middle" style={{ width: "60px" }}>SL</th>
                <th className="align-middle" style={{ width: "80px" }}>Day</th>
                <th>Message</th>
                <th className="align-middle" style={{ width: "160px" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td className="align-middle">{index + 1}</td>
                  <td className="align-middle">Day {row.day_number}</td>

                  <td>
                    <textarea
                      className="form-control"
                      rows="2"
                      disabled={!row.isEditing}
                      value={row.message}
                      onChange={e => {
                        const copy = [...rows];
                        copy[index].message = e.target.value;
                        setRows(copy);
                      }}
                    />

                    {row.statusMsg && (
                      <div
                        className={`small mt-1 fw-semibold ${
                          row.statusType === "success"
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        {row.statusMsg}
                      </div>
                    )}
                  </td>

                  <td className="align-middle">
                    {!row.isEditing ? (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => enableEdit(index)}
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => saveMessage(index)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => cancelEdit(index)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {error && (
          <div className="card-footer text-danger fw-semibold">
            {error}
          </div>
        )}

      </div>
    </div>
  );
}
