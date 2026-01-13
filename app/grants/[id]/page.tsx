"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";

interface Grant {
  id: string;
  title: string;
  description: string;
  organization: string;
  category: string[];
  amount?: string;
  deadline?: string;
  url: string;
  requirements?: string;
  eligibility?: string;
  source: string;
  tags: string[];
}

export default function GrantDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: grant, isLoading, error } = useQuery<Grant>({
    queryKey: ["grant", id],
    queryFn: async () => {
      const response = await fetch(`/api/grants/${id}`);
      if (!response.ok) throw new Error("Failed to fetch grant");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading grant details...</p>
      </div>
    );
  }

  if (error || !grant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">Grant not found</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/grants">Back to Grants</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button asChild variant="outline" className="mb-6">
        <Link href="/grants">← Back to Grants</Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{grant.title}</CardTitle>
              <CardDescription className="text-lg">{grant.organization}</CardDescription>
            </div>
            <Badge variant="outline">{grant.source}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {grant.category.map((cat) => (
              <Badge key={cat} variant="secondary">
                {cat}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {grant.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grant.amount && (
              <div>
                <h3 className="font-semibold mb-2">Amount</h3>
                <p className="text-muted-foreground">{grant.amount}</p>
              </div>
            )}
            {grant.deadline && (
              <div>
                <h3 className="font-semibold mb-2">Deadline</h3>
                <p className="text-muted-foreground">
                  {format(new Date(grant.deadline), "MMMM dd, yyyy")}
                </p>
              </div>
            )}
          </div>

          {grant.eligibility && (
            <div>
              <h3 className="font-semibold mb-2">Eligibility</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {grant.eligibility}
              </p>
            </div>
          )}

          {grant.requirements && (
            <div>
              <h3 className="font-semibold mb-2">Requirements</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {grant.requirements}
              </p>
            </div>
          )}

          {grant.tags && grant.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {grant.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t">
            <Button asChild size="lg">
              <a href={grant.url} target="_blank" rel="noopener noreferrer">
                Apply Now
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
