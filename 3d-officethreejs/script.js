const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()
const textureLoader = new THREE.TextureLoader()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Base camera
const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 18
camera.position.y = 10
camera.position.z = 20
scene.add(camera)

// Controls
const controls = new THREE.OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = true
controls.enablePan = false
controls.minDistance = 10
controls.maxDistance = 20
controls.minPolarAngle = Math.PI / 4
controls.maxPolarAngle = Math.PI / 2.25
controls.minAzimuthAngle = - Math.PI / 16 
controls.maxAzimuthAngle = Math.PI / 2

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

// Materials
const bakedTexture = textureLoader.load('https://rawcdn.githack.com/ricardoolivaalonso/ThreeJS-Room01/98fd8d7909308ec03a596928a394bb25ed9239f1/baked.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

const bakedMaterial = new THREE.MeshBasicMaterial({
    map: bakedTexture,
    side: THREE.DoubleSide,
})

//Loader
const loader = new THREE.GLTFLoader()
loader.load('https://rawcdn.githack.com/ricardoolivaalonso/ThreeJS-Room01/98fd8d7909308ec03a596928a394bb25ed9239f1/THREEJS2.glb',
    (gltf) => {
        const model = gltf.scene
        model.traverse( child => child.material = bakedMaterial )
	    scene.position.set(0,-2,0)
        scene.add(model)
    },
    ( xhr ) => {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
    }
)


window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
// Animation
const tick = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()