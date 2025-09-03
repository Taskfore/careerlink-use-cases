import { useState, useEffect } from 'react';
import { Event } from '@/types/events';
import { EventCard } from './EventCard';
// Button is not used in this file
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Skeleton is now implemented inline

export interface EventListProps {
  events: Event[];
  loading?: boolean;
  onRSVP?: (eventId: string, status: 'going' | 'not_going' | 'maybe') => Promise<void>;
  emptyMessage?: string;
  showTabs?: boolean;
  isOwner?: (event: Event) => boolean;
}

export function EventList({
  events,
  loading = false,
  onRSVP,
  emptyMessage = 'No events found',
  showTabs = true,
  isOwner,
}: EventListProps) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    const now = new Date();
    if (!events) return;
    
    const filtered = events.filter(event => {
      const endDate = new Date(event.end_time);
      if (activeTab === 'upcoming') return endDate >= now;
      if (activeTab === 'past') return endDate < now;
      return true;
    });
    
    // Sort by start time (soonest first for upcoming, most recent first for past)
    filtered.sort((a, b) => {
      const aDate = new Date(a.start_time);
      const bDate = new Date(b.start_time);
      return activeTab === 'upcoming' 
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    });
    
    setFilteredEvents(filtered);
  }, [events, activeTab]);

  const handleRSVP = async (eventId: string, status: 'going' | 'not_going' | 'maybe') => {
    if (onRSVP) {
      await onRSVP(eventId, status);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ height: '16rem', width: '100%', borderRadius: '0.5rem', border: '1px solid #ddd', backgroundColor: '#f7f7f7' }} />
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showTabs && (
        <Tabs 
          defaultValue="upcoming" 
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
            {filteredEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No upcoming events found
              </p>
            ) : (
              <EventGrid 
                events={filteredEvents} 
                onRSVP={onRSVP && handleRSVP} 
                isOwner={isOwner}
              />
            )}
          </TabsContent>
          
          <TabsContent value="past" className="mt-6">
            {filteredEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No past events found
              </p>
            ) : (
              <EventGrid 
                events={filteredEvents} 
                onRSVP={onRSVP && handleRSVP} 
                isOwner={isOwner}
              />
            )}
          </TabsContent>
        </Tabs>
      )}
      
      {!showTabs && (
        <EventGrid 
          events={filteredEvents} 
          onRSVP={onRSVP && handleRSVP} 
          isOwner={isOwner}
        />
      )}
    </div>
  );
}

interface EventGridProps {
  events: Event[];
  onRSVP?: (eventId: string, status: 'going' | 'not_going' | 'maybe') => void;
  isOwner?: (event: Event) => boolean;
}

function EventGrid({ events, onRSVP, isOwner }: EventGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onRSVP={onRSVP && event.id ? (status) => onRSVP(event.id, status) : undefined}
          isOwner={isOwner ? isOwner(event) : false}
        />
      ))}
    </div>
  );
}

