import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaChevronRight, FaPlus } from "react-icons/fa";
import './Sidebar.css';
import axios from 'axios';

function Header() {
  const navigate = useNavigate();
  return <h1 onClick={() => navigate('/')}>GRC Compliance</h1>;
}

const menu = [
  { to: '/', label: 'Dashboard', icon: <svg className="nav-icon" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg> },
  { to: '/control-category', label: 'Control Category', icon: <svg className="nav-icon" viewBox="0 0 24 24"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" /></svg> },
  { to: '/controls', label: 'Controls', icon: <svg className="nav-icon" viewBox="0 0 24 24"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" /></svg> },
  { to: '/audits', label: 'Audits', icon: <svg className="nav-icon" viewBox="0 0 24 24"><path d="M14 6V4h-4v2h4zM4 8v11h16V8H4zm16-2c1.11 0 2 .89 2 2v11c0 1.11-.89 2-2 2H4c-1.11 0-2-.89-2-2l.01-11c0-1.11.88-2 1.99-2h4V4c0-1.11.89-2 2-2h4c1.11 0 2 .89 2 2v2h4z" /></svg> },
  { to: '/reports', label: 'Reports', icon: <svg className="nav-icon" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /></svg> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showComplianceSub, setShowComplianceSub] = useState(false);
  const [compliances, setCompliances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompliances = async () => {
      try {
        const response = await axios.get('/api/compliances');
        setCompliances(response.data);
      } catch (error) {
        console.error('Error fetching compliances:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompliances();
  }, []);

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-header">
        <button
          className={`${collapsed ? ' collapse-btn' : 'not-collapse-btn'}`}
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <svg width="22" height="22" viewBox="0 0 24 24"><path fill="#8b8fd1" d="M10 17l5-5-5-5v10z"/></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24"><path fill="#8b8fd1" d="M14 7l-5 5 5 5V7z"/></svg>
          )}
        </button>
        <div className="logo" onClick={() => navigate('/')}>
          {!collapsed ? (
            <h1>GRC Compliance</h1>
          ) : (
            <span className="logo-icon" role="img" aria-label="logo">🧑‍💻</span>
          )}
        </div>
      </div>
      <nav>
        <ul className="nav-menu">
          {menu.slice(0, 3).map(item => (
            <li className={`${collapsed ? ' nav-item-collapsed' : 'nav-item'}`} key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                {item.icon}
                {!collapsed && item.label}
              </NavLink>
            </li>
          ))}

          {/* Dynamic Compliance tab with submenu */}
          <li
            className={`${collapsed ? ' nav-item-collapsed' : 'nav-item'} compliance-parent`}
            onMouseEnter={() => setShowComplianceSub(true)}
            onMouseLeave={() => setShowComplianceSub(false)}
          >
            <div className="nav-link compliance-link">
              <svg className="nav-icon" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              {!collapsed && <>Compliance <FaChevronRight style={{ marginLeft: 6, fontSize: 12 }} /></>}
            </div>
            {showComplianceSub && !collapsed && (
              <ul className="sidebar-submenu">
                {loading ? (
                  <li>Loading...</li>
                ) : (
                  <>
                    {compliances.map(compliance => (
                      <li key={compliance._id}>
                        <NavLink 
                          to={`/compliance/${compliance.name.toLowerCase()}`} 
                          className="sidebar-sublink"
                        >
                          {compliance.name}
                        </NavLink>
                      </li>
                    ))}
                    <li>
                      <NavLink to="/compliance/add" className="sidebar-sublink add-new">
                        <FaPlus style={{ fontSize: 12, marginRight: 4 }} />
                        Add New
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            )}
          </li>

          {menu.slice(3).map(item => (
            <li className={`${collapsed ? ' nav-item-collapsed' : 'nav-item'}`} key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                {item.icon}
                {!collapsed && item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;