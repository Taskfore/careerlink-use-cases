"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Loader2,
  AlertCircle,
  Frown,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { eventService } from "@/lib/api/services/eventService";
import { Event } from "@/lib/types";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await eventService.getEvents();

        if (fetchError) {
          throw new Error(fetchError);
        }

        if (data) {
          setEvents(data);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load events. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
          <p className="text-muted-foreground mt-2">
            Discover and join exciting events in your area
          </p>
        </div>
        <Button asChild>
          <Link href="/events/new">Create Event</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      ) : error ? (
        <div className="rounded-md bg-destructive/15 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">
                Failed to load events
              </h3>
              <div className="mt-2 text-sm text-destructive">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <div className="mx-auto h-16 w-16 text-muted-foreground">
            <Frown className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium">No events found</h3>
          <p className="text-muted-foreground">
            There are no upcoming events. Be the first to create one!
          </p>
          <Button asChild className="mt-4">
            <Link href="/events/new">Create Event</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card
              key={event.id}
              className="flex flex-col h-full hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                    <span className="text-xl font-semibold text-center px-4">
                      {event.title}
                    </span>
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="space-y-1">
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <div className="flex items-center text-sm">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {format(parseISO(event.start_time), "MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {format(parseISO(event.start_time), "h:mm a")} -{" "}
                    {format(parseISO(event.end_time), "h:mm a")}
                  </span>
                </div>
                <div className="flex items-start text-sm">
                  <MapPin className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span className="line-clamp-2">{event.location}</span>
                </div>
                <div className="flex items-center justify-between pt-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    <span>
                      {event.rsvps?.length || 0} attending •{" "}
                      {event.capacity ? `${event.capacity} max` : "No limit"}
                    </span>
                  </div>
                  {event.rsvps?.some((rsvp) => rsvp.status) && (
                    <Badge variant="secondary" className="capitalize">
                      {event.rsvps[0].status.replace("_", " ")}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between w-max gap-4">
                <Button variant="outline" asChild className="w-full flex-1">
                  <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
                <Button asChild className="w-full flex-1">
                  <Link href={`/events/${event.id}/register`}>Register</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
