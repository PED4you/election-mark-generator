import { useEffect, useRef, useState } from "react"

import clsx from "clsx"
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas"

import DescribeRoute from "@/components/common/DescribeRoute"

function useFetchData() {
  const [data, setData] = useState<null | { goodImages: number; badImages: number; totalImages: number }>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData("/api/images")
  }, [])

  const fetchData = async (url: string) => {
    setLoading(true)
    try {
      const res = await fetch(url)
      const data = await res.json()
      setData(data)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => fetchData("/api/images")

  return { data, error, loading, refetch }
}

export default function HomePage() {
  const [submitting, setSubmitting] = useState(false)
  const canvasRef = useRef<ReactSketchCanvasRef | null>(null)
  const [isGood, setIsGood] = useState(false)

  const { data: imageData, error, loading, refetch } = useFetchData()

  if (loading || submitting)
    return <div className="flex min-h-screen animate-pulse flex-col items-center justify-center">loading...</div>

  return (
    <DescribeRoute title="Election Marking Generator" description="by betich">
      <main className="flex flex-col items-center justify-center gap-12 p-10 font-display text-black">
        <h1 className="text-4xl font-bold">Election Mark Generator</h1>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold">บัตรดี</h2>
            <span>{imageData?.goodImages}</span>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold">บัตรเสีย</h2>
            <span>{imageData?.badImages}</span>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold">บัตรทั้งหมด</h2>
            <span>{imageData?.totalImages}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-semibold">รูปภาพที่มีอยู่</h2>
          </div>

          <ReactSketchCanvas
            style={{
              border: "0.5rem solid #000",
              borderRadius: "0.25rem",
            }}
            width="480"
            height="270"
            strokeWidth={4}
            strokeColor="black"
            ref={canvasRef}
          />
        </div>

        <div className="flex items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-semibold">ประเภทบัตร</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsGood(true)}
                className={clsx(
                  isGood ? "bg-green-400 hover:bg-green-500" : "bg-green-400/50",
                  "rounded-sm px-6 py-3 text-white shadow-sm transition-colors duration-500"
                )}
              >
                บัตรดี
              </button>
              <button
                onClick={() => setIsGood(false)}
                className={clsx(
                  !isGood ? "bg-red-400 hover:bg-red-500" : "bg-red-400/50",
                  "rounded-sm px-6 py-3 text-white shadow-sm transition-colors duration-500"
                )}
              >
                บัตรเสีย
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-semibold">Tools</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  canvasRef.current?.clearCanvas()
                }}
                className="rounded-sm bg-gray-500 px-6 py-3 text-white shadow-sm transition-colors duration-500 hover:bg-gray-600"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  canvasRef?.current
                    ?.exportImage("png")
                    .then((data) => {
                      setSubmitting(true)

                      // post to api route /upload
                      fetch("/api/upload", {
                        method: "POST",
                        body: JSON.stringify({
                          good: isGood,
                          data,
                        }),
                      })
                        .then((res) => {
                          if (res.status === 200) {
                            console.log("Success")
                            refetch()
                          }
                        })
                        .catch((e) => {
                          console.error("Error", e)
                        })
                        .finally(() => {
                          canvasRef?.current?.clearCanvas()
                          setSubmitting(false)
                        })
                    })
                    .catch((e) => {
                      console.log(e)
                    })
                }}
                className="rounded-sm bg-orange-400 px-6 py-3 text-white shadow-sm transition-colors duration-500 hover:bg-orange-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </main>
    </DescribeRoute>
  )
}
