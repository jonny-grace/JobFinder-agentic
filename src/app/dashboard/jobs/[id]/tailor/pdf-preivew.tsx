'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PDFViewer, pdf } from "@react-pdf/renderer"
import { ClassicTemplate } from "@/components/resume-templates" // Only Classic
import { Download, Loader2 } from "lucide-react"

interface PdfPreviewProps {
  data: any
}

export default function PdfPreview({ data }: PdfPreviewProps) {
  if (!data) return null
  
  return (
    <div className="w-full h-full shadow-2xl bg-white rounded-sm overflow-hidden">
      <PDFViewer width="100%" height="100%" className="border-none">
        <ClassicTemplate data={data} />
      </PDFViewer>
    </div>
  )
}

// Safe Manual Download Button
export function PdfDownloadButton({ data }: PdfPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    if (!data) return
    setIsGenerating(true)

    try {
      // Generate Blob manually on click
      const blob = await pdf(<ClassicTemplate data={data} />).toBlob()
      const url = URL.createObjectURL(blob)
      
      // Programmatic click
      const link = document.createElement('a')
      link.href = url
      link.download = `Tailored_Resume.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Download failed", error)
      alert("Could not generate PDF. Please check the console.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button 
      onClick={handleDownload} 
      disabled={isGenerating} 
      size="sm" 
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
      {isGenerating ? "Generating..." : "Download PDF"}
    </Button>
  )
}