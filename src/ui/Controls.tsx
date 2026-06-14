import { useStore, SPEEDS } from '../state/store'
import { TRACKS, type MassClass } from '../data/stars'
import { t } from '../i18n/ui'

export function Controls() {
  const lang = useStore((s) => s.lang)
  const massClass = useStore((s) => s.massClass)
  const setMass = useStore((s) => s.setMass)
  const toggleLang = useStore((s) => s.toggleLang)
  const autoplay = useStore((s) => s.autoplay)
  const toggleAutoplay = useStore((s) => s.toggleAutoplay)
  const speed = useStore((s) => s.speed)
  const setSpeed = useStore((s) => s.setSpeed)
  const compare = useStore((s) => s.compare)
  const toggleCompare = useStore((s) => s.toggleCompare)
  const compareMass = useStore((s) => s.compareMass)
  const setCompareMass = useStore((s) => s.setCompareMass)

  return (
    <header className="controls">
      <div className="brand">
        <h1>StarLife <span>3D</span></h1>
        <p>{t('subtitle', lang)}</p>
      </div>

      <div className="control-group">
        <span className="control-label">{t('massFilter', lang)}</span>
        <div className="seg">
          {TRACKS.map((tr) => (
            <button
              key={tr.id}
              className={massClass === tr.id ? 'on' : ''}
              onClick={() => setMass(tr.id)}
            >
              {tr.massRange}
            </button>
          ))}
        </div>
      </div>

      <div className="control-actions">
        <button
          className={`pill ${autoplay ? 'on' : ''}`}
          onClick={toggleAutoplay}
          title={t('autoplay', lang)}
        >
          {autoplay ? '❚❚' : '▶'} {t('autoplay', lang)}
        </button>

        {autoplay && (
          <div className="seg speed-seg" title={t('speed', lang)}>
            {SPEEDS.map((sp) => (
              <button
                key={sp}
                className={speed === sp ? 'on' : ''}
                onClick={() => setSpeed(sp)}
              >
                {sp}×
              </button>
            ))}
          </div>
        )}

        <button
          className={`pill ${compare ? 'on' : ''}`}
          onClick={toggleCompare}
        >
          ⊞ {t('compare', lang)}
        </button>

        {compare && (
          <select
            className="pill select"
            value={compareMass}
            onChange={(e) => setCompareMass(e.target.value as MassClass)}
          >
            {TRACKS.map((tr) => (
              <option key={tr.id} value={tr.id}>
                {tr.massRange}
              </option>
            ))}
          </select>
        )}

        <button className="pill lang" onClick={toggleLang}>
          {lang === 'it' ? '🇮🇹 IT' : '🇬🇧 EN'}
        </button>
      </div>
    </header>
  )
}
