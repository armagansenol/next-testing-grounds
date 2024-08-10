import * as THREE from "three"
import vertexShader from "./vertex.glsl"
import fragmentShader from "./fragment.glsl"

export const shaderOptions = {
  duration: 1.5,
  debug: true,
  easing: "easeOut",
  uniforms: {
    time: 0.0,
    progress: 0.0,
    width: 0.5,
    scaleX: 40.0,
    scaleY: 40.0,
    texture1: null,
    texture2: null,
    displacement: null,
    resolution: new THREE.Vector4(),
  },
  vertex: vertexShader,
  fragment: fragmentShader,
}
