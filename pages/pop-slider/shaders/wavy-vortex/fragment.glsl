precision highp float;

const float PI = 3.14159265358979323846264;
const float TWOPI = PI * 2.0;

const vec4 WHITE = vec4(1.0, 1.0, 1.0, 1.0);
const vec4 BLACK = vec4(0.0, 0.4588, 0.8078, 1.0);

const vec2 CENTER = vec2(0.0, 0.0);

const int MAX_RINGS = 100;

uniform vec4 color;
uniform float time;
uniform float width;
uniform float height;
uniform float ringDistance;
uniform int maxRings;
uniform float waveCount;
uniform float waveDepth;
uniform float yCenter;
uniform float direction;

void main(void) {
    float rot = time;
    float vmin = min(width, height);
    vec2 position = vec2(-(width / 2.0) + gl_FragCoord.x, -(height / 2.0) + gl_FragCoord.y) / (vmin / 2.0);
    float x = position.x;
    float y = position.y;

    bool white = false;
    float prevRingDist = ringDistance;
    for(int i = 0; i < MAX_RINGS; i++) {
        vec2 center = vec2(0.0, yCenter - ringDistance * float(i) * direction);
        float radius = 0.5 + ringDistance / (pow(float(i + 5), 1.1) * 0.006);
        float dist = distance(center, position);
        dist = pow(dist, 1.0 / 3.0);
        float ringDist = abs(dist - radius);
        if(ringDist < ringDistance * prevRingDist * 7.0) {
            float angle = atan(y - center.y, x - center.x);
            float thickness = 1.2 * abs(dist - radius) / prevRingDist;
            float depthFactor = waveDepth * sin((angle + rot * radius) * waveCount);
            if(dist > radius) {
                white = (thickness < ringDistance * 5.0 - depthFactor * 2.0);
            } else {
                white = (thickness < ringDistance * 5.0 + depthFactor);
            }
            break;
        }
        if(dist > radius || i >= maxRings)
            break;
        prevRingDist = ringDist;
    }

    gl_FragColor = white ? color : WHITE;
}