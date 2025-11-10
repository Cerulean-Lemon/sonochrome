/* =========================
   Water Effect with Three.js
   ========================= */
function initWaterEffect() {
  const container = document.getElementById("water-container");
  if (!container) return; // 컨테이너 없으면 종료

  const simScale = 0.5;
  const waveSpeed = 0.8;
  const damping = 0.97;
  const rippleSize = 15;

  const textCanvas = document.createElement("canvas");
  const textCtx = textCanvas.getContext("2d");

  const fontSize = window.innerWidth > 767 ? 120 : 64;
  const text = "SonoChrome";

  textCtx.font = `800 ${fontSize}px 'Playfair Display', serif`;
  const metrics = textCtx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize * 1.4;

  textCanvas.width = textWidth;
  textCanvas.height = textHeight;

  textCtx.fillStyle = "#1a1a1a";
  textCtx.font = `800 ${fontSize}px 'Playfair Display', serif`;
  textCtx.textBaseline = "middle";
  textCtx.fillText(text, 0, textHeight / 2);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(textWidth, textHeight);
  container.appendChild(renderer.domElement);

  const resolution = new THREE.Vector2(
    Math.max(1, Math.floor(textWidth * simScale)),
    Math.max(1, Math.floor(textHeight * simScale))
  );

  let renderTargetA = new THREE.WebGLRenderTarget(resolution.x, resolution.y, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  });
  let renderTargetB = renderTargetA.clone();

  const textTexture = new THREE.CanvasTexture(textCanvas);
  textTexture.needsUpdate = true;

  const simMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: null },
      uResolution: { value: resolution },
      uMouse: { value: new THREE.Vector3(-1, -1, 0) },
      uDelta: { value: waveSpeed },
      uDamping: { value: damping },
      uRippleSize: { value: rippleSize },
    },
    vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            uniform sampler2D uTexture;
            uniform vec2 uResolution;
            uniform vec3 uMouse;
            uniform float uDelta;
            uniform float uDamping;
            uniform float uRippleSize;
            varying vec2 vUv;

            void main() {
                vec2 texel = 1.0 / uResolution;
                vec2 coord = vUv;
                vec4 data = texture2D(uTexture, coord);

                float pressure = data.x;
                float velocity = data.y;

                float p_right = texture2D(uTexture, coord + vec2(texel.x, 0.0)).x;
                float p_left  = texture2D(uTexture, coord - vec2(texel.x, 0.0)).x;
                float p_up    = texture2D(uTexture, coord + vec2(0.0, texel.y)).x;
                float p_down  = texture2D(uTexture, coord - vec2(0.0, texel.y)).x;

                if (coord.x < texel.x) p_left = p_right;
                if (coord.x > 1.0 - texel.x) p_right = p_left;
                if (coord.y < texel.y) p_down = p_up;
                if (coord.y > 1.0 - texel.y) p_up = p_down;

                velocity += uDelta * (-2.0 * pressure + p_right + p_left) / 3.0;
                velocity += uDelta * (-2.0 * pressure + p_up + p_down) / 3.0;
                pressure += uDelta * velocity * 1.2;
                velocity -= 0.001 * uDelta * pressure;
                velocity *= 1.0 - 0.005 * uDelta;
                pressure *= uDamping;

                float gradX = (p_right - p_left) / 2.0;
                float gradY = (p_up - p_down) / 2.0;

                gl_FragColor = vec4(pressure, velocity, gradX, gradY);

                if (uMouse.z > 0.5) {
                    float dist = distance(coord * uResolution, uMouse.xy);
                    if (dist <= uRippleSize) {
                        gl_FragColor.x += (1.0 - dist / uRippleSize) * 0.8;
                    }
                }
            }
        `,
  });

  const displayMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: null },
      uContentTexture: { value: textTexture },
    },
    transparent: true,
    vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            uniform sampler2D uTexture;
            uniform sampler2D uContentTexture;
            varying vec2 vUv;

            void main() {
                vec4 data = texture2D(uTexture, vUv);
                vec2 distortion = data.zw * 0.15;

                vec2 distortedUV = vUv + distortion;
                vec4 content = texture2D(uContentTexture, distortedUV);

                gl_FragColor = content;
            }
        `,
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const simMesh = new THREE.Mesh(geometry, simMaterial);
  const displayMesh = new THREE.Mesh(geometry, displayMaterial);

  let currentTarget = renderTargetA;
  let previousTarget = renderTargetB;

  const mouse = new THREE.Vector2(-1, -1);
  const prevMouse = new THREE.Vector2(-1, -1);
  let isMouseActive = false;

  function updateMouseFromEvent(ev) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = (ev.clientX - rect.left) * simScale;
    mouse.y = (rect.height - (ev.clientY - rect.top)) * simScale;
  }

  renderer.domElement.addEventListener(
    "mouseenter",
    () => (isMouseActive = true)
  );
  renderer.domElement.addEventListener(
    "mouseleave",
    () => (isMouseActive = false)
  );
  renderer.domElement.addEventListener("mousemove", (e) => {
    isMouseActive = true;
    updateMouseFromEvent(e);
  });

  const sceneAdd = (mesh) => {
    scene.add(mesh);
    renderer.render(scene, camera);
    scene.remove(mesh);
  };

  function animate() {
    requestAnimationFrame(animate);

    const mouseMoved =
      Math.abs(mouse.x - prevMouse.x) > 0.5 ||
      Math.abs(mouse.y - prevMouse.y) > 0.5;

    simMaterial.uniforms.uTexture.value = previousTarget.texture;
    simMaterial.uniforms.uMouse.value.set(
      mouse.x,
      mouse.y,
      isMouseActive && mouseMoved ? 1 : 0
    );

    renderer.setRenderTarget(currentTarget);
    sceneAdd(simMesh);

    displayMaterial.uniforms.uTexture.value = currentTarget.texture;
    renderer.setRenderTarget(null);
    sceneAdd(displayMesh);

    [currentTarget, previousTarget] = [previousTarget, currentTarget];
    prevMouse.copy(mouse);
  }

  animate();

  gsap.fromTo(
    container,
    { opacity: 0, y: 10 },
    { opacity: 1, y: -10, duration: 1.2, ease: "power2.out" }
  );
}
