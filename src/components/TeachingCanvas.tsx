import { ExternalLink, Maximize2 } from 'lucide-react'

export type CanvasHotspot = {
  number: string
  title: string
  body: string
  position: string
}

type TeachingCanvasProps = {
  image: string
  alt: string
  caption: string
  source?: string
  hotspots?: CanvasHotspot[]
  onZoom: (trigger: HTMLButtonElement) => void
}

export function TeachingCanvas({
  image,
  alt,
  caption,
  source,
  hotspots = [],
  onZoom,
}: TeachingCanvasProps) {
  return (
    <figure className="teaching-canvas">
      <div className="teaching-stage">
        <button
          className="canvas-image-button"
          type="button"
          aria-label={`Enlarge image: ${alt}`}
          onClick={(event) => onZoom(event.currentTarget)}
        >
          <img src={image} alt={alt} />
          <span className="canvas-zoom" aria-hidden="true">
            <Maximize2 size={20} />
          </span>
        </button>
        {hotspots.map((hotspot) => (
          <div className={`canvas-hotspot ${hotspot.position}`} key={hotspot.number}>
            <span className="hotspot-number">{hotspot.number}</span>
            <div className="hotspot-copy">
              <strong>{hotspot.title}</strong>
              <span>{hotspot.body}</span>
            </div>
          </div>
        ))}
      </div>
      <figcaption>
        <span>{caption}</span>
        {source && (
          <a href={source} target="_blank" rel="noreferrer">
            Open source <ExternalLink size={16} />
          </a>
        )}
      </figcaption>
    </figure>
  )
}
