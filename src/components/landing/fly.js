// A small element (a value, a record) flown from one box to another along
// an arc, for the hero stages. Positions are measured in the stage's own
// units, so the flight lands right however the page is zoomed. The element
// is styled by `className` and removed when it lands.

export function fly(stage, layer, { className, text, from, to, duration, lift = 70 }) {
  const box = stage.getBoundingClientRect();
  const scale = box.width / stage.offsetWidth || 1;
  const node = document.createElement('span');
  node.className = className;
  node.textContent = text;
  layer.appendChild(node);
  const w = node.offsetWidth;
  const h = node.offsetHeight;
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const x0 = (a.left + a.width / 2 - box.left) / scale - w / 2;
  const y0 = (a.top + a.height / 2 - box.top) / scale - h / 2;
  const x1 = (b.left + b.width / 2 - box.left) / scale - w / 2;
  const y1 = (b.top + b.height / 2 - box.top) / scale - h / 2;
  const mx = x0 + (x1 - x0) * 0.55;
  const my = Math.min(y0, y1) - lift;
  const animation = node.animate(
    [
      { transform: `translate(${x0}px, ${y0}px) scale(0.85)`, opacity: 0 },
      { transform: `translate(${x0}px, ${y0 - 16}px) scale(1.1)`, opacity: 1, offset: 0.16 },
      { transform: `translate(${mx}px, ${my}px) scale(1.14)`, opacity: 1, offset: 0.56 },
      { transform: `translate(${x1}px, ${y1}px) scale(1)`, opacity: 1, offset: 0.9 },
      { transform: `translate(${x1}px, ${y1}px) scale(0.92)`, opacity: 0 },
    ],
    { duration, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' }
  );
  const done = animation.finished.then(
    () => node.remove(),
    () => node.remove()
  );
  return { animation, done };
}
