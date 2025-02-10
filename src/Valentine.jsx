import { useState, useEffect, useRef } from "react";
import "./valentine.scss";
import Background from "./preview.jpg";

// Import images directly for better path resolution
import img1 from './PIC/1.JPG';
import img2 from './PIC/2.JPG';
import img3 from './PIC/3.JPG';
import img4 from './PIC/4.JPG';
import img5 from './PIC/5.JPG';
import img6 from './PIC/6.JPG';
import img7 from './PIC/7.JPG';
import img8 from './PIC/8.JPG';
import img9 from './PIC/9.JPG';

export default function ValentineApp() {
  const [message, setMessage] = useState("Will you be my Valentine?");
  const [noButtonStyle, setNoButtonStyle] = useState({});
  const [showImages, setShowImages] = useState(false);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);

  const handleYesClick = () => {
    setMessage("Yay! ❤️ You made my day!");
    setShowImages(true);
    initializeImages();
  };

  const handleNoHover = () => {
    const randomX = Math.floor(Math.random() * 200) - 100;
    const randomY = Math.floor(Math.random() * 200) - 100;
    setNoButtonStyle({
      transform: `translate(${randomX}px, ${randomY}px)`,
    });
  };

  const handleYesHover = () => {
    setNoButtonStyle({
      transform: "translate(0, 0)",
    });
  };

  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

  function ImageShape(x, y, velX, velY, imageSrc, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.image = new Image();
    this.size = size;
    this.loaded = false;

    this.image.onload = () => {
      this.loaded = true;
    };

    this.image.onerror = () => {
      console.error(`Failed to load image: ${imageSrc}`);
    };

    this.image.src = imageSrc;
  }

  ImageShape.prototype.draw = function (ctx) {
    if (this.loaded) {
      ctx.save(); // Save the current state
      ctx.beginPath();
      ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, 0, Math.PI * 2); // Draw a circle
      ctx.closePath();
      ctx.clip(); // Clip to the circle path
      ctx.drawImage(this.image, this.x, this.y, this.size, this.size); // Draw the image
      ctx.restore(); // Restore to the original state
    }
  };

  ImageShape.prototype.update = function (width, height) {
    if ((this.x + this.size) >= width || this.x <= 0) this.velX = -this.velX;
    if ((this.y + this.size) >= height || this.y <= 0) this.velY = -this.velY;
    this.x += this.velX;
    this.y += this.velY;
  };

  const initializeImages = () => {
    const imageSources = [img1, img2, img3, img4, img5, img6, img7, img8, img9];
    const imageSize = 100;
    let imageShapes = [];

    for (let i = 0; i < imageSources.length; i++) {
      const size = random(300, 250);
      const img = new ImageShape(
        random(0, window.innerWidth - size),
        random(0, window.innerHeight - size),
        random(-5, 5),
        random(-5, 5),
        imageSources[i],
        size
      );
      imageShapes.push(img);
    }

    setImages(imageShapes);
  };

  useEffect(() => {
    if (showImages) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        images.forEach((img) => {
          img.draw(ctx);
          img.update(canvas.width, canvas.height);
        });
        requestAnimationFrame(animate);
      };

      animate();
    }
  }, [showImages, images]);

  return (
    <div className="container">
      {showImages && <h1 className="love-message">I LOVE YOU BOO 😍</h1>}
      {showImages ? (
        <canvas ref={canvasRef} style={{ display: 'block' }} />
      ) : (
        <>
          <h1 className="message">{message}</h1>
          <div className="button-group">
            <button onClick={handleYesClick} onMouseEnter={handleYesHover} className="button yes">
              Yes
            </button>
            <button onMouseEnter={handleNoHover} style={noButtonStyle} className="button no">
              No
            </button>
          </div>
        </>
      )}
    </div>
  );
}