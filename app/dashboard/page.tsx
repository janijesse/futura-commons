"use client"

import { useEffect, useState } from "react"
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
    // Simulate NFT verification
    const verifyNftAccess = async () => {
      setLoading(true)

      try {
        // Retrieve NFT ID and contribution data
        const storedNftId = localStorage.getItem("userNftId")
        const storedContributionData = localStorage.getItem("contributionData")

        if (storedNftId && storedContributionData) {
          // Simulate verification delay
          await new Promise((resolve) => setTimeout(resolve, 1000))

          setNftId(storedNftId)
          setContributionData(JSON.parse(storedContributionData))
          setAuthenticated(true)
        } else {
          // No NFT found, redirect to home
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

  // Calculate simulated retirement fund metrics
  const calculateMetrics = () => {
    if (!contributionData) return null

    // Check if we have pension plan data
    const pensionPlan = contributionData.pensionPlan

    if (pensionPlan) {
      const amount = Number.parseFloat(contributionData.amount)
      const currentBalance = amount // Initial contribution

      // Use pension plan data for projections
      const projectedAnnualReturn = pensionPlan.yieldRate / 100
      const oneYearProjection = amount * (1 + projectedAnnualReturn)

      // Calculate projected balance after the full term
      const fullTermProjection = pensionPlan.estimatedPension

      // Calculate impact metrics (simplified)
      const carbonOffset = amount * 0.02 // 0.02 tons of CO2 per XRP
      const renewableEnergy = amount * 0.5 // 0.5 kWh per XRP

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
      // Fallback to original calculation
      const amount = Number.parseFloat(contributionData.amount)
      const currentBalance = amount // Initial contribution

      // Default values
      const projectedAnnualReturn = 0.08 // 8% default

      // Calculate projected balance after 1 year
      const oneYearProjection = amount * (1 + projectedAnnualReturn)

      // Calculate projected balance after 10 years (compound annually)
      const tenYearProjection = amount * Math.pow(1 + projectedAnnualReturn, 10)

      // Calculate impact metrics (simplified)
      const carbonOffset = amount * 0.02 // 0.02 tons of CO2 per XRP
      const renewableEnergy = amount * 0.5 // 0.5 kWh per XRP

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

      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <PiggyBank className="mr-2 h-4 w-4 text-primary" />
              <div className="text-xl sm:text-2xl font-bold">{metrics.currentBalance.toFixed(2)} XRP</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Started on {new Date(contributionData.timestamp).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projected Annual Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
              <div className="text-xl sm:text-2xl font-bold">{(metrics.projectedAnnualReturn * 100).toFixed(1)}%</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Based on your selected yield rate</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Impact Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Leaf className="mr-2 h-4 w-4 text-green-600" />
              <div className="text-xl sm:text-2xl font-bold">{metrics.carbonOffset.toFixed(2)} tons CO₂</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Carbon offset from your investments</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Contribution Summary</CardTitle>
                <CardDescription>Your contribution details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-medium">Initial Amount</p>
                    <p className="text-lg">{contributionData.amount} XRP</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Monthly Contribution</p>
                    <p className="text-lg">{contributionData.pensionPlan.monthly} XRP</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Contribution Date</p>
                  <p className="text-muted-foreground text-sm">
                    {new Date(contributionData.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Pension Plan</CardTitle>
                <CardDescription>Your pension investment strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Annual Yield Rate</p>
                    <p className="text-muted-foreground">{contributionData.pensionPlan.yieldRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-muted-foreground">{contributionData.pensionPlan.years} years</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Estimated Final Pension</p>
                    <p className="text-muted-foreground">
                      {contributionData.pensionPlan.estimatedPension.toFixed(2)} XRP
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projections" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Growth Projections</CardTitle>
              <CardDescription>Estimated growth of your pension fund over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Current Balance</p>
                    <p className="text-sm">{metrics.currentBalance.toFixed(2)} XRP</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="h-2 rounded-full bg-primary w-[5%]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">1 Year Projection</p>
                    <p className="text-sm">{metrics.oneYearProjection.toFixed(2)} XRP</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="h-2 rounded-full bg-primary w-[15%]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {metrics.pensionPlan ? `${metrics.pensionPlan.years} Year Projection` : "10 Year Projection"}
                    </p>
                    <p className="text-sm">{metrics.tenYearProjection.toFixed(2)} XRP</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="h-2 rounded-full bg-primary w-[60%]" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    These projections are based on your current contribution amount and the selected yield rate. Actual
                    results may vary based on market conditions and investment performance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="mt-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Impact Metrics</CardTitle>
              <CardDescription>The positive environmental and social impact of your investments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Carbon Offset</p>
                  <div className="flex items-center">
                    <Leaf className="mr-2 h-5 w-5 text-green-600" />
                    <p className="text-xl font-bold">{metrics.carbonOffset.toFixed(2)} tons</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Equivalent to planting {Math.round(metrics.carbonOffset * 50)} trees
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Renewable Energy</p>
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-yellow-500" />
                    <p className="text-xl font-bold">{metrics.renewableEnergy.toFixed(1)} kWh</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Clean energy generated through your investments</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <h3 className="text-base font-medium mb-4">Impact Projects</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3 shrink-0">
                      <Leaf className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Solar Microgrid in Kenya</h4>
                      <p className="text-xs text-muted-foreground">
                        Your investment helps power rural communities with clean energy
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3 shrink-0">
                      <Leaf className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Sustainable Agriculture in Colombia</h4>
                      <p className="text-xs text-muted-foreground">
                        Supporting regenerative farming practices that sequester carbon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

