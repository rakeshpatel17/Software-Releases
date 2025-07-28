import { useState, useEffect, useCallback } from 'react';
import get_jars from '../../../api/get_jars';
import toast from 'react-hot-toast';
import { dismissibleError } from '../../Toast/customToast';
/**
 * Manages all state and logic for the JarSelector component.
 */
export function useJarSelector(selectedJars, setSelectedJars) {
    // State for the master list of all possible JAR suggestions from the API.
    const [jarDataSuggestions, setJarDataSuggestions] = useState([]);

    // State to manage which row's dropdown is currently visible.
    const [focusedIndex, setFocusedIndex] = useState(null);

    // State for the filtered list of suggestions for each row.
    const [dropdowns, setDropdowns] = useState([]);

    // Effect to fetch the master list of JARs once when the component mounts.
    useEffect(() => {
        const fetchJars = async () => {
            const jars = await get_jars();
            setJarDataSuggestions(jars || []);
        };
        fetchJars();
    }, []); // Empty array ensures this runs only once.

    // Effect to keep the dropdowns array in sync with the number of selected JARs.
    useEffect(() => {
        setDropdowns(new Array(selectedJars.length).fill([]));
    }, [selectedJars.length]);

    // --- Event Handlers ---

    // Handles any change to an input field (name, version, or remarks).
    const handleJarChange = useCallback((index, field, value) => {
        const updated = [...selectedJars];
        updated[index][field] = value;
        setSelectedJars(updated);

        // If the name field is changed, update the suggestions for that row.
        if (field === 'name') {
            const updatedDropdowns = [...dropdowns];
            if (value.trim() === '') {
                updatedDropdowns[index] = [];
            } else {
                updatedDropdowns[index] = jarDataSuggestions.filter(jar =>
                    jar.name.toLowerCase().includes(value.toLowerCase())
                );
            }
            setDropdowns(updatedDropdowns);
        }
    }, [selectedJars, setSelectedJars, dropdowns, jarDataSuggestions]);

    const handleAddJar = () => {
        // First, check if there are any JARs already.
        if (selectedJars.length > 0) {
            // Get the very last JAR in the list.
            const lastJar = selectedJars[selectedJars.length - 1];

            // If the last JAR's name or version is empty, show an error and stop.
            if (!lastJar.name.trim() || !lastJar.version.trim()) {
                // toast.error('Please fill out the name and version for the last JAR before adding a new one.');
                dismissibleError('Please fill out the name and version for the last JAR before adding a new one.');

                return;
            }
        }
        // If the list is empty OR the last JAR is valid, add a new empty row.
        setSelectedJars(prev => [...prev, { name: '', version: '', remarks: '' }]);
    };

    const handleRemoveJar = (index) => {
        setSelectedJars(prev => prev.filter((_, i) => i !== index));
    };

    // Handles selecting a JAR from the suggestion dropdown.
    const handleSelectSuggestion = (index, name) => {
        handleJarChange(index, 'name', name);
        // After selection, hide the dropdown for that row.
        const updatedDropdowns = [...dropdowns];
        updatedDropdowns[index] = [];
        setDropdowns(updatedDropdowns);
    };

    // Expose all necessary state and handlers to the component.
    return {
        focusedIndex,
        setFocusedIndex,
        dropdowns,
        setDropdowns,
        handlers: {
            handleJarChange,
            handleAddJar,
            handleRemoveJar,
            handleSelectSuggestion,
        }
    };
}