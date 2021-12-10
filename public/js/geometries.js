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
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshPhongMaterial({color: '#8AC'});
    this.mesh = null;
    this.wireframe = new THREE.WireframeGeometry( this.geometry );
    this.line = new THREE.LineSegments( this.wireframe );
  }

  addGeometry() {
    this.mesh.position.set(0, 0, 0);
    this.scene.add(this.mesh);
    this.mesh.add(this.line);
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
    this.update();
  }

  update() {
    this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
    updateGroupGeometry(this.mesh, this.geometry, this.line);
  }
}

function updateGroupGeometry( mesh, geometry, line ) {
  mesh.geometry.dispose();
  line.geometry.dispose();

  mesh.geometry = geometry;
  line.geometry = geometry;
}

class Sphere extends Geometry {
  constructor(index, scene, gui, radius) {
    super(index, scene, gui);
    this.radius = radius;
    this.widthDivisions = 32;
    this.heightDivisions = 16;
    this.geometry = new THREE.SphereGeometry(this.radius, this.widthDivisions, this.heightDivisions);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.update();
  }

  update() {
    this.geometry = new THREE.SphereGeometry(this.radius, this.widthDivisions, this.heightDivisions);
    updateGroupGeometry(this.mesh, this.geometry, this.line);
  }

  addGUIFolder(name) {
    const folder = this.gui.addFolder(name + Number(this.index + 1));
		folder.add(this.mesh.position, 'x', -10, 10);
		folder.add(this.mesh.position, 'y', -10, 10);
		folder.add(this.mesh.position, 'z', -10, 10);
    folder.add(this, 'radius', 0, 10).onChange(() => {
      this.update();
  })
    folder.addColor(new ColorGUIHelper(this.material,'color'),'value');
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
    this.update();
  }

  update() {
    this.geometry = new THREE.ConeGeometry(this.radius, this.height, this.radialSegments);
    updateGroupGeometry(this.mesh, this.geometry, this.line);
  }

  addGUIFolder(name) {
    const folder = this.gui.addFolder(name + Number(this.index + 1));
		folder.add(this.mesh.position, 'x', -10, 10);
		folder.add(this.mesh.position, 'y', -10, 10);
		folder.add(this.mesh.position, 'z', -10, 10);
    folder.add(this, 'radius', 0, 10).onChange(() => {
      this.update();
    });
    folder.add(this, 'height', 0, 10).onChange(() => {
      this.update();
    });
    folder.addColor(new ColorGUIHelper(this.material,'color'),'value');
  }
}

class Cylinder extends Geometry {
  constructor(index, scene, gui, radius) {
    super(index, scene, gui);
    this.radius = radius;
    this.height = 6;
    this.radialSegments = 16;
    this.geometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height, this.radialSegments);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.update();
  }

  update() {
    this.geometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height, this.radialSegments);
    updateGroupGeometry(this.mesh, this.geometry, this.line);
  }

  addGUIFolder(name) {
    const folder = this.gui.addFolder(name + Number(this.index + 1));
		folder.add(this.mesh.position, 'x', -10, 10);
		folder.add(this.mesh.position, 'y', -10, 10);
		folder.add(this.mesh.position, 'z', -10, 10);
    folder.add(this, 'radius', 0, 10).onChange(() => {
      this.update();
    });
    folder.add(this, 'height', 0, 10).onChange(() => {
      this.update();
    });
    folder.addColor(new ColorGUIHelper(this.material,'color'),'value');
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
    this.update();
  }

  update() {
    this.geometry = new THREE.PlaneGeometry(this.width, this.height);
    updateGroupGeometry(this.mesh, this.geometry, this.line);
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
    this.update();
  }

  update() {
    this.geometry = new THREE.CircleGeometry(this.radius, this.segments);
    updateGroupGeometry(this.mesh, this.geometry, this.line);
  }

  addGUIFolder(name) {
    const folder = this.gui.addFolder(name + Number(this.index + 1));
		folder.add(this.mesh.position, 'x', -10, 10);
		folder.add(this.mesh.position, 'y', -10, 10);
		folder.add(this.mesh.position, 'z', -10, 10);
    folder.add(this, 'radius', 0, 10).onChange(() => {
      this.update();
    });
    folder.addColor(new ColorGUIHelper(this.material,'color'),'value');
  }
}

class Dodecahedron extends Geometry {
  constructor(index, scene, gui, radius) {
    super(index, scene, gui);
    this.radius = radius;
    this.geometry = new THREE.DodecahedronGeometry(this.radius);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.update();
  }

  update() {
    this.geometry = new THREE.DodecahedronGeometry(this.radius);
    updateGroupGeometry(this.mesh, this.geometry, this.line);
  }

  addGUIFolder(name) {
    const folder = this.gui.addFolder(name + Number(this.index + 1));
		folder.add(this.mesh.position, 'x', -10, 10);
		folder.add(this.mesh.position, 'y', -10, 10);
		folder.add(this.mesh.position, 'z', -10, 10);
    folder.add(this, 'radius', 0, 10).onChange(() => {
      this.update();
    });
    folder.addColor(new ColorGUIHelper(this.material,'color'),'value');
  }
}

class Icosahedron extends Geometry {
  constructor(index, scene, gui, radius) {
    super(index, scene, gui);
    this.radius = radius;
    this.geometry = new THREE.IcosahedronGeometry(this.radius);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.update();
  }

  update() {
    this.geometry = new THREE.IcosahedronGeometry(this.radius);
    updateGroupGeometry(this.mesh, this.geometry, this.line);
  }

  addGUIFolder(name) {
    const folder = this.gui.addFolder(name + Number(this.index + 1));
		folder.add(this.mesh.position, 'x', -10, 10);
		folder.add(this.mesh.position, 'y', -10, 10);
		folder.add(this.mesh.position, 'z', -10, 10);
    folder.add(this, 'radius', 0, 10).onChange(() => {
      this.update();
    });
    folder.addColor(new ColorGUIHelper(this.material,'color'),'value');
  }
}

export {Cube, Circle, Cone, Cylinder, Dodecahedron, Icosahedron, Plane, Sphere}