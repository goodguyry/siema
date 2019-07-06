import Siema from './src/siema';

// Private methods
// slideToCurrent(enableTransition)

// Events:
// touchstart
// touchend
// touchmove
// mousedown
// mouseup
// mouseleave
// mousemove
// click

describe('Transforms markup as expected', () => {
  // expectedWidth = (width / perPage) * slides
  test.each([
    [1024, 1, 8192],
    [768, 2, 3072],
    [768, 3, 2048],
  ])(
    'Resized to %s',
    (width, perPage, expectedWidth) => {
      const { window } = global;

      // Set up our document body
      document.body.innerHTML =
        `<ul class="slides">
          <li>Slide One</li>
          <li>Slide Two</li>
          <li>Slide Three</li>
          <li>Slide Four</li>
          <li>Slide Five</li>
          <li>Slide Six</li>
          <li>Slide Seven</li>
          <li>Slide Eight</li>
        </ul>`;

      const expected = `<div style="width: ${expectedWidth}px; webkit-transition: all 200ms ease-out; transition: all 200ms ease-out; transform: translate3d(0px, 0, 0);"><div style="float: left; width: 12.5%;"><li>Slide One</li></div><div style="float: left; width: 12.5%;"><li>Slide Two</li></div><div style="float: left; width: 12.5%;"><li>Slide Three</li></div><div style="float: left; width: 12.5%;"><li>Slide Four</li></div><div style="float: left; width: 12.5%;"><li>Slide Five</li></div><div style="float: left; width: 12.5%;"><li>Slide Six</li></div><div style="float: left; width: 12.5%;"><li>Slide Seven</li></div><div style="float: left; width: 12.5%;"><li>Slide Eight</li></div></div>`;

      const slides = document.querySelector('.slides');

      const carousel = new Siema({
        selector: slides,
        perPage,
      });

      window.resizeTo(width, 800);

      expect(carousel.currentSlide).toEqual(0);
      expect(carousel.innerElements.length).toEqual(8);
      expect(slides.innerHTML).toEqual(expected);

      carousel.destroy(true);
      expect(slides.innerHTML).toEqual('<li>Slide One</li><li>Slide Two</li><li>Slide Three</li><li>Slide Four</li><li>Slide Five</li><li>Slide Six</li><li>Slide Seven</li><li>Slide Eight</li>');
    },
  );
});

describe('Tests class methods', () => {
  const width = 768;
  const perPage = 3;

  const onInit = jest.fn();
  const onChange = jest.fn();

  // Set up our document body
  document.body.innerHTML =
    `<ul class="slides">
      <li>Slide One</li>
      <li>Slide Two</li>
      <li>Slide Three</li>
      <li>Slide Four</li>
      <li>Slide Five</li>
      <li>Slide Six</li>
      <li>Slide Seven</li>
      <li>Slide Eight</li>
    </ul>`;

  const slides = document.querySelector('.slides');

  const carousel = new Siema({
    selector: slides,
    perPage: 3,
    onInit,
    onChange,
  });

  test('Carousel is initialized as expected', () => {
    expect(carousel.currentSlide).toEqual(0);
    expect(carousel.innerElements.length).toEqual(8);
    expect(carousel.selector.firstChild.style.width).toEqual(`${(width / perPage) * 8}px`);
    expect(onInit).toHaveBeenCalled();
  });

  test('`prev` does not move from first slide', () => {
    carousel.prev(3);
    expect(carousel.currentSlide).toEqual(0);
  });

  test('`next` moves the expected number of slides', () => {
    const onNext = jest.fn();

    carousel.next(3, onNext);

    expect(carousel.currentSlide).toEqual(3);
    expect(onNext).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();
  });

  test('`prev` moves the expected number of slides', () => {
    const onPrev = jest.fn();

    carousel.prev(2, onPrev);

    expect(carousel.currentSlide).toEqual(1);
    expect(onPrev).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();
  });

  test('`goTo` moves to the expected slide', () => {
    const onGoTo = jest.fn();

    carousel.goTo(6, onGoTo);

    expect(carousel.currentSlide).toEqual(5);
    expect(onGoTo).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();
  });

  test('`remove` removes the expected slide', () => {
    const onRemove = jest.fn();

    carousel.remove(6, onRemove);

    expect(carousel.currentSlide).toEqual(5);
    expect(carousel.innerElements.length).toEqual(7);
    expect(onRemove).toHaveBeenCalled();
  });

  test('`insert` inserts the expected element', () => {
    const onInsert = jest.fn();
    const li = document.createElement('li');
    li.textContent = 'Slide Seven';

    carousel.insert(li, 6, onInsert);

    expect(carousel.currentSlide).toEqual(5);
    expect(carousel.innerElements.length).toEqual(8);
    expect(onInsert).toHaveBeenCalled();
  });

  test('`prepend` prepends the expected element', () => {
    const onPrepend = jest.fn();
    const li = document.createElement('li');
    li.textContent = 'Slide Zero';

    carousel.prepend(li, onPrepend);

    expect(carousel.currentSlide).toEqual(6);
    expect(carousel.innerElements.length).toEqual(9);
    expect(onPrepend).toHaveBeenCalled();
  });

  test('`append` appends the expected element', () => {
    const onAppend = jest.fn();
    const li = document.createElement('li');
    li.textContent = 'Slide Nine';

    carousel.append(li, onAppend);

    expect(carousel.currentSlide).toEqual(6);
    expect(carousel.innerElements.length).toEqual(10);
    expect(onAppend).toHaveBeenCalled();
  });

  test('Carousel is destroyed as expected', () => {
    const onDestroy = jest.fn();

    carousel.destroy(true, onDestroy);

    expect(slides.innerHTML).toEqual('<li>Slide Zero</li><li>Slide One</li><li>Slide Two</li><li>Slide Three</li><li>Slide Four</li><li>Slide Five</li><li>Slide Six</li><li>Slide Seven</li><li>Slide Eight</li><li>Slide Nine</li>');
    expect(onDestroy).toHaveBeenCalled();
  });
});
