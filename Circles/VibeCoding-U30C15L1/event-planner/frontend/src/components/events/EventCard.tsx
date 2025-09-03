import { format } from "date-fns";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/events";
import Link from "next/link";

interface EventCardProps {
  event: Event;
  showActions?: boolean;
  onRSVP?: (status: "going" | "not_going" | "maybe") => void;
  isOwner?: boolean;
}

export function EventCard({
  event,
  showActions = true,
  onRSVP,
  isOwner = false,
}: EventCardProps) {
  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);
  const isPast = new Date() > endDate;

  const getRSVPStatus = () => {
    if (!event.user_rsvp) return null;

    const statusMap = {
      going: "Going",
      not_going: "Not Going",
      maybe: "Maybe",
    };

    return (
      <div className="mt-2">
        <Badge variant="secondary">
          {statusMap[event.user_rsvp.status as keyof typeof statusMap]}
        </Badge>
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl">
            <Link href={`/events/${event.id}`} className="hover:underline">
              {event.title}
            </Link>
          </CardTitle>
          {isOwner && (
            <Badge variant="outline" className="text-xs">
              Your Event
            </Badge>
          )}
        </div>
        {!event.is_public && (
          <Badge variant="outline" className="w-fit">
            Private
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {format(startDate, "MMM d, yyyy h:mm a")} -{" "}
              {format(endDate, "h:mm a")}
            </span>
          </div>
          {event.location && (
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
          {event.max_attendees && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {event.rsvp_count || 0} / {event.max_attendees} attendees
              </span>
            </div>
          )}
        </div>

        {getRSVPStatus()}
      </CardContent>
      {showActions && (
        <CardFooter className="flex justify-between gap-2 w-full">
          <Button asChild variant="outline" size="sm">
            <Link href={`/events/${event.id}`}>View Details</Link>
          </Button>

          {!isOwner && !isPast && onRSVP && (
            <div className="flex gap-2">
              <Button
                variant={
                  event.user_rsvp?.status === "not_going"
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => onRSVP("not_going")}
              >
                Can&apos;t Go
              </Button>
              <Button
                variant={
                  event.user_rsvp?.status === "maybe" ? "default" : "outline"
                }
                size="sm"
                onClick={() => onRSVP("maybe")}
              >
                Maybe
              </Button>
              <Button
                variant={
                  event.user_rsvp?.status === "going" ? "default" : "outline"
                }
                size="sm"
                onClick={() => onRSVP("going")}
              >
                Going
              </Button>
            </div>
          )}

          {isOwner && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/events/${event.id}/edit`}>Edit Event</Link>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
