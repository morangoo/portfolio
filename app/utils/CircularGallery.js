import { useRef, useEffect, useState } from 'react'
import { useLang } from '@/app/contexts/LangContext';
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Mesh,
  Program,
  Texture,
} from 'ogl'

function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance)
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance)
    }
  })
}

function createTextTexture(gl, text, font = "bold 30px monospace", color = "black") {
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")
  context.font = font
  const metrics = context.measureText(text)
  const textWidth = Math.ceil(metrics.width)
  const textHeight = Math.ceil(parseInt(font, 10) * 1.2)
  canvas.width = textWidth + 20
  canvas.height = textHeight + 20
  context.font = font
  context.fillStyle = color
  context.textBaseline = "middle"
  context.textAlign = "center"
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillText(text, canvas.width / 2, canvas.height / 2)
  const texture = new Texture(gl, { generateMipmaps: false })
  texture.image = canvas
  return { texture, width: canvas.width, height: canvas.height }
}

class Title {
  constructor({ gl, plane, renderer, text, textColor = "#545050", font = "30px sans-serif" }) {
    autoBind(this)
    this.gl = gl
    this.plane = plane
    this.renderer = renderer
    this.text = text
    this.textColor = textColor
    this.font = font
    this.createMesh()
  }
  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor
    )
    const geometry = new Plane(this.gl)
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      depthTest: false,
      depthWrite: false,
      transparent: false,
    })
    this.mesh = new Mesh(this.gl, { geometry, program })
    const aspect = width / height
    const textHeight = this.plane.scale.y * 0.15
    const textWidth = textHeight * aspect
    this.mesh.scale.set(textWidth, textHeight, 1)
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.05
    this.mesh.setParent(this.plane)
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    id,
    link,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font
  }) {
    this.extra = 0
    this.geometry = geometry
    this.gl = gl
    this.image = image
    this.index = index
    this.length = length
    this.renderer = renderer
    this.scene = scene
    this.screen = screen
    this.text = text
    this.id = id
    this.link = link
    this.isHovered = false;
    this.viewport = viewport
    this.bend = bend
    this.textColor = textColor
    this.borderRadius = borderRadius
    this.font = font
    this.createShader()
    this.createMesh()
    this.createTitle()
    this.onResize()
  }
  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: false })
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        uniform float uHovered;
        varying vec2 vUv;
        
        // Rounded box SDF for UV space
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);

          // GRAYSCALE
          float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          color.rgb = mix(vec3(gray), color.rgb, uHovered);

          // Apply rounded corners (assumes vUv in [0,1])
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          if(d > 0.0) {
            discard;
          }
          
          gl_FragColor = vec4(color.rgb, 1.0);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
        uHovered: { value: 0 },
      },
      transparent: true
    })
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.src = this.image
    img.onload = () => {
      texture.image = img
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight]
    }
  }
  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })
    this.plane.__media = this
    this.plane.setParent(this.scene)
  }
  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      fontFamily: this.font
    })
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x
    const H = this.viewport.width / 2

    if (this.bend === 0) {
      this.plane.position.y = 0
      this.plane.rotation.z = 0
    } else {
      const B_abs = Math.abs(this.bend)
      const R = (H * H + B_abs * B_abs) / (2 * B_abs)
      const effectiveX = Math.min(Math.abs(x), H)

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX)
      if (this.bend > 0) {
        this.plane.position.y = -arc
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R)
      } else {
        this.plane.position.y = arc
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R)
      }
    }

    this.speed = scroll.current - scroll.last
    this.program.uniforms.uTime.value += 0.04
    this.program.uniforms.uSpeed.value = this.speed

    const planeOffset = this.plane.scale.x / 2
    const viewportOffset = this.viewport.width / 2
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal
      this.isBefore = this.isAfter = false
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal
      this.isBefore = this.isAfter = false
    }
  }
  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen
    if (viewport) {
      this.viewport = viewport
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height]
      }
    }
    this.scale = this.screen.height / 1500
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y]
    this.padding = 2
    this.width = this.plane.scale.x + this.padding
    this.widthTotal = this.width * this.length
    this.x = this.width * this.index
  }
}

