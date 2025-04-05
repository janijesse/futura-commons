"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

const formSchema = z.object({
  age: z
    .string()
    .min(1, { message: "Please enter your age" })
    .refine((val) => Number.parseInt(val) >= 18, { message: "You must be at least 18 years old" }),
  income: z.string().min(1, { message: "Please enter your income" }),
  savingsGoal: z.string().min(1, { message: "Please enter your savings goal" }),
  country: z.string().min(1, { message: "Please select your country" }),
  riskTolerance: z.enum(["low", "medium", "high"], {
    required_error: "Please select your risk tolerance",
  }),
  investmentExperience: z.enum(["none", "some", "experienced"], {
    required_error: "Please select your investment experience",
  }),
})

// List of countries for the dropdown
const countries = [
  "Argentina",
  "Australia",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "France",
  "Germany",
  "India",
  "Indonesia",
  "Italy",
  "Japan",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Peru",
  "Russia",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Venezuela",
].sort()

export default function AssessmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: "",
      income: "",
      savingsGoal: "",
      country: "",
      riskTolerance: undefined,
      investmentExperience: undefined,
    },
  })

  function calculateRiskProfile(data: z.infer<typeof formSchema>) {
    // Simple algorithm to determine risk profile
    let riskScore = 0

    // Age factor - younger can take more risk
    const age = Number.parseInt(data.age)
    if (age < 30) riskScore += 3
    else if (age < 50) riskScore += 2
    else riskScore += 1

    // Risk tolerance self-assessment
    if (data.riskTolerance === "high") riskScore += 3
    else if (data.riskTolerance === "medium") riskScore += 2
    else riskScore += 1

    // Investment experience
    if (data.investmentExperience === "experienced") riskScore += 3
    else if (data.investmentExperience === "some") riskScore += 2
    else riskScore += 1

    // Determine final risk profile
    if (riskScore >= 7) return "high"
    if (riskScore >= 4) return "medium"
    return "low"
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    // Calculate risk profile
    const riskProfile = calculateRiskProfile(values)

    // Store assessment data in localStorage for the next step
    localStorage.setItem(
      "assessmentData",
      JSON.stringify({
        ...values,
        riskProfile,
      }),
    )

    // Navigate to the investment packages page
    setTimeout(() => {
      router.push("/packages")
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:py-10 sm:max-w-md">
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl">Personal Assessment</CardTitle>
          <CardDescription>Help us understand your retirement goals.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter your age (18+)" {...field} />
                    </FormControl>
                    <FormDescription>You must be at least 18 years old.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="h-60">
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Income (XRP)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter your annual income" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="savingsGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retirement Savings Goal (XRP)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter your savings goal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="riskTolerance"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Risk Tolerance</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="low" />
                          </FormControl>
                          <FormLabel className="font-normal">Low - I prefer stability over high returns</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="medium" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Medium - I can accept some volatility for better returns
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="high" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            High - I'm comfortable with volatility for maximum returns
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="investmentExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment Experience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None - I'm new to investing</SelectItem>
                        <SelectItem value="some">Some - I have some investment experience</SelectItem>
                        <SelectItem value="experienced">Experienced - I regularly invest</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? "Processing..." : "Continue"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

