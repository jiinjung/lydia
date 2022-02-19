import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
// Debug
const debugObject = {}
const gui = new dat.GUI({
    width: 300
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Material
 */
debugObject.surfaceColor = "#e1dae2"
const material = new THREE.MeshPhongMaterial({color: debugObject.surfaceColor })

gui
    .addColor(debugObject, 'surfaceColor')
    .onChange(()=>
    {
        material.color.set(debugObject.surfaceColor)
    })
    .name('Lydia color')

material.shininess = 60
gui.add(material, 'shininess').min(0).max(1000).step(0.1).name('Lydia shininess')


debugObject.specularColor = "#09060e"
material.specular.set(debugObject.specularColor)
gui
    .addColor(debugObject, 'specularColor')
    .onChange(()=>
    {
        material.specular.set(debugObject.specularColor)
    })
    .name('Lydia specular color')

debugObject.emissiveColor = "#110713"
material.emissive.set(debugObject.emissiveColor)
gui
    .addColor(debugObject, 'emissiveColor')
    .onChange(()=>
    {
        material.emissive.set(debugObject.emissiveColor)
    })
    .name('Lydia emissive color')

let Lydia
gltfLoader.load(
    '/models/Lydia.glb',
    (gltf) =>
    {
        Lydia = gltf.scene
        Lydia.scale.set(1, 1, 1)
        Lydia.children[0].material = material
        Lydia.children[0].castShadow = true
        scene.add(Lydia)
    }
)

/**
 * Box
 */
 const boxGeometry = new THREE.BoxGeometry(3.8, 1, 3.8)
 const box = new THREE.Mesh( boxGeometry, material );
 box.receiveShadow = true
 box.position.y = -1.8
 box.position.z = 0.3

 scene.add( box );
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(- 4, 5, -1)
scene.add(directionalLight)

debugObject.directionalLightColor = 0xffffff
gui
    .addColor(debugObject, 'directionalLightColor')
    .onChange(()=>
    {
        directionalLight.color.set(debugObject.directionalLightColor)
    })
    .name('directional light color')

gui.add(directionalLight, 'intensity').min(0).max(1).step(0.01).name('directional light intensity')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 0.1, 100)
camera.position.set(3, 2, -3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0, 0)
controls.enableDamping = true
controls.minDistance = 3;
controls.maxDistance = 20;
controls.maxPolarAngle = Math.PI / 2;


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Background 
debugObject.backgroundColor = "#544d56"
renderer.setClearColor(debugObject.backgroundColor)
gui
    .addColor(debugObject, 'backgroundColor')
    .onChange(() =>
    {
        renderer.setClearColor(debugObject.backgroundColor)
    })
    .name('background color')

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // directionalLight.position.z = Math.cos(elapsedTime)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()