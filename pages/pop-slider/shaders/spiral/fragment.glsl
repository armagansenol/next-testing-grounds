#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform vec3 primary_color;
uniform vec3 secondary_color;

uniform float ripple_base_size;
uniform float ripples_number;
uniform float ripple_width;
uniform float ripple_bleed;
uniform float center_clear_area;
uniform float speed_factor;
uniform float direction;

varying vec4 texCoords;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform sampler2D mytexture;

void main() {
    vec2 uv = vUv;
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st = st * 2.0 - 0.5;
    vec2 mouseRatio = vec2(u_mouse.xy) / vec2(u_resolution.xy);
    vec2 dMouse = abs(vec2(0.5) - mouseRatio);

   //setting center and placement:

    float pct = pow(distance(sin(st) * 2.0, vec2(sin(1.0))), (abs(1.0 - dMouse.y) / abs(1.0 - dMouse.x)) * 2.0);

 //setting repetitional pattern:

    float ripple_size = ripple_base_size; //width of a single ripple
    float whole_size = 40.; //overall size of the pattern

    float d = length(direction * /*pct- direction-*/(u_time * (speed_factor * 0.01))); //distance from center

    vec3 ripples = vec3(smoothstep(ripple_size, ripple_size + ripple_bleed, mod(((uv.y * ripples_number) + d) * ripples_number, 1.)));
    /*vec3( step(pct,whole_size))-
    vec3(smoothstep(ripple_size,ripple_size+ ripple_bleed, fract(d * ripples_number)))* //dark rings
    vec3(smoothstep(ripple_size,ripple_size+ ripple_bleed, fract(d * ripples_number * 2.))); */

    vec3 levels = ripples;
//inverting b/w
    vec3 bgColor = secondary_color;
    vec3 levels_invert = vec3(1.0) - levels;
    vec3 color = (levels_invert * bgColor) + (primary_color * levels);
    vec3 finalColor = color;
//write a function converting hexadecimal colors to d
//setting final frag shade:
    gl_FragColor = vec4(finalColor, 1.0);
}