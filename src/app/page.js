import { DemoButtons } from "../components/demo_button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Improved Notification System Demo</h1>

      <div className="flex flex-col items-center gap-4">
        <p className="text-center max-w-md mb-4">
          Click the buttons below to trigger different types of notifications. Each notification will automatically
          disappear after 5 seconds.
        </p>

        <DemoButtons />
      </div>
    </main>
  )
}

