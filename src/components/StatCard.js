export default function StatCard({
  amount,
  title,
  updated,
  icon,
}) {
  return (
    <div className="stat-card position-relative p-3">

      <div className="stat-icon">
        <i className={`bi ${icon}`}></i>
      </div>

      <h4 className="fw-bold mb-1">{amount}</h4>
      <small className="fw-semibold">{title}</small>

      <small className="opacity-75 d-block mt-3">
        <i className="bi bi-clock me-1"></i>
        {updated}
      </small>

    </div>
  );
}
