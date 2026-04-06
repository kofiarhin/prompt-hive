import { Suspense, lazy } from 'react'

const AppContent = lazy(() => import('./AppContent.jsx'))

function AppFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <div className="text-sm font-medium tracking-wide text-slate-300">Loading Prompt Hive...</div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<AppFallback />}>
      <AppContent />
    </Suspense>
  )
}
