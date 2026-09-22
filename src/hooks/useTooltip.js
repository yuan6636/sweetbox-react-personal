import { useEffect, useRef } from 'react';
import { Tooltip } from 'bootstrap';

function useTooltip(dep) {
  const tooltipRef = useRef(null);

  useEffect(() => {
    let tooltip;

    if (tooltipRef.current) {
      tooltip = new Tooltip(tooltipRef.current);
    }

    return () => tooltip?.dispose();
  }, [dep]);

  return tooltipRef;
}

export default useTooltip;
