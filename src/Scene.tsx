import * as THREE from 'three'
import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, useTexture, useVideoTexture, Html } from '@react-three/drei';
import ExplosionConfetti from './Confetti'
import { useSpring, animated, easings } from '@react-spring/three'

import TVMedia from "/Audio.mp4"
import CouchModel from "/Couch.glb"
import FloorTexture from "/floor.jpg"
import HeartModel from "/Heart.glb"
import PlantModel from "/Plant.glb"
import PresentModel from "/Present.glb"
import RugModel from "/Rug.glb"
import TableModel from "/Table.glb"

function TV() {
  const texts = [
    "Hi Eri (babi)!",
    "Thanks for coming out to this trip with me ❤️",
    "I really appreciate it :)",
    "It's crazy to think how far we've come.",
    "5 months ago we dreamed of living in NY,",
    "Now look at where we are :)",
    "Long distance has been pretty rough,",
    "And I know I tricked you back into it,",
    "But I think its completely worth it.",
    "Your postcard board is getting so full,",
    "Hope this digital card saves you some space.",
    "Looking forward to all the memories we make,",
    "In the city that never sleeps.",
    "Now enjoy some jazz music!",
    "From Aaron (other babi)",
  ]
  const [index, setIndex] = useState(0)

  const texture = useVideoTexture(TVMedia)
  // Play music when active
  useEffect(() => {
    const audio = new Audio(TVMedia);
    audio.play()
  }, []);

  // Cancel interval
  useEffect(() => {
    console.log(index, texts.length)
    if (index < texts.length + 3) {
      // Scroll effect
      setTimeout(() => {
        setIndex(index + 1)
      }, 2500)
    }
  }, [index])

  return (
    <>
      <mesh position={[0, 1, 2]} rotation={[0, -Math.PI, 0]} >
        <planeGeometry args={[5, 3]} />
        <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
        <Html position={[0, 0, 0]} transform center>
          <div className='text-white -z-10 text-[8px] text-center flex justify-center items-center flex-col'>
            {
              texts.
                filter(
                  (_, i) => (i <= index && i >= index - 2)
                ).map(
                  (v, i) => <span key={"text" + i} className='bg-black bg-opacity-50'>{v}</span>
                )
            }
          </div>
        </Html>
      </mesh >
    </>
  );
}

const BackgroundBG: React.FC<{ active: boolean }> = ({ active }) => {
  const { intensity } = useSpring({
    from: { intensity: 0 },
    to: { intensity: .5 },
    loop: { reverse: true }, // Reverse the animation for up-and-down motion
    config: {
      duration: 1000, easing: easings.easeInOutSine, // Smooth easing function
    }, // Adjust for bounce feel
  });
  return (
    <>
      <ambientLight intensity={1} />
      {
        active &&
        <animated.pointLight color={"red"} position={[0, .5, -.25]} decay={1} castShadow intensity={1} />
      }
      {
        !active &&
        <animated.pointLight color={"yellow"} position={[0, .5, 0]} castShadow intensity={intensity} />
      }
      <spotLight color={"yellow"} position={[10, 10, 10]} angle={.2} penumbra={.5} decay={0} intensity={Math.PI * .15} castShadow />
    </>
  )
}

// Load the model
const Present: React.FC<{
  setActive: any;
  active: boolean;
}> = ({ setActive, active }) => {
  const modelRef = useRef<THREE.Mesh>(null!)
  const [hover, setHover] = useState(false)
  const { scale } = useSpring({ scale: active ? 0 : (hover ? 3 : 2) })
  const { scene } = useGLTF(PresentModel);
  useFrame((_, delta) => {
    modelRef.current.rotation.y += delta
  })

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        //@ts-ignore
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // child.material.color.set('white'); // Change material color to blue
        }
      });
    }
  }, []);

  return <>
    {/* @ts-ignore */}
    <animated.primitive
      position={[0, -.05, 0]}
      rotation-y={-Math.PI / 8}
      castShadow
      ref={modelRef}
      object={scene}
      scale={scale}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}  // Trigger on hover
      onPointerOut={() => setHover(false)}  // Trigger when hover ends
    />
  </>
};

