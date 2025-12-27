"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface PermissionRequestProps {
  onRequest: () => void;
  onDismiss: () => void;
  isVisible: boolean;
  className?: string;
}

export function PermissionRequest({
  onRequest,
  onDismiss,
  isVisible,
  className,
}: PermissionRequestProps) {
  if (!isVisible) return null;

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Help Pooja reach you
            </h3>
            <p className="text-sm text-muted-foreground">
              Find your distance from Pooja's location
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              We'll use your location to calculate the distance and help Pooja reach out to you.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onRequest} className="flex-1">
              Find My Distance
            </Button>
            <Button variant="outline" onClick={onDismiss}>
              Dismiss
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
