import { SceneCanvas } from './three/Scene'
import { Controls } from './ui/Controls'
import { InfoPanel } from './ui/InfoPanel'
import { Timeline } from './ui/Timeline'
import { useStore } from './state/store'
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
    </div>
  )
}
