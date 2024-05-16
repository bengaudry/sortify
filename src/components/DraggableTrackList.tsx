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
      activationConstraint: { delay: 100, distance: 0 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
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
            const newPos = over.id as number;

            console.log("active, over: ", active.id, over.id);

            return arrayMove(
              items as PlaylistTrackObject[],
              originalPos - 1,
              newPos - 1
            );
          });
        }}
      >
        <div className="flex flex-col pb-8 w-full">
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
    useSortable({ id: idx + 1 });

  const { album, explicit, artists, duration_ms, name, external_urls } = track;

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="button"
      tabIndex={0}
      aria-roledescription="draggable"
      aria-describedby={`DndContext-${idx}`}
      className="flex flex-row justify-between gap-2 py-2 select-none hover:cursor-default"
    >
      <div className="flex flex-row items-center">
        <span className="text-white/50 w-4 text-right">{idx + 1}</span>
        <C.Cover
          imgurl={album.images[0].url}
          spotifyurl={external_urls.spotify}
        />
        <div className="ml-2 flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-spotify-200 text-sm">
            {explicit && <C.ExplicitContent />}
            {artists.map((artist, idx) => {
              if (idx === artists.length - 1) return artist.name;
              return artist.name + ", ";
            })}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <C.Duration dur={duration_ms} />
        <div className="flex flex-col sm:flex-row md:flex-row-reverse ml-2">
          <C.ArrowBtn onClick={onup} up />
          <C.ArrowBtn onClick={ondown} />
        </div>
        {process.env.NODE_ENV === "development" && (
          <i
            className="fi fi-rr-menu-burger h-full flex items-center justify-end pl-2 pr-6 text-spotify-200 active:cursor-move"
            {...attributes}
            {...listeners}
          />
        )}
      </div>
    </div>
  );
}

const C = {
  ExplicitContent: () => (
    <span className="inline-grid place-content-center h-4 text-medium bg-spotify-200/50 text-spotify-900 font-semibold mr-1 rounded-sm aspect-square text-sm">
      E
    </span>
  ),
  Cover: ({ imgurl, spotifyurl }: { imgurl: string; spotifyurl: string }) => (
    <a className="relative w-fit block ml-2" target="_blank" href={spotifyurl}>
      <div className="absolute w-full h-full grid place-content-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
        <img
          src="/Spotify_Icon_RGB_White.png"
          width={28}
          height={28}
          className="aspect-square w-7"
        />
      </div>
      <img
        src={imgurl}
        className="h-12 aspect-square rounded-sm bg-neutral-600"
        width={48}
        height={48}
      />
    </a>
  ),
  ArrowBtn: ({ up, onClick }: { up?: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex-1 w-6 md:w-8 text-lg text-spotify-100/50 hover:text-spotify-100 transition-colors"
    >
      <i
        className={`fi fi-rr-arrow-alt-square-${
          up ? "up" : "down"
        } md:text-2xl translate-y-0.5`}
      />
    </button>
  ),
  Duration: ({ dur }: { dur: number }) => (
    <div className="flex flex-col items-end justify-center">
      <span className="text-spotify-200 text-xs">{formatMsDuration(dur)}</span>
    </div>
  ),
};
