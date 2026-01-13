"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  isActive: boolean;
}

export default function GrantsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["grants", search, category, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
      });
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      params.append("isActive", "true");

      const response = await fetch(`/api/grants?${params}`);
      if (!response.ok) throw new Error("Failed to fetch grants");
      return response.json();
    },
  });

  const grants: Grant[] = data?.grants || [];
  const pagination = data?.pagination;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Browse Grants</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search grants..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1"
          />
          <Select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            <option value="Cloud Compute">Cloud Compute</option>
            <option value="Health AI">Health AI</option>
            <option value="Finance AI">Finance AI</option>
            <option value="LLM Tokens">LLM Tokens</option>
          </Select>
        </div>
      </div>

      {isLoading && <p className="text-center py-8">Loading grants...</p>}
      {error && <p className="text-center py-8 text-destructive">Error loading grants</p>}

      {!isLoading && !error && (
        <>
          {grants.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No grants found. Try adjusting your filters.</p>
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
                      <Button asChild variant="outline" size="sm">
                        <a href={grant.url} target="_blank" rel="noopener noreferrer">
                          Apply
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
