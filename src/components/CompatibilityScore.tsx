"use client";

import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { CompatibilityScore as CompatibilityScoreType } from "~/lib/astro-types";

interface CompatibilityScoreProps {
  score: CompatibilityScoreType;
  showDetails?: boolean;
}

export default function CompatibilityScore({ score, showDetails = true }: CompatibilityScoreProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const scoreCategories = [
    { key: "communication", label: "Communication", value: score.communication },
    { key: "collaboration", label: "Collaboration", value: score.collaboration },
    { key: "leadership", label: "Leadership", value: score.leadership },
    { key: "creativity", label: "Creativity", value: score.creativity },
    { key: "workStyle", label: "Work Style", value: score.workStyle }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Compatibility Score</span>
          <span className={`text-2xl font-bold ${getScoreColor(score.overall)}`}>
            {score.overall}%
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Match</span>
            <span className={`text-sm font-semibold ${getScoreColor(score.overall)}`}>
              {score.overall}%
            </span>
          </div>
          <Progress 
            value={score.overall} 
            className="h-2"
          />
        </div>

        {showDetails && (
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-sm font-medium">Detailed Breakdown</h4>
            {scoreCategories.map(({ key, label, value }) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className={`text-xs font-medium ${getScoreColor(value)}`}>
                    {value}%
                  </span>
                </div>
                <Progress 
                  value={value} 
                  className="h-1"
                />
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          {score.overall >= 80 && "Excellent compatibility for collaboration"}
          {score.overall >= 60 && score.overall < 80 && "Good potential for working together"}
          {score.overall < 60 && "May require extra effort to align working styles"}
        </div>
      </CardContent>
    </Card>
  );
}