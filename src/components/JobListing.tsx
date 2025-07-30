"use client";

import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { JobListing as JobListingType } from "~/lib/astro-types";

interface JobListingProps {
  job: JobListingType;
  onApply?: (jobId: string) => void;
  showApplyButton?: boolean;
  compatibilityScore?: number;
}

export default function JobListing({ 
  job, 
  onApply, 
  showApplyButton = true,
  compatibilityScore 
}: JobListingProps) {
  const formatBudget = (budget: JobListingType["budget"]) => {
    if (!budget) return "Budget not specified";
    return `${budget.currency} ${budget.min.toLocaleString()} - ${budget.max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{job.location}</span>
              <span>•</span>
              <span>{job.duration}</span>
            </div>
          </div>
          {compatibilityScore && (
            <Badge 
              variant={compatibilityScore >= 80 ? "default" : compatibilityScore >= 60 ? "secondary" : "outline"}
              className="text-xs"
            >
              {compatibilityScore}% Match
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {job.description}
        </p>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Required Skills</h4>
          <div className="flex flex-wrap gap-1">
            {job.skillsRequired.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Requirements</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {job.requirements.slice(0, 3).map((req, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 bg-current rounded-full flex-shrink-0" />
                {req}
              </li>
            ))}
            {job.requirements.length > 3 && (
              <li className="text-xs">+{job.requirements.length - 3} more requirements</li>
            )}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="space-y-1">
            <div className="text-sm font-medium">{formatBudget(job.budget)}</div>
            <div className="text-xs text-muted-foreground">
              Posted {formatDate(job.createdAt)} • Stake: {job.stakeAmount} tokens
            </div>
          </div>
          
          {showApplyButton && onApply && (
            <Button size="sm" onClick={() => onApply(job.id)}>
              Apply
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}