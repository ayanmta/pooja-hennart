"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

const whatsappFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  eventType: z.string().min(1, "Please select an event type"),
  date: z.string().min(1, "Please select a date"),
  city: z.string().min(2, "City must be at least 2 characters"),
  customMessage: z.string().optional(),
});

type WhatsAppFormValues = z.infer<typeof whatsappFormSchema>;

interface WhatsAppContactFormProps {
  whatsappNumber: string;
  defaultMessage?: string;
  onSend?: (values: WhatsAppFormValues) => void;
  className?: string;
}

export function WhatsAppContactForm({
  whatsappNumber,
  defaultMessage,
  onSend,
  className,
}: WhatsAppContactFormProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const form = useForm<WhatsAppFormValues>({
    resolver: zodResolver(whatsappFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      eventType: "",
      date: "",
      city: "",
      customMessage: "",
    },
  });

  const formatWhatsAppMessage = (values: WhatsAppFormValues): string => {
    const parts: string[] = [];

    if (defaultMessage) {
      parts.push(defaultMessage);
      parts.push("");
    }

    parts.push("📋 *Booking Details*");
    parts.push("");
    parts.push(`👤 *Name:* ${values.name}`);
    parts.push(`📱 *Phone:* ${values.phone}`);
    parts.push(`🎉 *Event Type:* ${values.eventType}`);
    parts.push(`📅 *Date:* ${values.date}`);
    parts.push(`📍 *City:* ${values.city}`);

    if (values.customMessage) {
      parts.push("");
      parts.push("💬 *Additional Message:*");
      parts.push(values.customMessage);
    }

    return parts.join("\n");
  };

  const handleSubmit = (values: WhatsAppFormValues) => {
    const message = formatWhatsAppMessage(values);
    const cleanNumber = whatsappNumber.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

    // Track analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "whatsapp_form_submit", {
        event_type: values.eventType,
        city: values.city,
      });
    }

    onSend?.(values);
    window.open(whatsappUrl, "_blank");

    // Reset form
    form.reset();
    setIsExpanded(false);
  };

  const handleQuickSend = () => {
    const cleanNumber = whatsappNumber.replace(/\D/g, "");
    const message = defaultMessage || "Hi! I'd like to know more about your services.";
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

    // Track analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "whatsapp_quick_send", {});
    }

    window.open(whatsappUrl, "_blank");
  };

  if (!isExpanded) {
    return (
      <Card className={cn("border-border/50 bg-card/50 backdrop-blur-sm", className)}>
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#25D366] shadow-sm">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold leading-none">Send via WhatsApp</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Fill in your details or send a quick message
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuickSend}
              className="border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366]"
            >
              Quick Send
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="bg-[#25D366] hover:bg-[#20BA5A]"
            >
              Fill Details
              <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("border-border/50 bg-card/50 backdrop-blur-sm", className)}>
      <div className="border-b border-border/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#25D366] shadow-sm">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold leading-none">Send via WhatsApp</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Fill in your details and we'll open WhatsApp for you
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsExpanded(false);
              form.reset();
            }}
            className="h-8 w-8"
            aria-label="Close form"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Your phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Bridal">Bridal</SelectItem>
                        <SelectItem value="Engagement">Engagement</SelectItem>
                        <SelectItem value="Sangeet">Sangeet</SelectItem>
                        <SelectItem value="Mehendi">Mehendi</SelectItem>
                        <SelectItem value="Party">Party</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional details or questions..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Share any additional details about your event or ask questions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsExpanded(false);
                  form.reset();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#25D366] hover:bg-[#20BA5A]"
              >
                <Send className="mr-2 h-4 w-4" />
                Send on WhatsApp
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
}