function getMeshUnderPointer(meshes, gl, camera, mouseX, mouseY) {
  const rect = gl.canvas.getBoundingClientRect()
  const mx = ((mouseX - rect.left) / rect.width) * 2 - 1
  const my = -((mouseY - rect.top) / rect.height) * 2 + 1

  const cameraZ = camera.position.z
  const fov = camera.fov * Math.PI / 180
  const viewHeight = 2 * Math.tan(fov / 2) * cameraZ
  const viewWidth = viewHeight * camera.aspect

  const worldX = mx * viewWidth / 2
  const worldY = my * viewHeight / 2

  for (let media of meshes) {
    const plane = media.plane
    const px = plane.position.x
    const py = plane.position.y
    const w = plane.scale.x
    const h = plane.scale.y
    if (
      worldX >= px - w / 2 &&
      worldX <= px + w / 2 &&
      worldY >= py - h / 2 &&
      worldY <= py + h / 2
    ) {
      return media
    }
  }
  return null
}

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
  }
  createRenderer() {
    this.renderer = new Renderer({ alpha: true })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)
    this.container.appendChild(this.gl.canvas)
  }
  createCamera() {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 20
  }
  createScene() {
    this.scene = new Transform()
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 10,
      widthSegments: 20
    })
  }
  createMedias(items, bend = 1, textColor, borderRadius, font) {
    const defaultItems = [
      { image: `https://picsum.photos/seed/1/800/600?grayscale`, text: 'Bridge' },
      { image: `https://picsum.photos/seed/2/800/600?grayscale`, text: 'Desk Setup' },
      { image: `https://picsum.photos/seed/3/800/600?grayscale`, text: 'Waterfall' },
      { image: `https://picsum.photos/seed/4/800/600?grayscale`, text: 'Strawberries' },
      { image: `https://picsum.photos/seed/5/800/600?grayscale`, text: 'Deep Diving' },
      { image: `https://picsum.photos/seed/16/800/600?grayscale`, text: 'Train Track' },
      { image: `https://picsum.photos/seed/17/800/600?grayscale`, text: 'Santorini' },
      { image: `https://picsum.photos/seed/8/800/600?grayscale`, text: 'Blurry Lights' },
      { image: `https://picsum.photos/seed/9/800/600?grayscale`, text: 'New York' },
      { image: `https://picsum.photos/seed/10/800/600?grayscale`, text: 'Good Boy' },
      { image: `https://picsum.photos/seed/21/800/600?grayscale`, text: 'Coastline' },
      { image: `https://picsum.photos/seed/12/800/600?grayscale`, text: "Palm Trees" }
    ]
    const galleryItems = items && items.length ? items : defaultItems
    // Duplicar mantendo todos os props
    this.galleryItems = galleryItems;
    this.mediasImages = galleryItems.concat(galleryItems).map((item) => ({ ...item }));
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        id: data.id,
        link: data.link,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font
      })
    })
  }
  onTouchDown(e) {
    this.isDown = true
    this.scroll.position = this.scroll.current
    this.start = e.touches ? e.touches[0].clientX : e.clientX
    this.hasMoved = false 
    this.gl.canvas.style.cursor = 'grabbing';
  }
  onTouchMove(e) {
    if (!this.isDown) return
    const x = e.touches ? e.touches[0].clientX : e.clientX
    const distance = (this.start - x) * 0.05
    this.scroll.target = this.scroll.position + distance
    this.hasMoved = true 
  }
  onTouchUp() {
    this.isDown = false
    this.gl.canvas.style.cursor = 'grab';
    this.onCheck()
  }
  onCheck() {
    if (!this.medias || !this.medias[0]) return
    const width = this.medias[0].width
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width)
    const item = width * itemIndex
    this.scroll.target = this.scroll.target < 0 ? -item : item
  }
  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    }
    this.renderer.setSize(this.screen.width, this.screen.height)
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    })
    const fov = (this.camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect
    this.viewport = { width, height }
    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport })
      )
    }
  }
  update() {
    const now = Date.now();
    if (now - this.lastUpdate < 16) { // Limitar para aproximadamente 60fps
      this.raf = window.requestAnimationFrame(this.update.bind(this));
      return;
    }
    this.lastUpdate = now;
  
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }
  onCanvasMouseMove = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    let hovered = null;
    for (let media of this.medias) {
      media.isHovered = false;
      media.program.uniforms.uHovered.value = 0;
    }
    const hit = getMeshUnderPointer(this.medias, this.gl, this.camera, mouseX, mouseY);
    if (hit) {
      hit.isHovered = true;
      hit.program.uniforms.uHovered.value = 1;
      hovered = hit;
      this.gl.canvas.style.cursor = 'pointer';
    } else {
      this.gl.canvas.style.cursor = this.isDown ? 'grabbing' : 'grab';
    }
  };
  onCanvasClick = (e) => {
    if (e.target !== this.gl.canvas || this.hasMoved) return 
  
    const mouseX = e.clientX
    const mouseY = e.clientY
    const hit = getMeshUnderPointer(this.medias, this.gl, this.camera, mouseX, mouseY)
    if (hit) {
      if (hit.link) {
        window.open(hit.link, '_blank')
      } else {
        console.log('No link available for this item.')
      }
    }
  }
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
    window.addEventListener('touchstart', this.boundOnTouchDown)
    window.addEventListener('touchmove', this.boundOnTouchMove)
    window.addEventListener('touchend', this.boundOnTouchUp)
    this.gl.canvas.addEventListener('click', this.boundOnCanvasClick)
    this.gl.canvas.addEventListener('mousemove', this.onCanvasMouseMove.bind(this));
  }
  destroy() {
    window.cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.boundOnResize)
    //window.removeEventListener('mousewheel', this.boundOnWheel)
    //window.removeEventListener('wheel', this.boundOnWheel)
    window.removeEventListener('mousedown', this.boundOnTouchDown)
    window.removeEventListener('mousemove', this.boundOnTouchMove)
    window.removeEventListener('mouseup', this.boundOnTouchUp)
    window.removeEventListener('touchstart', this.boundOnTouchDown)
    window.removeEventListener('touchmove', this.boundOnTouchMove)
    window.removeEventListener('touchend', this.boundOnTouchUp)
    if (this.gl && this.boundOnCanvasClick)
      this.gl.canvas.removeEventListener('click', this.boundOnCanvasClick)
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas)
    }
    this.gl.canvas.removeEventListener('mousemove', this.onCanvasMouseMove);
  }
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = "bold 30px DM Sans"
}) {
  const containerRef = useRef(null)
  const [tooltip, setTooltip] = useState({ visible: false, content: null, x: 0, y: 0 })
  const { language } = useLang();
  // Remove isClient state, useEffect will only run on client
  const [showHint, setShowHint] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const hintTimeoutRef = useRef();
  const appRef = useRef();
  const lastHoveredRef = useRef(null);

  // Remove isClient effect

  // Tooltip helpers
  function showTooltip(content, x, y) {
    setTooltip(prev => {
      if (prev.visible && prev.content === content) {
        return { ...prev, x, y };
      } else {
        return { visible: true, content, x, y };
      }
    });
  }
  function hideTooltip() {
    setTooltip(t => t.visible ? { ...t, visible: false } : t)
  }
  // MouseMove handler always uses latest appRef
  function onMouseMove(e) {
    const app = appRef.current;
    if (!app || !app.medias) return;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const hit = getMeshUnderPointer(app.medias, app.gl, app.camera, mouseX, mouseY);
    if (hit) {
      const origIdx = hit.index % (items?.length || 1);
      if (hit.id !== lastHoveredRef.current) {
        lastHoveredRef.current = hit.id;
        if (items && items[origIdx] && items[origIdx].tooltip) {
          showTooltip(items[origIdx].tooltip, mouseX, mouseY);
        } else {
          hideTooltip();
        }
      } else {
        if (items && items[origIdx] && items[origIdx].tooltip) {
          setTooltip(prev => prev.visible ? { ...prev, x: mouseX, y: mouseY } : prev);
        }
      }
    } else {
      lastHoveredRef.current = null;
      hideTooltip();
    }
  }
  // Hint handlers
  function handleMouseEnter() {
    if (showHint) {
      clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = setTimeout(() => setShowHint(false), 3000);
    }
  }
  function handleMouseDown() {
    setShowHint(false);
  }
  function handleTouchStart() {
    setShowHint(false);
  }
  function handleClick() {
    setShowHint(false);
  }

  useEffect(() => {
    setIsClient(true);
    if (!containerRef.current) return;
    const app = new App(containerRef.current, { items, bend, textColor, borderRadius, font });
    appRef.current = app;
    const canvas = app.gl && app.gl.canvas;
    if (canvas) {
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mouseleave', hideTooltip);
      canvas.addEventListener('mouseenter', handleMouseEnter);
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('touchstart', handleTouchStart);
      canvas.addEventListener('click', handleClick);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseleave', hideTooltip);
        canvas.removeEventListener('mouseenter', handleMouseEnter);
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('click', handleClick);
        clearTimeout(hintTimeoutRef.current);
      }
      if (app) app.destroy();
    };
  }, []);

  return (
    <>
      <div
        className='w-full h-full overflow-hidden cursor-grab active:cursor-grabbing'
        ref={containerRef}
        style={{ position: 'relative', zIndex: 0 }}
      >
        {/* Hint overlay, zIndex baixo, pointerEvents none */}
        {isClient && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              textAlign: 'center',
              fontSize: 22,
              fontWeight: 700,
              color: '#fff',
              zIndex: 2,
              pointerEvents: 'none',
              background: 'none',
              userSelect: 'none',
              textShadow: '0 2px 12px rgba(0,0,0,0.45), 0 1px 0 #222',
              opacity: showHint ? 1 : 0,
              transition: 'opacity 0.5s',
              animation: showHint ? 'cgHintFadeIn 0.7s' : 'cgHintFadeOut 0.5s',
            }}
          >
            {language === 'pt' ? 'Arraste para navegar →' : 'Drag to navigate →'}
            <style>{`
              @keyframes cgHintFadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes cgHintFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
              }
            `}</style>
          </div>
        )}
        {/* Tooltip overlay, zIndex alto */}
        {tooltip.visible && (
          <div
            style={{
              position: 'fixed',
              left: tooltip.x + 16,
              top: tooltip.y + 16,
              zIndex: 9999,
              pointerEvents: 'none',
              background: 'rgba(30,30,30,0.95)',
              color: '#fff',
              borderRadius: 8,
              boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
              fontSize: 15,
              maxWidth: 340,
              minWidth: 80,
              minHeight: 24,
              lineHeight: 1.4,
              transition: 'opacity 0.1s',
              opacity: tooltip.visible ? 1 : 0,
              whiteSpace: 'pre-line',
            }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
    </>
  )
}