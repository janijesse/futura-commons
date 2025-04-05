"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ArrowRight, Wallet } from "lucide-react"

const formSchema = z.object({
  amount: z.string().min(1, { message: "Please enter an amount" }),
})

type PensionPlan = {
  initial: number
  monthly: number
  yieldRate: number
  years: number
  estimatedPension: number
}

type AssessmentData = {
  age: string
  income: string
  savingsGoal: string
  country: string
  riskTolerance: string
  investmentExperience: string
  riskProfile: "low" | "medium" | "high"
}

export default function ContributePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [pensionPlan, setPensionPlan] = useState<PensionPlan | null>(null)
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  })

  useEffect(() => {
    // Retrieve pension plan data
    const pensionPlanData = localStorage.getItem("pensionPlan")
    const assessmentDataStr = localStorage.getItem("assessmentData")

    if (pensionPlanData && assessmentDataStr) {
      const plan = JSON.parse(pensionPlanData)
      const assessment = JSON.parse(assessmentDataStr)
      setPensionPlan(plan)
      setAssessmentData(assessment)
      // Set initial amount based on pension plan
      form.setValue("amount", plan.monthly.toString())
    } else {
      // Redirect if data is missing
      router.push("/packages")
    }
  }, [router, form])

  const simulateWalletConnection = async () => {
    setIsConnecting(true)

    try {
      // Simulate wallet connection delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a random XRPL-like address
      const randomAddress = `r${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

      setWalletAddress(randomAddress)
      setWalletConnected(true)

      // Store wallet address in localStorage
      localStorage.setItem("walletAddress", randomAddress)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!walletConnected) {
      // Prompt to connect wallet first
      return
    }

    setLoading(true)

    try {
      // Store contribution data
      localStorage.setItem(
        "contributionData",
        JSON.stringify({
          amount: values.amount,
          walletAddress: walletAddress,
          timestamp: new Date().toISOString(),
          pensionPlan: pensionPlan,
          assessmentData: assessmentData,
        }),
      )

      // Simulate NFT minting delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a fake NFT ID
      const nftId = `FUTURA-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      localStorage.setItem("userNftId", nftId)

      // Navigate to success page
      router.push("/success")
    } catch (error) {
      console.error("Error processing contribution:", error)
      // Handle error state
    } finally {
      setLoading(false)
    }
  }

  if (!pensionPlan) {
    return <div className="container mx-auto py-10 text-center">Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-10 sm:max-w-md">
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl">Make Your First Contribution</CardTitle>
          <CardDescription>Start your retirement journey with your first contribution.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border p-4 bg-muted">
            <h3 className="text-sm font-medium mb-2">Your Pension Plan Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Initial Investment:</div>
              <div className="text-right font-medium">{pensionPlan.initial} XRP</div>

              <div>Monthly Contribution:</div>
              <div className="text-right font-medium">{pensionPlan.monthly} XRP</div>

              <div>Annual Yield:</div>
              <div className="text-right font-medium">{pensionPlan.yieldRate}%</div>

              <div>Duration:</div>
              <div className="text-right font-medium">{pensionPlan.years} years</div>

              <div>Estimated Pension:</div>
              <div className="text-right font-medium">{pensionPlan.estimatedPension.toFixed(2)} XRP</div>

              {assessmentData && (
                <>
                  <div>Country:</div>
                  <div className="text-right font-medium">{assessmentData.country}</div>
                </>
              )}
            </div>
          </div>

          {!walletConnected ? (
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Connect Your Wallet</CardTitle>
                <CardDescription>Connect your XRPL wallet to continue</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={simulateWalletConnection} className="w-full" disabled={isConnecting}>
                  {isConnecting ? (
                    <span className="flex items-center">
                      <Wallet className="mr-2 h-4 w-4 animate-pulse" />
                      Connecting...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect XRPL Wallet
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md">
                <Wallet className="h-4 w-4" />
                <span className="text-sm font-medium">Wallet Connected</span>
              </div>
              <div className="text-xs text-muted-foreground break-all">
                <span className="font-medium">Address:</span> {walletAddress}
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contribution Amount (XRP)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormDescription>This is your first contribution to start your pension fund.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center">
                        Processing... <Wallet className="ml-2 h-4 w-4 animate-pulse" />
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Contribute & Mint NFT <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

