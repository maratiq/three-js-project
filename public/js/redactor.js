import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';
import {Cube, Circle, Cone, Cylinder, Dodecahedron, Icosahedron, Plane, Sphere} from '../js/geometries.js';

class MinMaxGUIHelper {
  constructor(obj, minProp, maxProp, minDif) {
    this.obj = obj;
    this.minProp = minProp;
    this.maxProp = maxProp;
    this.minDif = minDif;
  }
  get min() {
    return this.obj[this.minProp];
  }
  set min(v) {
    this.obj[this.minProp] = v;
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
  }
  get max() {
    return this.obj[this.maxProp];
  }
  set max(v) {
    this.obj[this.maxProp] = v;
    this.min = this.min;  // this will call the min setter
  }
}

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name);
  folder.add(vector3, 'x', -100, 100).onChange(onChangeFn);
  folder.add(vector3, 'y', 0, 100).onChange(onChangeFn);
  folder.add(vector3, 'z', -100, 100).onChange(onChangeFn);
  folder.open();
}

class AmbientLight {
  constructor(scene) {
    this.scene = scene;
    this.color = 0xFFFFFF;
    this.intensity = 0.5;
    this.light = new THREE.AmbientLight(this.color, this.intensity);
  }

  addLight() {
    this.scene.add(this.light);
  }

  addGUI() {
    const gui = new GUI();
    const lightFolder = gui.addFolder('Источник окружающего света');
    lightFolder.addColor(new ColorGUIHelper(this.light, 'color'), 'value').name('color');
    lightFolder.add(this.light, 'intensity', 0, 2, 0.01);
  }
}

class Light {
  constructor(scene) {
    this.scene = scene;
    this.color =  0xFFFFFF;
    this.intensity = 1;
    this.light = new THREE.PointLight(this.color, this.intensity);
    this.helper = new THREE.PointLightHelper(this.light);
    this.updateLight = this.updateLight.bind(this);
  }

  addLight() {
    this.light.position.set(0, 10, 0);
    this.scene.add(this.light);
  }

  addHelper() {
    this.scene.add(this.helper);
  }

  updateLight() {
    this.helper.update();
  }

  addGUI() {
    const gui = new GUI();
    const lightFolder = gui.addFolder('Источник света');
    lightFolder.addColor(new ColorGUIHelper(this.light, 'color'), 'value').name('color');
    lightFolder.add(this.light, 'intensity', 0, 2, 0.01);
    lightFolder.add(this.light, 'distance', 0, 40).onChange(this.updateLight());
    makeXYZGUI(lightFolder, this.light.position, 'Позиция света');
  }
  
}

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  let cubeIndex = 0;
  let sphereIndex = 0;
  let coneIndex = 0;
  let cylinderIndex = 0;
  let planeIndex = 0;
  let circleIndex = 0;
  let dodecahedronIndex = 0;
  let icosahedronIndex = 0;

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);



  function updateCamera() {
    camera.updateProjectionMatrix();
  }

  const addGeometries = {
  	addCube: function () {
      const cube = new Cube(cubeIndex, scene, gui, 4);
      cube.addGeometry();
      cube.addGUIFolder('Cube');
      cubeIndex += 1;
	  },
    addSphere: function () {
      const sphere = new Sphere(sphereIndex, scene, gui, 4);
      sphere.addGeometry();
      sphere.addGUIFolder('Sphere');
      sphereIndex += 1;
    },
  	addCone: function () {
      const cone = new Cone(coneIndex, scene, gui, 4);
      cone.addGeometry();
      cone.addGUIFolder('Cone');
      coneIndex += 1;
	  },
    addCylinder: function () {
      const cylinder = new Cylinder(cylinderIndex, scene, gui, 4);
      cylinder.addGeometry();
      cylinder.addGUIFolder('Cylinder');
      cylinderIndex += 1;
    },
    addPlane: function () {
      const plane = new Plane(planeIndex, scene, gui);
      plane.addGeometry();
      plane.addGUIFolder('Plane');
      planeIndex += 1;
	  },
    addCircle: function () {
      const circle = new Circle(circleIndex, scene, gui);
      circle.addGeometry();
      circle.addGUIFolder('Circle');
      circleIndex += 1;
	  },
    addDodecahedron: function () {
      const dodecahedron = new Dodecahedron(dodecahedronIndex, scene, gui, 4)
      dodecahedron.addGeometry();
      dodecahedron.addGUIFolder('Dodecahedron');
      dodecahedronIndex += 1;
    },
    addIcosahedron: function () {
      const icosahedron = new Icosahedron(icosahedronIndex, scene, gui, 4)
      icosahedron.addGeometry();
      icosahedron.addGUIFolder('Icosahedron');
      icosahedronIndex += 1;
    },
  };

  const gui = new GUI();
  gui.width = 500;
  const cameraFolder = gui.addFolder('Камера');
  cameraFolder.add(camera, 'fov', 1, 180).onChange(updateCamera);
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
  cameraFolder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
  cameraFolder.add(minMaxGUIHelper, 'max', 0.1, 100, 0.1).name('far').onChange(updateCamera);

  gui.add(addGeometries, 'addCube')
	  .name('Добавить куб');
  gui.add(addGeometries, 'addSphere')
	  .name('Добавить сферу');
  gui.add(addGeometries, 'addCone')
	  .name('Добавить конус');
  gui.add(addGeometries, 'addCylinder')
	  .name('Добавить цилиндр');
  gui.add(addGeometries, 'addPlane')
	  .name('Добавить плоскость');
  gui.add(addGeometries, 'addCircle')
	  .name('Добавить круг');
  gui.add(addGeometries, 'addDodecahedron')
	  .name('Добавить додекаэдр');
  gui.add(addGeometries, 'addIcosahedron')
	  .name('Добавить икосаэдр');

  const controls = new OrbitControls(camera, canvas);
  controls.listenToKeyEvents( window );
  controls.target.set(0, 5, 0);
  controls.update();

  controls.screenSpacePanning = false;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('grey');

  //Добавление плоскости для сцены
  { 
    const planeSize = 400;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);

    const axes = new THREE.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 1;
    mesh.add(axes);
  }

  //Добавление источника света
  {
    const light = new Light(scene);
    light.addLight();
    light.addHelper();
    light.addGUI();

    const ambientLight = new AmbientLight(scene);
    ambientLight.addLight();
    ambientLight.addGUI();
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