const Heart = () => {
  const { scene } = useGLTF(HeartModel);
  const modelRef = useRef<THREE.Mesh>(null!)
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        //@ts-ignore
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, []);
  const { positionY } = useSpring({
    from: { positionY: .75 },
    to: { positionY: .25 },
    loop: { reverse: true }, // Reverse the animation for up-and-down motion
    config: {
      duration: 750, easing: easings.easeInOutQuad, // Smooth easing function
    }, // Adjust for bounce feel
  });
  const rotationSpring = useSpring({
    from: { rotationY: Math.PI * 3 },
    to: { rotationY: Math.PI },
    config: {
      duration: 750, easing: easings.easeInOutQuad, // Smooth easing function
    }, // Adjust for bounce feel
  });
  const sizeSpring = useSpring({
    from: { size: .0015 },
    to: { size: .003 },
    loop: { reverse: true },
    config: {
      duration: 750, easing: easings.easeInOutQuad, // Smooth easing function
    }, // Adjust for bounce feel
  });


  //@ts-ignore
  return <animated.primitive
    ref={modelRef}
    position-y={positionY}
    rotation-y={rotationSpring.rotationY}
    rotation={[0, -Math.PI, 0]}
    castShadow
    object={scene}
    scale={sizeSpring.size}
    onPointerOver={() => rotationSpring.rotationY.reset()}  // Trigger on hover
  />
}

const Couch = () => {
  const { scene } = useGLTF(CouchModel);
  const modelRef = useRef<THREE.Mesh>(null!)
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        //@ts-ignore
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, []);
  return <group position={[0, -.1, -1.75]} scale={[1, 1, 1]}>
    <primitive ref={modelRef} object={scene} />
  </group>
}

const Table = () => {
  const { scene } = useGLTF(TableModel);
  const modelRef = useRef<THREE.Mesh>(null!)
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        //@ts-ignore
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, []);

  return <group position={[0, -.33, 0]} scale={[1, 1, 1]}>
    <primitive ref={modelRef} object={scene} receiveShadow />
  </group>
}

const Rug = () => {
  const { scene } = useGLTF(RugModel);
  const modelRef = useRef<THREE.Mesh>(null!)
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        //@ts-ignore
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, []);
  return <group position={[2.1, -.5, -1.65]} scale={[10, 2, 12]}>
    <primitive ref={modelRef} object={scene} receiveShadow />
  </group>
}

const Plant = () => {
  const { scene } = useGLTF(PlantModel);
  const modelRef = useRef<THREE.Mesh>(null!)
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        //@ts-ignore
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, []);
  return <group position={[-1.65, -.5, -1.25]} scale={.25}>
    <primitive ref={modelRef} object={scene} />
  </group>
}

const Floor = () => {
  const texture = useTexture(FloorTexture);
  let meshes = []
  const size = 10
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      meshes.push(
        <mesh rotation-x={-Math.PI / 2} position={[r - (size / 2), -.5, c - (size / 2)]} receiveShadow>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial map={texture} />
        </mesh>
      )
    }
  }

  // Adjust the texture repeat to tile it across the floor
  return (
    <>
      {...meshes}
    </>
  );
};

export function Scene() {
  const [active, setActive] = useState(false)

  return <Canvas
    dpr={1}
    shadows
    gl={{ antialias: true }}
    camera={{ position: [0, 3, -5], near: 0.25, fov: 50 }}
    style={{ background: "black" }}
  >
    {/* <axesHelper args={[10]} /> */}

    {/* Interactive items */}
    {active && <>
      <ExplosionConfetti
        shadows
        particleSize={0.1}
        numberOfExplosions={3}
        explosionCount={3}
        spreaAreadRadius={1}
        position={[0, 0, 0]}
        colorsArray={['pink', 'orange', 'red']}
      />
      <Heart />
      <TV />
    </>}
    <Present active={active} setActive={setActive} />

    {/* Decoration items */}
    <Floor />
    <Couch />
    <Table />
    <Rug />
    <Plant />
    <BackgroundBG active={active} />

    <OrbitControls
      zoomSpeed={1}
      minDistance={2}
      maxDistance={6}
      maxPolarAngle={Math.PI / 2.0}
    // minPolarAngle={Math.PI / 3.0}
    />
  </Canvas >
}

