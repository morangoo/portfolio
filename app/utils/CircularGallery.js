import { useRef, useEffect } from 'react'
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Mesh,
  Program,
  Texture,
} from 'ogl'

// ... todas as funções utilitárias (debounce, lerp, etc) e classes (Title, Media, getMeshUnderPointer) permanecem iguais

class App {
  constructor(container, { items, bend, textColor = "#ffffff", borderRadius = 0, font = "bold 30px DM Sans" } = {}) {
    document.documentElement.classList.remove('no-js')
    this.container = container
    this.scroll = { ease: 0.05, current: 0, target: 0, last: 0 }
    this.onCheckDebounce = debounce(this.onCheck, 200)
    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.onResize()
    this.createGeometry()
    this.createMedias(items, bend, textColor, borderRadius, font)
    this.update()
    this.addEventListeners()
    this.isTouch = false // NOVO: flag para diferenciar touch/mouse
  }
  // ...restante código igual...
  onTouchDown(e) {
    this.isDown = true
    this.isTouch = !!e.touches // NOVO: flag para saber se é touch
    this.scroll.position = this.scroll.current
    this.start = e.touches ? e.touches[0].clientX : e.clientX
    this.startY = e.touches ? e.touches[0].clientY : e.clientY // para controlar scroll vertical
    this.hasMoved = false 
    this.gl.canvas.style.cursor = 'grabbing';
    if (e.touches) {
      // Prevenir o scroll da página ao arrastar horizontalmente na galeria
      document.body.style.overflow = 'hidden'
    }
  }
  onTouchMove(e) {
    if (!this.isDown) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    const y = e.touches ? e.touches[0].clientY : e.clientY
    // Em mobile, se mover predominantemente na vertical, deixa o comportamento normal
    if (this.isTouch && Math.abs(this.startY - y) > Math.abs(this.start - x)) {
      this.isDown = false
      document.body.style.overflow = ''
      return
    }
    const distance = (this.start - x) * 0.05
    this.scroll.target = this.scroll.position + distance
    this.hasMoved = true 
    if (e.touches) e.preventDefault() // Evita scroll vertical do browser durante o drag horizontal
  }
  onTouchUp(e) {
    this.isDown = false
    this.gl.canvas.style.cursor = 'grab';
    this.onCheck()
    if (this.isTouch) {
      document.body.style.overflow = ''
      this.isTouch = false
    }
  }
  // ...restante código igual...
  addEventListeners() {
    this.gl.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.destroy();
    });
    this.boundOnResize = debounce(this.onResize.bind(this), 200);
    this.boundOnTouchDown = this.onTouchDown.bind(this)
    this.boundOnTouchMove = this.onTouchMove.bind(this)
    this.boundOnTouchUp = this.onTouchUp.bind(this)
    this.boundOnCanvasClick = this.onCanvasClick.bind(this)
    window.addEventListener('resize', this.boundOnResize)
    window.addEventListener('mousedown', this.boundOnTouchDown)
    window.addEventListener('mousemove', this.boundOnTouchMove)
    window.addEventListener('mouseup', this.boundOnTouchUp)

    // MOBILE EVENTS
    this.gl.canvas.addEventListener('touchstart', this.boundOnTouchDown, { passive: false })
    this.gl.canvas.addEventListener('touchmove', this.boundOnTouchMove, { passive: false })
    this.gl.canvas.addEventListener('touchend', this.boundOnTouchUp, { passive: false })

    this.gl.canvas.addEventListener('click', this.boundOnCanvasClick)
    this.gl.canvas.addEventListener('mousemove', this.onCanvasMouseMove.bind(this));
  }
  destroy() {
    window.cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.boundOnResize)
    window.removeEventListener('mousedown', this.boundOnTouchDown)
    window.removeEventListener('mousemove', this.boundOnTouchMove)
    window.removeEventListener('mouseup', this.boundOnTouchUp)
    // Remover apenas dos listeners do canvas no caso do mobile
    if (this.gl) {
      this.gl.canvas.removeEventListener('touchstart', this.boundOnTouchDown)
      this.gl.canvas.removeEventListener('touchmove', this.boundOnTouchMove)
      this.gl.canvas.removeEventListener('touchend', this.boundOnTouchUp)
      this.gl.canvas.removeEventListener('mousemove', this.onCanvasMouseMove);
      if (this.boundOnCanvasClick)
        this.gl.canvas.removeEventListener('click', this.boundOnCanvasClick)
    }
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas)
    }
    document.body.style.overflow = '' // garantir que não fica preso
  }
}

// ...restante código igual...
export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = "bold 30px DM Sans"
}) {
  const containerRef = useRef(null)
  useEffect(() => {
    const app = new App(containerRef.current, { items, bend, textColor, borderRadius, font })
    return () => {
      app.destroy()
    }
  }, [items, bend, textColor, borderRadius, font])
  return (
    <div
      className='w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none'
      ref={containerRef}
      style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none' }} // bloqueia seleção e scrolling nativo
    />
  )
}