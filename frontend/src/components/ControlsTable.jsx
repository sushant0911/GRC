import React from 'react';
import controlsData from '../data/controls';

const ControlsTable = () => {
    return (
        <div className="controls-section fade-in">
            <div className="section-header">
                <h3 className="section-title">ISO 27001:2022 Controls</h3>
                <button className="btn btn-secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
                    </svg>
                    Filter
                </button>
            </div>

            <div className="table-container">
                <table className="controls-table">
                    <thead>
                        <tr>
                            <th scope="col">Control ID</th>
                            <th scope="col">Control Name</th>
                            <th scope="col">Risk Level</th>
                            <th scope="col">Status</th>
                            <th scope="col">Department</th>
                            <th scope="col">Owner</th>
                            <th scope="col">Next Audit</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(controlsData || []).map(control => (
                            <tr key={control.id}>
                                <td>{control.id}</td>
                                <td>{control.name}</td>
                                <td>
                                    <span className={`risk-badge risk-${control.riskLevel?.toLowerCase()}`}>
                                        {control.riskLevel}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge status-${control.status?.toLowerCase()}`}>
                                        {control.status}
                                    </span>
                                </td>
                                <td>{control.department}</td>
                                <td>{control.owner}</td>
                                <td>{control.nextAudit}</td>
                                <td>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ControlsTable;
