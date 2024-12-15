"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import FileDropUpload from "./_components/FileDropUpload"
import { FileUpload } from "@/components/ui/file-upload"

const ChatWithPDF = () => {
  return (
    <div>
      <h1 className="mt-12 text-3xl text-center font-semibold md:text-4xl lg:text-6xl">Drop your Study Material and <br/> let our <span className="gradient">Intelligent Agent</span> Help You!!!</h1>
      {/* <FileDropUpload></FileDropUpload> */}
      {/* <Link><Button>Start uploading Study Material</Button></Link> */}
      <FileUpload></FileUpload>
    </div>
  )
}

export default ChatWithPDF