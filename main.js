//////Dependecies Below on or at the first statement 
// All listed Dependencies should be listed as the very first statements

import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from '/OrbitControls'
import gsap from 'gsap'

// //dat.gui
const gui = new dat.GUI()
const world = {
    plane: {
        width: 700,
        height: 700,
        widthSegments: 70,
        heightSegments: 70
    }
}
//width
gui.add(world.plane, 'width', 1, 1000).
    onChange(generatePlane)

//Height
gui.add(world.plane, 'height', 1, 1000).
    onChange(generatePlane)

//widthSegments
gui.add(world.plane, 'widthSegments', 1, 1000).
    onChange(generatePlane)

//heightSegments
gui.add(world.plane, 'heightSegments', 1, 1000).
    onChange(generatePlane)


//Plane Geometry Creation ---> Initial plane geometry creation
function generatePlane() {
    planeMesh.geometry.dispose()
    planeMesh.geometry = new THREE.PlaneGeometry(
        world.plane.width,
        world.plane.height,
        world.plane.widthSegments,
        world.plane.heightSegments
    )

    //Vertice position randomization
    const { array } = planeMesh.geometry.attributes.position

    const randomValues = []

    for (let i = 0; i < array.length; i++) {

        if (i % 3 === 0) {

            const x = array[i]
            const y = array[i + 1]
            const z = array[i + 2]

            array[i] = x + (Math.random() - 0.5) * 3
            array[i + 1] = y + (Math.random() - 0.5) * 3
            array[i + 2] = z + (Math.random() - 0.5) * 3

        }
        randomValues.push(Math.random() * Math.PI * 2)
    }

    planeMesh.geometry.attributes.position.
        randomValues = randomValues

    planeMesh.geometry.attributes.position.
        originalPosition =
        planeMesh.geometry.attributes.position
            .array
    
    // Color attribute addition { please create originals }(r,b,g all hexadecimal))
    const color = []
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
        color.push(0, 0.19, 0.4)
    }

    planeMesh.geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(new
            Float32Array(color), 3)
    )
}

//Scene
const scene = new THREE.Scene();

// Why are we using raycaster and not postprocessing ?

//Raycaster
const raycaster = new THREE.Raycaster();

//Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(devicePixelRatio) // set pixel Ratio to reduce the distortion of pixels on rotating images
document.body.appendChild(renderer.domElement);

//Orbit Controls
new OrbitControls(camera, renderer.domElement);

//Camera position
camera.position.z = 70

//Geometry
const planeGeometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments) // (width: Float, height: FLoat, widthSegments: Interger, heightSegments: Interger)

/////// The plane Material will be Created every time this page is loaded and or refreshed //////////////////////

//Material
const planeMaterial = new THREE.MeshPhongMaterial({
    color: 'black',
    side: THREE.DoubleSide,
    flatShading: true,
    vertexColors: true
})

//Mesh
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)

//Scene
scene.add(planeMesh)

// What statement is generate plane function on??? ( what line is this statement on)?

// Calling plane Function below 
generatePlane();

///////////////////////////////////////////////////////////////////


//Light
const light = new THREE.DirectionalLight(0xffffff, 1,)
light.position.set(0, 1, 1)
scene.add(light)

//Light
const backLight = new THREE.DirectionalLight(0xffffff, 1,) // Hexidecimal values
backLight.position.set(0, 0, -1)
scene.add(backLight)

//Background Scene (Stars)
const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff
})

// Stars Vertices array
const starVerticies = []
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000
    const y = (Math.random() - 0.5) * 2000
    const z = (Math.random() - 0.5) * 2000
    starVerticies.push(x, y, z)
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVerticies, 3))

// Stars Variable 
const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)

/////////////////////////Ambient lightinng what other lighting options can we utilize 

// please uncomment statements 177-181

//Ambient Lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight)
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// scene.add(directionalLight)

//Initalize mouse variable for eventlistener ( under animate function)
const mouse = {
    x: undefined,
    y: undefined
}


//Animate function(Initalize)
let frame = 0

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    raycaster.setFromCamera(mouse, camera)
    frame += 0.01

    const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position
    // change to For of loop
    for (let i = 0; i < array.length; i += 3) {
        //x
        array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.009
        //y
        array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.009
    }
    planeMesh.geometry.attributes.position.needsUpdate = true


    const intersects = raycaster.intersectObject(planeMesh)
    if (intersects.length > 0) {
        const { color } = intersects[0].object.geometry.attributes


//Setting vertex colors

        //Vertice 1
        color.setX(intersects[0].face.a, 0.1)
        color.setX(intersects[0].face.a, 0.5)
        color.setZ(intersects[0].face.a, 1)
        //Vertice 2
        color.setX(intersects[0].face.b, 0.1)
        color.setY(intersects[0].face.b, 0.5)
        color.setZ(intersects[0].face.b, 1)
        //Vertice 3
        color.setX(intersects[0].face.c, 0.1)
        color.setY(intersects[0].face.c, 0.5)
        color.setZ(intersects[0].face.c, 1)

        intersects[0].object.geometry.
            attributes.color.needsUpdate = true

        const initialColor = {
            r: 0,
            g: .19,
            b: 0.4
        }

        const hoverColor = {
            r: 0.1,
            g: 0.5,
            b: 1
        }

        gsap.to(hoverColor, {
            r: initialColor.r,
            g: initialColor.g,
            b: initialColor.b,
            duration: 0.7,
            onUpdate: () => {
                //Vertice 1
                color.setX(intersects[0].face.a, hoverColor.r)
                color.setX(intersects[0].face.a, hoverColor.g)
                color.setZ(intersects[0].face.a, hoverColor.b)
                //Vertice 2
                color.setX(intersects[0].face.b, hoverColor.r)
                color.setY(intersects[0].face.b, hoverColor.g)
                color.setZ(intersects[0].face.b, hoverColor.b)
                //Vertice 3
                color.setX(intersects[0].face.c, hoverColor.r)
                color.setY(intersects[0].face.c, hoverColor.g)
                color.setZ(intersects[0].face.c, hoverColor.b)
                color.needsUpdate = true
            }
        })
    }
    // stars.rotation.x += 0.0007
}
//Call Animate function

animate(); // what statement is animate() function on??

//Event Listener ( mouse move )
addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    mouse.y = -(event.clientY / innerHeight) * 2 + 1
})

gsap.to('button', {
    opacity: 10,
    duration: 1.5,
    delay: 0,
    y: 0,
    ease: 'expo.inOut'
})

////////// please find out what is this and how it can be utilized and changed accordingly/////
// gsap.to('#mission', {
//     opacity: 10,
//     duration: 4,
//     delay: 10,
//     y: 0,
//     ease: 'expoScale'
// })


///////// '#midiriya' what is this, an ID or a class ????////////
document.querySelector('#midoriya').
    addEventListener('click', (event) => {
        event.preventDefault()
        gsap.to('#container', {
            opacity: 0
        })

        gsap.to(camera.position, {
            z: 25,
            ease: 'power3.inOut',
            duration: 2
        })
        gsap.to(camera.rotation, {
            x: 1.57,
            ease: 'power3.inOut',
            duration: 2
        })

        gsap.to(camera.position, {
            y: 1000,
            ease: 'power3.in',
            duration: 1.5,
            delay: 2,
            onComplete: () => {
                window.location = 'https://www.linkedin.com/in/alvinjohnson144/'
            }

        })
    })

addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
})

