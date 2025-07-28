import { useState, useEffect } from 'react';
import get_scopes from '../../../api/get_scopes';
// import toast from 'react-hot-toast';
import { dismissibleError } from '../../Toast/customToast';

export function useHighLevelScope(highLevelScope, setHighLevelScope, isEditing) {
    // State for the temporary, editable version of the scopes. All edits happen here.
    const [tempHighLevelScope, setTempHighLevelScope] = useState([...highLevelScope]);
    // State for the master list of all possible suggestions fetched from the API.
    const [scopeSuggestionsList, setScopeSuggestionsList] = useState([]);
    // State to manage the visible suggestions dropdown for each individual row.
    const [labelSuggestions, setLabelSuggestions] = useState([]);


    // Effect to fetch the master list of scope suggestions once when the component mounts.
    useEffect(() => {
        const fetchScopes = async () => {
            const scopes = await get_scopes();
            setScopeSuggestionsList(scopes || []);
        };
        fetchScopes();
    }, []);

    useEffect(() => {
        setTempHighLevelScope([...highLevelScope]);
    }, [isEditing, highLevelScope]);

    // Effect to notify the parent component of any changes made to the temporary scope list.
    useEffect(() => {
        if (typeof setHighLevelScope === 'function') {
            setHighLevelScope(prev => {
                const isSame = JSON.stringify(prev) === JSON.stringify(tempHighLevelScope);
                return isSame ? prev : tempHighLevelScope;
            });
        }
    }, [tempHighLevelScope, setHighLevelScope]);

    // --- Event Handlers ---

    const handleAddScope = () => {
        // First, check if there are any scopes already.
        if (tempHighLevelScope.length > 0) {
            // Get the very last scope in the list.
            const lastScope = tempHighLevelScope[tempHighLevelScope.length - 1];

            // If the last scope's name or version is empty (after trimming whitespace), show an error.
            if (!lastScope.name.trim() || !lastScope.version.trim()) {
                // toast.error('Please fill out the previous Scope entry before adding a new one.');
                dismissibleError('Please fill out the previous Scope entry before adding a new one.');

                return; // Stop the function here.
            }
        }
        // If the list is empty OR the last scope is valid, add a new empty row.
        setTempHighLevelScope(prev => [...prev, { name: '', version: '' }]);
    };


    const handleRemoveScope = (index) => {
        setTempHighLevelScope(prev => prev.filter((_, i) => i !== index));
    };

    const handleVersionChange = (index, newValue) => {
        const updatedScope = [...tempHighLevelScope];
        updatedScope[index].version = newValue;
        setTempHighLevelScope(updatedScope);
    };
    // Handles text changes in the "Name" input and filters suggestions.
    const handleLabelChange = (index, newLabel) => {
        const updatedScope = [...tempHighLevelScope];
        updatedScope[index].name = newLabel;
        setTempHighLevelScope(updatedScope);

        const filtered = newLabel.trim()
            ? scopeSuggestionsList.filter(s => s.name.toLowerCase().includes(newLabel.toLowerCase()))
            : [];

        const updatedSuggestions = [...labelSuggestions];
        updatedSuggestions[index] = filtered;
        setLabelSuggestions(updatedSuggestions);
    };

    // Handles clicking on a suggestion from the dropdown.
    const handleSuggestionClick = (index, suggestion) => {
        const updatedScope = [...tempHighLevelScope];
        updatedScope[index].name = suggestion.name;
        setTempHighLevelScope(updatedScope);
        // Clear the suggestions for this row after a selection is made.
        const updatedSuggestions = [...labelSuggestions];
        updatedSuggestions[index] = [];
        setLabelSuggestions(updatedSuggestions);
    };


    // Expose the state and handlers to the component.
    return {
        tempHighLevelScope,
        labelSuggestions,
        setLabelSuggestions,
        handlers: {
            handleAddScope,
            handleRemoveScope,
            handleVersionChange,
            handleLabelChange,
            handleSuggestionClick
        }
    };
}