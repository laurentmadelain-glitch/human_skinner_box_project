const ResponseKeyManager = (() => {
  const keyPositions = {};

  const getCircularPositions = (cx, cy, radius) => {
    const positions = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const x = cx + radius * Math.cos(angle) - 10;
      const y = cy + radius * Math.sin(angle) - 10;
      positions.push({ x, y });
    }
    return positions;
  };

  const drawKeys = (container) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const radius = Math.min(width, height) / 8;

    const keys = [
      { id: 'left', x: width / 6, y: height / 3 },
      { id: 'center', x: width / 2, y: height / 3 },
      { id: 'right', x: (5 * width) / 6, y: height / 3 }
    ];

    keys.forEach(({ id, x, y }) => {
      keyPositions[id] = getCircularPositions(x, y, radius);
      drawKey(container, id, x, y, radius, true);
    });
  };

  const drawKey = (container, id, centerX, centerY, radius, isActive) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'response-key';
    wrapper.id = `response-key-${id}`;
    container.appendChild(wrapper);

    keyPositions[id].forEach(pos => {
      const circle = document.createElement('div');
      circle.className = 'circle';
      circle.style.left = `${pos.x}px`;
      circle.style.top = `${pos.y}px`;
      circle.style.backgroundColor = isActive ? '#ccc' : '#f0f0f0';
      circle.style.border = isActive ? '2px solid #5e5e5e' : '2px solid #ccc';
      wrapper.appendChild(circle);
    });

    const centerDot = document.createElement('div');
    centerDot.className = 'center-dot';
    centerDot.style.left = `${centerX - 7}px`;
    centerDot.style.top = `${centerY - 7}px`;
    centerDot.style.backgroundColor = isActive ? '#ccc' : '#f0f0f0';
    centerDot.style.border = isActive ? '2px solid #5e5e5e' : '2px solid #ccc';
    wrapper.appendChild(centerDot);
  };

  const setActive = (keyId, isActive) => {
    const wrapper = document.getElementById(`response-key-${keyId}`);
    if (!wrapper) return;

    const circles = wrapper.querySelectorAll('.circle');
    const centerDot = wrapper.querySelector('.center-dot');

    circles.forEach(circle => {
      const isOperant = circle.style.zIndex === '3';
      if (!isOperant) {
        circle.style.backgroundColor = isActive ? '#ccc' : '#f0f0f0';
        circle.style.border = isActive ? '2px solid #5e5e5e' : '2px solid #ccc';
      }
    });

    if (centerDot) {
      centerDot.style.backgroundColor = isActive ? '#ccc' : '#f0f0f0';
      centerDot.style.border = isActive ? '2px solid #5e5e5e' : '2px solid #ccc';
    }
  };

  const getPositions = (keyId) => keyPositions[keyId] || [];

  return {
    drawKeys,
    setActive,
    getPositions
  };
})();
