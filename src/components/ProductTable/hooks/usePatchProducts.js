import { useState, useEffect } from 'react';
import { getPatchById } from '../../../api/getPatchById';

export function usePatchProducts(patchname) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getPatchById(patchname)
      .then(data => setProducts(data.products))
      .finally(() => setLoading(false));
  }, [patchname]);
  return { products, loading };
}
