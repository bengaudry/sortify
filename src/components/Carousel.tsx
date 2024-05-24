import { createContext, ReactNode, useContext, useState } from "react";

export type CarouselContext = ReturnType<typeof useCarousel>;

// Default context that is never used
const Context = createContext({
  index: 0,
  setIndex: (index: number) => {},
  nbSlides: 1,
  infiniteLoop: false,
  slideHeight: 0,
  slideWidth: 0,
});

/** Hook to access the carousel context */
export const useCarousel = () => useContext(Context);

/**
 * Calculates the new index based on the offset and the carousel context.
 * @param offset - The offset (-1 to decrement, 1 to increment).
 * @param context - The carousel context (given by useCarousel(), but be careful to store the context in a variable and pass it as an argument instead of using directly useCarousel() in the arguments).
 */
function getNewIndex(offset: -1 | 1, context: CarouselContext) {
  const { index, nbSlides, infiniteLoop } = context;

  if (offset === -1) {
    // decrement
    if (infiniteLoop) {
      return index > 0 ? index - 1 : nbSlides - 1;
    } else return index > 0 ? index - 1 : index;
  }

  // increment
  if (infiniteLoop) {
    return index < nbSlides - 1 ? index + 1 : 0;
  } else return index < nbSlides - 1 ? index + 1 : index;
}

/**
 * Button to move to previous slide in the carousel.
 * @param children - The children nodes.
 * @param [className] - The class name for the button.
 */
export function ButtonBack({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const carousel = useCarousel();
  const { index, setIndex, infiniteLoop } = carousel;
  const decrement = () => setIndex(getNewIndex(-1, carousel));

  return (
    <button
      onClick={decrement}
      disabled={index <= 0 && !infiniteLoop}
      className={className}
    >
      {children}
    </button>
  );
}

/**
 * Button to move to next slide in the carousel.
 * @param children - The children nodes.
 * @param [className] - The class name for the button.
 */
export function ButtonNext({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const carousel = useCarousel();
  const { index, setIndex, nbSlides, infiniteLoop } = carousel;
  const increment = () => setIndex(getNewIndex(+1, carousel));

  return (
    <button
      onClick={increment}
      disabled={index >= nbSlides - 1 && !infiniteLoop}
      className={className}
    >
      {children}
    </button>
  );
}

/**
 * Displays the current index of the carousel and the number of slides (optionnal).
 * @param [props.hideMax] - Whether to hide the maximum number of slides.
 */
export function Index({ hideMax }: { hideMax?: boolean }) {
  const { index, nbSlides } = useCarousel();
  return (
    <span>
      {index + 1}
      {!hideMax && `/${nbSlides}`}
    </span>
  );
}

/**
 * Displays progress dots for the carousel.
 * @param [DotElement] - Custom dot element component.
 */
export function ProgressDots({
  DotElement,
}: {
  DotElement?: ({ isCurrent }: { isCurrent: boolean }) => ReactNode;
}) {
  const { index, setIndex, nbSlides } = useCarousel();

  return (
    <div className="flex flex-row items-center h-3">
      {Array.from({ length: nbSlides }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => setIndex(idx)}
          className={`
            block w-fit h-fit p-1
          `}
        >
          {DotElement ? (
            <DotElement isCurrent={index === idx} />
          ) : (
            <span
              className={`block w-2 p-1 bg-neutral-100 aspect-square rounded-full transition-opacity ${
                index === idx ? "opacity-100" : "opacity-30"
              }`}
            />
          )}
        </button>
      ))}
    </div>
  );
}

const nbAsNatInt: (nb?: number) => number = (nb) =>
  Math.floor(nb && nb > 0 ? nb : 0);

/**
 * Provides the carousel context to its children.
 * @param children - The children nodes.
 * @param nbSlides - The number of slides.
 * @param [defaultIndex] - The default index.
 * @param [infiniteLoop] - Whether the carousel has an infinite loop.
 * @param slideHeight - The height of the slide.
 * @param slideWidth - The width of the slide.
 * @returns The provider element.
 */
export function SliderContextProvider({
  children,
  nbSlides,
  defaultIndex,
  infiniteLoop,
  slideHeight,
  slideWidth,
}: {
  children: ReactNode;
  nbSlides: number;
  defaultIndex?: number;
  infiniteLoop?: boolean;
  slideHeight: number;
  slideWidth: number;
}) {
  const [index, setIndex] = useState(nbAsNatInt(defaultIndex));

  return (
    <Context.Provider
      value={{
        index,
        setIndex,
        nbSlides,
        infiniteLoop: infiniteLoop || false,
        slideHeight,
        slideWidth,
      }}
    >
      {children}
    </Context.Provider>
  );
}

/**
 * Container for the slides in the carousel.
 * @param children - The children nodes.
 * @param [className] - The class name for the container.
 */
export function Slides({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { slideHeight, slideWidth } = useCarousel();

  return (
    <div
      style={{
        minWidth: slideWidth,
        minHeight: slideHeight,
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
      }}
      className={className}
    >
      {children}
    </div>
  );
}

/**
 * Represents a single slide in the carousel.
 * @param index - The index of the slide.
 * @param children - The children nodes.
 * @param [className] - The class name for the slide.
 */
export function Slide({
  index,
  children,
  className,
}: {
  index: number;
  children: ReactNode;
  className?: string;
}) {
  const { nbSlides, ...carousel } = useCarousel();
  const curridx = carousel.index;

  return (
    <div
      style={{
        transform:
          curridx === index
            ? "translateX(0)"
            : index < curridx
            ? "translateX(-100vw)"
            : "translateX(100vw)",
        transition: "transform 300ms ease",
        position: "absolute",
        zIndex: "4",
      }}
      className={className}
    >
      {children}
    </div>
  );
}
