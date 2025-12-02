'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { triggerJobScan } from './actions'

export default function JobScanButton() {
  const [scanning, setScanning] = useState(false)

  const handleScan = async () => {
    setScanning(true)
    try {
      await triggerJobScan()
    } catch (e) {
      alert("Scan failed")
    } finally {
      setScanning(false)
    }
  }

  return (
    <Button 
      onClick={handleScan} 
      disabled={scanning}
      className="bg-black text-white hover:bg-slate-800"
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${scanning ? 'animate-spin' : ''}`} />
      {scanning ? 'AI Scanning...' : 'Find New Jobs'}
    </Button>
  )
}