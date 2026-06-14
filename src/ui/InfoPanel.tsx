import { useEffect, useState } from 'react'
import { useStore } from '../state/store'
import { trackById, phaseIcon, phaseFacts, SOURCES } from '../data/stars'
import { t } from '../i18n/ui'

export function InfoPanel() {
  const lang = useStore((s) => s.lang)
  const massClass = useStore((s) => s.massClass)
  const pos = useStore((s) => s.pos)
  const next = useStore((s) => s.next)
  const prev = useStore((s) => s.prev)
  // Open/collapsed state lives in the store so the timeline can auto-expand it.
  const open = useStore((s) => s.infoOpen)
  const toggleOpen = useStore((s) => s.toggleInfoOpen)

  const track = trackById(massClass)
  const idx = Math.round(pos)
  const phase = track.phases[idx]

  // Random "Did you know?" fact, refreshed whenever the phase changes.
  const facts = phaseFacts(massClass, phase.id)
  const [factIdx, setFactIdx] = useState(0)
  useEffect(() => {
    setFactIdx(facts.length ? Math.floor(Math.random() * facts.length) : 0)
  }, [idx, massClass]) // eslint-disable-line react-hooks/exhaustive-deps
  const fact = facts[Math.min(factIdx, Math.max(facts.length - 1, 0))]
  const shuffleFact = () =>
    setFactIdx((i) =>
      facts.length > 1 ? (i + 1 + Math.floor(Math.random() * (facts.length - 1))) % facts.length : i,
    )

  return (
    <div className={`info-panel ${open ? 'open' : 'collapsed'}`}>
      <button className="info-head" onClick={toggleOpen} aria-expanded={open}>
        <span className="info-icon">{phaseIcon(phase.visual.kind)}</span>
        <span className="info-head-text">
          <span className="info-step">
            {t('phase', lang)} {idx + 1} {t('of', lang)} {track.phases.length}
          </span>
          <span className="info-title">{phase.name[lang]}</span>
          <span className="info-mass-range">{track.label[lang]}</span>
        </span>
        <span className="info-chevron">{open ? '▾' : '▸'}</span>
      </button>

      <div className="info-body">
        <dl className="info-grid">
          <div>
            <dt>{t('duration', lang)}</dt>
            <dd>{phase.data.duration[lang]}</dd>
          </div>
          <div>
            <dt>{t('temperature', lang)}</dt>
            <dd>{phase.data.temperature}</dd>
          </div>
          <div>
            <dt>{t('luminosity', lang)}</dt>
            <dd>{phase.data.luminosity}</dd>
          </div>
          <div>
            <dt>{t('radius', lang)}</dt>
            <dd>{phase.data.radius}</dd>
          </div>
          <div>
            <dt>{t('mass', lang)}</dt>
            <dd>{phase.data.mass}</dd>
          </div>
        </dl>

        <div className="info-section">
          <h3>{t('physics', lang)}</h3>
          <p>{phase.physics[lang]}</p>
        </div>

        <div className="info-section">
          <h3>{t('examples', lang)}</h3>
          <p className="info-examples">{phase.examples}</p>
        </div>

        {fact && (
          <div className="info-fact">
            <div className="info-fact-head">
              <h3>💡 {t('curiosity', lang)}</h3>
              {facts.length > 1 && (
                <button
                  className="fact-shuffle"
                  onClick={shuffleFact}
                  title={t('shuffle', lang)}
                  aria-label={t('shuffle', lang)}
                >
                  🔄
                </button>
              )}
            </div>
            <p>{fact[lang]}</p>
            <span className="fact-src">
              {t('source', lang)}: {fact.src}
            </span>
          </div>
        )}

        <details className="info-sources">
          <summary>{t('sources', lang)}</summary>
          <ul>
            {SOURCES.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </details>

        <div className="info-nav">
          <button onClick={prev} disabled={idx === 0}>
            ‹ {t('prev', lang)}
          </button>
          <button onClick={next} disabled={idx === track.phases.length - 1}>
            {t('next', lang)} ›
          </button>
        </div>
      </div>
    </div>
  )
}
