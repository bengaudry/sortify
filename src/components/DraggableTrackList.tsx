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
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Dispatch, MouseEventHandler, SetStateAction, useState } from "react";

const formatMsDuration = (duration_ms: number): string => {
  let seconds = Math.floor(duration_ms / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds -= 60 * minutes;
  return `${minutes}m${seconds}s`;
};

export function DraggableTrackList({
  tracksItems,
  setTracksItems,
  moveSong,
}: {
  tracksItems: PlaylistTrackObject[] | undefined;
  setTracksItems: Dispatch<SetStateAction<PlaylistTrackObject[] | undefined>>;
  moveSong: (prevIdx: number, newIdx: number) => void;
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
  const moveSongUp = (startIdx: number) => {
    if (startIdx <= 0) return;
    moveSong(startIdx, startIdx - 1);
  };

  const moveSongDown = (startIdx: number) => {
    if (!tracksItems || startIdx >= tracksItems.length - 1) return;
    moveSong(startIdx, startIdx + 1);
  };

  const moveSongToTop = (startIdx: number) => {
    if (!tracksItems || startIdx <= 0) return;
    moveSong(startIdx, 0);
  };

  const moveSongToBottom = (startIdx: number) => {
    if (!tracksItems || startIdx >= tracksItems.length - 1) return;
    moveSong(startIdx, tracksItems.length);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    console.log("dragend", e);
    const { active, over } = e;
    if (!over || !tracksItems || active.id === over.id) return;

    setTracksItems((items) => {
      const originalPos = (active.id as number) - 1;
      const it = items as PlaylistTrackObject[];
      const newPos =
        over.id === it.length ? it.length - 1 : (over.id as number) - 1;
      moveSong(originalPos, newPos);

      return arrayMove(items as PlaylistTrackObject[], originalPos, newPos);
    });
  };

  const [toolsShown, setToolsShown] = useState(false);
  const [toolBoxTarget, setToolboxTarget] = useState(0);
  const [toolBoxLocation, setToolboxLocation] = useState({ x: 0, y: 0 });

  const useToolbox = (fn: () => void) => {
    setToolsShown(false);
    fn();
  };

  return (
    tracksItems && (
      <DndContext
        autoScroll
        collisionDetection={closestCorners}
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        {toolsShown && (
          <button
            className="fixed inset-0 z-30 w-screen h-screen"
            onClick={() => setToolsShown(false)}
          />
        )}
        <div
          className={`absolute z-40 px-4 bg-spotify-700 shadow-lg shadow-spotify-900/60 rounded-full flex items-center ${
            toolsShown ? "scale-100 opacity-1" : "scale-75 opacity-0"
          } origin-top-right transition-[opacity,transform] duration-150`}
          style={{ top: toolBoxLocation.y, left: toolBoxLocation.x }}
        >
          <C.ArrowBtn
            onClick={() => useToolbox(() => moveSongUp(toolBoxTarget))}
            up
          />
          <C.ArrowBtn
            onClick={() => useToolbox(() => moveSongDown(toolBoxTarget))}
          />
          <C.FullArrowBtn
            onClick={() => useToolbox(() => moveSongToTop(toolBoxTarget))}
            up
          />
          <C.FullArrowBtn
            onClick={() => useToolbox(() => moveSongToBottom(toolBoxTarget))}
          />
          {process.env.NODE_ENV === "development" && (
            <C.DeleteBtn onClick={() => null} />
          )}
        </div>
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
                onToolboxToggle={(e) => {
                  setToolsShown((t) => !t);
                  setToolboxTarget(idx);
                  setToolboxLocation({
                    x: e.clientX - 4 * e.currentTarget.clientWidth,
                    y: e.clientY + 5,
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
  onToolboxToggle,
}: {
  idx: number;
  track: Track;
  onToolboxToggle: MouseEventHandler<HTMLButtonElement>;
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
      <div className="relative flex items-center justify-end">
        <C.Duration dur={duration_ms} />
        <div className="h-full flex flex-col sm:flex-row md:flex-row-reverse">
          <button
            className="h-full w-10 flex items-center justify-center"
            onClick={onToolboxToggle}
          >
            <i className="fi fi-rr-menu-dots-vertical translate-y-0.5 text-spotify-200" />
          </button>
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
      title={`Move song ${up ? "up" : "down"}`}
      className="flex-1 w-8 text-lg text-spotify-100/50 hover:text-spotify-100 h-full px-2 pt-2 pb-1 hover:scale-125 origin-bottom transition-all"
    >
      <i
        className={`fi fi-rr-arrow-alt-square-${
          up ? "up" : "down"
        } text-center translate-y-0.5`}
      />
    </button>
  ),
  FullArrowBtn: ({ up, onClick }: { up?: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      title={`Move song to ${up ? "top" : "bottom"}`}
      className="flex-1 w-8 md:w-8 text-lg text-spotify-100/50 hover:text-spotify-100 h-full px-2 pt-2 pb-1 hover:scale-125 origin-bottom transition-all"
    >
      <i
        className={`fi fi-rr-angle-double-small-${
          up ? "up" : "down"
        } text-2xl text-center translate-y-0.5`}
      />
    </button>
  ),
  DeleteBtn: ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      title="Remove from playlist"
      className="flex-1 w-8 md:w-8 text-lg text-spotify-100/50 hover:text-spotify-100 h-full px-2 pt-2 pb-1 hover:scale-125 origin-bottom transition-all"
    >
      <i className={`fi fi-rr-cross translate-y-0.5 text-center`} />
    </button>
  ),
  Duration: ({ dur }: { dur: number }) => (
    <div className="flex flex-col items-end justify-center">
      <span className="text-spotify-200 text-xs">{formatMsDuration(dur)}</span>
    </div>
  ),
};
