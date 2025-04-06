
"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, Leaf, PiggyBank, TrendingUp, Wallet } from "lucide-react"
import Link from "next/link"

type ContributionData = {
  amount: string
  walletAddress: string
  timestamp: string
  pensionPlan: {
    initial: number
    monthly: number
    yieldRate: number
    years: number
    estimatedPension: number
  }
  assessmentData?: {
    country: string
    age: string
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [nftId, setNftId] = useState<string | null>(null)
  const [contributionData, setContributionData] = useState<ContributionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const verifyNftAccess = async () => {
      setLoading(true)
      try {
        const storedNftId = localStorage.getItem("userNftId")
        const storedContributionData = localStorage.getItem("contributionData")

        if (storedNftId && storedContributionData) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          setNftId(storedNftId)
          setContributionData(JSON.parse(storedContributionData))
          setAuthenticated(true)
        } else {
          router.push("/")
        }
      } catch (error) {
        console.error("Error verifying NFT access:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    verifyNftAccess()
  }, [router])

  const calculateMetrics = () => {
    if (!contributionData) return null
    const pensionPlan = contributionData.pensionPlan

    if (pensionPlan) {
      const amount = parseFloat(contributionData.amount)
      const currentBalance = amount
      const projectedAnnualReturn = pensionPlan.yieldRate / 100
      const oneYearProjection = amount * (1 + projectedAnnualReturn)
      const fullTermProjection = pensionPlan.estimatedPension
      const carbonOffset = amount * 0.02
      const renewableEnergy = amount * 0.5

      return {
        currentBalance,
        oneYearProjection,
        tenYearProjection: fullTermProjection,
        projectedAnnualReturn,
        carbonOffset,
        renewableEnergy,
        pensionPlan,
      }
    } else {
      const amount = parseFloat(contributionData.amount)
      const currentBalance = amount
      const projectedAnnualReturn = 0.08
      const oneYearProjection = amount * (1 + projectedAnnualReturn)
      const tenYearProjection = amount * Math.pow(1 + projectedAnnualReturn, 10)
      const carbonOffset = amount * 0.02
      const renewableEnergy = amount * 0.5

      return {
        currentBalance,
        oneYearProjection,
        tenYearProjection,
        projectedAnnualReturn,
        carbonOffset,
        renewableEnergy,
      }
    }
  }

  const metrics = calculateMetrics()

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 sm:py-20 text-center">
        <div className="flex flex-col items-center justify-center">
          <Wallet className="h-10 w-10 sm:h-12 sm:w-12 animate-pulse text-primary mb-4" />
          <h2 className="text-lg sm:text-xl font-medium">Verifying NFT access...</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Please wait while we verify your retirement vault access.
          </p>
        </div>
      </div>
    )
  }

  if (!authenticated || !contributionData || !metrics) {
    return (
      <div className="container mx-auto py-10 px-4 sm:py-20 text-center">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-lg sm:text-xl font-medium">Access Denied</h2>
          <p className="text-sm text-muted-foreground mt-2">
            You need a valid retirement NFT to access this dashboard.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold">Retirement Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            NFT ID: {nftId}
            {contributionData.assessmentData?.country && ` • Country: ${contributionData.assessmentData.country}`}
          </p>
        </div>
        <Button size="sm" className="w-full md:w-auto">
          Make a Contribution
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Metric Cards and Tabs remain unchanged... */}

      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-bold mb-2">Advanced On-Chain Setup</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Click the button below to mint the RETREAT token, send funds, and create the Automated Market Maker pool (RETREAT/XRP).
        </p>

        <Button
          variant="secondary"
          onClick={async () => {
            setLoading(true)
            try {
              const res = await fetch("/api/create-amm")
              const data = await res.json()
              if (data?.ammHash) {
                alert(
                  `✅ AMM created!\n\nIssuer: ${data.issuerWallet}\nLP Wallet: ${data.lpWallet}\nHash: ${data.ammHash}`
                )
              } else {
                console.error("❌ Error:", data)
                alert("❌ AMM creation failed. Check the console for details.")
              }
            } catch (err) {
              alert("❌ Network error. Try again.")
              console.error(err)
            } finally {
              setLoading(false)
            }
          }}
          disabled={loading}
        >
          {loading ? "Creating AMM..." : "Create AMM + Token"}
        </Button>
      </div>
    </div>
  )
}
