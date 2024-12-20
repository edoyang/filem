import { useState } from "react";

const useNavigateLink = (threshold = 10) => {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isClickAllowed, setIsClickAllowed] = useState(true);

  const handleMouseDown = (event) => {
    setStartPos({ x: event.clientX, y: event.clientY });
    setIsClickAllowed(true); // Reset click allowance
  };

  const handleMouseMove = (event) => {
    const moveX = Math.abs(event.clientX - startPos.x);
    const moveY = Math.abs(event.clientY - startPos.y);
    if (moveX > threshold || moveY > threshold) {
      setIsClickAllowed(false); // Disallow click if movement exceeds threshold
    }
  };

  const handleMouseUp = (navigateFn, id) => {
    if (isClickAllowed) {
      navigateFn(`/movie/${id}`); // Navigate to the movie page
    }
  };

  return { handleMouseDown, handleMouseMove, handleMouseUp };
};

export default useNavigateLink;
