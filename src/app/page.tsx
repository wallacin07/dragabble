"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export default function Page() {
  const subjects = [
    { name: "Matemática", hours: 6 },
    { name: "Português", hours: 4 },
    { name: "História", hours: 3 },
    { name: "Geografia", hours: 3 },
    { name: "Ciências", hours: 4 },
    { name: "Inglês", hours: 2 },
    { name: "Educação Física", hours: 2 },
  ];

  const [days, setDays] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      events: [] as Array<{ id: string; name: string; hours: number }>
    }))
  );

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === "materias" && destination.droppableId.startsWith("dia-")) {
      const subject = subjects.find(subj => subj.name === result.draggableId);
      if (!subject) return;

      const diaDestino = parseInt(destination.droppableId.split("-")[1]);

      if (source.droppableId.startsWith("dia-") && destination.droppableId === "materias") {
        const diaOrigem = parseInt(source.droppableId.split("-")[1]);

        setDays(prevDays =>
          prevDays.map(dia => {
            if (dia.day === diaOrigem) {
              const newEvents = dia.events.filter((_, index) => index !== source.index);
              return { ...dia, events: newEvents };
            }
            return dia;
          })
        );
      }

      setDays(prevDays =>
        prevDays.map(dia => {
          if (dia.day === diaDestino) {
            return {
              ...dia,
              events: [...dia.events, {
                id: `${subject.name}-${Date.now()}`,
                name: subject.name,
                hours: subject.hours
              }]
            }
          }
          return dia;
        })
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <DragDropContext onDragEnd={handleDragEnd}>


        <aside className="w-1/4 p-4 bg-muted/20">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Matérias</CardTitle>
            </CardHeader>
            <CardContent>
              <Droppable droppableId="materias">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {subjects.map((subject, index) => (
                      <Draggable
                        key={subject.name}
                        draggableId={subject.name}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex justify-between items-center border rounded-md p-2"
                          >
                            <span className="font-medium">{subject.name}</span>
                            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
                              {subject.hours} horas
                            </span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        </aside>


        <main className="w-full md:w-3/4 p-4">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold">Março</h2>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((dia) => (
              <div key={dia} className="text-center font-medium p-2">
                {dia}
              </div>
            ))}

            {Array.from({ length: 3 }, (_, i) => (
              <div key={`empty-${i}`} className="aspect-square min-h-[100px]"></div>
            ))}

            {days.map((diaObj) => (
              <Droppable key={diaObj.day} droppableId={`dia-${diaObj.day}`}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="aspect-square border rounded-md relative p-2 min-h-[100px] hover:bg-muted/10 transition-colors"
                  >
                    <span className="absolute top-1 left-1 text-sm font-medium text-muted-foreground">
                      {diaObj.day}
                    </span>
                    <div className="pt-5 h-full space-y-1">
                      {diaObj.events.map((evento, index) => (
                        <Draggable
                          key={evento.id}
                          draggableId={evento.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="text-sm bg-primary/10 p-1 rounded truncate border"
                            >
                              {evento.name}
                              <span className="ml-1 text-xs text-primary">
                                ({evento.hours}h)
                              </span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </main>
      </DragDropContext>
    </div>
  )
}