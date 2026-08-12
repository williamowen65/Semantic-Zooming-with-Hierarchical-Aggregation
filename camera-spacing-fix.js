// Keep the first hierarchy layer flush with its intended top position.
// The camera may scroll upward into deeper levels, but it should never translate
// the entire hierarchy downward and create blank space above the first layer.
(() => {
  if (typeof cameraBounds !== 'function' || typeof applyCamera !== 'function') return;

  cameraBounds = function() {
    const bottomAllowance = 54;
    return {
      min: Math.min(0, height - worldHeight - bottomAllowance),
      max: 0
    };
  };

  if (typeof cameraY === 'number' && cameraY > 0) cameraY = 0;
  applyCamera(false);
})();
