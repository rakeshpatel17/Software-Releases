import React from 'react';
import ExpandableSection from '../../ExpandableSection/ExpandableSection';
import JarFilterButtons from '../../Button/JarFilterButtons';
import JarTable from '../../JarTable/JarTable';

export default function JarsSection({
  jars, patchname, imageName,
  selectedJarStatuses, setSelectedJarStatuses,
  onImageJarsUpdate
}) {
  return (
    <ExpandableSection
      title="Jars"
      actions={
        <JarFilterButtons
          allJars={jars}
          selectedStatuses={selectedJarStatuses}
          onToggleStatus={status => {
            setSelectedJarStatuses(s => {
              const copy = new Set(s);
              copy.has(status) ? copy.delete(status) : copy.add(status);
              return copy;
            });
          }}
          onToggleAll={() =>
            setSelectedJarStatuses(s =>
              s.size === 2 ? new Set() : new Set(['updated','not updated'])
            )
          }
        />
      }
    >
      <JarTable
        jars={jars.filter(j => selectedJarStatuses.has(j.updated ? 'updated' : 'not updated'))}
        patchName={patchname}
        imageName={imageName}
        onJarsUpdate={updated => onImageJarsUpdate(imageName, updated)}
      />
    </ExpandableSection>
  );
}
