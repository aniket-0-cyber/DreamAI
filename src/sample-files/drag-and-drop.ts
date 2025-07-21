// src/sample-files/drag-and-drop.ts

export function makeDraggable(element: HTMLElement): void {
    let isDragging = false;
    let offsetX: number, offsetY: number;
  
    element.addEventListener('mousedown', (e: MouseEvent) => {
      isDragging = true;
      offsetX = e.clientX - element.offsetLeft;
      offsetY = e.clientY - element.offsetTop;
      element.style.cursor = 'grabbing';
    });
  
    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (isDragging) {
        element.style.left = `${e.clientX - offsetX}px`;
        element.style.top = `${e.clientY - offsetY}px`;
      }
    });
  
    document.addEventListener('mouseup', () => {
      isDragging = false;
      element.style.cursor = 'grab';
    });
  }
  
  export function makeDroppable(element: HTMLElement, onDrop: (data: string) => void): void {
    element.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault();
    });
  
    element.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault();
      const data = e.dataTransfer?.getData('text/plain');
      if (data) {
        onDrop(data);
      }
    });
  } 