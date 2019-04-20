import Siema from './src/siema';

test('Transforms markup as expected', () => {
  // Set up our document body
  document.body.innerHTML =
    `<ul class="slides" data-component="hi-there">
      <li>Hello</li>
      <li>World</li>
    </ul>`;

  const expected = '<div style="width: 0px; webkit-transition: all 200ms ease-out; transition: all 200ms ease-out; transform: translate3d(0px, 0, 0);"><div style="float: left; width: 50%;"><li>Hello</li></div><div style="float: left; width: 50%;"><li>World</li></div></div>';

  const slides = document.querySelector('.slides');

  const carousel = new Siema({
    selector: slides,
  });

  expect(carousel.currentSlide).toEqual(0);
  expect(carousel.innerElements.length).toEqual(2);
  expect(slides.innerHTML).toEqual(expected);
  expect(slides.dataset.component).toEqual('hi-there');
  expect(slides.getAttribute('data-component')).toEqual('hi-there');
});
