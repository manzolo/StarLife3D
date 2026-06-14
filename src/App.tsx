import { SceneCanvas } from './three/Scene'
import { Controls } from './ui/Controls'
import { InfoPanel } from './ui/InfoPanel'
import { Timeline } from './ui/Timeline'
import { useStore } from './state/store'
import { SOURCES } from './data/stars'
import { t } from './i18n/ui'
import './App.css'

export default function App() {
  const lang = useStore((s) => s.lang)
  return (
    <div className="app">
      <div className="canvas-wrap">
        <SceneCanvas />
      </div>
      <Controls />
      <InfoPanel />
      <Timeline />
      <p className="hint">{t('hint', lang)}</p>
      <footer className="credits">
        <span>{t('sources', lang)}:</span>
        {SOURCES.map((s) => (
          <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
            {s.name.split(' — ')[0]}
          </a>
        ))}
      </footer>
    </div>
  )
}
