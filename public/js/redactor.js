import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

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

class Geometry {
  constructor(index, scene, gui) {
    this.gui = gui;
    this.scene = scene;
    this.index = index;
    this.geometry = null;
    this.material = new THREE.MeshPhongMaterial({color: '#8AC'});
    this.mesh = null;
  }

  addGeometry() {
    this.mesh.position.set(0, 0, 0);
		this.scene.add(this.mesh);
  }

  addGUIFolder(name) {
    const folder = this.gui.addFolder(name + Number(this.index + 1));
		folder.add(this.mesh.position, 'x', -10, 10);
		folder.add(this.mesh.position, 'y', -10, 10);
		folder.add(this.mesh.position, 'z', -10, 10);
		folder.add(this.mesh.scale, 'x', 0, 10)
            .name('Ширина');
    folder.add(this.mesh.scale, 'y', 0, 10)
            .name('Высота');
    folder.add(this.mesh.scale, 'z', 0, 10)
            .name('Глубина');
    folder.addColor(new ColorGUIHelper(this.material,'color'),'value');
  }
}

class Cube extends Geometry {
  constructor(index, scene, gui, size) {
    super(index, scene, gui);
    this.size = size;
    this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
}

class Sphere extends Geometry {
  constructor(index, scene, gui, radius) {
    super(index, scene, gui);
    this.radius = radius;
    this.widthDivisions = 32;
    this.heightDivisions = 16;
    this.geometry = new THREE.SphereGeometry(this.radius, this.widthDivisions, this.heightDivisions);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
}

class Cone extends Geometry {
  constructor(index, scene, gui, radius) {
    super(index, scene, gui);
    this.radius = radius;
  	this.height = 6;
  	this.radialSegments = 16;
    this.geometry = new THREE.ConeGeometry(this.radius, this.height, this.radialSegments);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
}

class Cylinder extends Geometry {
  constructor(index, scene, gui, radius) {
    super(index, scene, gui);
    this.radiusTop = radius;
    this.radiusBottom = radius;
    this.height = 6;
    this.radialSegments = 16;
    this.geometry = new THREE.CylinderGeometry(this.radiusTop, this.radiusTop, this.height, this.radialSegments);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
}

class Plane extends Geometry {
  constructor(index, scene, gui) {
    super(index, scene, gui);
    this.width = 3;
    this.height = 3;
    this.geometry = new THREE.PlaneGeometry(this.width, this.height);
    this.material = new THREE.MeshPhongMaterial({color: '#CA8',  side: THREE.DoubleSide});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
}

class Circle extends Geometry {
  constructor(index, scene, gui) {
    super(index, scene, gui);
    this.radius = 4;
    this.segments = 24;
    this.geometry = new THREE.CircleGeometry(this.radius, this.segments);
    this.material = new THREE.MeshPhongMaterial({color: '#CA8',  side: THREE.DoubleSide});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
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

  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
  }

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
      const radius = 3;
      const geometry = new THREE.DodecahedronGeometry(radius);
      const material = new THREE.MeshPhongMaterial({color: '#CA8',  side: THREE.DoubleSide});
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, radius + 2, 0);
      scene.add(mesh);
      const dodecahedronFolder = gui.addFolder('Dodecahedron' + Number(dodecahedronIndex + 1));
      dodecahedronFolder.add(mesh.position, 'x', -10, 10);
      dodecahedronFolder.add(mesh.position, 'y', -10, 10);
      dodecahedronFolder.add(mesh.position, 'z', -10, 10);
      dodecahedronFolder.add(mesh.scale, 'x', 0, 10)
                  .name('Ширина');
      dodecahedronFolder.add(mesh.scale, 'y', 0, 10)
                  .name('Высота');
      dodecahedronFolder.addColor(new ColorGUIHelper(material, 'color'), 'value');
      dodecahedronIndex += 1;
    },
    addIcosahedron: function () {
      const radius = 3;
      const geometry = new THREE.IcosahedronGeometry(radius);
      const material = new THREE.MeshPhongMaterial({color: '#CA8',  side: THREE.DoubleSide});
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, radius + 2, 0);
      scene.add(mesh);
      const icosahedronFolder = gui.addFolder('Icosahedron' + Number(icosahedronIndex + 1));
      icosahedronFolder.add(mesh.position, 'x', -10, 10);
      icosahedronFolder.add(mesh.position, 'y', -10, 10);
      icosahedronFolder.add(mesh.position, 'z', -10, 10);
      icosahedronFolder.add(mesh.scale, 'x', 0, 10)
                  .name('Ширина');
      icosahedronFolder.add(mesh.scale, 'y', 0, 10)
                  .name('Высота');
      icosahedronFolder.addColor(new ColorGUIHelper(material, 'color'), 'value');
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
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('grey');

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

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, 10, 0);
    scene.add(light);

    const helper = new THREE.PointLightHelper(light);
    scene.add(helper);

    function updateLight() {
      helper.update();
    }

    const gui = new GUI();
    const lightFolder = gui.addFolder('Источник света');
    lightFolder.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    lightFolder.add(light, 'intensity', 0, 2, 0.01);
    lightFolder.add(light, 'distance', 0, 40).onChange(updateLight);

    makeXYZGUI(lightFolder, light.position, 'Позиция света');
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
