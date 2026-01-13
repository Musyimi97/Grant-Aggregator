"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ScrapingJob {
  id: string;
  source: string;
  status: string;
  grantsFound: number;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

export default function AdminPage() {
  const [isRunning, setIsRunning] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["scraping-jobs"],
    queryFn: async () => {
      const response = await fetch("/api/scrape/status?limit=20");
      if (!response.ok) throw new Error("Failed to fetch scraping jobs");
      return response.json();
    },
  });

  const jobs: ScrapingJob[] = data?.jobs || [];

  const handleRunScraping = async () => {
    setIsRunning(true);
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // In production, you'd need to add: "x-cron-secret": process.env.NEXT_PUBLIC_CRON_SECRET
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to run scraping");
      }

      // Refetch jobs after a delay
      setTimeout(() => {
        refetch();
        setIsRunning(false);
      }, 2000);
    } catch (error) {
      console.error("Error running scraping:", error);
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Button onClick={handleRunScraping} disabled={isRunning}>
            {isRunning ? "Running..." : "Run Scraping Job"}
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scraping Jobs</CardTitle>
          <CardDescription>Recent scraping job history</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-muted-foreground">No scraping jobs found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grants Found</TableHead>
                  <TableHead>Started At</TableHead>
                  <TableHead>Completed At</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.source}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          job.status === "success"
                            ? "default"
                            : job.status === "failed"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{job.grantsFound}</TableCell>
                    <TableCell>
                      {format(new Date(job.startedAt), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      {job.completedAt
                        ? format(new Date(job.completedAt), "MMM dd, yyyy HH:mm")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-destructive text-sm">
                      {job.error || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
