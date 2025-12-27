"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ContactFormProps {
  onSubmit: (data: { name?: string; phone?: string }) => Promise<void>;
  onSkip: () => void;
  isSubmitting: boolean;
  className?: string;
}

export function ContactForm({
  onSubmit,
  onSkip,
  isSubmitting,
  className,
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Both fields are optional, but at least one should be provided
    if (!name.trim() && !phone.trim()) {
      setError("Please provide at least your name or phone number");
      return;
    }

    try {
      await onSubmit({
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
      });
    } catch (err) {
      setError("Failed to share. Please try again.");
      console.error("Contact form submission error:", err);
    }
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto shadow-lg", className)}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Help Pooja reach out to you
            </h3>
            <p className="text-sm text-muted-foreground">
              Would you like to share your name and number so Pooja can reach out to you?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (optional)</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
                className="w-full"
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || (!name.trim() && !phone.trim())}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sharing...
                  </>
                ) : (
                  "Share with Pooja"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onSkip}
                disabled={isSubmitting}
              >
                Skip
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
