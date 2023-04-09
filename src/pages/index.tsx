import { useRef, useState } from "react"

import clsx from "clsx"
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas"

import DescribeRoute from "@/components/common/DescribeRoute"

export default function HomePage() {
  const canvasRef = useRef<ReactSketchCanvasRef | null>(null)
  const [isGood, setIsGood] = useState(false)

  return (
    <DescribeRoute title="Election Marking Generator" description="by betich">
      <main className="flex h-screen flex-col items-center justify-center gap-12 p-10 font-display text-black">
        <h1 className="text-4xl font-bold">Election Mark Generator</h1>

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

        <div className="flex flex-col items-center justify-center gap-4">
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

          <h2 className="text-2xl font-semibold">Tools</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                canvasRef.current?.undo()
              }}
              className="rounded-sm bg-gray-500 px-6 py-3 text-white shadow-sm transition-colors duration-500 hover:bg-gray-600"
            >
              Undo
            </button>
            <button
              onClick={() => {
                canvasRef?.current
                  ?.exportImage("png")
                  .then((data) => {
                    console.log(data)
                  })
                  .catch((e) => {
                    console.log(e)
                  })
              }}
              className="rounded-sm bg-teal-500 px-6 py-3 text-white shadow-sm transition-colors duration-500 hover:bg-teal-600"
            >
              Submit
            </button>
          </div>
        </div>
      </main>
    </DescribeRoute>
  )
}
