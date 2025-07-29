import { useState, useEffect } from 'react';
import patch_image_jars from '../../../api/patch_image_jars';

export function useImageJars(patchname, images, patchJars) {
  const [imageJarsMap, setImageJarsMap] = useState({});
  useEffect(() => {
    if (!images.length || !patchJars.length) return;
    const versionLookup = Object.fromEntries(patchJars.map(pj => [pj.name, pj.version]));
    Promise.all(images.map(img =>
      patch_image_jars(patchname, img.image_name)
        .then(rawJars => ({
          image_name: img.image_name,
          jars: (rawJars || [])
            .filter(rj => versionLookup[rj.name])
            .map(rj => ({ ...rj, version: versionLookup[rj.name] }))
        }))
        .catch(() => ({ image_name: img.image_name, jars: [] }))
    )).then(results => {
      setImageJarsMap(Object.fromEntries(results.map(r => [r.image_name, r.jars])));
    });
  }, [patchname, images, patchJars]);
  return imageJarsMap;
}
