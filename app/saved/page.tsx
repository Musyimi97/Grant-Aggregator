"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";

interface Grant {
  id: string;
  title: string;
  description: string;
  organization: string;
  category: string[];
  amount?: string;
  deadline?: string;
  url: string;
  source: string;
}

export default function SavedGrantsPage() {
  // TODO: Get userId from auth context
  const userId = "temp-user-id";

  const { data, isLoading, error } = useQuery({
    queryKey: ["saved-grants", userId],
    queryFn: async () => {
      const response = await fetch(`/api/user/saved?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch saved grants");
      return response.json();
    },
    enabled: !!userId,
  });

  const grants: Grant[] = data?.grants || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Saved Grants</h1>

      {isLoading && <p className="text-center py-8">Loading saved grants...</p>}
      {error && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">Error loading saved grants</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && (
        <>
          {grants.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">
                  You haven't saved any grants yet.
                </p>
                <Button asChild>
                  <Link href="/grants">Browse Grants</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {grants.map((grant) => (
                <Card key={grant.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="mb-2">
                          <Link
                            href={`/grants/${grant.id}`}
                            className="hover:underline"
                          >
                            {grant.title}
                          </Link>
                        </CardTitle>
                        <CardDescription>{grant.organization}</CardDescription>
                      </div>
                      <Badge variant="outline">{grant.source}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {grant.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {grant.category.map((cat) => (
                        <Badge key={cat} variant="secondary">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex gap-4">
                        {grant.amount && (
                          <span className="text-muted-foreground">
                            Amount: {grant.amount}
                          </span>
                        )}
                        {grant.deadline && (
                          <span className="text-muted-foreground">
                            Deadline: {format(new Date(grant.deadline), "MMM dd, yyyy")}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <a href={grant.url} target="_blank" rel="noopener noreferrer">
                            Apply
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
