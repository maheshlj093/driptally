import { useState } from "react";
import { url } from "./url";

export default function SendCampaign({onBack}) {
  const [type, setType] = useState("single");
  const [mobile, setMobile] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const downloadTemplate = () => {
    const csvContent = "mobile\n9876543210\n9123456789";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "mobile_template.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  const send = () => {
    setError("");

    if (type === "single") {
      if (!mobile.trim()) {
        setError("Mobile number is required");
        return;
      }
      if (!/^[6-9]\d{9}$/.test(mobile)) {
        setError("Enter a valid 10-digit mobile number");
        return;
      }
    }

    if (type === "bulk" && !file) {
      setError("Please upload CSV file");
      return;
    }

    const fd = new FormData();
    fd.append("type", type);
    if (type === "single") fd.append("mobile", mobile);
    if (type === "bulk") fd.append("csv", file);

    setLoading(true);

    fetch(url.sendCampaign, { method: "POST", body: fd })
      .then(res => res.json())
      .then(data => {
        if (data.status === "error") {
          setError(data.message);
        } else {
          alert("Campaign Scheduled Successfully");

          // Reset form
          setMobile("");
          setFile(null);
          setType("single");
        }
      })
      .catch(() => {
        setError("Server error. Please try again later.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="col-lg-6 col-md-8 col-sm-10">

        <div className="card shadow border-0">
          <div className="card-header bg-success text-white fw-bold">
            <button
            className="btn btn-sm btn-light"
            onClick={onBack}
            title="Back"
          >
        <i className="bi bi-arrow-left"></i>
      </button> Send Campaign
          </div>

          <div className="card-body">
            <label className="form-label fw-semibold">
              Send Type
            </label>
            <select
              className="form-select mb-3"
              value={type}
              onChange={e => {
                setType(e.target.value);
                setError("");
              }}
            >
              <option value="single">Single</option>
              <option value="bulk">Bulk (CSV)</option>
            </select>

            {type === "single" && (
              <>
                <label className="form-label fw-semibold">
                  Mobile Number
                </label>
                <input
                  className="form-control mb-3"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={e => {
                    setMobile(e.target.value);
                    setError("");
                  }}
                />
              </>
            )}

            {type === "bulk" && (
              <>
                <label className="form-label fw-semibold">
                  Upload CSV File
                </label>
                <input
                  type="file"
                  className="form-control mb-2"
                  accept=".csv"
                  onChange={e => {
                    setFile(e.target.files[0]);
                    setError("");
                  }}
                />

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <small className="text-muted">
                    CSV must contain a <strong>mobile</strong> column
                  </small>

                  <button
                    type="button"
                    className="btn btn-link p-0 fw-semibold"
                    onClick={downloadTemplate}
                  >
                    <i className="bi bi-download me-1"></i>
                    Download CSV Template
                  </button>
                </div>
              </>
            )}

            {/* Error placeholder (prevents jump) */}
            <div style={{ minHeight: "24px" }}>
              {error && (
                <div className="text-danger fw-semibold">
                  {error}
                </div>
              )}
            </div>

          </div>

          <div className="card-footer text-end bg-light">
            <button
              className="btn btn-success px-4"
              onClick={send}
              disabled={loading}
            >
              {loading ? "Scheduling..." : (
                <>
                  <i className="bi bi-check-circle me-1"></i>
                  Schedule Campaign
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
