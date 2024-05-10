"use client";

import {
  DndContext,
  closestCorners,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Dispatch, SetStateAction } from "react";

const formatMsDuration = (duration_ms: number): string => {
  let seconds = Math.floor(duration_ms / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds -= 60 * minutes;
  return `${minutes}m${seconds}s`;
};

export function DraggableTrackList({
  tracksItems,
  setTracksItems,
  moveSongUp,
  moveSongDown,
}: {
  tracksItems: PlaylistTrackObject[] | undefined;
  setTracksItems: Dispatch<SetStateAction<PlaylistTrackObject[] | undefined>>;
  moveSongUp: (songIdx: number) => void;
  moveSongDown: (songIdx: number) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 100, distance: 0},
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    tracksItems && (
      <DndContext
        autoScroll
        collisionDetection={closestCorners}
        sensors={sensors}
        onDragEnd={(e) => {
          console.log("dragend", e);
          const { active, over } = e;
          if (!over || !tracksItems || active.id === over.id) return;

          setTracksItems((items) => {
            const originalPos = active.id as number;
            const newPos = over.id ? parseInt(over.id.toString()) : 0;

            return arrayMove(
              items as PlaylistTrackObject[],
              originalPos,
              newPos
            );
          });
        }}
      >
        <div className="flex flex-col">
          <SortableContext
            items={tracksItems.map((_, index) => index)}
            strategy={verticalListSortingStrategy}
          >
            {tracksItems.map((track, idx) => (
              <TrackDisplayer
                idx={idx}
                key={idx}
                track={track.track}
                onup={() => {
                  setTracksItems((prev) => {
                    const newarr = prev?.filter((_, i) => i !== idx);
                    newarr?.splice(idx - 1, 0, track);
                    moveSongUp(idx);
                    return newarr;
                  });
                }}
                ondown={() => {
                  setTracksItems((prev) => {
                    const newarr = prev?.filter((_, i) => i !== idx);
                    newarr?.splice(idx + 1, 0, track);
                    moveSongDown(idx);
                    return newarr;
                  });
                }}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          <div className="w-full h-16 bg-neutral-400/20 rounded-lg"></div>
        </DragOverlay>
      </DndContext>
    )
  );
}

function TrackDisplayer({
  idx,
  track,
  onup,
  ondown,
}: {
  idx: number;
  track: Track;
  onup: () => void;
  ondown: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: idx });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      role="button"
      tabIndex={0}
      aria-roledescription="draggable"
      aria-describedby={`DndContext-${idx}`}
      className="flex flex-row justify-between gap-2 py-2 select-none"
    >
      <div className="flex flex-row items-center">
        <span className="text-white/50 w-4 text-right mr-2">{idx + 1}</span>
        <div className="flex flex-col">
          <C.ArrowBtn onClick={onup} up />
          <C.ArrowBtn onClick={ondown} />
        </div>
        <C.Cover url={track.album.images[0].url} />
        <div className="flex flex-col">
          <span className="font-medium">{track.name}</span>
          <span className="text-spotify-200 text-sm">
            {track.explicit && <C.ExplicitContent />}
            {track.artists.map((artist, idx) => {
              if (idx === track.artists.length - 1) return artist.name;
              return artist.name + ", ";
            })}
          </span>
        </div>
      </div>
      <C.Duration dur={track.duration_ms} />
    </div>
  );
}

const C = {
  ExplicitContent: () => (
    <span className="inline-grid place-content-center h-4 text-medium bg-spotify-200/50 text-spotify-900 font-semibold mr-1 rounded-sm aspect-square text-sm">
      E
    </span>
  ),
  Cover: ({ url }: { url: string }) => (
    <img
      src={url}
      className="h-12 aspect-square rounded-sm mr-2 bg-neutral-600"
      width={48}
      height={48}
    />
  ),
  ArrowBtn: ({ up, onClick }: { up?: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex-1 w-6 text-lg text-spotify-200 hover:text-spotify-100 hover:scale-150 transition-all"
    >
      <i className={`fi fi-rr-arrow-alt-square-${up ? "up" : "down"}`} />
    </button>
  ),
  Duration: ({ dur }: { dur: number }) => (
    <div className="flex flex-col items-end justify-center">
      <span className="text-spotify-200 text-xs">{formatMsDuration(dur)}</span>
    </div>
  ),
};
