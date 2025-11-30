import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Stars } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import './NetworkVisualization3D.css';

interface NodeProps {
    position: [number, number, number];
    color: string;
    label: string;
    isActive?: boolean;
}

const AgentNode = ({ position, color, label, isActive }: NodeProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;

            if (isActive || hovered) {
                const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
                meshRef.current.scale.set(scale, scale, scale);
            }
        }
    });

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={isActive || hovered ? 2 : 0.5}
                    wireframe
                />
            </mesh>
            <mesh>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial color={color} opacity={0.8} transparent />
            </mesh>
            <Text
                position={[0, -1.5, 0]}
                fontSize={0.5}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>
        </group>
    );
};

const Connection = ({ start, end, color }: { start: [number, number, number], end: [number, number, number], color: string }) => {
    // Create a curve
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(...start),
        new THREE.Vector3((start[0] + end[0]) / 2, (start[1] + end[1]) / 2 + 1, (start[2] + end[2]) / 2),
        new THREE.Vector3(...end)
    ]);

    return (
        <mesh>
            <tubeGeometry args={[curve, 20, 0.05, 8, false]} />
            <meshStandardMaterial color={color} opacity={0.3} transparent />
        </mesh>
    );
};

const ParticleFlow = ({ start, end, color, delay }: { start: [number, number, number], end: [number, number, number], color: string, delay: number }) => {
    const mesh = useRef<THREE.Mesh>(null);
    const [active, setActive] = useState(false);

    useFrame((state) => {
        if (state.clock.elapsedTime > delay) {
            if (!active) setActive(true);
            if (mesh.current) {
                const t = (state.clock.elapsedTime - delay) % 2 / 2; // 2 second loop

                const curve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(...start),
                    new THREE.Vector3((start[0] + end[0]) / 2, (start[1] + end[1]) / 2 + 1, (start[2] + end[2]) / 2),
                    new THREE.Vector3(...end)
                ]);

                const pos = curve.getPoint(t);
                mesh.current.position.copy(pos);
            }
        }
    });

    if (!active) return null;

    return (
        <mesh ref={mesh}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color={color} />
        </mesh>
    );
};

export const NetworkVisualization3D = () => {
    // Hardcoded positions for the Council
    const nodes = [
        { id: 'query', pos: [0, 0, 0], color: '#ffffff', label: 'User Query' },
        { id: 'analyst', pos: [-4, 2, 0], color: '#4facfe', label: 'Analyst' },
        { id: 'visionary', pos: [0, 4, -2], color: '#38ef7d', label: 'Visionary' },
        { id: 'risk', pos: [4, 2, 0], color: '#ffae00', label: 'Risk Officer' },
        { id: 'chairman', pos: [0, -3, 2], color: '#764ba2', label: 'Chairman' },
    ] as const;

    const connections = [
        { start: 'query', end: 'analyst' },
        { start: 'query', end: 'visionary' },
        { start: 'query', end: 'risk' },
        { start: 'analyst', end: 'chairman' },
        { start: 'visionary', end: 'chairman' },
        { start: 'risk', end: 'chairman' },
    ];

    const getNodePos = (id: string) => nodes.find(n => n.id === id)!.pos as [number, number, number];
    const getNodeColor = (id: string) => nodes.find(n => n.id === id)!.color;

    return (
        <div className="canvas-container">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <color attach="background" args={['#050510']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <OrbitControls autoRotate autoRotateSpeed={0.5} />

                {nodes.map(node => (
                    <AgentNode
                        key={node.id}
                        position={node.pos as [number, number, number]}
                        color={node.color}
                        label={node.label}
                        isActive={true}
                    />
                ))}

                {connections.map((conn, i) => (
                    <group key={i}>
                        <Connection
                            start={getNodePos(conn.start)}
                            end={getNodePos(conn.end)}
                            color={getNodeColor(conn.end)}
                        />
                        <ParticleFlow
                            start={getNodePos(conn.start)}
                            end={getNodePos(conn.end)}
                            color={getNodeColor(conn.end)}
                            delay={i * 0.5}
                        />
                    </group>
                ))}
            </Canvas>
            <div className="overlay-controls">
                <p>Drag to rotate • Scroll to zoom</p>
            </div>
        </div>
    );
};
