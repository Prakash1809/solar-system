import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import {
  Play,
  Pause,
  RotateCcw,
  Compass,
  Info,
  Eye,
  EyeOff,
  Sparkles,
  Scale,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Sliders,
  Globe,
  Sun as SunIcon,
  Moon as MoonIcon,
  Award,
  BookOpen,
  Code,
  X,
  Zap,
  Layers,
  Menu,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

const CELESTIAL_DATA = [
  {
    id: 'sun',
    name: 'The Sun',
    subtitle: 'Yellow Dwarf Star (G2V)',
    type: 'Star',
    color: '#ffaa00',
    accentColor: '#ff5500',
    radius: 5.2,
    realDiameterKm: 1392700,
    earthDiameterRatio: 109.2,
    distanceAU: 0,
    realDistanceMKm: 0,
    semiMajorAxis: 0,
    eccentricity: 0,
    inclinationDeg: 0,
    axialTiltDeg: 7.25,
    orbitalPeriodDays: 0,
    orbitalPeriodLabel: '230 Million Yrs (Galactic)',
    rotationPeriodLabel: '25.05 Days (Equator)',
    rotationSpeed: 0.004,
    temperatureLabel: '5,500°C (Surface) / 15M°C (Core)',
    moonsCount: 0,
    gravity: '274 m/s² (27.9 g)',
    atmosphere: 'Hydrogen (73%), Helium (25%)',
    description:
      'The heart of our Solar System, containing 99.86% of the entire system’s mass. Driven by nuclear fusion in its core, it radiates electromagnetic energy that sustains life on Earth and governs the gravitational orbits of all planets, dwarf planets, and comets.',
    facts: [
      'Roughly 1.3 million Earths could fit inside the Sun’s volume.',
      'Light from the Sun’s core takes up to 100,000 years to reach the surface, then just 8 minutes 20 seconds to reach Earth.',
      'Solar flares and coronal mass ejections trigger vibrant auroras across planetary magnetospheres.'
    ],
    tourNarration:
      'Welcome to the center of our cosmic neighborhood! The Sun is a seething sphere of magnetized plasma whose immense gravity holds planets as far as 30 AU in synchronous dance.',
    moons: []
  },
  {
    id: 'mercury',
    name: 'Mercury',
    subtitle: 'The Swift Iron World',
    type: 'Terrestrial Planet',
    color: '#b5b0a8',
    accentColor: '#d6d1c7',
    radius: 0.65,
    realDiameterKm: 4879,
    earthDiameterRatio: 0.38,
    distanceAU: 0.39,
    realDistanceMKm: 57.9,
    semiMajorAxis: 11.5,
    eccentricity: 0.205,
    inclinationDeg: 7.0,
    axialTiltDeg: 0.03,
    orbitalPeriodDays: 87.97,
    orbitalPeriodLabel: '88 Earth Days',
    rotationPeriodLabel: '58.6 Earth Days',
    rotationSpeed: 0.003,
    educationalAngularSpeed: 1.6,
    realisticAngularSpeed: 4.15,
    temperatureLabel: '-180°C to 430°C',
    moonsCount: 0,
    gravity: '3.7 m/s² (0.38 g)',
    atmosphere: 'Exosphere (O₂, Na, H₂, He)',
    description:
      'The smallest and innermost planet in the Solar System. Mercury possesses a massive metallic core that makes up about 85% of its radius, surrounded by a heavily cratered silicate mantle marked by towering lobate scarps formed as the planet cooled and contracted.',
    facts: [
      'Mercury has the most eccentric (elliptical) and inclined orbit of all eight major planets.',
      'Despite being closest to the Sun, water ice exists permanently inside deep, shadowed polar craters.',
      'A solar day on Mercury (sunrise to sunrise) lasts 176 Earth days—twice as long as its year!'
    ],
    tourNarration:
      'Notice how pronounced Mercury’s elliptical path and 7-degree orbital tilt are. Without a thick atmosphere to trap heat, its surface experiences the wildest temperature swings in the Solar System.',
    moons: []
  },
  {
    id: 'venus',
    name: 'Venus',
    subtitle: 'The Veiled Greenhouse World',
    type: 'Terrestrial Planet',
    color: '#e8c382',
    accentColor: '#f5d79c',
    radius: 1.15,
    realDiameterKm: 12104,
    earthDiameterRatio: 0.95,
    distanceAU: 0.72,
    realDistanceMKm: 108.2,
    semiMajorAxis: 17.5,
    eccentricity: 0.007,
    inclinationDeg: 3.39,
    axialTiltDeg: 177.36,
    orbitalPeriodDays: 224.7,
    orbitalPeriodLabel: '225 Earth Days',
    rotationPeriodLabel: '-243 Earth Days (Retrograde)',
    rotationSpeed: -0.0015,
    educationalAngularSpeed: 1.18,
    realisticAngularSpeed: 1.62,
    temperatureLabel: '465°C (Mean Surface)',
    moonsCount: 0,
    gravity: '8.87 m/s² (0.90 g)',
    atmosphere: 'CO₂ (96.5%), N₂ (3.5%), H₂SO₄ clouds',
    hasAtmosphere: true,
    atmosphereColor: '#ffdd99',
    description:
      'Often called Earth’s twin in size and mass, Venus is shrouded in opaque clouds of sulfuric acid. A runaway greenhouse effect traps heat relentlessly, making its surface hotter than Mercury and crushing visitors under 92 times Earth’s atmospheric pressure.',
    facts: [
      'Venus spins backwards (retrograde rotation) compared to almost all other planets—the Sun rises in the west and sets in the east.',
      'Its sidereal rotation (243 Earth days) takes longer than its complete orbit around the Sun (225 Earth days).',
      'Over 1,600 major volcanoes and volcanic features dot its basaltic plains.'
    ],
    tourNarration:
      'Shrouded in golden-cream super-rotating clouds, Venus rotates clockwise (retrograde) on an nearly upside-down 177.4° axis while maintaining the most circular orbit of any planet.',
    moons: []
  },
  {
    id: 'earth',
    name: 'Earth',
    subtitle: 'The Blue Marble Oasis',
    type: 'Terrestrial Planet',
    color: '#2b82ff',
    accentColor: '#4da6ff',
    radius: 1.25,
    realDiameterKm: 12742,
    earthDiameterRatio: 1.0,
    distanceAU: 1.0,
    realDistanceMKm: 149.6,
    semiMajorAxis: 24.5,
    eccentricity: 0.017,
    inclinationDeg: 0.0,
    axialTiltDeg: 23.44,
    orbitalPeriodDays: 365.25,
    orbitalPeriodLabel: '365.25 Days (1.0 Yr)',
    rotationPeriodLabel: '23h 56m 4s',
    rotationSpeed: 0.018,
    educationalAngularSpeed: 0.9,
    realisticAngularSpeed: 1.0,
    temperatureLabel: '-89°C to 57°C (Avg 15°C)',
    moonsCount: 1,
    gravity: '9.81 m/s² (1.00 g)',
    atmosphere: 'Nitrogen (78%), Oxygen (21%), Argon (1%)',
    hasAtmosphere: true,
    atmosphereColor: '#4da6ff',
    hasClouds: true,
    description:
      'Our home world and the only astronomical object known to harbor life. Covered 71% by liquid water oceans and protected by a dynamic magnetosphere, Earth’s 23.44° axial tilt gives rise to the rhythmic cycle of planetary seasons.',
    facts: [
      'Earth is the densest planet in the Solar System at 5.51 g/cm³.',
      'Plate tectonics continually recycle the planetary crust, regulating carbon dioxide over geological timescales.',
      'The Moon is unusually large relative to Earth (27% diameter), stabilizing our axial tilt and driving ocean tides.'
    ],
    tourNarration:
      'Here is Earth—complete with dynamic weather clouds, azure oceans, continents, a Rayleigh-scattered blue atmosphere, and our faithful Moon orbiting closely alongside.',
    moons: [
      {
        name: 'The Moon (Luna)',
        radius: 0.32,
        distance: 2.8,
        speed: 2.4,
        color: '#cccccc',
        inclination: 5.1
      }
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    subtitle: 'The Rust-Red Frontier',
    type: 'Terrestrial Planet',
    color: '#e05a33',
    accentColor: '#ff784f',
    radius: 0.85,
    realDiameterKm: 6779,
    earthDiameterRatio: 0.53,
    distanceAU: 1.52,
    realDistanceMKm: 227.9,
    semiMajorAxis: 32.0,
    eccentricity: 0.093,
    inclinationDeg: 1.85,
    axialTiltDeg: 25.19,
    orbitalPeriodDays: 687.0,
    orbitalPeriodLabel: '687 Earth Days (1.88 Yrs)',
    rotationPeriodLabel: '24h 37m 22s',
    rotationSpeed: 0.017,
    educationalAngularSpeed: 0.68,
    realisticAngularSpeed: 0.53,
    temperatureLabel: '-140°C to 20°C (Avg -63°C)',
    moonsCount: 2,
    gravity: '3.72 m/s² (0.38 g)',
    atmosphere: 'CO₂ (95%), N₂ (2.6%), Argon (1.9%)',
    hasAtmosphere: true,
    atmosphereColor: '#ff8a5c',
    description:
      'Stained rusty orange by iron oxide dust across its surface, Mars boasts the largest volcano in the Solar System (Olympus Mons) and the grandest canyon system (Valles Marineris). Ancient dry riverbeds and polar ice caps hint at a warmer, wetter past.',
    facts: [
      'Olympus Mons stands 21.9 km high—nearly three times the height of Mount Everest.',
      'Mars experiences planet-encircling dust storms that can obscure its entire surface for months.',
      'Its two tiny captured-asteroid moons, Phobos and Deimos, orbit rapidly close to the Martian surface.'
    ],
    tourNarration:
      'Observe Mars’ bright white CO₂ and water-ice polar caps, dark volcanic regions like Syrtis Major, and its twin asteroid-like moons Phobos and Deimos.',
    moons: [
      {
        name: 'Phobos',
        radius: 0.12,
        distance: 1.6,
        speed: 4.2,
        color: '#a8998c',
        inclination: 1.1
      },
      {
        name: 'Deimos',
        radius: 0.09,
        distance: 2.2,
        speed: 2.6,
        color: '#b8aa9d',
        inclination: 1.8
      }
    ]
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    subtitle: 'King of the Gas Giants',
    type: 'Gas Giant',
    color: '#d99c66',
    accentColor: '#f2b880',
    radius: 3.1,
    realDiameterKm: 139820,
    earthDiameterRatio: 10.97,
    distanceAU: 5.2,
    realDistanceMKm: 778.5,
    semiMajorAxis: 45.0,
    eccentricity: 0.049,
    inclinationDeg: 1.3,
    axialTiltDeg: 3.13,
    orbitalPeriodDays: 4332.59,
    orbitalPeriodLabel: '11.86 Earth Years',
    rotationPeriodLabel: '9h 55m 30s',
    rotationSpeed: 0.042,
    educationalAngularSpeed: 0.42,
    realisticAngularSpeed: 0.084,
    temperatureLabel: '-110°C (Cloud Tops)',
    moonsCount: 95,
    gravity: '24.79 m/s² (2.53 g)',
    atmosphere: 'Hydrogen (90%), Helium (10%), Ammonia bands',
    hasAtmosphere: true,
    atmosphereColor: '#e6b88a',
    description:
      'More than twice as massive as all other planets combined, Jupiter is a turbulent gas giant sculpted into colorful zonal bands of ammonia clouds and anticyclonic storms—most famously the Great Red Spot, a storm larger than Earth raging for centuries.',
    facts: [
      'Jupiter has the shortest day of all planets, spinning once in under 10 hours and causing a noticeable equatorial bulge.',
      'Its four major Galilean moons—Io, Europa, Ganymede, and Callisto—form a miniature planetary system.',
      'Ganymede is larger than the planet Mercury, while Europa harbors a vast subsurface saltwater ocean.'
    ],
    tourNarration:
      'Jupiter commands the outer system! Watch its rapid 10-hour spin, banded clouds, the iconic Great Red Spot, and the four Galilean moons (Io, Europa, Ganymede, and Callisto) circling in orbital resonance.',
    moons: [
      {
        name: 'Io',
        radius: 0.22,
        distance: 4.3,
        speed: 3.6,
        color: '#f5d742',
        inclination: 0.05
      },
      {
        name: 'Europa',
        radius: 0.2,
        distance: 5.2,
        speed: 2.7,
        color: '#d9e6f2',
        inclination: 0.47
      },
      {
        name: 'Ganymede',
        radius: 0.3,
        distance: 6.3,
        speed: 1.9,
        color: '#9e9589',
        inclination: 0.2
      },
      {
        name: 'Callisto',
        radius: 0.27,
        distance: 7.5,
        speed: 1.3,
        color: '#736b60',
        inclination: 0.28
      }
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    subtitle: 'The Jewel of the Solar System',
    type: 'Gas Giant',
    color: '#ebd095',
    accentColor: '#fae3b0',
    radius: 2.55,
    realDiameterKm: 116460,
    earthDiameterRatio: 9.14,
    distanceAU: 9.58,
    realDistanceMKm: 1434.0,
    semiMajorAxis: 61.0,
    eccentricity: 0.057,
    inclinationDeg: 2.49,
    axialTiltDeg: 26.73,
    orbitalPeriodDays: 10759.22,
    orbitalPeriodLabel: '29.45 Earth Years',
    rotationPeriodLabel: '10h 33m',
    rotationSpeed: 0.038,
    educationalAngularSpeed: 0.29,
    realisticAngularSpeed: 0.034,
    temperatureLabel: '-140°C (Cloud Tops)',
    moonsCount: 146,
    gravity: '10.44 m/s² (1.06 g)',
    atmosphere: 'Hydrogen (96%), Helium (3%), Methane',
    hasAtmosphere: true,
    atmosphereColor: '#f5deb3',
    hasRings: true,
    ringInnerRadius: 3.2,
    ringOuterRadius: 6.4,
    ringType: 'saturn',
    description:
      'Adorned with a breathtaking system of icy rings spanning 282,000 kilometers across yet averaging only 10 meters thick, Saturn is a golden gas giant with a mean density lower than liquid water and a bizarre hexagonal jet stream at its north pole.',
    facts: [
      'Saturn holds the record for the most confirmed moons (146), led by giant Titan and geyser-active Enceladus.',
      'Titan is the only moon in the Solar System with a dense nitrogen atmosphere and liquid hydrocarbon lakes on its surface.',
      'Saturn’s rings are 99% pure water ice particles ranging in size from microscopic dust grains to house-sized boulders.'
    ],
    tourNarration:
      'Marvel at Saturn’s 26.7° tilted ring system, complete with the Cassini Division, Encke Gap, and translucent C-ring, accompanied by haze-wrapped Titan and icy Enceladus.',
    moons: [
      {
        name: 'Enceladus',
        radius: 0.16,
        distance: 6.9,
        speed: 2.8,
        color: '#eef7ff',
        inclination: 0.02
      },
      {
        name: 'Titan',
        radius: 0.34,
        distance: 8.3,
        speed: 1.6,
        color: '#e6a84c',
        inclination: 0.35
      }
    ]
  },
  {
    id: 'uranus',
    name: 'Uranus',
    subtitle: 'The Sideways Ice Giant',
    type: 'Ice Giant',
    color: '#73d7e8',
    accentColor: '#99ecfa',
    radius: 1.85,
    realDiameterKm: 50724,
    earthDiameterRatio: 3.98,
    distanceAU: 19.2,
    realDistanceMKm: 2871.0,
    semiMajorAxis: 77.5,
    eccentricity: 0.046,
    inclinationDeg: 0.77,
    axialTiltDeg: 97.77,
    orbitalPeriodDays: 30688.5,
    orbitalPeriodLabel: '84.02 Earth Years',
    rotationPeriodLabel: '-17h 14m (Retrograde)',
    rotationSpeed: -0.024,
    educationalAngularSpeed: 0.2,
    realisticAngularSpeed: 0.012,
    temperatureLabel: '-195°C (Coldest Min: -224°C)',
    moonsCount: 28,
    gravity: '8.69 m/s² (0.89 g)',
    atmosphere: 'Hydrogen (83%), Helium (15%), Methane (2.3%)',
    hasAtmosphere: true,
    atmosphereColor: '#7be3f5',
    hasRings: true,
    ringInnerRadius: 2.35,
    ringOuterRadius: 3.25,
    ringType: 'uranus',
    description:
      'An aquamarine ice giant composed mainly of water, ammonia, and methane ices above a rocky core. Knocked onto its side likely by a colossal ancient impact, Uranus rolls around the Sun with a 97.77° axial tilt and faint vertical rings.',
    facts: [
      'Because of its extreme 98° tilt, each pole gets around 42 years of continuous sunlight followed by 42 years of darkness.',
      'Methane in the upper atmosphere absorbs red light and reflects blue-green wavelengths back into space.',
      'Uranus’s moons are named after characters from the works of William Shakespeare and Alexander Pope (Titania, Oberon, Miranda).'
    ],
    tourNarration:
      'Notice how Uranus rolls on its side at a 97.8° angle! Its delicate, dark-dust and ice rings and major moon Titania orbit nearly perpendicular to the Solar System plane.',
    moons: [
      {
        name: 'Titania',
        radius: 0.2,
        distance: 4.1,
        speed: 2.1,
        color: '#c2cfd6',
        inclination: 0.3
      }
    ]
  },
  {
    id: 'neptune',
    name: 'Neptune',
    subtitle: 'The Supersonic Azure World',
    type: 'Ice Giant',
    color: '#3b66f5',
    accentColor: '#668cff',
    radius: 1.8,
    realDiameterKm: 49244,
    earthDiameterRatio: 3.86,
    distanceAU: 30.05,
    realDistanceMKm: 4495.0,
    semiMajorAxis: 93.0,
    eccentricity: 0.01,
    inclinationDeg: 1.77,
    axialTiltDeg: 28.32,
    orbitalPeriodDays: 60195.0,
    orbitalPeriodLabel: '164.8 Earth Years',
    rotationPeriodLabel: '16h 6m',
    rotationSpeed: 0.026,
    educationalAngularSpeed: 0.15,
    realisticAngularSpeed: 0.006,
    temperatureLabel: '-200°C (Cloud Tops)',
    moonsCount: 16,
    gravity: '11.15 m/s² (1.14 g)',
    atmosphere: 'Hydrogen (80%), Helium (19%), Methane (1.5%)',
    hasAtmosphere: true,
    atmosphereColor: '#4c75ff',
    description:
      'The most distant major planet in our Solar System, orbiting 30 times farther from the Sun than Earth. Despite receiving 1/900th of Earth’s sunlight, internal heat drives the fastest supersonic winds in the Solar System—reaching 2,100 km/h.',
    facts: [
      'Neptune was the first planet located through mathematical predictions (by Urbain Le Verrier) before it was seen through a telescope in 1846.',
      'In 2011, Neptune completed its very first full 165-year orbit since its discovery in 1846.',
      'Its largest moon, Triton, orbits backwards (retrograde)—a captured Kuiper Belt dwarf planet that spews nitrogen ice geysers.'
    ],
    tourNarration:
      'At the frontier of the planetary realm lies deep-cobalt Neptune, swept by supersonic white cirrus clouds of frozen methane and orbited by retrograde Triton.',
    moons: [
      {
        name: 'Triton',
        radius: 0.24,
        distance: 3.9,
        speed: -2.2,
        color: '#d9d2e9',
        inclination: 15.0
      }
    ]
  }
];

const ATMOSPHERE_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const ATMOSPHERE_FRAGMENT_SHADER = `
  uniform vec3 glowColor;
  uniform float intensityFactor;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDirection)), 2.8);
    // Day-side sun scattering boost (Sun is at origin 0,0,0)
    vec3 sunDir = normalize(-vWorldPosition);
    float daySide = smoothstep(-0.35, 0.55, dot(vNormal, sunDir));
    float alpha = fresnel * (0.35 + 0.65 * daySide) * intensityFactor;
    gl_FragColor = vec4(glowColor, clamp(alpha, 0.0, 0.95));
  }
`;

const SOLAR_CORONA_FRAGMENT_SHADER = `
  uniform vec3 coronaColor;
  uniform float time;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float viewDot = abs(dot(vNormal, viewDir));
    // Smooth radial falloff toward the outer edge of the corona sphere
    float halo = pow(1.0 - viewDot, 2.2) * smoothstep(0.0, 0.45, viewDot);
    float pulse = 0.92 + 0.08 * sin(time * 2.4 + vWorldPosition.x * 0.7 + vWorldPosition.y * 0.7);
    gl_FragColor = vec4(coronaColor, clamp(halo * 0.75 * pulse, 0.0, 0.85));
  }
`;

function createSeededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Value noise helper for seamless equirectangular planetary textures
function valueNoise2D(x, y, seed = 1) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  const hash = (ix, iy) => {
    const n = Math.sin(ix * 127.1 + iy * 311.7 + seed * 74.7) * 43758.5453123;
    return n - Math.floor(n);
  };

  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);

  const aa = hash(xi, yi);
  const ab = hash(xi, yi + 1);
  const ba = hash(xi + 1, yi);
  const bb = hash(xi + 1, yi + 1);

  const x1 = aa + u * (ba - aa);
  const x2 = ab + u * (bb - ab);
  return x1 + v * (x2 - x1);
}

function fbm(x, y, octaves = 4, seed = 1) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * valueNoise2D(x * frequency, y * frequency, seed + i * 19);
    frequency *= 2.02;
    amplitude *= 0.5;
  }
  return value;
}

