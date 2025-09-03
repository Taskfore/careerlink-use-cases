"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { EventForm } from "@/components/events/EventForm";
import { eventService } from "@/lib/api/services/eventService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { EventCreate } from "@/types/events";

export default function NewEventPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSubmit = async (formData: EventCreate | EventUpdate) => {
    try {
      // Ensure required fields are present
      if (!formData.title || !formData.description || !formData.location || !formData.start_time || !formData.end_time) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare event data in the format expected by the API
      const eventData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        start_time: formData.start_time instanceof Date 
          ? formData.start_time.toISOString() 
          : formData.start_time,
        end_time: formData.end_time instanceof Date 
          ? formData.end_time.toISOString() 
          : formData.end_time,
        is_public: formData.is_public ?? true,
        max_attendees: formData.max_attendees,
        image_url: formData.image_url,
        created_by: user.id,
      };
      
      const response = await eventService.createEvent({
        ...eventData,
        created_by: user.id,
      });

      if (response.error) throw new Error(response.error);

      toast({
        title: "Success!",
        description: "Your event has been created successfully.",
      });

      router.push("/events");
    } catch (error: unknown) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to create event. Please try again.",
        variant: "destructive",
      });
      throw error; // Re-throw to let the form handle the error state
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to create your event
        </p>
      </div>

      <EventForm onSubmit={handleSubmit} submitLabel="Create Event" />
    </div>
  );
}
