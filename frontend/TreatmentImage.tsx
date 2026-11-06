import { useState } from 'react';
import type { Offering } from './lib/types';
import { treatmentImage } from './lib/treatment-images';
import { asset } from './ui';
import './treatment-image.css';

export default function TreatmentImage({ offering, compact = false }: { offering: Offering; compact?: boolean }) {
  const image = treatmentImage(offering);
  const src = asset(compact ? image.thumbnail : image.src);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return <figure className={`treatment-image${compact ? ' treatment-image-compact' : ''}`}
    data-offering-id={offering.id} data-source={image.source} data-image-key={image.key}>
    {failedSrc === src
      ? <div className="treatment-image-frame treatment-image-fallback" role="img" aria-label={image.alt}><span>Image unavailable</span></div>
      : <img className="treatment-image-frame" src={src} alt={image.alt} width={image.width} height={image.height}
          loading="lazy" decoding="async" style={{ objectPosition: image.position }} onError={() => setFailedSrc(src)} />}
    <figcaption>{image.caption}</figcaption>
  </figure>;
}
