import './PatchProgressPage.css';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import Tooltip from '../../components/ToolTip/ToolTip';
import RefreshButton from '../../components/Button/RefreshButton';
import { Download } from 'lucide-react';
function PatchTopBar({ products, progress, onExport, onRefreshAll, isSingleProductMode }){
    return(
        <div className="top-bar">
            <div className="progress-export">
                <div className="progress-container" style={{ pointerEvents: "none" }}>
                <ProgressBar value={progress} label="Patch Progress" />
                </div>
                {products.length > 0 && (
                <button className="export-btn" onClick={onExport}>
                    <Tooltip text="Export Security Issues" position="down"><Download size={20} /></Tooltip>
                </button>
                )}
                <div className='refresh'>
                {!isSingleProductMode && (
                    <RefreshButton onRefresh={onRefreshAll} tooltipText="Refresh All Products" />
                )}
                </div>
            </div>
        </div>
    );
}
export default PatchTopBar;