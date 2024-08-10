import { useControls } from "leva"

function ModelControls() {
  const modelOptions = useControls({
    metalness: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    roughness: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    transmission: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    ior: {
      value: 1.5,
      min: 1,
      max: 3,
      step: 0.01,
    },
    reflectivity: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    thickness: {
      value: 5.8,
      min: 0.1,
      max: 10,
      step: 0.1,
    },
    envMapIntensity: {
      value: 2.5,
      min: 0,
      max: 5,
      step: 0.1,
    },
    clearcoat: {
      value: 0.36,
      min: 0,
      max: 1,
      step: 0.01,
    },
    clearcoatRoughness: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
  })

  return modelOptions // The controls are automatically rendered by Leva
}

export default ModelControls
