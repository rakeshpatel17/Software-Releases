import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, X, Download } from 'lucide-react';
import Tooltip from '../../../components/ToolTip/ToolTip';
import ProgressBar from '../../../components/ProgressBar/ProgressBar';
import exportToExcel from '../../../api/exportToExcel';
import RoleVisibility from '../../../components/AuthorizedAction/RoleVisibility';

const getDate = () => new Date().toLocaleDateString('en-GB').replace(/\//g, '-');

export function PatchPageHeader({ patchName, patchData, progress, isEditing, onToggleEdit }) {
    const navigate = useNavigate();
    return (
        <div className="patch-header">
            <div className="left-header">
                <h2>Patch Details</h2>
                {patchData.patch_state !== 'released' && (
                    <RoleVisibility roles={['admin']}>
                        <button className="edit-btn" onClick={onToggleEdit}>
                            {isEditing ? (
                                <X size={16} />
                            ) : (
                                <Tooltip text="Edit" position="down">
                                    <Pencil size={18} />
                                </Tooltip>
                            )}
                        </button>
                    </RoleVisibility>

                )}
            </div>
            <div className="right-header">
                <div className="progress-container">
                    <ProgressBar value={progress} label="Patch Progress" onClick={() => navigate(`/progress/${patchName}`)} />
                </div>
                <button
                    className="export-btn"
                    onClick={() => exportToExcel(patchData.products_data, `${patchName}_vulnerabilities_${getDate()}`)}
                >
                    <Tooltip text="Export Security issues" position="down"><Download size={20} /></Tooltip>
                </button>
            </div>
        </div>
    );
}