import React from 'react';
import { useHighLevelScope } from './hooks/useHighLevelScope';
import { EditableScopeView } from './components/EditableScopeView';
import './HighLevelScope.css';

function HighLevelScope({ highLevelScope = [], setHighLevelScope, isEditing }) {
    // All complex logic is managed by the custom hook.
    const {
        tempHighLevelScope,
        labelSuggestions,
        setLabelSuggestions,
        handlers
    } = useHighLevelScope(highLevelScope, setHighLevelScope, isEditing);

    return (
        <div className="high-level-scope">
            <label>High Level Scope</label>
            {isEditing ? (
                // The single component for the entire editable view
                // When editing, render the full-featured EditableScopeView component.

                <EditableScopeView
                    scopes={tempHighLevelScope}
                    labelSuggestions={labelSuggestions}
                    setLabelSuggestions={setLabelSuggestions}
                    handlers={handlers}
                />
            ) : (
                // When not editing, render a simple, read-only table.
                <div className="read-only-scope">
                    <table className="read-only-scope-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Version</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(highLevelScope || []).map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.version}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default HighLevelScope;