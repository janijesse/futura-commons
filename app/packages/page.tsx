"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Leaf, Wallet } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ArrowRight } from "lucide-react"

type AssessmentData = {
  age: string
  income: string
  savingsGoal: string
  country: string
  riskTolerance: string
  investmentExperience: string
  riskProfile: "low" | "medium" | "high"
}

type PensionInputs = {
  initial: number
  monthly: number
  yieldRate: number
  years: number
}

const calculatePension = ({ initial, monthly, yieldRate, years }: PensionInputs): number => {
  const r = yieldRate / 100 // Convert to decimal
  const n = 12 // Monthly compounding
  const t = years

  const compoundInitial = initial * Math.pow(1 + r / n, n * t)
  const compoundMonthly = monthly * ((Math.pow(1 + r / n, n * t) - 1) / (r / n))

  return compoundInitial + compoundMonthly
}

export default function PackagesPage() {
  const router = useRouter()
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null)

  // Pension simulator state
  const [inputs, setInputs] = useState<PensionInputs>({
    initial: 1000,
    monthly: 100,
    yieldRate: 8,
    years: 10,
  })

  useEffect(() => {
    // Retrieve assessment data from localStorage
    const storedData = localStorage.getItem("assessmentData")
    if (storedData) {
      const data = JSON.parse(storedData)
      setAssessmentData(data)

      // Set initial values based on assessment data
      if (data.income) {
        const income = Number.parseFloat(data.income)
        setInputs((prev) => ({
          ...prev,
          initial: Math.round(income * 0.1), // 10% of annual income as initial
          monthly: Math.round((income * 0.05) / 12), // 5% of annual income as monthly
        }))
      }

      // Set yield rate based on risk profile
      if (data.riskProfile === "high") {
        setInputs((prev) => ({ ...prev, yieldRate: 12 }))
      } else if (data.riskProfile === "medium") {
        setInputs((prev) => ({ ...prev, yieldRate: 8 }))
      } else {
        setInputs((prev) => ({ ...prev, yieldRate: 5 }))
      }

      // Set years based on age
      if (data.age) {
        const age = Number.parseInt(data.age)
        const yearsToRetirement = Math.max(5, 65 - age)
        setInputs((prev) => ({ ...prev, years: yearsToRetirement }))
      }
    } else {
      // Redirect to assessment if no data is found
      router.push("/assessment")
    }
  }, [router])

  const handleInputChange = (name: keyof PensionInputs, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleContinue = () => {
    // Store pension plan data
    localStorage.setItem(
      "pensionPlan",
      JSON.stringify({
        ...inputs,
        estimatedPension: calculatePension(inputs),
      }),
    )

    // Navigate to the contribution page
    router.push("/contribute")
  }

  const result = calculatePension(inputs)

  if (!assessmentData) {
    return <div className="container mx-auto py-10 text-center">Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-10">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Your Pension Plan</h1>
      <p className="text-center mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
        Your pension grows through smart yield generation. When you contribute to the pool, your funds are actively put
        to work in decentralized finance—earning rewards through staking, lending, or farming.
      </p>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
        <div className="space-y-6">
          <Card className="shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">How It Works</CardTitle>
              <CardDescription>A secure, transparent, and sustainable way to build your future</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full shrink-0">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Smart Yield Generation</h3>
                  <p className="text-sm text-muted-foreground">
                    Contributions are allocated to a yield-generating liquidity pool, compounding returns over time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full shrink-0">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Regenerative Finance</h3>
                  <p className="text-sm text-muted-foreground">
                    Your investments support sustainable projects that generate both financial returns and positive
                    impact.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full shrink-0">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Secure Redemption</h3>
                  <p className="text-sm text-muted-foreground">
                    Upon maturity, participants redeem their principal plus accrued yield, reflecting their proportional
                    share of the pool's performance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Pension Yield Simulator</CardTitle>
            <CardDescription>Estimate your future pension based on your contributions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="initial">Initial Investment (XRP)</Label>
                <span className="text-sm font-medium">{inputs.initial} XRP</span>
              </div>
              <Slider
                id="initial"
                min={100}
                max={10000}
                step={100}
                value={[inputs.initial]}
                onValueChange={(value) => handleInputChange("initial", value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="monthly">Monthly Contribution (XRP)</Label>
                <span className="text-sm font-medium">{inputs.monthly} XRP</span>
              </div>
              <Slider
                id="monthly"
                min={10}
                max={1000}
                step={10}
                value={[inputs.monthly]}
                onValueChange={(value) => handleInputChange("monthly", value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="yieldRate">Annual Yield (%)</Label>
                <span className="text-sm font-medium">{inputs.yieldRate}%</span>
              </div>
              <Slider
                id="yieldRate"
                min={1}
                max={15}
                step={0.5}
                value={[inputs.yieldRate]}
                onValueChange={(value) => handleInputChange("yieldRate", value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="years">Duration (years)</Label>
                <span className="text-sm font-medium">{inputs.years} years</span>
              </div>
              <Slider
                id="years"
                min={1}
                max={40}
                step={1}
                value={[inputs.years]}
                onValueChange={(value) => handleInputChange("years", value[0])}
              />
            </div>

            <div className="mt-5 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Estimated Pension:</p>
                <p className="text-2xl sm:text-3xl font-bold text-primary">{result.toFixed(2)} XRP</p>
                <p className="text-xs text-muted-foreground mt-2">
                  When you're ready to retire, you simply withdraw your pension: your original deposit plus your share
                  of the yield.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleContinue} className="w-full">
              Continue to Contribution
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

