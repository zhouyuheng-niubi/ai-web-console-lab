import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class ThreeJSSceneManager {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.animationId = null;
    this.factoryModel = null;
    this.accidentAnimation = null;
    this.modelLoaded = false; // 添加模型加载状态标记
    this.loadingPromise = null; // 存储加载Promise
    this.loadingText = null; // 加载提示文本
    this.onModelLoaded = null; // 模型加载完成回调
    
    // 初始化静态属性
    if (typeof ThreeJSSceneManager.sharedModel === 'undefined') {
      ThreeJSSceneManager.sharedModel = null;
    }
    if (typeof ThreeJSSceneManager.modelLoadingPromise === 'undefined') {
      ThreeJSSceneManager.modelLoadingPromise = null;
    }
  }

  // 静态方法：获取单例模型实例
  static getModelInstance() {
    return ThreeJSSceneManager.sharedModel;
  }

  init() {
    if (!this.container) {
      console.error('Three.js 容器不存在');
      return;
    }

    // 清除之前的内容
    this.container.innerHTML = '';

    // 获取容器尺寸
    const containerRect = this.container.getBoundingClientRect();
    const width = containerRect.width || 800;
    const height = containerRect.height || 500;

    // 创建场景
    this.scene = new THREE.Scene();
    
    // 加载天空背景图片
    const loader = new THREE.TextureLoader();
    loader.load(
      '/src/assets/sky.jpg',
      (texture) => {
        this.scene.background = texture;
        console.log('天空背景图片加载成功');
      },
      (progress) => {
        console.log('背景图片加载进度:', Math.round((progress.loaded / progress.total) * 100) + '%');
      },
      (error) => {
        console.warn('背景图片加载失败，使用默认天空蓝背景:', error);
        this.scene.background = new THREE.Color(0x87CEEB); // 天空蓝背景
      }
    );

    // 创建相机 - 根据用户拖动数据优化初始视角
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    
    // 根据用户拖动数据优化初始视角 - 调整到更近的距离
    // 用户实际使用距离约30，我们设置为更近的20-25距离
    this.camera.position.set(42.35, 4.6, -30.65);
    this.camera.lookAt(0, 0, 0);

    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.container.appendChild(this.renderer.domElement);

    // 添加灯光
    this.setupLighting();

    // 添加地面
    // this.setupGround();

    // 添加网格辅助线
    const gridHelper = new THREE.GridHelper(200, 20, 0x444444, 0x888888);
    this.scene.add(gridHelper);

    // 添加坐标轴辅助线
    // const axesHelper = new THREE.AxesHelper(20);
    // this.scene.add(axesHelper);

    // 添加轨道控制器
    this.setupControls();

    // 添加加载提示文本
    this.createLoadingText();
    
    // 加载工厂GLB模型（只加载一次）
    this.loadFactoryModelOnce();

    // 开始渲染循环
    this.animate();

    console.log('Three.js 场景管理器初始化完成');
  }

  setupLighting() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    // 主方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // 补充光源
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-50, 50, -50);
    this.scene.add(fillLight);
  }

  setupGround() {
    // 主地面
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // 添加道路
    const roadGeometry = new THREE.PlaneGeometry(10, 100);
    const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const road1 = new THREE.Mesh(roadGeometry, roadMaterial);
    road1.rotation.x = -Math.PI / 2;
    road1.position.set(0, 0.01, 0);
    this.scene.add(road1);

    const road2 = new THREE.Mesh(roadGeometry, roadMaterial);
    road2.rotation.x = -Math.PI / 2;
    road2.rotation.z = Math.PI / 2;
    road2.position.set(0, 0.01, 0);
    this.scene.add(road2);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 8;  // 允许更近的观察距离
    this.controls.maxDistance = 80;  // 适当减小最大距离
    this.controls.maxPolarAngle = Math.PI / 2;
    
    // 修改鼠标控制行为：
    // 左键：平移视角 (Pan)
    // 右键：旋转视角 (Orbit)
    // 中键：缩放 (Dolly/Zoom)
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,      // 左键平移
      MIDDLE: THREE.MOUSE.DOLLY,   // 中键缩放
      RIGHT: THREE.MOUSE.ROTATE    // 右键旋转
    };
    
    // 或者保持默认但添加快捷键：
    // 按住 Shift + 左键 也可以平移
    this.controls.enablePan = true;
    
    // 添加相机位置变化的监听器
    // this.setupCameraInfoListener();
  }

  // 设置相机信息监听器
  setupCameraInfoListener() {
    // 存储上一次的位置信息，用于检测变化
    let lastCameraInfo = null;
    
    // 创建一个函数来获取并输出相机信息
    const updateCameraInfo = () => {
      const cameraInfo = {
        // 相机位置
        position: {
          x: Math.round(this.camera.position.x * 100) / 100,
          y: Math.round(this.camera.position.y * 100) / 100,
          z: Math.round(this.camera.position.z * 100) / 100
        },
        // 相机目标点
        target: {
          x: Math.round(this.controls.target.x * 100) / 100,
          y: Math.round(this.controls.target.y * 100) / 100,
          z: Math.round(this.controls.target.z * 100) / 100
        },
        // 相机旋转（欧拉角）
        rotation: {
          x: Math.round(this.camera.rotation.x * 100) / 100,
          y: Math.round(this.camera.rotation.y * 100) / 100,
          z: Math.round(this.camera.rotation.z * 100) / 100
        },
        // 距离信息
        distance: Math.round(this.camera.position.distanceTo(this.controls.target) * 100) / 100,
        // 极坐标信息（更有用的角度信息）
        spherical: {
          radius: Math.round(this.controls.getDistance() * 100) / 100,
          polarAngle: Math.round(this.controls.getPolarAngle() * 180 / Math.PI * 100) / 100,
          azimuthAngle: Math.round(this.controls.getAzimuthalAngle() * 180 / Math.PI * 100) / 100
        }
      };
      
      // 只在信息发生变化时输出
      if (!lastCameraInfo || 
          JSON.stringify(cameraInfo) !== JSON.stringify(lastCameraInfo)) {
        console.log('📷 相机信息更新:', cameraInfo);
        
        // 可以通过回调函数将信息传递给外部
        if (this.onCameraUpdate) {
          this.onCameraUpdate(cameraInfo);
        }
        
        lastCameraInfo = { ...cameraInfo };
      }
    };
    
    // 在控制器的change事件中调用
    this.controls.addEventListener('change', updateCameraInfo);
    
    // 初始输出一次
    updateCameraInfo();
    
    // 也可以在渲染循环中定期检查（频率较低）
    let frameCount = 0;
    const originalAnimate = this.animate.bind(this);
    this.animate = () => {
      originalAnimate();
      frameCount++;
      // 每30帧检查一次（约0.5秒，假设60fps）
      if (frameCount % 30 === 0) {
        updateCameraInfo();
      }
    };
  }

  // 设置相机更新回调函数
  setCameraUpdateCallback(callback) {
    this.onCameraUpdate = callback;
  }

  // 设置模型加载完成回调函数
  setModelLoadedCallback(callback) {
    this.onModelLoaded = callback;
  }

  // 创建加载提示文本
  createLoadingText() {
    // 使用 Canvas 2D 创建简单的加载提示
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    // 设置文本样式
    context.fillStyle = '#ffffff';
    context.font = 'bold 42px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('正在加载工厂模型...', canvas.width / 2, canvas.height / 2);
    
    // 创建纹理
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // 创建精灵材质
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 1.0
    });
    
    // 创建精灵
    const sprite = new THREE.Sprite(spriteMaterial);
    const scaleFactor = 1.8; 
    sprite.scale.set(10 * scaleFactor, 2.5 * scaleFactor, 1); 
    sprite.position.set(10, 10, 10);
    
    this.loadingText = sprite;
    this.scene.add(this.loadingText);
    
    console.log('已添加加载提示文本');
  }

  // 更新加载提示文本
  updateLoadingText(text) {
    if (!this.loadingText) return;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    context.fillStyle = '#000';
    context.font = 'bold 32px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    this.loadingText.material.map = texture;
    this.loadingText.material.needsUpdate = true;
  }

  // 隐藏加载提示文本
  hideLoadingText() {
    if (this.loadingText) {
      this.scene.remove(this.loadingText);
      this.loadingText = null;
      console.log('已隐藏加载提示文本');
    }
  }

  // 只加载一次的工厂模型
  async loadFactoryModelOnce() {

    // 如果模型已经加载过，直接使用共享模型
    if (ThreeJSSceneManager.sharedModel && this.modelLoaded) {
      this.updateLoadingText('正在初始化场景...');
      this.factoryModel = ThreeJSSceneManager.sharedModel.clone();
      this.scene.add(this.factoryModel);
      this.hideLoadingText();
      // 触发加载完成回调
      if (this.onModelLoaded) {
        this.onModelLoaded();
      }
      return;
    }

    // 如果正在加载，等待加载完成
    if (ThreeJSSceneManager.modelLoadingPromise) {
      this.updateLoadingText('等待模型加载...');
      try {
        const model = await ThreeJSSceneManager.modelLoadingPromise;
        this.factoryModel = model.clone();
        this.scene.add(this.factoryModel);
        this.modelLoaded = true;
        this.hideLoadingText();
        // 触发加载完成回调
        if (this.onModelLoaded) {
          this.onModelLoaded();
        }
        return;
      } catch (error) {
        this.hideLoadingText();
      }
    }

    // 开始加载模型
    this.updateLoadingText('正在加载工厂模型...');
    ThreeJSSceneManager.modelLoadingPromise = this.loadModelFromDisk();
    
    try {
      const model = await ThreeJSSceneManager.modelLoadingPromise;
      ThreeJSSceneManager.sharedModel = model; // 保存为共享模型
      this.updateLoadingText('正在配置模型...');
      this.factoryModel = model.clone();
      this.scene.add(this.factoryModel);
      this.modelLoaded = true;
      this.hideLoadingText();
      // 触发加载完成回调
      if (this.onModelLoaded) {
        this.onModelLoaded();
      }
    } catch (error) {
      this.updateLoadingText('模型加载失败，使用简化场景...');
      setTimeout(() => {
        this.hideLoadingText();
        this.createFactoryScene();
        // 即使使用简化场景，也要触发回调
        if (this.onModelLoaded) {
          this.onModelLoaded();
        }
      }, 2000);
    }
  }

  // 从磁盘加载模型
  loadModelFromDisk() {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      const modelPath = '/src/assets/factory.glb';
      loader.load(
        modelPath,
        (gltf) => {
          const model = gltf.scene;
          
          // 调整模型位置、缩放和旋转
          model.position.set(0, 0, 0);
          model.scale.set(0.1, 0.1, 0.1); // 缩小到合适大小
          model.rotation.y = 0;
          
          // 确保模型投射和接收阴影
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          resolve(model);
        },
        (progress) => {
          if (progress.total > 0) {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            this.updateLoadingText(`加载中... ${percent}%`);
          } else {
            this.updateLoadingText('加载中...');
          }
        },
        (error) => {
          console.error('工厂模型加载失败:', error);
          reject(error);
        }
      );
    });
  }

  createFactoryScene() {
    // 创建建筑物
    this.createBuildings();
    
    // 创建管道系统
    this.createPipeSystem();
    
    // 创建储罐区
    this.createStorageTankArea();
    
    // 创建生产设备区
    this.createProductionArea();
  }

  createBuildings() {
    const buildingMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7355 });
    
    // 主生产车间
    const mainBuildingGeometry = new THREE.BoxGeometry(80, 25, 60);
    const mainBuilding = new THREE.Mesh(mainBuildingGeometry, buildingMaterial);
    mainBuilding.position.set(0, 12.5, 0);
    mainBuilding.castShadow = true;
    mainBuilding.receiveShadow = true;
    this.scene.add(mainBuilding);

    // 主车间屋顶
    const roofGeometry = new THREE.ConeGeometry(50, 15, 4);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 32.5, 0);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    this.scene.add(roof);

    // 办公楼
    const officeGeometry = new THREE.BoxGeometry(40, 20, 30);
    const office = new THREE.Mesh(officeGeometry, buildingMaterial);
    office.position.set(60, 10, 40);
    office.castShadow = true;
    office.receiveShadow = true;
    this.scene.add(office);

    // 控制室
    const controlRoomGeometry = new THREE.BoxGeometry(25, 12, 25);
    const controlRoom = new THREE.Mesh(controlRoomGeometry, buildingMaterial);
    controlRoom.position.set(-50, 6, 40);
    controlRoom.castShadow = true;
    controlRoom.receiveShadow = true;
    this.scene.add(controlRoom);

    // 控制室玻璃窗
    const windowGeometry = new THREE.BoxGeometry(20, 8, 1);
    const windowMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x87CEEB, 
      transparent: true, 
      opacity: 0.6 
    });
    const controlRoomWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    controlRoomWindow.position.set(-50, 8, 52.5);
    this.scene.add(controlRoomWindow);
  }

  createPipeSystem() {
    const pipeMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
    
    // 主要管道网络
    const pipes = [
      { pos: [0, 15, 0], rot: [0, 0, Math.PI / 2], scale: [1, 1, 100] },
      { pos: [40, 15, 0], rot: [0, 0, 0], scale: [1, 1, 40] },
      { pos: [-40, 15, 0], rot: [0, 0, 0], scale: [1, 1, 40] },
      { pos: [0, 15, 30], rot: [Math.PI / 2, 0, 0], scale: [1, 1, 80] },
      { pos: [0, 15, -30], rot: [Math.PI / 2, 0, 0], scale: [1, 1, 80] },
    ];

    pipes.forEach(pipeConfig => {
      const pipeGeometry = new THREE.CylinderGeometry(1.5, 1.5, 1, 16);
      const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
      
      pipe.position.set(...pipeConfig.pos);
      pipe.rotation.set(...pipeConfig.rot);
      pipe.scale.set(...pipeConfig.scale);
      pipe.castShadow = true;
      
      this.scene.add(pipe);
    });

    // 管道支架
    const supportMaterial = new THREE.MeshLambertMaterial({ color: 0x4A4A4A });
    const supports = [
      [20, 7.5, 0],
      [-20, 7.5, 0],
      [0, 7.5, 20],
      [0, 7.5, -20],
    ];

    supports.forEach(pos => {
      const supportGeometry = new THREE.CylinderGeometry(0.5, 0.5, 15);
      const support = new THREE.Mesh(supportGeometry, supportMaterial);
      support.position.set(...pos);
      support.castShadow = true;
      this.scene.add(support);
    });
  }

  createStorageTankArea() {
    const tankMaterial = new THREE.MeshLambertMaterial({ color: 0x4682B4 });
    const tankSupportMaterial = new THREE.MeshLambertMaterial({ color: 0x4A4A4A });
    const pipeMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 }); // 添加管道材质定义
    
    // 储罐组
    const tanks = [
      { pos: [-30, 12, -50], radius: 10, height: 24 },
      { pos: [0, 15, -50], radius: 12, height: 30 },
      { pos: [30, 10, -50], radius: 8, height: 20 },
      { pos: [-15, 8, -70], radius: 6, height: 16 },
      { pos: [15, 8, -70], radius: 6, height: 16 },
    ];

    tanks.forEach(tankConfig => {
      // 储罐主体
      const tankGeometry = new THREE.CylinderGeometry(tankConfig.radius, tankConfig.radius, tankConfig.height, 32);
      const tank = new THREE.Mesh(tankGeometry, tankMaterial);
      tank.position.set(...tankConfig.pos);
      tank.castShadow = true;
      tank.receiveShadow = true;
      this.scene.add(tank);

      // 储罐支架
      const supportGeometry = new THREE.CylinderGeometry(tankConfig.radius + 1, tankConfig.radius + 1, 2);
      const support = new THREE.Mesh(supportGeometry, tankSupportMaterial);
      support.position.set(tankConfig.pos[0], 1, tankConfig.pos[2]);
      support.castShadow = true;
      this.scene.add(support);

      // 储罐顶部管道接口
      const topPipeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5);
      const topPipe = new THREE.Mesh(topPipeGeometry, pipeMaterial);
      topPipe.position.set(tankConfig.pos[0], tankConfig.pos[1] + tankConfig.height / 2 + 2.5, tankConfig.pos[2]);
      topPipe.castShadow = true;
      this.scene.add(topPipe);
    });
  }

  createProductionArea() {
    const equipmentMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
    
    // 反应釜
    const reactorGeometry = new THREE.CapsuleGeometry(8, 20, 8, 16);
    const reactor1 = new THREE.Mesh(reactorGeometry, equipmentMaterial);
    reactor1.position.set(40, 14, 20);
    reactor1.rotation.z = Math.PI / 2;
    reactor1.castShadow = true;
    reactor1.receiveShadow = true;
    this.scene.add(reactor1);

    const reactor2 = new THREE.Mesh(reactorGeometry, equipmentMaterial);
    reactor2.position.set(40, 14, -20);
    reactor2.rotation.z = Math.PI / 2;
    reactor2.castShadow = true;
    reactor2.receiveShadow = true;
    this.scene.add(reactor2);

    // 分离塔
    const separatorGeometry = new THREE.CylinderGeometry(5, 7, 40, 16);
    const separator = new THREE.Mesh(separatorGeometry, equipmentMaterial);
    separator.position.set(-30, 20, 20);
    separator.castShadow = true;
    separator.receiveShadow = true;
    this.scene.add(separator);

    // 压缩机
    const compressorGeometry = new THREE.BoxGeometry(12, 8, 8);
    const compressorMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
    const compressor = new THREE.Mesh(compressorGeometry, compressorMaterial);
    compressor.position.set(-30, 4, 40);
    compressor.castShadow = true;
    compressor.receiveShadow = true;
    this.scene.add(compressor);
  }

  // 模拟事故动画
  simulateAccident(accidentType, position) {
    console.log(`模拟${accidentType}事故，位置:`, position);
    
    // 清除之前的事故效果
    this.clearAccidentEffects();
    
    switch (accidentType) {
      case 'gasLeak':
        this.simulateGasLeak(position);
        break;
      case 'fire':
        this.simulateFire(position);
        break;
      case 'explosion':
        this.simulateExplosion(position);
        break;
      case 'collapse':
        this.simulateCollapse(position);
        break;
      case 'electricShock':
        this.simulateElectricShock(position);
        break;
      default:
        console.warn('未知的事故类型:', accidentType);
    }
  }

  simulateGasLeak(position) {
    // 创建气体泄漏视觉效果
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = position.x + (Math.random() - 0.5) * 5;
      positions[i3 + 1] = position.y + Math.random() * 2;
      positions[i3 + 2] = position.z + (Math.random() - 0.5) * 5;
      
      velocities.push({
        x: (Math.random() - 0.5) * 0.1,
        y: Math.random() * 0.05,
        z: (Math.random() - 0.5) * 0.1
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x00ff00,
      size: 0.5,
      transparent: true,
      opacity: 0.6
    });

    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);

    // 动画更新粒子位置
    this.accidentAnimation = () => {
      const positions = particles.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i].x;
        positions[i3 + 1] += velocities[i].y;
        positions[i3 + 2] += velocities[i].z;
        
        // 风力影响
        positions[i3] += 0.05;
        positions[i3 + 2] += 0.02;
      }
      
      particles.geometry.attributes.position.needsUpdate = true;
    };

    particles.userData.velocities = velocities;
    this.scene.userData.accidentEffect = particles;
  }

  simulateFire(position) {
    // 创建火焰效果
    const flameCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(flameCount * 3);
    const colors = new Float32Array(flameCount * 3);
    const velocities = [];

    for (let i = 0; i < flameCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 3;
      const angle = Math.random() * Math.PI * 2;
      const height = Math.random() * 10; // 火焰高度
      
      positions[i3] = position.x + Math.cos(angle) * radius;
      positions[i3 + 1] = position.y + height;
      positions[i3 + 2] = position.z + Math.sin(angle) * radius;
      
      // 根据高度设置颜色：底部深红色，顶部亮黄色
      const heightRatio = height / 10; // 0 (底部) 到 1 (顶部)
      colors[i3] = 1; // R - 始终为最大值
      colors[i3 + 1] = 0.2 + heightRatio * 0.8; // G - 从0.2（深红）到1.0（亮黄）
      colors[i3 + 2] = 0; // B - 始终为0
      
      // 存储粒子速度用于动画
      velocities.push({
        x: (Math.random() - 0.5) * 0.05,
        y: Math.random() * 0.1 + 0.05, // 向上速度
        z: (Math.random() - 0.5) * 0.05,
        life: 1.0 // 粒子生命Maintainer期
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.NormalBlending // 改为正常混合模式
    });

    const flames = new THREE.Points(geometry, material);
    this.scene.add(flames);

    // 火焰动画
    let time = 0;
    this.accidentAnimation = () => {
      time += 0.05;
      const positions = flames.geometry.attributes.position.array;
      const colors = flames.geometry.attributes.color.array;
      
      for (let i = 0; i < flameCount; i++) {
        const i3 = i * 3;
        const velocity = velocities[i];
        
        // 更新位置
        positions[i3] += velocity.x + Math.sin(time + i) * 0.05;
        positions[i3 + 1] += velocity.y;
        positions[i3 + 2] += velocity.z + Math.cos(time + i) * 0.05;
        
        // 更新生命Maintainer期
        velocity.life -= 0.01;
        
        // 计算高度比例用于颜色
        const currentHeight = positions[i3 + 1] - position.y;
        const heightRatio = Math.min(Math.max(currentHeight / 10, 0), 1);
        
        // 根据高度和生命Maintainer期更新颜色
        const lifeIntensity = velocity.life;
        colors[i3] = 1; // R
        colors[i3 + 1] = (0.2 + heightRatio * 0.8) * lifeIntensity; // G
        colors[i3 + 2] = 0; // B
        
        // 重置粒子
        if (velocity.life <= 0 || currentHeight > 15) {
          const radius = Math.random() * 3;
          const angle = Math.random() * Math.PI * 2;
          
          positions[i3] = position.x + Math.cos(angle) * radius;
          positions[i3 + 1] = position.y;
          positions[i3 + 2] = position.z + Math.sin(angle) * radius;
          
          velocity.life = 1.0;
          velocity.y = Math.random() * 0.1 + 0.05;
          
          // 重置颜色为深红色
          colors[i3] = 1;
          colors[i3 + 1] = 0.2;
          colors[i3 + 2] = 0;
        }
      }
      
      flames.geometry.attributes.position.needsUpdate = true;
      flames.geometry.attributes.color.needsUpdate = true;
    };

    // 存储速度数组用于动画
    flames.userData.velocities = velocities;
    this.scene.userData.accidentEffect = flames;
  }

  simulateExplosion(position) {
    // 创建爆炸冲击波效果
    const shockwaveGeometry = new THREE.SphereGeometry(1, 32, 32);
    const shockwaveMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    const shockwave = new THREE.Mesh(shockwaveGeometry, shockwaveMaterial);
    shockwave.position.copy(position);
    this.scene.add(shockwave);

    // 爆炸粒子
    const particleCount = 2000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = Math.random() * 5 + 2;
      
      positions[i3] = position.x;
      positions[i3 + 1] = position.y;
      positions[i3 + 2] = position.z;
      
      velocities.push({
        x: Math.sin(phi) * Math.cos(theta) * speed,
        y: Math.sin(phi) * Math.sin(theta) * speed,
        z: Math.cos(phi) * speed
      });
      
      // 爆炸颜色（白到橙）
      const intensity = Math.random();
      colors[i3] = 1; // R
      colors[i3 + 1] = 0.5 + intensity * 0.5; // G
      colors[i3 + 2] = intensity * 0.3; // B
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(particles);

    // 爆炸动画
    let shockwaveScale = 1;
    let shockwaveOpacity = 0.8;
    
    this.accidentAnimation = () => {
      // 冲击波扩散
      shockwaveScale += 0.5;
      shockwaveOpacity -= 0.01;
      
      if (shockwaveOpacity > 0) {
        shockwave.scale.setScalar(shockwaveScale);
        shockwaveMaterial.opacity = shockwaveOpacity;
      } else {
        this.scene.remove(shockwave);
      }
      
      // 粒子运动
      const positions = particles.geometry.attributes.position.array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i].x;
        positions[i3 + 1] += velocities[i].y;
        positions[i3 + 2] += velocities[i].z;
        
        // 重力影响
        velocities[i].y -= 0.1;
      }
      
      particles.geometry.attributes.position.needsUpdate = true;
      
      // 逐渐透明
      if (particleMaterial.opacity > 0) {
        particleMaterial.opacity -= 0.005;
      }
    };

    particles.userData.velocities = velocities;
    this.scene.userData.accidentEffect = particles;
    this.scene.userData.shockwave = shockwave;
  }

  simulateCollapse(position) {
    console.log('模拟坍塌事故，位置:', position);
    
    // 创建坍塌结构碎片
    const debrisCount = 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(debrisCount * 3);
    const velocities = [];
    const colors = new Float32Array(debrisCount * 3);
    const rotations = new Float32Array(debrisCount);
    const rotationSpeeds = new Float32Array(debrisCount);
    const sizes = new Float32Array(debrisCount);

    for (let i = 0; i < debrisCount; i++) {
      const i3 = i * 3;
      
      // 初始位置：集中在坍塌中心附近
      const spread = 8; // 初始分布范围
      positions[i3] = position.x + (Math.random() - 0.5) * spread;
      positions[i3 + 1] = position.y + Math.random() * 15; // 建筑物高度方向
      positions[i3 + 2] = position.z + (Math.random() - 0.5) * spread;
      
      // 碎片颜色：灰色到棕色（混凝土、钢筋、砖块）
      const colorType = Math.random();
      if (colorType < 0.4) {
        // 混凝土灰色
        colors[i3] = 0.5 + Math.random() * 0.2;
        colors[i3 + 1] = 0.5 + Math.random() * 0.2;
        colors[i3 + 2] = 0.5 + Math.random() * 0.2;
      } else if (colorType < 0.7) {
        // 砖红色
        colors[i3] = 0.6 + Math.random() * 0.2;
        colors[i3 + 1] = 0.3 + Math.random() * 0.2;
        colors[i3 + 2] = 0.2 + Math.random() * 0.1;
      } else {
        // 钢筋深灰色
        colors[i3] = 0.3 + Math.random() * 0.2;
        colors[i3 + 1] = 0.3 + Math.random() * 0.2;
        colors[i3 + 2] = 0.3 + Math.random() * 0.2;
      }
      
      // 碎片大小
      sizes[i] = 0.3 + Math.random() * 1.2;
      
      // 初始速度：向下和向外扩散
      const speed = 0.5 + Math.random() * 2;
      const angle = Math.random() * Math.PI * 2;
      const upwardComponent = Math.random() * 0.3; // 少量向上初速度
      
      velocities.push({
        x: Math.cos(angle) * speed * 0.5,
        y: upwardComponent - Math.random() * 1.5, // 重力影响
        z: Math.sin(angle) * speed * 0.5
      });
      
      // 旋转
      rotations[i] = Math.random() * Math.PI * 2;
      rotationSpeeds[i] = (Math.random() - 0.5) * 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      sizeAttenuation: true // 根据距离调整大小
    });

    const debris = new THREE.Points(geometry, material);
    this.scene.add(debris);

    // 创建坍塌主体结构
    const collapseGroup = new THREE.Group();
    
    // 主要坍塌块
    for (let i = 0; i < 5; i++) {
      const blockGeometry = new THREE.BoxGeometry(
        3 + Math.random() * 4,
        2 + Math.random() * 3,
        3 + Math.random() * 4
      );
      const blockMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0.6 + Math.random() * 0.2, 0.4 + Math.random() * 0.2, 0.3),
        transparent: true,
        opacity: 0.9
      });
      
      const block = new THREE.Mesh(blockGeometry, blockMaterial);
      block.position.set(
        position.x + (Math.random() - 0.5) * 6,
        position.y + 5 + Math.random() * 10,
        position.z + (Math.random() - 0.5) * 6
      );
      
      block.castShadow = true;
      block.receiveShadow = true;
      
      // 存储块的运动参数
      block.userData = {
        velocity: {
          x: (Math.random() - 0.5) * 0.3,
          y: -Math.random() * 0.5,
          z: (Math.random() - 0.5) * 0.3
        },
        rotation: {
          x: Math.random() * 0.02,
          y: Math.random() * 0.02,
          z: Math.random() * 0.02
        },
        life: 1.0
      };
      
      collapseGroup.add(block);
    }
    
    this.scene.add(collapseGroup);

    // 创建尘埃云效果
    const dustCount = 300;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustVelocities = [];
    const dustSizes = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 15;
      const angle = Math.random() * Math.PI * 2;
      
      dustPositions[i3] = position.x + Math.cos(angle) * radius;
      dustPositions[i3 + 1] = position.y + Math.random() * 5;
      dustPositions[i3 + 2] = position.z + Math.sin(angle) * radius;
      
      dustVelocities.push({
        x: (Math.random() - 0.5) * 0.2,
        y: Math.random() * 0.3 + 0.1, // 向上飘
        z: (Math.random() - 0.5) * 0.2
      });
      
      dustSizes[i] = 2 + Math.random() * 3;
    }

    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1));

    const dustMaterial = new THREE.PointsMaterial({
      color: 0x8B7355, // 棕色尘埃
      size: 1.5,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true
    });

    const dust = new THREE.Points(dustGeometry, dustMaterial);
    this.scene.add(dust);

    // 坍塌动画
    let time = 0;
    this.accidentAnimation = () => {
      time += 0.05;
      
      // 更新碎片粒子
      const positions = debris.geometry.attributes.position.array;
      
      for (let i = 0; i < debrisCount; i++) {
        const i3 = i * 3;
        const velocity = velocities[i];
        
        // 更新位置
        positions[i3] += velocity.x;
        positions[i3 + 1] += velocity.y;
        positions[i3 + 2] += velocity.z;
        
        // 重力影响
        velocity.y -= 0.08; // 重力加速度
        
        // 空气阻力
        velocity.x *= 0.99;
        velocity.z *= 0.99;
        
        // 地面碰撞检测
        if (positions[i3 + 1] <= 0.1) {
          positions[i3 + 1] = 0.1;
          velocity.y = 0;
          velocity.x *= 0.7; // 摩擦力
          velocity.z *= 0.7;
        }
      }
      
      debris.geometry.attributes.position.needsUpdate = true;
      
      // 更新大块结构
      collapseGroup.children.forEach((block) => {
        const userData = block.userData;
        
        // 更新位置
        block.position.x += userData.velocity.x;
        block.position.y += userData.velocity.y;
        block.position.z += userData.velocity.z;
        
        // 更新旋转
        block.rotation.x += userData.rotation.x;
        block.rotation.y += userData.rotation.y;
        block.rotation.z += userData.rotation.z;
        
        // 重力影响
        userData.velocity.y -= 0.06;
        
        // 地面碰撞检测
        if (block.position.y <= block.geometry.parameters.height / 2) {
          block.position.y = block.geometry.parameters.height / 2;
          userData.velocity.y = 0;
          userData.velocity.x *= 0.5;
          userData.velocity.z *= 0.5;
          userData.rotation.x *= 0.8;
          userData.rotation.z *= 0.8;
        }
        
        // 生命Maintainer期衰减
        userData.life -= 0.005;
        block.material.opacity = userData.life * 0.9;
      });
      
      // 更新尘埃
      const dustPositions = dust.geometry.attributes.position.array;
      
      for (let i = 0; i < dustCount; i++) {
        const i3 = i * 3;
        const velocity = dustVelocities[i];
        
        dustPositions[i3] += velocity.x;
        dustPositions[i3 + 1] += velocity.y;
        dustPositions[i3 + 2] += velocity.z;
        
        // 尘埃逐渐上升并消散
        velocity.y += 0.02;
        velocity.x *= 0.98;
        velocity.z *= 0.98;
      }
      
      dust.geometry.attributes.position.needsUpdate = true;
      
      // 尘埃逐渐消散
      if (dustMaterial.opacity > 0.1) {
        dustMaterial.opacity -= 0.002;
      }
    };

    // 存储所有效果对象
    debris.userData.velocities = velocities;
    dust.userData.velocities = dustVelocities;
    this.scene.userData.accidentEffect = debris;
    this.scene.userData.collapseGroup = collapseGroup;
    this.scene.userData.dust = dust;
  }

  simulateElectricShock(position) {
    console.log('模拟触电事故，位置:', position);
    
    // 创建电弧效果
    const lightningCount = 8;
    
    // 电弧组
    const lightningGroup = new THREE.Group();
    
    // 创建多条横向电弧
    for (let i = 0; i < lightningCount; i++) {
      const points = [];
      const segments = 20;
      
      // 横向电弧起点和终点
      const startX = position.x - 6 + Math.random() * 3;
      const endX = position.x + 6 + Math.random() * 3;
      const baseY = position.y + 2 + Math.random() * 3; // 离地高度
      const currentZ = position.z + (Math.random() - 0.5) * 4;
      
      points.push(new THREE.Vector3(startX, baseY, currentZ));
      
      // 创建锯齿状横向电弧路径
      for (let j = 1; j < segments - 1; j++) {
        const progress = j / (segments - 1);
        const x = startX + (endX - startX) * progress;
        
        // 添加随机偏移创建锯齿效果
        const yOffset = (Math.random() - 0.5) * 1;
        const zOffset = (Math.random() - 0.5) * 1;
        
        points.push(new THREE.Vector3(x, baseY + yOffset, currentZ + zOffset));
      }
      
      // 电弧终点
      points.push(new THREE.Vector3(
        endX + (Math.random() - 0.5) * 2,
        baseY + (Math.random() - 0.5) * 2,
        currentZ + (Math.random() - 0.5) * 2
      ));
      
      // 创建电弧几何体
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x00ffff, // 青色电弧
        linewidth: 1, // 减小线宽
        transparent: true,
        opacity: 0.9
      });
      
      const lightning = new THREE.Line(geometry, material);
      lightningGroup.add(lightning);
    }
    
    this.scene.add(lightningGroup);
    
    // 创建多个电流脉冲球体（沿横向分布）
    const pulseGroup = new THREE.Group();
    const pulseCount = 3;
    
    for (let i = 0; i < pulseCount; i++) {
      const pulseGeometry = new THREE.SphereGeometry(0.6 + Math.random() * 0.3, 16, 16); // 减小球体大小
      const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.6,
        wireframe: true
      });
      
      const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
      pulse.position.set(
        position.x - 4 + i * 4, // 横向分布，减少间距从8到4
        position.y + 3,
        position.z + (Math.random() - 0.5) * 2
      );
      
      pulseGroup.add(pulse);
    }
    
    this.scene.add(pulseGroup);
    
    // 触电动画
    let time = 0;
    let pulseScale = 1;
    let pulseOpacity = 0.6;
    
    this.accidentAnimation = () => {
      time += 0.1;
      
      // 更新电弧闪烁效果
      lightningGroup.children.forEach((lightning, index) => {
        const flickerIntensity = Math.sin(time * 20 + index) * 0.5 + 0.5;
        lightning.material.opacity = flickerIntensity * 0.9;
        
        // 偶尔重新生成横向电弧路径
        if (Math.random() < 0.05) {
          const points = [];
          const segments = 20;
          const startX = position.x - 6 + Math.random() * 3;
          const endX = position.x + 6 + Math.random() * 3;
          const baseY = position.y + 2 + Math.random() * 3;
          const currentZ = position.z + (Math.random() - 0.5) * 4;
          
          points.push(new THREE.Vector3(startX, baseY, currentZ));
          
          for (let j = 1; j < segments - 1; j++) {
            const progress = j / (segments - 1);
            const x = startX + (endX - startX) * progress;
            const yOffset = (Math.random() - 0.5) * 1;
            const zOffset = (Math.random() - 0.5) * 1;
            points.push(new THREE.Vector3(x, baseY + yOffset, currentZ + zOffset));
          }
          
          points.push(new THREE.Vector3(
            endX + (Math.random() - 0.5) * 2,
            baseY + (Math.random() - 0.5) * 2,
            currentZ + (Math.random() - 0.5) * 2
          ));
          
          lightning.geometry.setFromPoints(points);
        }
      });
      
      // 更新脉冲球体群组
      pulseGroup.children.forEach((pulse, index) => {
        const scale = 1 + Math.sin(time * 5 + index * 0.5) * 0.3;
        pulse.scale.setScalar(scale);
        const opacity = 0.6 + Math.sin(time * 8 + index * 0.3) * 0.3;
        pulse.material.opacity = Math.max(0, Math.min(1, opacity));
        
        // 旋转脉冲球体
        pulse.rotation.y += 0.05;
        pulse.rotation.z += 0.03;
        
        // 轻微横向移动
        pulse.position.x += Math.sin(time * 2 + index) * 0.02;
      });
    };
    
    // 存储效果对象
    this.scene.userData.lightningGroup = lightningGroup;
    this.scene.userData.pulseGroup = pulseGroup;
  }

  clearAccidentEffects() {
    // 清除之前的事故效果
    if (this.scene.userData.accidentEffect) {
      this.scene.remove(this.scene.userData.accidentEffect);
      this.scene.userData.accidentEffect = null;
    }
    
    if (this.scene.userData.shockwave) {
      this.scene.remove(this.scene.userData.shockwave);
      this.scene.userData.shockwave = null;
    }
    
    if (this.scene.userData.collapseGroup) {
      this.scene.remove(this.scene.userData.collapseGroup);
      this.scene.userData.collapseGroup = null;
    }
    
    if (this.scene.userData.dust) {
      this.scene.remove(this.scene.userData.dust);
      this.scene.userData.dust = null;
    }
    
    if (this.scene.userData.lightningGroup) {
      this.scene.remove(this.scene.userData.lightningGroup);
      this.scene.userData.lightningGroup = null;
    }
    
    if (this.scene.userData.pulseGroup) {
      this.scene.remove(this.scene.userData.pulseGroup);
      this.scene.userData.pulseGroup = null;
    }
    
    this.accidentAnimation = null;
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    // 更新控制器
    if (this.controls) {
      this.controls.update();
    }
    
    // 执行事故动画
    if (this.accidentAnimation) {
      this.accidentAnimation();
    }
    
    // 渲染场景
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  updateSize(width, height) {
    if (this.camera && this.renderer) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  dispose() {
    // 停止动画
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // 清除事故效果
    this.clearAccidentEffects();
    
    // 清除加载提示
    this.hideLoadingText();
    
    // 从场景中移除模型（但不释放共享模型的资源）
    if (this.factoryModel) {
      this.scene.remove(this.factoryModel);
      // 注意：这里不释放模型资源，因为它是共享的
    }
    
    // 释放渲染器资源
    if (this.renderer) {
      this.renderer.dispose();
      if (this.container && this.renderer.domElement) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
    
    // 释放场景资源（跳过模型对象）
    if (this.scene) {
      this.scene.traverse((object) => {
        // 跳过工厂模型的资源释放，因为它是共享的
        if (object === this.factoryModel) return;
        
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
    
    // 释放控制器
    if (this.controls) {
      this.controls.dispose();
    }
  }

  // 静态方法：清理共享模型资源（应用退出时调用）
  static disposeSharedModel() {
    if (ThreeJSSceneManager.sharedModel) {
      ThreeJSSceneManager.sharedModel.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
      ThreeJSSceneManager.sharedModel = null;
    }
    ThreeJSSceneManager.modelLoadingPromise = null;
  }
}