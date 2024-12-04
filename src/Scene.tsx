import * as THREE from 'three'
import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, useTexture, Plane, useVideoTexture } from '@react-three/drei';
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
  const texture = useVideoTexture(TVMedia)
  // Play music when active
  useEffect(() => {
    const audio = new Audio(TVMedia);
    audio.play()
  }, []);
  return (
    <>
      <mesh position={[0, 0, 2]} rotation={[0, -Math.PI, 0]} >
        <planeGeometry args={[5, 3]} /> {/* Adjust size to simulate a TV */}
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </>
  );
}

function BackgroundBG() {
  return (
    <>
      <Plane receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.65, 0]} scale={20}>
        <shadowMaterial opacity={0.4} />
      </Plane>
    </>
  )
}

// Load the model
const Present = () => {
  const modelRef = useRef<THREE.Mesh>(null!)
  const [active, setActive] = useState(false)
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
    {active && <>
      <ExplosionConfetti
        shadows
        particleSize={0.1}
        numberOfExplosions={3}
        spreaAreadRadius={1}
        position={[0, 0, 0]}
        colorsArray={['green', 'blue', 'orange', 'yellow', 'red']}
      />
      <Heart />
      <TV />
    </>}
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

  //@ts-ignore
  return <animated.primitive
    ref={modelRef}
    position-y={positionY}
    rotation={[0, -Math.PI, 0]}
    castShadow
    object={scene}
    scale={.003}
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
  const size = 100
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
  return <Canvas
    dpr={1}
    shadows
    gl={{ antialias: true }}
    camera={{ position: [0, 2, -3], near: 0.25, fov: 50 }}
  >
    <ambientLight intensity={1} />
    <pointLight color={"yellow"} position={[0, .5, 0]} castShadow intensity={.15} />
    <spotLight position={[10, 10, 10]} angle={.2} penumbra={.5} decay={0} intensity={Math.PI * .25} castShadow />
    {/* <axesHelper args={[5]} /> */}

    <Floor />
    <Couch />
    <Table />
    <Present />
    <Rug />
    <Plant />
    <BackgroundBG />

    <OrbitControls
      zoomSpeed={2}
      minDistance={2}
      maxDistance={4}
      maxPolarAngle={Math.PI / 3.0}
      minPolarAngle={Math.PI / 3.0}
    />
  </Canvas >
}

