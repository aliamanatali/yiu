"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out AI Chat",
    icon: Sparkles,
    color: "from-slate-600 to-slate-700",
    features: [
      "20 messages per day",
      "Basic AI responses",
      "Conversation history",
      "Search conversations",
      "Email support",
    ],
    limitations: [
      "Daily message limit",
      "Standard response speed",
    ],
    cta: "Get Started",
    ctaVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    description: "For professionals who need more power",
    icon: Zap,
    color: "from-purple-600 to-pink-600",
    features: [
      "500 messages per day",
      "Faster AI responses",
      "Priority support",
      "Export conversations",
      "Share conversations",
      "Advanced search",
      "Conversation tags",
    ],
    limitations: [],
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
    popular: true,
  },
  {
    name: "Plus",
    price: "$19.99",
    period: "per month",
    description: "Unlimited AI power for heavy users",
    icon: Crown,
    color: "from-orange-600 to-pink-600",
    features: [
      "Unlimited messages",
      "Fastest AI responses",
      "24/7 priority support",
      "Custom AI personalities",
      "API access",
      "Team collaboration (coming soon)",
      "Advanced analytics",
      "Everything in Pro",
    ],
    limitations: [],
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
    popular: false,
  },
];

export function PricingPlans() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/chat" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">AI Chat</span>
          </Link>
          <Link href="/chat">
            <Button variant="ghost">Back to Chat</Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          Simple, transparent pricing
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-4">
          Start free, upgrade when you need more. All plans include access to our powerful AI assistant.
        </p>
        <p className="text-sm text-slate-500">
          14-day money-back guarantee on all paid plans
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`relative overflow-hidden transition-all duration-300 ${
                  plan.popular
                    ? "border-2 border-purple-500 shadow-2xl shadow-purple-500/20 scale-105"
                    : "border border-slate-200 hover:border-purple-300 hover:shadow-xl"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-slate-500">/ {plan.period}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-6">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/50"
                        : ""
                    }`}
                    variant={plan.ctaVariant}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, 
                  or at the end of your billing cycle for downgrades.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">What happens if I hit my message limit?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  On the Free plan, you'll need to wait until the next day when your limit resets. 
                  Or you can upgrade to Pro or Plus for higher limits. We'll send you notifications when you're 
                  approaching your limit.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Is there a refund policy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Yes! We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, 
                  we'll refund your payment in full, no questions asked.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">How do I cancel my subscription?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  You can cancel anytime from your account settings. Your access will continue until the end of 
                  your billing period, then you'll automatically revert to the Free plan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="text-2xl">Still have questions?</CardTitle>
              <CardDescription>
                Our team is here to help you choose the right plan for your needs.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
