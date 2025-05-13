import React from 'react';

type Event = {
  id: number;
  title: string;
  date: string;
};

type UpcomingEventsProps = {
  events: Event[];
};

const UpcomingEvents = ({ events }: UpcomingEventsProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Próximos Eventos</h3>
      
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex items-center">
            <div className="bg-gray-100 text-primary text-center p-2 rounded min-w-[70px]">
              <span className="block font-bold">{event.date}</span>
            </div>
            <div className="ml-3">
              <h4 className="font-medium">{event.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
