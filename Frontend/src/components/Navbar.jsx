import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export const Logo = () => <Link className="brand" to="/"><span className="brand-mark">ग</span><span>Grama <b>Setu</b></span></Link>;
function Navbar() { const { user, isAuthenticated, logout } = useAuth(); const navigate = useNavigate(); return <header className="site-header"><nav className="navbar container"><Logo/><div className="nav-links"><NavLink to="/" end>Home</NavLink><NavLink to="/workers">Find workers</NavLink>{isAuthenticated ? <><NavLink to="/dashboard">My dashboard</NavLink><span className="user-chip"><i>{user?.name?.[0] || "U"}</i>{user?.name?.split(" ")[0]}</span><button className="text-button" onClick={() => { logout(); navigate("/"); }}>Sign out</button></> : <><NavLink to="/login">Sign in</NavLink><Link className="button button-small" to="/register">Get started <span>→</span></Link></>}</div></nav></header> }
export default Navbar;
