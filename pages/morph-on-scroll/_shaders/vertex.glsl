attribute vec3 position;
attribute vec3 secPosition;
attribute vec3 thirdPosition;
attribute vec3 forthPosition;
attribute vec3 fivePosition;
uniform float u_sec1;
uniform float u_sec2;
uniform float u_sec3;
uniform float u_sec4;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec3 vColor;

void main() {
  vec3 toTorus = mix(position, secPosition, u_sec1);
  vec3 toTorusKnot = mix(toTorus, thirdPosition, u_sec2);
  vec3 toCylinder = mix(toTorusKnot, forthPosition, u_sec3);
  vec3 finalPos = mix(toCylinder, fivePosition, u_sec4);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
  gl_PointSize = 3.0;

  // Calculate the distance from the origin
  float distance = length(finalPos);

  // Define colors
  vec3 orange = vec3(0.941, 0.365, 0.129); // #F05D21
  vec3 black = vec3(0.0, 0.0, 0.0);

  // Mix orange and black based on distance
  vColor = mix(black, orange, distance);
}