import fragmentShader from "./fragment.glsl"
import vertexShader from "./vertex.glsl"

export const shaderOptions = {
  debug: true,
  uniforms: {
    u_sec1: { type: "f", value: 0.0 },
    u_sec2: { type: "f", value: 0.0 },
    u_sec3: { type: "f", value: 0.0 },
    u_sec4: { type: "f", value: 0.0 },
  },
  vertex: vertexShader,
  fragment: fragmentShader,
}
