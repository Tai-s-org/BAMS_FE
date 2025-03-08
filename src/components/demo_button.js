"use client";
import { Button } from "@/components/ui/Button"
import authApi from "@/api/auth";

export default function DemoButtons() {
  const handleGet = async () => {

    try {
      const response = await authApi.test();
      console.log(response);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        addToast({ message: error.response.data.message, type: "error" });
      }
      //console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Improved Notification System Demo</h1>

      <div className="flex flex-col items-center gap-4">
        <p className="text-center max-w-md mb-4">
          Click the buttons below to trigger different types of notifications. Each notification will automatically
          disappear after 5 seconds.
        </p>
        <Button className="bg-red-600 text-white hover:bg-red-700" onClick = {handleGet}>Click</Button>
      </div>
    </main>
  )
}