import { Link } from "react-router-dom";
function ServiceCard({ icon, name, description }) { return <Link className="service-card" to={`/workers?profession=${encodeURIComponent(name)}`}><span className="service-icon">{icon}</span><div><h3>{name}</h3><p>{description}</p></div><span className="card-arrow">↗</span></Link>; }
export default ServiceCard;
