import { useState } from "react";
import { useNavigate } from "react-router";

const useDraggableLink = (threshold = 10) => {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isClickAllowed, setIsClickAllowed] = useState(true);
  const navigate = useNavigate();

  const onMouseDown = (event) => {
    setStartPos({ x: event.clientX, y: event.clientY });
    setIsClickAllowed(true); // Reset click allowance
  };

  const onMouseMove = (event) => {
    const moveX = Math.abs(event.clientX - startPos.x);
    const moveY = Math.abs(event.clientY - startPos.y);
    if (moveX > threshold || moveY > threshold) {
      setIsClickAllowed(false); // Disallow click if movement exceeds threshold
    }
  };

  const onMouseUp = (id) => {
    if (isClickAllowed) {
      navigate(`/movie/${id}`);
    }
  };

  return { onMouseDown, onMouseMove, onMouseUp };
};

export default useDraggableLink;