function generatePlanetTexture(planetId) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const rand = createSeededRandom(planetId.split('').reduce((a, c) => a + c.charCodeAt(0), 0));

  if (planetId === 'sun') {
    // Solar granulation & fiery active regions
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const nx = (x / w) * 14;
        const ny = (y / h) * 7;
        const n = fbm(nx, ny, 5, 11);
        const fine = valueNoise2D(nx * 4, ny * 4, 33);
        const v = Math.min(1, Math.max(0, n * 0.75 + fine * 0.25));
        const idx = (y * w + x) * 4;
        data[idx] = 255;
        data[idx + 1] = Math.floor(110 + v * 140);
        data[idx + 2] = Math.floor(v * v * 95);
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Bright solar plage / sunspot magnetic loops
    for (let i = 0; i < 35; i++) {
      const cx = rand() * w;
      const cy = (0.2 + rand() * 0.6) * h;
      const r = 8 + rand() * 32;
      const grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, r);
      if (rand() > 0.35) {
        grad.addColorStop(0, 'rgba(255, 255, 220, 0.85)');
        grad.addColorStop(0.5, 'rgba(255, 180, 40, 0.35)');
        grad.addColorStop(1, 'rgba(255, 100, 0, 0)');
      } else {
        grad.addColorStop(0, 'rgba(90, 25, 0, 0.8)');
        grad.addColorStop(0.5, 'rgba(180, 60, 0, 0.4)');
        grad.addColorStop(1, 'rgba(255, 140, 0, 0)');
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (planetId === 'mercury') {
    ctx.fillStyle = '#8c867e';
    ctx.fillRect(0, 0, w, h);
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const n = fbm((x / w) * 10, (y / h) * 5, 5, 42);
        const base = 105 + n * 75;
        const idx = (y * w + x) * 4;
        data[idx] = base + 6;
        data[idx + 1] = base + 2;
        data[idx + 2] = base - 4;
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Impact craters & ejecta rays
    for (let i = 0; i < 160; i++) {
      const cx = rand() * w;
      const cy = rand() * h;
      const r = 3 + rand() * 26;
      const grad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
      grad.addColorStop(0, 'rgba(70, 66, 62, 0.7)');
      grad.addColorStop(0.75, 'rgba(60, 56, 52, 0.8)');
      grad.addColorStop(0.9, 'rgba(195, 190, 182, 0.7)');
      grad.addColorStop(1, 'rgba(140, 134, 126, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (planetId === 'venus') {
    // Creamy sulfuric acid V-shaped chevron bands
    for (let y = 0; y < h; y++) {
      const lat = (y / h) * Math.PI;
      const band = Math.sin(lat * 9) * 18 + Math.cos(lat * 4) * 12;
      const r = Math.min(255, Math.floor(224 + band));
      const g = Math.min(255, Math.floor(182 + band * 0.85));
      const b = Math.min(255, Math.floor(114 + band * 0.6));
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, y, w, 1);
    }
    ctx.globalAlpha = 0.32;
    for (let i = 0; i < 60; i++) {
      const y = rand() * h;
      const height = 10 + rand() * 35;
      const grad = ctx.createLinearGradient(0, y, w, y + (rand() - 0.5) * 40);
      grad.addColorStop(0, '#fff2cc');
      grad.addColorStop(0.5, '#c98a3e');
      grad.addColorStop(1, '#fff2cc');
      ctx.fillStyle = grad;
      ctx.fillRect(0, y, w, height);
    }
    ctx.globalAlpha = 1;
  } else if (planetId === 'earth') {
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;
    for (let y = 0; y < h; y++) {
      const lat = Math.abs(y / h - 0.5) * 2; // 0 at equator, 1 at poles
      for (let x = 0; x < w; x++) {
        // Seamless horizontal wrapping noise
        const angle = (x / w) * Math.PI * 2;
        const nx = Math.cos(angle) * 2.2 + 2.5;
        const nz = Math.sin(angle) * 2.2 + 2.5;
        const ny = (y / h) * 3.8;
        const elevation = fbm(nx + ny * 0.35, nz + ny, 5, 108);
        const moisture = fbm(nx * 2, nz * 2 + ny, 3, 205);

        const idx = (y * w + x) * 4;
        // Polar ice caps
        if (lat > 0.86 - elevation * 0.08) {
          data[idx] = 240;
          data[idx + 1] = 248;
          data[idx + 2] = 255;
          data[idx + 3] = 255;
        } else if (elevation > 0.51) {
          // Landmasses: forests, savannas, deserts, mountains
          if (elevation > 0.68) {
            // Mountain ranges
            data[idx] = 135;
            data[idx + 1] = 122;
            data[idx + 2] = 108;
          } else if (moisture < 0.45 && lat < 0.45) {
            // Sahara / Outback style sandy deserts
            data[idx] = 212;
            data[idx + 1] = 182;
            data[idx + 2] = 120;
          } else {
            // Lush green continents
            data[idx] = Math.floor(38 + (elevation - 0.5) * 180);
            data[idx + 1] = Math.floor(115 + moisture * 55);
            data[idx + 2] = Math.floor(42 + (elevation - 0.5) * 90);
          }
          data[idx + 3] = 255;
        } else {
          // Deep oceans & shallow turquoise coastal shelves
          const shelf = Math.max(0, (elevation - 0.43) / 0.08);
          data[idx] = Math.floor(10 + shelf * 35);
          data[idx + 1] = Math.floor(52 + shelf * 95);
          data[idx + 2] = Math.floor(135 + shelf * 80);
          data[idx + 3] = 255;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  } else if (planetId === 'earth_night') {
    // Golden city lights concentrated along coastal continents
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;
    for (let y = 0; y < h; y++) {
      const lat = Math.abs(y / h - 0.5) * 2;
      for (let x = 0; x < w; x++) {
        const angle = (x / w) * Math.PI * 2;
        const nx = Math.cos(angle) * 2.2 + 2.5;
        const nz = Math.sin(angle) * 2.2 + 2.5;
        const ny = (y / h) * 3.8;
        const elevation = fbm(nx + ny * 0.35, nz + ny, 5, 108);
        const urbanCluster = valueNoise2D((x / w) * 55, (y / h) * 28, 912);
        const fineCity = valueNoise2D((x / w) * 160, (y / h) * 80, 411);
        const idx = (y * w + x) * 4;

        if (elevation > 0.515 && elevation < 0.66 && lat < 0.72 && urbanCluster > 0.56 && fineCity > 0.48) {
          const b = Math.min(1, (urbanCluster - 0.56) * 3.2 * fineCity);
          data[idx] = 255;
          data[idx + 1] = Math.floor(195 * b + 45);
          data[idx + 2] = Math.floor(95 * b);
          data[idx + 3] = Math.floor(b * 230);
        } else {
          data[idx] = 0;
          data[idx + 1] = 0;
          data[idx + 2] = 0;
          data[idx + 3] = 0;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  } else if (planetId === 'earth_clouds') {
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const angle = (x / w) * Math.PI * 2;
        const nx = Math.cos(angle) * 3.2 + 5;
        const nz = Math.sin(angle) * 3.2 + 5;
        const ny = (y / h) * 4.5;
        const c = fbm(nx, nz + ny, 5, 77);
        const alpha = c > 0.52 ? Math.min(245, Math.floor((c - 0.52) * 650)) : 0;
        const idx = (y * w + x) * 4;
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = alpha;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  } else if (planetId === 'mars') {
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;
    for (let y = 0; y < h; y++) {
      const lat = Math.abs(y / h - 0.5) * 2;
      for (let x = 0; x < w; x++) {
        const n = fbm((x / w) * 8, (y / h) * 4, 5, 303);
        const darkBasalt = fbm((x / w) * 4, (y / h) * 2, 3, 99);
        const idx = (y * w + x) * 4;

        if (lat > 0.89 - n * 0.05) {
          // Polar ice caps
          data[idx] = 245;
          data[idx + 1] = 242;
          data[idx + 2] = 240;
          data[idx + 3] = 255;
        } else {
          const rust = darkBasalt > 0.57 ? 0.62 : 1.0;
          data[idx] = Math.min(255, Math.floor((175 + n * 75) * rust));
          data[idx + 1] = Math.min(255, Math.floor((72 + n * 48) * rust));
          data[idx + 2] = Math.min(255, Math.floor((38 + n * 28) * rust));
          data[idx + 3] = 255;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Martian craters & Valles Marineris scar
    ctx.strokeStyle = 'rgba(90, 30, 15, 0.65)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.52);
    ctx.bezierCurveTo(w * 0.45, h * 0.54, w * 0.52, h * 0.51, w * 0.62, h * 0.53);
    ctx.stroke();
  } else if (planetId === 'jupiter') {
    // Detailed zonal bands of cream, ochre, rust, and slate
    const palette = [
      '#c9b29b',
      '#e3d1b8',
      '#c47d4e',
      '#f2e4ce',
      '#b8693d',
      '#e8d3b9',
      '#9e5b36',
      '#eddcc4',
      '#d19264',
      '#f5ead8',
      '#bd7346',
      '#c9b29b'
    ];
    for (let y = 0; y < h; y++) {
      const t = (y / h) * (palette.length - 1);
      const idx = Math.floor(t);
      const frac = t - idx;
      const c1 = new THREE.Color(palette[idx]);
      const c2 = new THREE.Color(palette[Math.min(palette.length - 1, idx + 1)]);
      c1.lerp(c2, frac);

      // Subtle wavy turbulence along latitude
      ctx.fillStyle = `#${c1.getHexString()}`;
      ctx.fillRect(0, y, w, 1);
    }

    // Band edge eddies
    for (let i = 0; i < 180; i++) {
      const x = rand() * w;
      const y = rand() * h;
      const rw = 20 + rand() * 80;
      const rh = 3 + rand() * 9;
      ctx.fillStyle = rand() > 0.5 ? 'rgba(255, 240, 218, 0.22)' : 'rgba(155, 75, 35, 0.22)';
      ctx.beginPath();
      ctx.ellipse(x, y, rw, rh, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Iconic Great Red Spot in Southern Hemisphere
    const grsX = w * 0.62;
    const grsY = h * 0.66;
    const grsGrad = ctx.createRadialGradient(grsX, grsY, 4, grsX, grsY, 54);
    grsGrad.addColorStop(0, '#b82e14');
    grsGrad.addColorStop(0.55, '#d94e28');
    grsGrad.addColorStop(0.82, '#f2cdb0');
    grsGrad.addColorStop(1, 'rgba(242, 205, 176, 0)');
    ctx.save();
    ctx.translate(grsX, grsY);
    ctx.scale(1.65, 0.95);
    ctx.fillStyle = grsGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (planetId === 'saturn') {
    // Smooth golden-butterscotch atmospheric bands
    for (let y = 0; y < h; y++) {
      const ny = y / h;
      const wave =
        Math.sin(ny * 28) * 10 + Math.cos(ny * 12) * 14 + Math.sin(ny * 55) * 4;
      const polarDarken = Math.abs(ny - 0.5) > 0.42 ? -22 : 0;
      const r = Math.min(255, Math.max(80, Math.floor(228 + wave + polarDarken)));
      const g = Math.min(255, Math.max(70, Math.floor(198 + wave * 0.85 + polarDarken)));
      const b = Math.min(255, Math.max(60, Math.floor(138 + wave * 0.6 - polarDarken * 0.5)));
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, y, w, 1);
    }
  } else if (planetId === 'uranus') {
    // Pale cyan-aquamarine methane atmosphere with subtle polar hood
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#9beff7');
    grad.addColorStop(0.25, '#76d9e8');
    grad.addColorStop(0.5, '#65cce0');
    grad.addColorStop(0.75, '#76d9e8');
    grad.addColorStop(1, '#58b8cc');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(220, 252, 255, 0.16)';
    for (let i = 0; i < 18; i++) {
      ctx.fillRect(0, rand() * h, w, 2 + rand() * 6);
    }
  } else if (planetId === 'neptune') {
    // Rich azure-cobalt bands with high-altitude white methane cirrus streaks and Great Dark Spot
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#1f3da8');
    grad.addColorStop(0.3, '#2d57d6');
    grad.addColorStop(0.5, '#3b6df2');
    grad.addColorStop(0.7, '#284ec7');
    grad.addColorStop(1, '#1a3391');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Great Dark Spot
    ctx.save();
    ctx.translate(w * 0.42, h * 0.6);
    ctx.scale(1.6, 0.9);
    const gds = ctx.createRadialGradient(0, 0, 4, 0, 0, 32);
    gds.addColorStop(0, 'rgba(12, 24, 78, 0.85)');
    gds.addColorStop(0.75, 'rgba(22, 42, 120, 0.5)');
    gds.addColorStop(1, 'rgba(45, 87, 214, 0)');
    ctx.fillStyle = gds;
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // White supersonic methane cloud streaks
    for (let i = 0; i < 28; i++) {
      ctx.fillStyle = 'rgba(225, 242, 255, 0.45)';
      const x = rand() * w;
      const y = (0.15 + rand() * 0.7) * h;
      ctx.beginPath();
      ctx.ellipse(x, y, 22 + rand() * 55, 1.5 + rand() * 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Moon / rocky body fallback
    ctx.fillStyle = '#b5b5b5';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) {
      ctx.fillStyle = rand() > 0.5 ? 'rgba(80,80,80,0.4)' : 'rgba(210,210,210,0.35)';
      ctx.beginPath();
      ctx.arc(rand() * w, rand() * h, 2 + rand() * 16, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function generateBumpTexture(planetId) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;
  const seed = planetId.charCodeAt(0) * 37;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const n = fbm((x / w) * 14, (y / h) * 7, 4, seed);
      const val = Math.floor(n * 255);
      const idx = (y * w + x) * 4;
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

function generateRingTexture(ringType) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const cx = 256;
  const cy = 256;

  // Draw concentric high-detail radial ring bands from inner radius (r=110) to outer radius (r=250)
  for (let r = 100; r <= 252; r += 0.5) {
    const norm = (r - 100) / 152; // 0 (inner) to 1 (outer)
    if (ringType === 'saturn') {
      // C Ring (translucent inner), B Ring (bright dense), Cassini Division (gap around 0.66-0.71), A Ring (outer), Encke gap (0.91)
      let alpha = 0;
      let color = '230, 206, 165';

      if (norm < 0.22) {
        // C Ring
        alpha = 0.18 + Math.sin(norm * 90) * 0.06;
        color = '185, 165, 140';
      } else if (norm < 0.65) {
        // B Ring
        alpha = 0.72 + Math.sin(norm * 180) * 0.18 + Math.cos(norm * 65) * 0.08;
        color = norm > 0.45 ? '245, 224, 184' : '222, 194, 148';
      } else if (norm < 0.71) {
        // Cassini Division
        alpha = 0.04;
      } else if (norm < 0.97) {
        // A Ring with Encke Gap
        if (norm > 0.89 && norm < 0.91) {
          alpha = 0.05;
        } else {
          alpha = 0.52 + Math.sin(norm * 140) * 0.12;
          color = '215, 195, 162';
        }
      } else {
        // Narrow F ring
        alpha = norm > 0.985 ? 0.45 : 0.02;
      }

      ctx.strokeStyle = `rgba(${color}, ${Math.max(0, Math.min(0.95, alpha))})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Uranus subtle narrow icy-charcoal rings (Epsilon, Delta, Gamma, Eta)
      const isBand =
        Math.abs(norm - 0.25) < 0.025 ||
        Math.abs(norm - 0.48) < 0.02 ||
        Math.abs(norm - 0.68) < 0.025 ||
        Math.abs(norm - 0.9) < 0.045;
      const alpha = isBand ? 0.42 : 0.04;
      ctx.strokeStyle = `rgba(155, 225, 242, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function generateGlowSpriteTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 8, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255, 250, 210, 1)');
  grad.addColorStop(0.22, 'rgba(255, 185, 50, 0.75)');
  grad.addColorStop(0.5, 'rgba(255, 105, 15, 0.28)');
  grad.addColorStop(1, 'rgba(255, 60, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function generateCircularParticleTexture(isSoftCloud = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  if (isSoftCloud) {
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.12)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  } else {
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function getEllipticalOrbitPosition(planet, angleRad) {
  if (!planet.semiMajorAxis || planet.semiMajorAxis === 0) {
    return new THREE.Vector3(0, 0, 0);
  }
  const a = planet.semiMajorAxis;
  const e = planet.eccentricity || 0;
  const b = a * Math.sqrt(1 - e * e);
  const c = a * e; // Sun at focal point

  // Position in orbital plane before inclination
  const xPlane = a * Math.cos(angleRad) - c;
  const zPlane = b * Math.sin(angleRad);

  // Apply orbital inclination around Z axis
  const incRad = THREE.MathUtils.degToRad(planet.inclinationDeg || 0);
  const x = xPlane * Math.cos(incRad);
  const y = xPlane * Math.sin(incRad);
  const z = zPlane;

  return new THREE.Vector3(x, y, z);
}

function SolarSystemViewport({
  selectedId,
  onSelect,
  showOrbits,
  showLabels,
  isPaused,
  simSpeed,
  realisticSpeeds,
  resetSignal,
  overviewTrigger,
  onEpochTick
}) {
  const mountRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [labels3D, setLabels3D] = useState([]);

  // Live mutable refs so the 60fps requestAnimationFrame loop always reads latest React state
  const stateRef = useRef({
    selectedId,
    showOrbits,
    showLabels,
    isPaused,
    simSpeed,
    realisticSpeeds,
    hoveredId: null
  });

  useEffect(() => {
    stateRef.current.selectedId = selectedId;
    stateRef.current.showOrbits = showOrbits;
    stateRef.current.showLabels = showLabels;
    stateRef.current.isPaused = isPaused;
    stateRef.current.simSpeed = simSpeed;
    stateRef.current.realisticSpeeds = realisticSpeeds;
  }, [selectedId, showOrbits, showLabels, isPaused, simSpeed, realisticSpeeds]);

  useEffect(() => {
    stateRef.current.hoveredId = hoveredId;
  }, [hoveredId]);

  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const onEpochTickRef = useRef(onEpochTick);
  useEffect(() => {
    onEpochTickRef.current = onEpochTick;
  }, [onEpochTick]);

  // Camera spherical orbit & target state
  const camControlRef = useRef({
    target: new THREE.Vector3(0, 0, 0),
    spherical: new THREE.Spherical(130, 1.12, 0.25),
    desiredRadius: 130,
    desiredPhi: 1.12,
    isTransitioning: false,
    isDragging: false,
    dragMode: 'rotate',
    prevPointer: { x: 0, y: 0 },
    pointerDownPos: { x: 0, y: 0 },
    prevSelectedId: null,
    prevBodyPos: new THREE.Vector3(0, 0, 0)
  });

  const bodiesMapRef = useRef({});
  const orbitLinesMapRef = useRef({});

  // Trigger smooth camera approach when selected planet changes
  useEffect(() => {
    const ctrl = camControlRef.current;
    if (selectedId !== ctrl.prevSelectedId) {
      ctrl.prevSelectedId = selectedId;
      ctrl.isTransitioning = true;
      const bodyData = CELESTIAL_DATA.find((b) => b.id === selectedId);
      if (bodyData) {
        const bodyEntry = bodiesMapRef.current[selectedId];
        if (bodyEntry) {
          ctrl.prevBodyPos.copy(bodyEntry.group.position);
        }
        ctrl.desiredRadius = Math.max(bodyData.radius * 4.2, 4.4);
        ctrl.desiredPhi = 1.18;
      } else {
        ctrl.desiredRadius = 130;
        ctrl.desiredPhi = 1.12;
      }
    }
  }, [selectedId]);

  // Return to full system overview when triggered
  useEffect(() => {
    if (overviewTrigger > 0 && !selectedId) {
      const ctrl = camControlRef.current;
      ctrl.isTransitioning = true;
      ctrl.desiredRadius = 130;
      ctrl.desiredPhi = 1.12;
    }
  }, [overviewTrigger, selectedId]);

  // Reset all planetary orbital phases to initial positions
  useEffect(() => {
    if (resetSignal > 0) {
      Object.values(bodiesMapRef.current).forEach((entry) => {
        if (entry.planet.id !== 'sun') {
          entry.angle = entry.initialAngle;
          const pos = getEllipticalOrbitPosition(entry.planet, entry.angle);
          entry.group.position.copy(pos);
        }
      });
    }
  }, [resetSignal]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#010308');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1400);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Ambient & hemisphere lighting
    const ambientLight = new THREE.AmbientLight('#9bb0ff', 0.24);
    scene.add(ambientLight);
    const hemiLight = new THREE.HemisphereLight('#ffffff', '#060a14', 0.18);
    scene.add(hemiLight);

    // Sunlight point source at center
    const sunLight = new THREE.PointLight('#fff5e4', 3.8, 460, 0.08);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Generate procedural textures & bump maps
    const textures = {};
    const bumpMaps = {};
    CELESTIAL_DATA.forEach((body) => {
      textures[body.id] = generatePlanetTexture(body.id);
      if (body.type === 'Terrestrial Planet') {
        bumpMaps[body.id] = generateBumpTexture(body.id);
      }
    });
    textures.earth_clouds = generatePlanetTexture('earth_clouds');
    textures.earth_night = generatePlanetTexture('earth_night');
    textures.saturn_ring = generateRingTexture('saturn');
    textures.uranus_ring = generateRingTexture('uranus');
    textures.moon = generatePlanetTexture('moon');
    textures.sun_glow = generateGlowSpriteTexture();
    textures.star_disc = generateCircularParticleTexture(false);
    textures.nebula_cloud = generateCircularParticleTexture(true);

    // 1. Deep Space Starfield, Twinkling Layer & Distant Spiral Galaxy
    const starsGroup = new THREE.Group();
    scene.add(starsGroup);

    const starCount = 6500;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#ffe9d2'),
      new THREE.Color('#d4e4ff'),
      new THREE.Color('#9bbcff'),
      new THREE.Color('#ffd2a1')
    ];

    for (let i = 0; i < starCount; i++) {
      const r = 240 + Math.random() * 340;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const c = starPalette[Math.floor(Math.random() * starPalette.length)];
      const b = 0.55 + Math.random() * 0.45;
      starColors[i * 3] = c.r * b;
      starColors[i * 3 + 1] = c.g * b;
      starColors[i * 3 + 2] = c.b * b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 1.8,
      map: textures.star_disc,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      alphaTest: 0.01,
      depthWrite: false
    });
    starsGroup.add(new THREE.Points(starGeo, starMat));

    // Bright Twinkling Foreground Stars
    const twinkleCount = 650;
    const twPos = new Float32Array(twinkleCount * 3);
    const twCol = new Float32Array(twinkleCount * 3);
    for (let i = 0; i < twinkleCount; i++) {
      const r = 210 + Math.random() * 140;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      twPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      twPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      twPos[i * 3 + 2] = r * Math.cos(phi);
      const c = starPalette[i % starPalette.length];
      twCol[i * 3] = c.r;
      twCol[i * 3 + 1] = c.g;
      twCol[i * 3 + 2] = c.b;
    }
    const twGeo = new THREE.BufferGeometry();
    twGeo.setAttribute('position', new THREE.BufferAttribute(twPos, 3));
    twGeo.setAttribute('color', new THREE.BufferAttribute(twCol, 3));
    const twinkleMat = new THREE.PointsMaterial({
      size: 3.4,
      map: textures.star_disc,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    starsGroup.add(new THREE.Points(twGeo, twinkleMat));

    // Distant Spiral Galaxy Cluster (Andromeda-inspired)
    const galaxyGroup = new THREE.Group();
    galaxyGroup.position.set(-210, 95, -240);
    galaxyGroup.rotation.set(0.55, 0.3, -0.4);
    const galPts = 1800;
    const galPos = new Float32Array(galPts * 3);
    const galCol = new Float32Array(galPts * 3);
    const coreColor = new THREE.Color('#ffdfb0');
    const armColor = new THREE.Color('#689dff');
    for (let i = 0; i < galPts; i++) {
      const arm = i % 2;
      const radius = Math.pow(Math.random(), 1.6) * 42;
      const spinAngle = radius * 0.22 + arm * Math.PI;
      const spread = (Math.random() - 0.5) * (2.5 + radius * 0.12);
      galPos[i * 3] = Math.cos(spinAngle) * radius + spread;
      galPos[i * 3 + 1] = (Math.random() - 0.5) * (2.8 - radius * 0.04);
      galPos[i * 3 + 2] = Math.sin(spinAngle) * radius + spread;
      const mixed = coreColor.clone().lerp(armColor, Math.min(1, radius / 32));
      galCol[i * 3] = mixed.r;
      galCol[i * 3 + 1] = mixed.g;
      galCol[i * 3 + 2] = mixed.b;
    }
    const galGeo = new THREE.BufferGeometry();
    galGeo.setAttribute('position', new THREE.BufferAttribute(galPos, 3));
    galGeo.setAttribute('color', new THREE.BufferAttribute(galCol, 3));
    galaxyGroup.add(
      new THREE.Points(
        galGeo,
        new THREE.PointsMaterial({
          size: 2.2,
          map: textures.star_disc,
          vertexColors: true,
          transparent: true,
          opacity: 0.75,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      )
    );
    starsGroup.add(galaxyGroup);

    const nebulaCount = 260;
    const nebPos = new Float32Array(nebulaCount * 3);
    const nebCol = new Float32Array(nebulaCount * 3);
    const nc1 = new THREE.Color('#3b1d7a');
    const nc2 = new THREE.Color('#0f4c81');
    const nc3 = new THREE.Color('#6b184e');
    for (let i = 0; i < nebulaCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 260 + Math.random() * 90;
      nebPos[i * 3] = Math.cos(angle) * radius;
      nebPos[i * 3 + 1] = (Math.random() - 0.5) * 85;
      nebPos[i * 3 + 2] = Math.sin(angle) * radius;
      const pick = i % 3 === 0 ? nc1 : i % 3 === 1 ? nc2 : nc3;
      nebCol[i * 3] = pick.r;
      nebCol[i * 3 + 1] = pick.g;
      nebCol[i * 3 + 2] = pick.b;
    }
    const nebGeo = new THREE.BufferGeometry();
    nebGeo.setAttribute('position', new THREE.BufferAttribute(nebPos, 3));
    nebGeo.setAttribute('color', new THREE.BufferAttribute(nebCol, 3));
    const nebMat = new THREE.PointsMaterial({
      size: 28,
      map: textures.nebula_cloud,
      vertexColors: true,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    starsGroup.add(new THREE.Points(nebGeo, nebMat));

    // 2. Main Asteroid Belt (Mars-Jupiter) & Outer Kuiper Belt (Beyond Neptune)
    const beltCount = 1300;
    const beltPos = new Float32Array(beltCount * 3);
    for (let i = 0; i < beltCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 36.2 + Math.random() * 4.6;
      beltPos[i * 3] = Math.cos(angle) * r;
      beltPos[i * 3 + 1] = (Math.random() - 0.5) * 1.8;
      beltPos[i * 3 + 2] = Math.sin(angle) * r;
    }
    const beltGeo = new THREE.BufferGeometry();
    beltGeo.setAttribute('position', new THREE.BufferAttribute(beltPos, 3));
    const beltMat = new THREE.PointsMaterial({
      color: '#a89e91',
      map: textures.star_disc,
      size: 0.55,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    });
    const asteroidBelt = new THREE.Points(beltGeo, beltMat);
    scene.add(asteroidBelt);

    const kuiperCount = 1600;
    const kuiperPos = new Float32Array(kuiperCount * 3);
    for (let i = 0; i < kuiperCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 100 + Math.random() * 18;
      kuiperPos[i * 3] = Math.cos(angle) * r;
      kuiperPos[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
      kuiperPos[i * 3 + 2] = Math.sin(angle) * r;
    }
    const kuiperGeo = new THREE.BufferGeometry();
    kuiperGeo.setAttribute('position', new THREE.BufferAttribute(kuiperPos, 3));
    const kuiperBelt = new THREE.Points(
      kuiperGeo,
      new THREE.PointsMaterial({
        color: '#6b8ab8',
        map: textures.star_disc,
        size: 0.6,
        transparent: true,
        opacity: 0.4,
        depthWrite: false
      })
    );
    scene.add(kuiperBelt);

    // 3. Build Sun, Smooth Volumetric Corona & Planets
    const pickableMeshes = [];
    const bodiesMap = {};
    const orbitLinesMap = {};

    const sunData = CELESTIAL_DATA[0];
    const sunGroup = new THREE.Group();
    scene.add(sunGroup);

    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(sunData.radius, 64, 64),
      new THREE.MeshBasicMaterial({
        map: textures.sun,
        depthWrite: true,
        depthTest: true
      })
    );
    sunMesh.userData = { bodyId: 'sun' };
    sunGroup.add(sunMesh);
    pickableMeshes.push(sunMesh);

    const coronaUniforms = {
      coronaColor: { value: new THREE.Color('#ff8811') },
      time: { value: 0 }
    };
    const coronaShaderMat = new THREE.ShaderMaterial({
      vertexShader: ATMOSPHERE_VERTEX_SHADER,
      fragmentShader: SOLAR_CORONA_FRAGMENT_SHADER,
      uniforms: coronaUniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const coronaMesh = new THREE.Mesh(
      new THREE.SphereGeometry(sunData.radius * 1.22, 64, 64),
      coronaShaderMat
    );
    sunGroup.add(coronaMesh);

    const sunSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: textures.sun_glow,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: true
      })
    );
    sunSprite.scale.set(sunData.radius * 5.2, sunData.radius * 5.2, 1);
    sunGroup.add(sunSprite);

    bodiesMap['sun'] = {
      planet: sunData,
      group: sunGroup,
      mesh: sunMesh,
      coronaUniforms
    };

    // Build all 8 planets, rings, Fresnel atmospheres, moons, and orbit lines
    CELESTIAL_DATA.slice(1).forEach((planet) => {
      // Elliptical Orbit Path Line
      const orbitPts = [];
      const segments = 200;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        orbitPts.push(getEllipticalOrbitPosition(planet, theta));
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
      const orbitMat = new THREE.LineBasicMaterial({
        color: planet.color,
        transparent: true,
        opacity: 0.28,
        depthTest: true,
        depthWrite: false
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      scene.add(orbitLine);
      orbitLinesMap[planet.id] = { line: orbitLine, mat: orbitMat, planet };

      // Planet Root Group
      const planetGroup = new THREE.Group();
      const hash = planet.id.split('').reduce((acc, c) => acc + c.charCodeAt(0) * 17, 0);
      const initialAngle = (hash % 360) * (Math.PI / 180);
      const startPos = getEllipticalOrbitPosition(planet, initialAngle);
      planetGroup.position.copy(startPos);
      scene.add(planetGroup);

      // Axial Tilt Group
      const tiltGroup = new THREE.Group();
      tiltGroup.rotation.z = THREE.MathUtils.degToRad(planet.axialTiltDeg || 0);
      planetGroup.add(tiltGroup);

      // Subtle Axial Pole Indicator Axis Line (only visible when planet is selected up close)
      const polePts = [
        new THREE.Vector3(0, -planet.radius * 1.38, 0),
        new THREE.Vector3(0, planet.radius * 1.38, 0)
      ];
      const poleLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(polePts),
        new THREE.LineBasicMaterial({
          color: planet.accentColor,
          transparent: true,
          opacity: 0.45
        })
      );
      poleLine.visible = false;
      tiltGroup.add(poleLine);

      // Main Planet Sphere with Procedural Bump Relief
      const matConfig = {
        map: textures[planet.id],
        roughness:
          planet.id === 'earth'
            ? 0.55
            : planet.type === 'Gas Giant' || planet.type === 'Ice Giant'
            ? 0.65
            : 0.84,
        metalness: planet.id === 'earth' ? 0.12 : 0.04
      };
      if (bumpMaps[planet.id]) {
        matConfig.bumpMap = bumpMaps[planet.id];
        matConfig.bumpScale = planet.id === 'mars' || planet.id === 'mercury' ? 0.045 : 0.025;
      }

      const planetMesh = new THREE.Mesh(
        new THREE.SphereGeometry(planet.radius, 64, 64),
        new THREE.MeshStandardMaterial(matConfig)
      );
      planetMesh.castShadow = true;
      planetMesh.receiveShadow = true;
      planetMesh.userData = { bodyId: planet.id };
      tiltGroup.add(planetMesh);
      pickableMeshes.push(planetMesh);

      // Earth Night-Side City Lights Layer
      let nightLightsMesh = null;
      if (planet.id === 'earth' && textures.earth_night) {
        nightLightsMesh = new THREE.Mesh(
          new THREE.SphereGeometry(planet.radius * 1.003, 48, 48),
          new THREE.MeshBasicMaterial({
            map: textures.earth_night,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          })
        );
        planetMesh.add(nightLightsMesh);
      }

      // Earth Clouds Layer
      let cloudMesh = null;
      if (planet.hasClouds && textures.earth_clouds) {
        cloudMesh = new THREE.Mesh(
          new THREE.SphereGeometry(planet.radius * 1.018, 48, 48),
          new THREE.MeshStandardMaterial({
            map: textures.earth_clouds,
            transparent: true,
            opacity: 0.86,
            depthWrite: false,
            roughness: 1
          })
        );
        tiltGroup.add(cloudMesh);
      }

      // Custom GLSL Fresnel Rayleigh Atmospheric Rim Scattering
      let atmosphereUniforms = null;
      if (planet.hasAtmosphere) {
        atmosphereUniforms = {
          glowColor: { value: new THREE.Color(planet.atmosphereColor) },
          intensityFactor: { value: 1.15 }
        };
        const atmoShaderMat = new THREE.ShaderMaterial({
          vertexShader: ATMOSPHERE_VERTEX_SHADER,
          fragmentShader: ATMOSPHERE_FRAGMENT_SHADER,
          uniforms: atmosphereUniforms,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const atmoMesh = new THREE.Mesh(
          new THREE.SphereGeometry(planet.radius * 1.065, 48, 48),
          atmoShaderMat
        );
        tiltGroup.add(atmoMesh);
      }

      // Planetary Ring System (Saturn & Uranus)
      if (planet.hasRings) {
        const rTex =
          planet.ringType === 'saturn' ? textures.saturn_ring : textures.uranus_ring;
        const ringGeo = new THREE.RingGeometry(
          planet.ringInnerRadius,
          planet.ringOuterRadius,
          112,
          1
        );
        const posAttr = ringGeo.attributes.position;
        const uvAttr = ringGeo.attributes.uv;
        for (let i = 0; i < posAttr.count; i++) {
          const vx = posAttr.getX(i);
          const vy = posAttr.getY(i);
          const rNorm =
            (Math.sqrt(vx * vx + vy * vy) - planet.ringInnerRadius) /
            (planet.ringOuterRadius - planet.ringInnerRadius);
          const angle = Math.atan2(vy, vx);
          const radPx = (100 + rNorm * 150) / 512;
          uvAttr.setXY(i, 0.5 + Math.cos(angle) * radPx, 0.5 + Math.sin(angle) * radPx);
        }

        const ringMesh = new THREE.Mesh(
          ringGeo,
          new THREE.MeshStandardMaterial({
            map: rTex,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: planet.ringType === 'saturn' ? 0.94 : 0.58,
            roughness: 0.55,
            depthWrite: false
          })
        );
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.receiveShadow = true;
        ringMesh.castShadow = true;
        ringMesh.userData = { bodyId: planet.id };
        tiltGroup.add(ringMesh);
        pickableMeshes.push(ringMesh);
      }

      // Selection Highlight Ring
      const highlightMat = new THREE.MeshBasicMaterial({
        color: planet.accentColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.0
      });
      const highlightRing = new THREE.Mesh(
        new THREE.RingGeometry(planet.radius * 1.32, planet.radius * 1.38, 64),
        highlightMat
      );
      highlightRing.rotation.x = Math.PI / 2;
      planetGroup.add(highlightRing);

      // Orbiting Moons + Subtle Moon Orbit Rings
      const moonEntries = (planet.moons || []).map((moon, idx) => {
        const inc = THREE.MathUtils.degToRad(moon.inclination || 0);
        const mOrbitPts = [];
        for (let s = 0; s <= 64; s++) {
          const a = (s / 64) * Math.PI * 2;
          const mx = Math.cos(a) * moon.distance;
          const mz = Math.sin(a) * moon.distance;
          mOrbitPts.push(new THREE.Vector3(mx * Math.cos(inc), mx * Math.sin(inc), mz));
        }
        const mOrbitLine = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(mOrbitPts),
          new THREE.LineBasicMaterial({
            color: moon.color,
            transparent: true,
            opacity: 0.18
          })
        );
        planetGroup.add(mOrbitLine);

        const mMesh = new THREE.Mesh(
          new THREE.SphereGeometry(moon.radius, 24, 24),
          new THREE.MeshStandardMaterial({
            map: textures.moon,
            color: moon.color,
            roughness: 0.9
          })
        );
        mMesh.castShadow = true;
        mMesh.receiveShadow = true;
        planetGroup.add(mMesh);
        return {
          data: moon,
          mesh: mMesh,
          orbitLine: mOrbitLine,
          angle: idx * 1.7
        };
      });

      bodiesMap[planet.id] = {
        planet,
        group: planetGroup,
        mesh: planetMesh,
        poleLine,
        cloudMesh,
        atmosphereUniforms,
        highlightMat,
        moons: moonEntries,
        initialAngle,
        angle: initialAngle
      };
    });

    bodiesMapRef.current = bodiesMap;
    orbitLinesMapRef.current = orbitLinesMap;

    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();
    const domElem = renderer.domElement;

    const updatePointerNDC = (clientX, clientY) => {
      const rect = domElem.getBoundingClientRect();
      pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerDown = (e) => {
      const ctrl = camControlRef.current;
      ctrl.isDragging = true;
      ctrl.isTransitioning = false;
      ctrl.dragMode = e.button === 2 || e.shiftKey ? 'pan' : 'rotate';
      ctrl.prevPointer = { x: e.clientX, y: e.clientY };
      ctrl.pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e) => {
      const ctrl = camControlRef.current;
      if (ctrl.isDragging) {
        const dx = e.clientX - ctrl.prevPointer.x;
        const dy = e.clientY - ctrl.prevPointer.y;
        ctrl.prevPointer = { x: e.clientX, y: e.clientY };

        if (ctrl.dragMode === 'rotate') {
          ctrl.spherical.theta -= dx * 0.0055;
          ctrl.spherical.phi = THREE.MathUtils.clamp(
            ctrl.spherical.phi - dy * 0.0055,
            0.08,
            Math.PI - 0.08
          );
        } else {
          // Pan camera target perpendicular to view direction
          const panSpeed = ctrl.spherical.radius * 0.0015;
          const forward = new THREE.Vector3()
            .subVectors(ctrl.target, camera.position)
            .normalize();
          const right = new THREE.Vector3()
            .crossVectors(forward, camera.up)
            .normalize();
          const up = new THREE.Vector3().crossVectors(right, forward).normalize();
          ctrl.target.addScaledVector(right, -dx * panSpeed);
          ctrl.target.addScaledVector(up, dy * panSpeed);
        }
        return;
      }

      // Hover raycasting when not dragging
      updatePointerNDC(e.clientX, e.clientY);
      raycaster.setFromCamera(pointerNDC, camera);
      const intersects = raycaster.intersectObjects(pickableMeshes, false);
      if (intersects.length > 0) {
        const hitId = intersects[0].object.userData.bodyId;
        if (hitId !== stateRef.current.hoveredId) {
          setHoveredId(hitId);
        }
        domElem.style.cursor = 'pointer';
      } else {
        if (stateRef.current.hoveredId !== null) {
          setHoveredId(null);
        }
        domElem.style.cursor = 'grab';
      }
    };

    const handlePointerUp = (e) => {
      const ctrl = camControlRef.current;
      ctrl.isDragging = false;
      const moveDist = Math.hypot(
        e.clientX - ctrl.pointerDownPos.x,
        e.clientY - ctrl.pointerDownPos.y
      );
      if (moveDist < 6 && e.button === 0) {
        updatePointerNDC(e.clientX, e.clientY);
        raycaster.setFromCamera(pointerNDC, camera);
        const intersects = raycaster.intersectObjects(pickableMeshes, false);
        if (intersects.length > 0) {
          const hitId = intersects[0].object.userData.bodyId;
          if (hitId && onSelectRef.current) {
            onSelectRef.current(hitId);
          }
        }
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const ctrl = camControlRef.current;
      ctrl.isTransitioning = false;
      const selBody = CELESTIAL_DATA.find((b) => b.id === stateRef.current.selectedId);
      const minRadius = selBody ? Math.max(selBody.radius * 1.65, 1.5) : 9;
      ctrl.spherical.radius = THREE.MathUtils.clamp(
        ctrl.spherical.radius * (1 + e.deltaY * 0.001),
        minRadius,
        260
      );
    };

    const handleContextMenu = (e) => e.preventDefault();

    domElem.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    domElem.addEventListener('wheel', handleWheel, { passive: false });
    domElem.addEventListener('contextmenu', handleContextMenu);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 4. Main Animation Loop
    let animationFrameId;
    let lastTime = performance.now();
    let labelUpdateCounter = 0;
    let simulatedDaysAcc = 0;

    const animate = (now) => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsed = now * 0.001;

      const {
        selectedId: curSelectedId,
        showOrbits: curShowOrbits,
        isPaused: curPaused,
        simSpeed: curSpeed,
        realisticSpeeds: curRealistic,
        hoveredId: curHoveredId
      } = stateRef.current;

      // Rotate background stars, twinkle layer & belts slowly
      starsGroup.rotation.y = elapsed * 0.0025;
      twinkleMat.opacity = 0.62 + Math.sin(elapsed * 3.8) * 0.28;
      if (!curPaused) {
        asteroidBelt.rotation.y += delta * 0.015 * curSpeed;
        kuiperBelt.rotation.y += delta * 0.004 * curSpeed;
        simulatedDaysAcc += delta * curSpeed * 14.5;
      }

      // Animate Sun surface & volumetric GLSL corona shader
      const sunEntry = bodiesMap['sun'];
      if (sunEntry) {
        if (!curPaused) {
          sunEntry.mesh.rotation.y += delta * 0.14 * Math.max(0.2, Math.min(curSpeed, 3));
        }
        if (sunEntry.coronaUniforms) {
          sunEntry.coronaUniforms.time.value = elapsed;
        }
      }

      // Animate all planets & moons
      CELESTIAL_DATA.slice(1).forEach((planet) => {
        const entry = bodiesMap[planet.id];
        if (!entry) return;

        const angularVelocity = curRealistic
          ? planet.realisticAngularSpeed * 0.45
          : planet.educationalAngularSpeed * 0.25;

        if (!curPaused) {
          entry.angle += delta * angularVelocity * curSpeed;
        }

        const pos = getEllipticalOrbitPosition(planet, entry.angle);
        entry.group.position.copy(pos);

        if (!curPaused) {
          entry.mesh.rotation.y +=
            planet.rotationSpeed * 18 * delta * Math.min(curSpeed, 5);
          if (entry.cloudMesh) {
            entry.cloudMesh.rotation.y +=
              planet.rotationSpeed * 22 * delta * Math.min(curSpeed, 5);
          }
        }

        // Update moons
        const isSel = curSelectedId === planet.id;
        const isHov = curHoveredId === planet.id;

        if (entry.poleLine) {
          entry.poleLine.visible = isSel;
        }

        entry.moons.forEach((m) => {
          if (!curPaused) {
            m.angle += delta * m.data.speed * 0.6 * Math.min(curSpeed, 4);
          }
          const inc = THREE.MathUtils.degToRad(m.data.inclination || 0);
          const mx = Math.cos(m.angle) * m.data.distance;
          const mz = Math.sin(m.angle) * m.data.distance;
          const my = mx * Math.sin(inc);
          m.mesh.position.set(mx * Math.cos(inc), my, mz);
          m.mesh.rotation.y += delta * 0.5;
          if (m.orbitLine) {
            m.orbitLine.visible = curShowOrbits && (isSel || isHov);
          }
        });

        // Update selection/hover visual highlights & Fresnel shader glow
        entry.highlightMat.opacity = isSel ? 0.85 : isHov ? 0.45 : 0.0;
        if (entry.atmosphereUniforms) {
          entry.atmosphereUniforms.intensityFactor.value = isSel || isHov ? 1.55 : 1.12;
        }

        // Update orbit line visibility & highlight
        const orbitEntry = orbitLinesMap[planet.id];
        if (orbitEntry) {
          orbitEntry.line.visible = curShowOrbits;
          orbitEntry.mat.opacity = isSel ? 0.85 : isHov ? 0.6 : 0.25;
          orbitEntry.mat.color.set(isSel || isHov ? planet.accentColor : planet.color);
        }
      });

      // Update Camera tracking & smooth orbital spherical position
      const ctrl = camControlRef.current;
      if (curSelectedId && bodiesMap[curSelectedId]) {
        const targetGroupPos = bodiesMap[curSelectedId].group.position;
        ctrl.target.lerp(targetGroupPos, Math.min(1, delta * 8.5));
        if (ctrl.isTransitioning) {
          ctrl.spherical.radius = THREE.MathUtils.lerp(
            ctrl.spherical.radius,
            ctrl.desiredRadius,
            Math.min(1, delta * 4.2)
          );
          ctrl.spherical.phi = THREE.MathUtils.lerp(
            ctrl.spherical.phi,
            ctrl.desiredPhi,
            Math.min(1, delta * 4.2)
          );
          if (Math.abs(ctrl.spherical.radius - ctrl.desiredRadius) < 0.25) {
            ctrl.isTransitioning = false;
          }
        }
      } else {
        const origin = new THREE.Vector3(0, 0, 0);
        ctrl.target.lerp(origin, Math.min(1, delta * 4.5));
        if (ctrl.isTransitioning) {
          ctrl.spherical.radius = THREE.MathUtils.lerp(
            ctrl.spherical.radius,
            ctrl.desiredRadius,
            Math.min(1, delta * 3.5)
          );
          ctrl.spherical.phi = THREE.MathUtils.lerp(
            ctrl.spherical.phi,
            ctrl.desiredPhi,
            Math.min(1, delta * 3.5)
          );
          if (Math.abs(ctrl.spherical.radius - ctrl.desiredRadius) < 0.8) {
            ctrl.isTransitioning = false;
          }
        }
      }

      const offsetVec = new THREE.Vector3().setFromSpherical(ctrl.spherical);
      camera.position.copy(ctrl.target).add(offsetVec);
      camera.lookAt(ctrl.target);

      renderer.render(scene, camera);

      // Project 3D world coordinates to 2D screen overlay coordinates for crisp interactive labels
      labelUpdateCounter++;
      if (labelUpdateCounter % 2 === 0 && container) {
        if (onEpochTickRef.current && labelUpdateCounter % 8 === 0) {
          onEpochTickRef.current(simulatedDaysAcc);
        }
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        const nextLabels = [];

        CELESTIAL_DATA.forEach((body) => {
          const entry = bodiesMap[body.id];
          if (!entry) return;
          const worldPos = entry.group.position.clone();
          worldPos.y += body.radius + (body.id === 'sun' ? 1.7 : 1.2);
          worldPos.project(camera);

          if (worldPos.z < 1) {
            const sx = (worldPos.x * 0.5 + 0.5) * w;
            const sy = (-worldPos.y * 0.5 + 0.5) * h;
            if (sx >= -100 && sx <= w + 100 && sy >= -60 && sy <= h + 60) {
              nextLabels.push({
                id: body.id,
                name: body.name,
                color: body.color,
                distanceAU: body.distanceAU,
                x: sx,
                y: sy,
                isMoon: false
              });
            }
          }

          // Project moon labels when this planet is currently selected
          if (curSelectedId === body.id && entry.moons) {
            entry.moons.forEach((m) => {
              const moonWorld = new THREE.Vector3();
              m.mesh.getWorldPosition(moonWorld);
              moonWorld.y += m.data.radius + 0.35;
              moonWorld.project(camera);
              if (moonWorld.z < 1) {
                const mx = (moonWorld.x * 0.5 + 0.5) * w;
                const my = (-moonWorld.y * 0.5 + 0.5) * h;
                nextLabels.push({
                  id: `${body.id}-${m.data.name}`,
                  name: m.data.name,
                  x: mx,
                  y: my,
                  isMoon: true
                });
              }
            });
          }
        });

        setLabels3D(nextLabels);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      domElem.removeEventListener('wheel', handleWheel);
      domElem.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />

      {/* Subtle Cinematic Vignette & HUD Corner Brackets */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(circle at center, transparent 58%, rgba(1, 3, 10, 0.65) 100%)'
        }}
      />

      {/* Projected 3D Floating Celestial Labels */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
        {labels3D.map((lbl) => {
          if (lbl.isMoon) {
            return (
              <div
                key={lbl.id}
                style={{
                  transform: `translate3d(${lbl.x}px, ${lbl.y}px, 0) translate(-50%, -100%)`
                }}
                className="absolute top-0 left-0 px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-700/70 text-[10px] text-slate-300 whitespace-nowrap"
              >
                {lbl.name}
              </div>
            );
          }

          const isSelected = selectedId === lbl.id;
          const isHovered = hoveredId === lbl.id;
          if (!showLabels && !isSelected && !isHovered) return null;

          return (
            <button
              key={lbl.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(lbl.id);
              }}
              style={{
                transform: `translate3d(${lbl.x}px, ${lbl.y}px, 0) translate(-50%, -100%)`
              }}
              className={`pointer-events-auto absolute top-0 left-0 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-colors whitespace-nowrap flex items-center gap-1.5 border backdrop-blur-md shadow-lg ${
                isSelected
                  ? lbl.id === 'sun'
                    ? 'bg-amber-500/30 border-amber-300 text-amber-100 shadow-amber-500/30'
                    : 'bg-indigo-500/35 border-indigo-300 text-white shadow-indigo-500/30'
                  : isHovered
                  ? 'bg-slate-900/95 border-sky-400/80 text-sky-100'
                  : 'bg-slate-950/75 border-slate-700/70 text-slate-200/90 hover:border-slate-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${lbl.id === 'sun' ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: lbl.color }}
              />
              <span>{lbl.name}</span>
              {lbl.id !== 'sun' && (
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  {lbl.distanceAU} AU
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ComparisonModal({ isOpen, onClose, onSelectPlanet }) {
  const [metric, setMetric] = useState('diameter');
  if (!isOpen) return null;

  const planetsOnly = CELESTIAL_DATA.slice(1);
  const maxDiameter = Math.max(...planetsOnly.map((p) => p.realDiameterKm));
  const maxDistance = Math.max(...planetsOnly.map((p) => p.distanceAU));
  const maxPeriod = Math.max(...planetsOnly.map((p) => p.orbitalPeriodDays));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[88vh] overflow-y-auto rounded-2xl bg-slate-900/95 border border-indigo-500/30 shadow-2xl shadow-indigo-950/60 p-6 text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide text-white">
                PLANETARY COMPARISON LABORATORY
              </h2>
              <p className="text-xs text-slate-400">
                True-to-scale scientific telemetry vs. 3D visualization adjustments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Relative Scale Silhouettes */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              True Relative Planetary Diameters (Compared to Jupiter = 100%)
            </span>
            <span className="text-[11px] text-slate-400">
              Sun is 10x wider than Jupiter (109x Earth)
            </span>
          </div>
          <div className="flex items-end justify-around gap-3 py-4 min-h-[140px]">
            {planetsOnly.map((p) => {
              const sizePx = Math.max(8, Math.round((p.realDiameterKm / maxDiameter) * 92));
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectPlanet(p.id);
                    onClose();
                  }}
                  className="group flex flex-col items-center gap-2 focus:outline-none"
                >
                  <div className="flex items-center justify-center h-24">
                    <div
                      className="rounded-full transition-transform duration-300 group-hover:scale-110 shadow-lg"
                      style={{
                        width: `${sizePx}px`,
                        height: `${sizePx}px`,
                        background: `radial-gradient(circle at 30% 30%, ${p.accentColor}, ${p.color} 70%, #090d16 100%)`,
                        boxShadow: `0 0 15px ${p.color}44`
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-200 group-hover:text-indigo-300">
                    {p.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {p.earthDiameterRatio}x Earth
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { id: 'diameter', label: 'Equatorial Diameter (km)' },
            { id: 'distance', label: 'Mean Distance from Sun (AU)' },
            { id: 'period', label: 'Sidereal Orbital Period (Days)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMetric(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                metric === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quantitative Bar Charts */}
        <div className="space-y-2.5">
          {planetsOnly.map((p) => {
            let value = p.realDiameterKm;
            let max = maxDiameter;
            let formatted = `${p.realDiameterKm.toLocaleString()} km (${p.earthDiameterRatio}x Earth)`;

            if (metric === 'distance') {
              value = p.distanceAU;
              max = maxDistance;
              formatted = `${p.distanceAU} AU (${p.realDistanceMKm.toLocaleString()}M km)`;
            } else if (metric === 'period') {
              value = p.orbitalPeriodDays;
              max = maxPeriod;
              formatted = `${p.orbitalPeriodDays.toLocaleString()} days (${p.orbitalPeriodLabel})`;
            }

            const widthPct = Math.max(2, (value / max) * 100);

            return (
              <div
                key={p.id}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/70"
              >
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    {p.name}
                    <span className="text-[11px] font-normal text-slate-400">
                      ({p.type})
                    </span>
                  </span>
                  <span className="font-mono text-indigo-200">{formatted}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: p.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Scientific Accuracy Note */}
        <div className="mt-5 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white">Why are 3D visual scales compressed?</strong> In true
            astronomical scale, if Earth were a 2.5mm marble, the Sun would be a 27cm basketball
            located 30 meters away, and Neptune would orbit nearly 1 kilometer away—rendering all
            planets invisible sub-pixel specks in a system-wide view. Our 3D visualization uses
            logarithmic-inspired orbital spacing and magnified planetary radii while preserving
            authentic relative order, axial tilts, orbital eccentricities, and exact NASA telemetry
            in all data cards.
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-slate-900/95 border border-sky-500/30 shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                LOCAL PROJECT SETUP & ARCHITECTURE
              </h2>
              <p className="text-xs text-slate-400">
                How to run this React Three Fiber application locally
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <h3 className="text-sm font-semibold text-sky-300 mb-2">
              1. Quick Start Commands (Vite + React)
            </h3>
            <pre className="font-mono text-[11px] text-emerald-300 bg-slate-900/90 p-3 rounded-lg overflow-x-auto">
{`npm create vite@latest solar-system-explorer -- --template react
cd solar-system-explorer
npm install three lucide-react
npm install -D tailwindcss postcss autoprefixer
npm run dev`}
            </pre>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <h4 className="font-semibold text-white mb-1">
                Zero-Dependency Procedural Textures
              </h4>
              <p className="text-slate-400">
                All planetary maps (Earth continents/clouds, Jupiter’s Great Red Spot, Saturn’s
                Cassini Division rings, Solar granulation) are synthesized dynamically on HTML5
                2D canvases using multi-octave Fractional Brownian Motion (fBm).
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <h4 className="font-semibold text-white mb-1">
                Keplerian Elliptical Orbits
              </h4>
              <p className="text-slate-400">
                Each planet computes true semi-major/semi-minor axes, focal offset{' '}
                <code>c = a · e</code>, orbital inclination, and axial obliquity (including
                retrograde Venus and 97.8° sideways Uranus).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1.0);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [realisticSpeeds, setRealisticSpeeds] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [overviewTrigger, setOverviewTrigger] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [simulatedDays, setSimulatedDays] = useState(0);

  const selectedBody = useMemo(
    () => CELESTIAL_DATA.find((b) => b.id === selectedId) || null,
    [selectedId]
  );

  // Format live simulated mission date starting from current base epoch
  const formattedEpochDate = useMemo(() => {
    const baseMs = Date.UTC(2026, 9, 14);
    const curDate = new Date(baseMs + simulatedDays * 86400000);
    return curDate.toISOString().slice(0, 10);
  }, [simulatedDays]);

  const handleSelectBody = useCallback((id) => {
    setSelectedId(id);
    const idx = CELESTIAL_DATA.findIndex((b) => b.id === id);
    if (idx !== -1) setTourStep(idx);
  }, []);

  const handleReturnOverview = useCallback(() => {
    setSelectedId(null);
    setTourActive(false);
    setOverviewTrigger((prev) => prev + 1);
  }, []);

  const handleResetSimulation = useCallback(() => {
    setSelectedId(null);
    setTourActive(false);
    setSimSpeed(1.0);
    setIsPaused(false);
    setSimulatedDays(0);
    setResetSignal((prev) => prev + 1);
    setOverviewTrigger((prev) => prev + 1);
  }, []);

  const startGuidedTour = useCallback(() => {
    setTourActive(true);
    setTourStep(0);
    setSelectedId(CELESTIAL_DATA[0].id);
  }, []);

  const stepTour = useCallback((direction) => {
    setTourStep((prev) => {
      const next = (prev + direction + CELESTIAL_DATA.length) % CELESTIAL_DATA.length;
      setSelectedId(CELESTIAL_DATA[next].id);
      return next;
    });
  }, []);

  // Keyboard shortcuts for convenience
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleReturnOverview();
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        setIsPaused((p) => !p);
      } else if (e.key === 'ArrowRight' && tourActive) {
        stepTour(1);
      } else if (e.key === 'ArrowLeft' && tourActive) {
        stepTour(-1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleReturnOverview, tourActive, stepTour]);

  return (
    <div className="relative w-full h-screen bg-[#010308] text-slate-100 overflow-hidden select-none font-sans">
      {/* Fullscreen Interactive 3D WebGL Viewport */}
      <div className="absolute inset-0 z-0">
        <SolarSystemViewport
          selectedId={selectedId}
          onSelect={handleSelectBody}
          showOrbits={showOrbits}
          showLabels={showLabels}
          isPaused={isPaused}
          simSpeed={simSpeed}
          realisticSpeeds={realisticSpeeds}
          resetSignal={resetSignal}
          overviewTrigger={overviewTrigger}
          onEpochTick={setSimulatedDays}
        />
      </div>

      {/* Top Futuristic Navigation Bar */}
      <header className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-950/65 backdrop-blur-xl border-b border-indigo-500/20 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-200"
            title="Toggle Planet Directory"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div
            onClick={handleReturnOverview}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-indigo-600 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold tracking-widest bg-gradient-to-r from-white via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                  SOLAR SYSTEM EXPLORER
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                  J2000 TELEMETRY
                </span>
                <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-900/90 border border-slate-700/80 text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  EPOCH {formattedEpochDate}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Interactive 3D Orrery • Click any celestial body to lock camera & inspect
              </p>
            </div>
          </div>
        </div>

        {/* Top Action Controls */}
        <div className="flex items-center gap-2">
          {selectedId && (
            <button
              onClick={handleReturnOverview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full System View</span>
            </button>
          )}

          <button
            onClick={() => (tourActive ? setTourActive(false) : startGuidedTour())}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              tourActive
                ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-200'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${tourActive ? 'animate-spin' : 'text-amber-400'}`} />
            <span className="hidden sm:inline">
              {tourActive ? 'Exit Guided Tour' : 'Guided Tour'}
            </span>
          </button>

          <button
            onClick={() => setIsComparisonOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition"
            title="Compare Planet Sizes & Orbits"
          >
            <Scale className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Compare Planets</span>
          </button>

          <button
            onClick={() => setIsArchOpen(true)}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition"
            title="Local Setup & Technical Specs"
          >
            <Code className="w-4 h-4 text-indigo-400" />
          </button>
        </div>
      </header>

      {/* Left Compact Celestial Directory Panel */}
      <aside
        className={`fixed lg:static top-16 left-4 z-20 w-56 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'
        } lg:mt-4 lg:ml-4`}
      >
        <div className="rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-slate-800/90 shadow-2xl p-2.5">
          <div className="flex items-center justify-between px-2 py-1.5 mb-1 border-b border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              Celestial Bodies
            </span>
            <button
              onClick={handleReturnOverview}
              className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition ${
                !selectedId
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
          </div>

          <div className="space-y-1 max-h-[62vh] overflow-y-auto pr-0.5">
            {CELESTIAL_DATA.map((body) => {
              const active = selectedId === body.id;
              return (
                <button
                  key={body.id}
                  onClick={() => {
                    handleSelectBody(body.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all ${
                    active
                      ? 'bg-gradient-to-r from-indigo-600/40 to-sky-500/20 border border-indigo-400/60 text-white shadow-md'
                      : 'hover:bg-slate-900/80 border border-transparent text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${body.accentColor}, ${body.color})`,
                        boxShadow: active ? `0 0 10px ${body.color}` : 'none'
                      }}
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold leading-tight truncate">
                        {body.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {body.id === 'sun' ? 'G2V Star' : `${body.distanceAU} AU`}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      active ? 'text-indigo-300 translate-x-0.5' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Scale Disclaimers & Quick Toggles */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 px-1.5 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Speed Mode</span>
              <button
                onClick={() => setRealisticSpeeds((r) => !r)}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 font-medium transition"
                title="Switch between Keplerian ratios and Harmonized visibility speeds"
              >
                {realisticSpeeds ? 'Keplerian Ratio' : 'Educational'}
              </button>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/75 border border-slate-800 text-[10px] text-slate-400 leading-snug">
              <div className="flex items-center justify-between text-slate-300 font-semibold mb-0.5">
                <span>Hybrid Visual Scale</span>
                <span>1 AU ≈ 24.5 u</span>
              </div>
              Distances & radii are visually scaled for 3D clarity; all telemetry cards show exact
              NASA measurements.
            </div>
          </div>
        </div>
      </aside>

      {/* Guided Educational Tour Floating Narration Card */}
      {tourActive && selectedBody && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-lg rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-amber-400/40 shadow-2xl shadow-amber-950/30 p-4 animate-fadeIn">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Guided Solar System Tour • Stop {tourStep + 1} of {CELESTIAL_DATA.length}
            </span>
            <button
              onClick={() => setTourActive(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h3 className="text-sm font-bold text-white mb-1">
            {selectedBody.name}: <span className="text-amber-200 font-normal">{selectedBody.subtitle}</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {selectedBody.tourNarration}
          </p>
          <div className="flex items-center justify-between">
            <button
              onClick={() => stepTour(-1)}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>
            <div className="flex gap-1">
              {CELESTIAL_DATA.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setTourStep(idx);
                    setSelectedId(b.id);
                  }}
                  className={`w-2 h-2 rounded-full transition ${
                    idx === tourStep ? 'bg-amber-400 w-4' : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => stepTour(1)}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition"
            >
              Next Stop
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Right Scientific Planet Information Panel */}
      {selectedBody && (
        <aside className="fixed top-16 right-4 bottom-24 z-20 w-[90vw] sm:w-88 md:w-96 flex flex-col rounded-2xl bg-slate-950/78 backdrop-blur-xl border border-indigo-500/30 shadow-2xl overflow-hidden animate-fadeIn">
          {/* Planet Header Banner */}
          <div
            className="p-4 border-b border-slate-800/80 relative overflow-hidden shrink-0"
            style={{
              background: `linear-gradient(135deg, ${selectedBody.color}28 0%, rgba(15,23,42,0.9) 100%)`
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full shrink-0 shadow-lg border border-white/20"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${selectedBody.accentColor}, ${selectedBody.color} 70%, #050811 100%)`,
                    boxShadow: `0 0 20px ${selectedBody.color}55`
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-white tracking-wide">
                      {selectedBody.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900/90 border border-slate-700 text-slate-300">
                      {selectedBody.type}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200/90">{selectedBody.subtitle}</p>
                </div>
              </div>
              <button
                onClick={handleReturnOverview}
                className="p-1.5 rounded-lg bg-slate-900/70 hover:bg-slate-800 text-slate-400 hover:text-white transition"
                title="Close & Return to Overview (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Telemetry & Scientific Facts */}
          <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
            <p className="text-slate-300 leading-relaxed">{selectedBody.description}</p>

            {/* Primary Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">
                  Equatorial Diameter
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {selectedBody.realDiameterKm.toLocaleString()} km
                </div>
                <div className="text-[10px] text-indigo-300">
                  {selectedBody.earthDiameterRatio}x Earth Diameter
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">
                  Distance from Sun
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {selectedBody.id === 'sun'
                    ? '0 km (Center)'
                    : `${selectedBody.realDistanceMKm.toLocaleString()}M km`}
                </div>
                <div className="text-[10px] text-indigo-300">
                  {selectedBody.distanceAU} Astronomical Units
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">
                  Orbital Period (Year)
                </div>
                <div className="text-xs font-bold text-white mt-0.5">
                  {selectedBody.orbitalPeriodLabel}
                </div>
                <div className="text-[10px] text-slate-400">
                  Eccentricity: {selectedBody.eccentricity}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">
                  Rotation Period (Day)
                </div>
                <div className="text-xs font-bold text-white mt-0.5">
                  {selectedBody.rotationPeriodLabel}
                </div>
                <div className="text-[10px] text-slate-400">
                  Axial Tilt: {selectedBody.axialTiltDeg}°
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">
                  Temperature Range
                </div>
                <div className="text-xs font-bold text-amber-300 mt-0.5">
                  {selectedBody.temperatureLabel}
                </div>
                <div className="text-[10px] text-slate-400">
                  Gravity: {selectedBody.gravity}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">
                  Confirmed Moons
                </div>
                <div className="text-sm font-bold text-sky-300 mt-0.5 flex items-center gap-1.5">
                  <MoonIcon className="w-3.5 h-3.5" />
                  {selectedBody.moonsCount}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {selectedBody.moons.length > 0
                    ? `Rendered: ${selectedBody.moons.map((m) => m.name.split(' ')[0]).join(', ')}`
                    : 'No natural satellites'}
                </div>
              </div>
            </div>

            {/* Atmospheric Composition */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Atmospheric Composition
              </div>
              <div className="text-xs text-slate-200 font-medium">
                {selectedBody.atmosphere}
              </div>
            </div>

            {/* Scientific Highlights */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Key Scientific Facts
              </div>
              {selectedBody.facts.map((fact, index) => (
                <div
                  key={index}
                  className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-slate-300 leading-relaxed flex items-start gap-2"
                >
                  <span className="w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    {index + 1}
                  </span>
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Card Footer Navigation */}
          <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between shrink-0">
            <button
              onClick={handleReturnOverview}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition flex items-center gap-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              Return to Solar System
            </button>
            <button
              onClick={() => setIsComparisonOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 text-xs font-medium text-indigo-200 transition flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              Compare Size
            </button>
          </div>
        </aside>
      )}

      {/* Bottom Docked Simulation & Orbital Controls Bar */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-3xl rounded-2xl bg-slate-950/75 backdrop-blur-xl border border-slate-800/90 shadow-2xl px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Play / Pause & Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused((p) => !p)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md ${
                isPaused
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              )}
            </button>

            <button
              onClick={handleResetSimulation}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition"
              title="Reset Orbits & Camera"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Simulation Speed Slider & Quick Multipliers */}
          <div className="flex items-center gap-3 flex-1 min-w-[180px] max-w-xs">
            <Sliders className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Orbital Speed</span>
                <span className="font-mono text-indigo-300 font-semibold">
                  {simSpeed.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={simSpeed}
                onChange={(e) => setSimSpeed(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
            <div className="hidden sm:flex items-center gap-1">
              {[0.5, 1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSimSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                    Math.abs(simSpeed - spd) < 0.05
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Visual Layer Toggles */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowOrbits((o) => !o)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition ${
                showOrbits
                  ? 'bg-indigo-500/20 border-indigo-400/50 text-indigo-200'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Elliptical Orbit Lines"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Orbits</span>
            </button>

            <button
              onClick={() => setShowLabels((l) => !l)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition ${
                showLabels
                  ? 'bg-sky-500/20 border-sky-400/50 text-sky-200'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Floating Planet Labels"
            >
              {showLabels ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Labels</span>
            </button>

            <button
              onClick={() => setRealisticSpeeds((r) => !r)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition ${
                realisticSpeeds
                  ? 'bg-purple-500/20 border-purple-400/50 text-purple-200'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle True Keplerian Relative Orbital Speeds"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {realisticSpeeds ? 'Kepler Speeds' : 'Harmony Speeds'}
              </span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals for Planetary Comparison & Local Setup Instructions */}
      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        onSelectPlanet={handleSelectBody}
      />
      <ArchitectureModal
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />
    </div>
  );
}