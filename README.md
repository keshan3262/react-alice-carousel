# React Keshan Carousel

![demo gif](https://github.com/keshan3262/react-keshan-carousel/raw/master/source/i/react-alice-carousel.gif)

![demo gif](https://github.com/keshan3262/react-keshan-carousel/raw/master/source/i/react-alice-carousel-demo.gif)

React Keshan Carousel is a React component for building content galleries, content rotators and any React carousels.
It is actually [react-alice-carousel](https://github.com/maxmarinich/react-alice-carousel) with several patches.

## Features of react-keshan-carousel

* Infinite loop
* FadeOut animation
* AutoPlay mode
* Mobile friendly
* Responsive design
* Swipe to slide
* Start index
* Slide to index
* RTL
* Keyboard navigation
* Touch and Drag support
* Custom rendered slides
* Custom animation duration
* Multiple items in the slide
* Show / hide anything (indicators, arrows, slides indexes)

## How to use

```apacheconfig
npm install react-keshan-carousel --save-dev
```

### Style import

```
# SCSS
@import "react-keshan-carousel/lib/keshan-carousel.scss";
```
```
# CSS
@import "react-keshan-carousel/lib/keshan-carousel.css";
```
```
# Webpack
import "react-keshan-carousel/lib/keshan-carousel.css";
```

#### Quick start

```javascript
import React from 'react';
import KeshanCarousel from 'react-keshan-carousel';


const Gallery = () => (
  <KeshanCarousel>
    <img src="/img1" className="yours-custom-class" />
    <img src="/img2" className="yours-custom-class" />
    <img src="/img3" className="yours-custom-class" />
    <img src="/img4" className="yours-custom-class" />
    <img src="/img5" className="yours-custom-class" />
  </KeshanCarousel>
)
```

### Advanced configuration


#### Props
*  `items` : Array, default `[]` - gallery items,  preferable to use this property instead of ` children `

* `duration` : Number, default  `250` - Duration of slides transition (milliseconds)

* `responsive` : Object, default `{}` - Number of items in the slide

  ```js
    {
        0: {
            items: 1
        },
        1024: {
            items: 3
        }
    }
  ```

* `buttonsDisabled` : Boolean, `false` - Disable buttons control

* `dotsDisabled` : Boolean, `false` - Disable dots navigation

* `startIndex` : Number, `0` - The starting index of the carousel

* `slideToIndex` : Number, `0` - Sets the carousel at the specified position

* `swipeDisabled` : Boolean, default `false` - Disable swipe handlers

* `mouseDragEnabled` : Boolean, default `false` - Enable mouse drag animation

* `infinite` : Boolean, default `true` - Disable infinite mode

* `fadeOutAnimation` : Boolean, `false` - Enable fadeout animation. Fired when 1 item is in the slide

* `keysControlDisabled` :  Boolean, default `false` - Disable keys controls (left, right, space)

* `playButtonEnabled` :  Boolean, default `false` - Disable play/pause button

* `autoPlay` : Boolean, default `false` - Set auto play mode

* `autoPlayInterval` : Number, default  `250` - Interval of auto play animation (milliseconds). If specified, a larger value will be taken from comparing this property and the `duration` one

* `autoPlayDirection` : String, default `ltr` - To run auto play in the left direction specify `rtl` value

* `autoPlayActionDisabled` : Boolean, default `false` - If this property is identified as `true` auto play animation will be stopped after clicking user on any gallery button

* `stopAutoPlayOnHover` : Boolean, default `true` - If this property is identified as `false` auto play animation won't stopped on hover

* `showSlideIndex` : Boolean, default `false` - Show slide info

* `onSlideChange` : Function - Fired when the event object is changing / returns event object

* `onSlideChanged` : Function - Fired when the event object was changed / returns event object

  _Both functions return next object_
  ```js
    {
        item: index,   // index of the item`s position
        slide: index   // index of the slide`s position
    }
  ```


### Examples

```javascript
import React from 'react';
import KeshanCarousel from 'react-keshan-carousel';


class Gallery extends React.Component {  
  responsive = {
    0: { items: 1 },
    600: { items: 2 },
    1024: { items: 3 },
  };

  onSlideChange(e) {
    console.log('Item`s position during a change: ', e.item);
    console.log('Slide`s position during a change: ', e.slide);
  };

  onSlideChanged(e) {
    console.log('Item`s position after changes: ', e.item);
    console.log('Slide`s position after changes: ', e.slide);
  };

  galleryItems() {
    return (
      [1, 2, 3, 4, 5].map((item, i) => (
        <div key={`key-${i}`} className="yours-custom-class"><h2>{item}</h2></div>
      ))
    )
  };

  render() {
    const items = this.galleryItems();

    return (
      <KeshanCarousel
        items={items}
        duration={400}
        autoPlay={true}
        startIndex = {1}
        fadeOutAnimation={true}
        mouseDragEnabled={true}
        playButtonEnabled={true}
        autoPlayInterval={2000}
        autoPlayDirection="rtl"
        responsive={this.responsive}
        autoPlayActionDisabled={true}
        onSlideChange={this.onSlideChange}
        onSlideChanged={this.onSlideChanged}
      />
    );
  }
}
```

#### Custom `Prev / Next` buttons, `dots / thumbs` navigation:
* Using -  [_refs_](https://facebook.github.io/react/docs/refs-and-the-dom.html).

```javascript
import React from 'react';
import KeshanCarousel from 'react-keshan-carousel';


class Gallery extends React.Component {  
  items = [1, 2, 3, 4, 5];

  galleryItem = (item, i) => (
    <div key={`key-${i}`} className="yours-custom-class"><h2>{item}</h2></div>
  )

  thumbItem = (item, i) => (
    <li key={i} onClick={() => this.Carousel._onDotClick(i)}>Thumb {item}</li>
  )

  render() {
    const items = this.items.map(this.galleryItem)

    return (
      <div>
        <h3>Navigation</h3>
        <ul>{this.items.map(this.thumbItem)}</ul>
        <button onClick={() => this.Carousel._slidePrev()}>Prev button</button>
        <button onClick={() => this.Carousel._slideNext()}>Next button</button>
        <h3>React Keshan Carousel</h3>

        <KeshanCarousel
          items={items}
          dotsDisabled={true}
          buttonsDisabled={true}
          ref={ el => this.Carousel = el }
        />
      </div>
    );
  }
}
```
* Using [_props_](https://facebook.github.io/react/docs/components-and-props.html)

```javascript
import React from 'react';
import KeshanCarousel from 'react-keshan-carousel';


class Gallery extends React.Component {
  items = [1, 2, 3, 4, 5];
  state = {
    currentIndex: 0,
    responsive: { 1024: { items: 3 }},
    items: this.items.map(this.galleryItem),
  };

  slideTo = (i) => this.setState({ currentIndex: i });

  onSlideChanged = (e) => this.setState({ currentIndex: e.item });

  slideNext = () => this.setState({ currentIndex: this.state.currentIndex + 1 });

  slidePrev = () => this.setState({ currentIndex: this.state.currentIndex - 1 });

  thumbItem = (item, i) => (
    <li key={`key-${i}`} onClick={() => this.slideTo(i)}>Thumb {item}</li>
  );

  galleryItem = (item, i) => (
    <div key={`key-${i}`} className="yours-custom-class"><h2>{item}</h2></div>
  );

  render() {
    const { items, responsive, currentIndex } = this.state
    return (
      <div>
        <h3>Navigation</h3>
        <ul>{this.items.map(this.thumbItem)}</ul>
        <button onClick={() => this.slidePrev()}>Prev button</button>
        <button onClick={() => this.slideNext()}>Next button</button>
        <h3>React Keshan Carousel</h3>

        <KeshanCarousel
          items={items}
          dotsDisabled={true}
          buttonsDisabled={true}
          responsive={responsive}
          slideToIndex={currentIndex}
          onSlideChanged={this.onSlideChanged}
        />
      </div>
    );
  }
}
```

### Build the project locally

#### Clone
```apacheconfig
git clone https://github.com/keshan3262/react-keshan-carousel
cd react-keshan-carousel
```
#### Run

```apacheconfig
npm i
npm start
```

#### License

MIT
