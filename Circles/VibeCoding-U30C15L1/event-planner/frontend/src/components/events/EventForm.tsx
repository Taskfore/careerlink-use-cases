"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { EventCreate, EventUpdate } from "@/types/events";

interface EventFormProps {
  initialData?: EventUpdate & { id?: string };
  onSubmit: (data: EventCreate | EventUpdate) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function EventForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Create Event",
}: EventFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState<EventCreate | EventUpdate>(
    initialData || {
      title: "",
      description: "",
      location: "",
      start_time: new Date(),
      end_time: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
      is_public: true,
      max_attendees: undefined,
      image_url: "",
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [datePickerOpen, setDatePickerOpen] = useState<"start" | "end" | null>(
    null
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.start_time) {
      newErrors.start_time = "Start time is required";
    }

    if (!formData.end_time) {
      newErrors.end_time = "End time is required";
    } else if (
      formData.start_time &&
      formData.end_time <= formData.start_time
    ) {
      newErrors.end_time = "End time must be after start time";
    }

    if (formData.max_attendees !== undefined && formData.max_attendees < 1) {
      newErrors.max_attendees = "Must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await onSubmit(formData);
      toast({
        title: "Success!",
        description: initialData
          ? "Event updated successfully"
          : "Event created successfully",
      });
      router.push(initialData ? `/events/${initialData.id}` : "/events");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save event';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "max_attendees"
          ? value
            ? parseInt(value, 10)
            : undefined
          : value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateSelect = (
    date: Date | undefined,
    field: "start_time" | "end_time"
  ) => {
    if (!date) return;

    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));

    // If setting start time, update end time if it would be before start
    if (field === "start_time" && formData.end_time < date) {
      const newEndTime = new Date(date.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
      setFormData((prev) => ({
        ...prev,
        end_time: newEndTime,
      }));
    }

    setDatePickerOpen(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="My Awesome Event"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell people what your event is about..."
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            placeholder="Where is the event taking place?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Start Time *</Label>
            <Popover
              open={datePickerOpen === "start"}
              onOpenChange={(open) => setDatePickerOpen(open ? "start" : null)}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.start_time && "text-muted-foreground",
                    errors.start_time && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.start_time ? (
                    format(new Date(formData.start_time), "PPPp")
                  ) : (
                    <span>Pick a date and time</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={new Date(formData.start_time)}
                  onSelect={(date) => handleDateSelect(date, "start_time")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.start_time && (
              <p className="text-sm text-red-500 mt-1">{errors.start_time}</p>
            )}
          </div>

          <div>
            <Label>End Time *</Label>
            <Popover
              open={datePickerOpen === "end"}
              onOpenChange={(open) => setDatePickerOpen(open ? "end" : null)}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.end_time && "text-muted-foreground",
                    errors.end_time && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.end_time ? (
                    format(new Date(formData.end_time), "PPPp")
                  ) : (
                    <span>Pick a date and time</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={new Date(formData.end_time)}
                  onSelect={(date) => handleDateSelect(date, "end_time")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.end_time && (
              <p className="text-sm text-red-500 mt-1">{errors.end_time}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="max_attendees">Max Attendees (optional)</Label>
            <Input
              id="max_attendees"
              name="max_attendees"
              type="number"
              min="1"
              value={formData.max_attendees || ""}
              onChange={handleChange}
              placeholder="Leave empty for unlimited"
              className={errors.max_attendees ? "border-red-500" : ""}
            />
            {errors.max_attendees && (
              <p className="text-sm text-red-500 mt-1">
                {errors.max_attendees}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="image_url">Image URL (optional)</Label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              value={formData.image_url || ""}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="is_public"
            checked={formData.is_public}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, is_public: checked }))
            }
          />
          <Label htmlFor="is_public">Make this event public</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
