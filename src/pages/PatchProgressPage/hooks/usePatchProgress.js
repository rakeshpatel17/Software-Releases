import { useState, useEffect} from "react";
import getProductPatchProgress from "../../../api/getProductPatchProgress";
import get_patch_progress from "../../../api/get_patch_progress";
export default function usePatchProgress(patchId, productName, isSingleProductMode, products) 
{
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const fetchProgress = async () => {
        if (!patchId) return;
        const progressValue = isSingleProductMode
            ? await getProductPatchProgress(patchId, productName)
            : await get_patch_progress(patchId);
        setProgress(progressValue || 0);
        };
        fetchProgress();
    }, [patchId, productName, isSingleProductMode, products]);
    return progress;
}