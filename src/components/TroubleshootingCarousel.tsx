import {
  SliderContextProvider,
  Index,
  ButtonBack,
  ButtonNext,
  Slides,
  Slide,
  ProgressDots,
} from "./Carousel";

const ImgSlide = ({
  index,
  src,
  label,
}: {
  index: number;
  src: string;
  label: string;
}) => (
  <Slide index={index}>
    <img src={src} alt="" width={250} />
    <p className="mt-1 text-spotify-200 text-center text-sm">{label}</p>
  </Slide>
);

export function TroubleshootingCarousel() {
  const slides = [
    { src: "/tuto/1.PNG", label: "Go to your playlist" },
    { src: "/tuto/2.PNG", label: "Swipe down to show menu" },
    { src: "/tuto/3.PNG", label: 'Press "Sort" button' },
    { src: "/tuto/4.PNG", label: 'Switch to "Custom order' },
  ];

  return (
    <div className="w-full">
      <SliderContextProvider nbSlides={4} slideWidth={250} slideHeight={570}>
        <div className="flex items-center justify-evenly w-full">
          <ButtonBack className="disabled:opacity-50 disabled:cursor-not-allowed transition-opacity p-3">
            <i className="fi fi-rr-angle-left" />
          </ButtonBack>
          <Slides className="grid place-content-center">
            {slides.map((props, index) => (
              <ImgSlide index={index} {...props} />
            ))}
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
