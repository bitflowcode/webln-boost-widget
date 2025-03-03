import WebLNBoostButton from './components/webln-boost-button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-[480px] h-[480px]">
        <WebLNBoostButton defaultAmount={100} />
      </div>
    </main>
  )
}