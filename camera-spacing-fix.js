// Keep the first hierarchy layer flush with its intended top position while
// allowing enough space to scroll the final layer comfortably above the bottom
// of the viewport. Layer height is now controlled independently; there is no
// hierarchy-wide zoom or viewport scaling.
(() => {
  if (typeof cameraBounds !== 'function' || typeof applyCamera !== 'function') return;

  cameraBounds = function() {
    const bottomAllowance = 84;
    return {
      min: Math.min(0, height - worldHeight - bottomAllowance),
      max: 0
    };
  };

  if (typeof cameraY === 'number' && cameraY > 0) cameraY = 0;
  applyCamera(false);
})();
