import * as THREE from "three";
import GUI from "lil-gui";

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
  materialColor: "#ccc",
};

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

// Texture
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
gradientTexture.magFilter = THREE.NearestFilter;
// Material
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});
// Meshes
const objectsDistance = 4
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 32), material);

const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 3

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(2, 2, 2);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  aplha: true, // transparent background, by default alpha (aka clearAlpha) is zero
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearAlpha(0.5) // this way we control the alpha on the background

/**
 * Scroll
 */
let scrollY = window.scrollY
window.addEventListener("scroll", () => {
  scrollY = window.scrollY / sizes.height * objectsDistance
  console.log(scrollY)
})

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animate camera
  camera.position.y = - scrollY 

  // Animate meshes
  for(const mesh of sectionMeshes) {
    mesh.rotation.x = elapsedTime * 0.1
    mesh.rotation.y = elapsedTime * 0.12
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
