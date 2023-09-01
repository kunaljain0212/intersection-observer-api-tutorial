import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isInitialCall, setIsInitialCall] = useState(true);
  const loadingRef = useRef(null);

  const fetchImages = async () => {
    const response = await fetch(
      `https://api.unsplash.com/photos?page=${page}&&per_page=10&&client_id=mNWyX3YH8mMSq4XVja87Vlf1AUipq21-PQRPNn3bgs4`
    );
    const data = await response.json();
    setIsInitialCall(false);
    setImages((images) => [...images, ...data]);
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  useEffect(() => {
    if (!loadingRef.current) return;

    const loading = loadingRef.current;

    const loadingObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInitialCall) {
          setPage((page) => page + 1);
        }
      },
      { threshold: 1 }
    );

    loadingObserver.observe(loading);

    return () => {
      if (loading) loadingObserver.unobserve(loading);
    };
  }, [images]);

  return (
    <div className="App">
      <h1>Infinite Scroll</h1>
      <div className="image-container">
        {images.map((image, index) => {
          return (
            <div key={index} className="image">
              <img
                height={400}
                src={image.urls.regular}
                alt={image.alt_description}
              />
            </div>
          );
        })}
      </div>
      <div ref={loadingRef}>Loading...</div>
    </div>
  );
}

export default App;
