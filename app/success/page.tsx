"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"
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
  }
}

export default function SuccessPage() {
  const router = useRouter()
  const [nftId, setNftId] = useState<string | null>(null)
  const [contributionData, setContributionData] = useState<ContributionData | null>(null)

  useEffect(() => {
    // Retrieve NFT ID and contribution data
    const storedNftId = localStorage.getItem("userNftId")
    const storedContributionData = localStorage.getItem("contributionData")

    if (storedNftId && storedContributionData) {
      setNftId(storedNftId)
      setContributionData(JSON.parse(storedContributionData))
    } else {
      // Redirect if data is missing
      router.push("/")
    }
  }, [router])

  if (!nftId || !contributionData) {
    return <div className="container mx-auto py-10 text-center">Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-10 sm:max-w-md">
      <Card className="shadow-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
          </div>
          <CardTitle className="text-xl sm:text-2xl">Success!</CardTitle>
          <CardDescription>Your retirement fund has been created and your NFT has been minted.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted p-4">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">NFT ID:</span>
                <span className="text-sm">{nftId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Contribution Amount:</span>
                <span className="text-sm">{contributionData.amount} XRP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Wallet Address:</span>
                <span className="text-sm truncate max-w-[180px]">{contributionData.walletAddress}</span>
              </div>
              {contributionData.assessmentData && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Country:</span>
                  <span className="text-sm">{contributionData.assessmentData.country}</span>
                </div>
              )}
              {contributionData.pensionPlan && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Monthly Contribution:</span>
                    <span className="text-sm">{contributionData.pensionPlan.monthly} XRP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Annual Yield:</span>
                    <span className="text-sm">{contributionData.pensionPlan.yieldRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm">{contributionData.pensionPlan.years} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Estimated Pension:</span>
                    <span className="text-sm">{contributionData.pensionPlan.estimatedPension.toFixed(2)} XRP</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-sm font-medium">Date:</span>
                <span className="text-sm">{new Date(contributionData.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">What happens next?</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>Your NFT serves as your access key to your retirement vault</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>Your contribution will be allocated to yield-generating pools</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>You can track your retirement growth and impact in your dashboard</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Return to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

