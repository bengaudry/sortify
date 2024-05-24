import {
  SliderContextProvider,
  Index,
  ButtonBack,
  ButtonNext,
  Slides,
  Slide,
  ProgressDots,
} from "./Carousel";

export function TroubleshootingCarousel() {
  return (
    <div className="w-full">
      <SliderContextProvider
        nbSlides={4}
        slideWidth={250}
        slideHeight={570}
      >
        <div className="flex items-center justify-evenly w-full">
          <ButtonBack className="disabled:opacity-50 disabled:cursor-not-allowed transition-opacity p-3">
            <i className="fi fi-rr-angle-left" />
          </ButtonBack>
          <Slides className="grid place-content-center">
            <Slide index={0}>
              <img src="/tuto/1.PNG" alt="" width={250} />
              <p className="mt-1 text-spotify-200 text-center text-sm">Go to your playlist</p>
            </Slide>
            <Slide index={1}>
              <img src="/tuto/2.PNG" alt="" width={250} />
              <p className="mt-1 text-spotify-200 text-center text-sm">Swipe down to show menu</p>
            </Slide>
            <Slide index={2}>
              <img src="/tuto/3.PNG" alt="" width={250} />
              <p className="mt-1 text-spotify-200 text-center text-sm">Press "Sort" button</p>
            </Slide>
            <Slide index={3}>
              <img src="/tuto/4.PNG" alt="" width={250} />
              <p className="mt-1 text-spotify-200 text-center text-sm">Switch to "Custom order"</p>
            </Slide>
          </Slides>
          <ButtonNext className="disabled:opacity-50 disabled:cursor-not-allowed p-3">
            <i className="fi fi-rr-angle-right" />
          </ButtonNext>
        </div>
        <div className="grid place-content-center text-center text-spotify-200 gap-1 pt-6">
          <ProgressDots />
          <Index />
        </div>
      </SliderContextProvider>
    </div>
  );
}
