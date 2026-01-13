import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          Find Your Next Grant
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Track and discover grants for Cloud Compute, Health AI, Finance AI, and LLM API tokens
          from leading organizations worldwide.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/grants">Browse Grants</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/saved">Saved Grants</Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Grants</CardTitle>
              <CardDescription>Active grants in our database</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>New This Week</CardTitle>
              <CardDescription>Recently added opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expiring Soon</CardTitle>
              <CardDescription>Deadlines approaching</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Cloud Compute</CardTitle>
              <CardDescription>AWS, Google Cloud, Azure credits</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Health AI</CardTitle>
              <CardDescription>Medical and healthcare AI grants</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Finance AI</CardTitle>
              <CardDescription>Financial technology grants</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>LLM Tokens</CardTitle>
              <CardDescription>Claude, OpenAI, Gemini API access</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
