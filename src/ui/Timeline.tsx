import { useStore } from '../state/store'
import { trackById } from '../data/stars'
import { t } from '../i18n/ui'

export function Timeline() {
  const lang = useStore((s) => s.lang)
  const massClass = useStore((s) => s.massClass)
  const pos = useStore((s) => s.pos)
  const setPos = useStore((s) => s.setPos)
  const setAutoplay = useStore((s) => s.setAutoplay)

  const track = trackById(massClass)
  const n = track.phases.length
  const max = n - 1
  const current = Math.round(pos)

  const scrub = (value: number) => {
    setAutoplay(false)
    setPos(value)
  }

  return (
    <div className="timeline">
      <div className="timeline-label">{t('timeline', lang)}</div>
      <div className="timeline-track">
        <div className="timeline-line">
          <div
            className="timeline-fill"
            style={{ width: `${(pos / max) * 100}%` }}
          />
        </div>
        {track.phases.map((p, i) => {
          const active = i === current
          return (
            <button
              key={p.id}
              className={`timeline-dot ${active ? 'active' : ''}`}
              style={{ left: `${(i / max) * 100}%` }}
              onClick={() => scrub(i)}
              title={p.name[lang]}
            >
              <span className="dot" />
              <span className="dot-label">{p.name[lang]}</span>
            </button>
          )
        })}
        <input
          className="timeline-range"
          type="range"
          min={0}
          max={max}
          step={0.001}
          value={pos}
          onChange={(e) => scrub(parseFloat(e.target.value))}
          aria-label={t('timeline', lang)}
        />
      </div>
    </div>
  )
}
