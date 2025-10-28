<template>
  <div ref="container" class="city-animation-container"></div>
</template>

<script>
export default {
  name: 'CityAnimation',
  data() {
    return {
      canvas: null,
      ctx: null,
      skylines: [],
      dt: 1,
      mouse: { x: 0, y: 0 },
      animationId: null,
      lastTime: Date.now()
    };
  },
  mounted() {
    this.initCanvas();
    this.setup();
    this.animate();
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    initCanvas() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.$refs.container.appendChild(this.canvas);
      this.resizeCanvas();
    },
    
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.mouse.x = this.canvas.width / 10;
      this.mouse.y = this.canvas.height;
    },
    
    handleResize() {
      this.resizeCanvas();
      // Repopulate skylines on resize
      this.skylines = [];
      this.setup();
    },
    
    handleMouseMove(e) {
      this.mouse.x = e.pageX;
      this.mouse.y = e.pageY;
    },
    
    random(min, max) {
      return Math.random() * (max - min) + min;
    },
    
    setup() {
      for (let i = 5; i > 0; i--) {
        this.skylines.push(this.createSkyline({
          layer: i,
          width: {
            min: i * 30,
            max: i * 40
          },
          height: {
            min: 150 - ((i - 1) * 35),
            max: 300 - ((i - 1) * 35)
          },
          speed: i * 0.003,
          color: `hsl(200, ${(i * 1) + 10}%, ${75 - ((i - 1) * 13)}%)`
        }));
      }
    },
    
    createSkyline(config) {
      const skyline = {
        x: 0,
        buildings: [],
        layer: config.layer,
        width: config.width,
        height: config.height,
        speed: config.speed,
        color: config.color
      };
      
      this.populateSkyline(skyline);
      return skyline;
    },
    
    populateSkyline(skyline) {
      let totalWidth = 0;
      while (totalWidth <= this.canvas.width + (skyline.width.max * 2)) {
        const newWidth = Math.round(this.random(skyline.width.min, skyline.width.max));
        const newHeight = Math.round(this.random(skyline.height.min, skyline.height.max));
        
        skyline.buildings.push(this.createBuilding({
          layer: skyline.layer,
          x: skyline.buildings.length === 0 ? 0 : 
             skyline.buildings[skyline.buildings.length - 1].x + 
             skyline.buildings[skyline.buildings.length - 1].width,
          y: this.canvas.height - newHeight,
          width: newWidth,
          height: newHeight,
          color: skyline.color
        }));
        
        totalWidth += newWidth;
      }
    },
    
    createBuilding(config) {
      return {
        layer: config.layer,
        x: config.x,
        y: config.y,
        width: config.width,
        height: config.height,
        color: config.color,
        slantedTop: Math.floor(this.random(0, 10)) === 0,
        slantedTopHeight: config.width / this.random(2, 4),
        slantedTopDirection: Math.round(this.random(0, 1)) === 0,
        spireTop: Math.floor(this.random(0, 15)) === 0,
        spireTopWidth: this.random(config.width * 0.01, config.width * 0.07),
        spireTopHeight: this.random(10, 20),
        antennaTop: Math.floor(this.random(0, 10)) === 0,
        antennaTopWidth: config.layer / 2,
        antennaTopHeight: this.random(5, 20)
      };
    },
    
    updateSkyline(skyline) {
      skyline.x -= (this.mouse.x * skyline.speed) * this.dt;
      
      const firstBuilding = skyline.buildings[0];
      if (firstBuilding.width + firstBuilding.x + skyline.x < 0) {
        const newWidth = Math.round(this.random(skyline.width.min, skyline.width.max));
        const newHeight = Math.round(this.random(skyline.height.min, skyline.height.max));
        const lastBuilding = skyline.buildings[skyline.buildings.length - 1];
        
        const resetBuilding = this.createBuilding({
          layer: skyline.layer,
          x: lastBuilding.x + lastBuilding.width,
          y: this.canvas.height - newHeight,
          width: newWidth,
          height: newHeight,
          color: skyline.color
        });
        
        skyline.buildings.shift();
        skyline.buildings.push(resetBuilding);
      }
    },
    
    renderBuilding(building) {
      this.ctx.fillStyle = this.ctx.strokeStyle = building.color;
      this.ctx.lineWidth = 2;
      
      // Main building body
      this.ctx.beginPath();
      this.ctx.rect(building.x, building.y, building.width, building.height);
      this.ctx.fill();
      this.ctx.stroke();
      
      // Slanted top
      if (building.slantedTop) {
        this.ctx.beginPath();
        this.ctx.moveTo(building.x, building.y);
        this.ctx.lineTo(building.x + building.width, building.y);
        if (building.slantedTopDirection) {
          this.ctx.lineTo(building.x + building.width, building.y - building.slantedTopHeight);
        } else {
          this.ctx.lineTo(building.x, building.y - building.slantedTopHeight);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
      }
      
      // Spire top
      if (building.spireTop) {
        this.ctx.beginPath();
        this.ctx.moveTo(building.x + (building.width / 2), building.y - building.spireTopHeight);
        this.ctx.lineTo(building.x + (building.width / 2) + building.spireTopWidth, building.y);
        this.ctx.lineTo(building.x + (building.width / 2) - building.spireTopWidth, building.y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
      }
      
      // Antenna top
      if (building.antennaTop && !building.spireTop) {
        this.ctx.beginPath();
        this.ctx.moveTo(building.x + (building.width / 2), building.y - building.antennaTopHeight);
        this.ctx.lineTo(building.x + (building.width / 2), building.y);
        this.ctx.lineWidth = building.antennaTopWidth;
        this.ctx.stroke();
      }
    },
    
    renderSkyline(skyline) {
      this.ctx.save();
      this.ctx.translate(
        skyline.x, 
        (this.canvas.height - this.mouse.y) / 20 * skyline.layer
      );
      
      for (let i = 0; i < skyline.buildings.length; i++) {
        this.renderBuilding(skyline.buildings[i]);
      }
      
      this.ctx.restore();
    },
    
    update() {
      const currentTime = Date.now();
      const deltaTime = (currentTime - this.lastTime) / 16; // Normalize to ~60fps
      this.lastTime = currentTime;
      
      this.dt = deltaTime < 0.1 ? 0.1 : deltaTime;
      this.dt = this.dt > 5 ? 5 : this.dt;
      
      for (let i = 0; i < this.skylines.length; i++) {
        this.updateSkyline(this.skylines[i]);
      }
    },
    
    draw() {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw all skylines
      for (let i = this.skylines.length - 1; i >= 0; i--) {
        this.renderSkyline(this.skylines[i]);
      }
    },
    
    animate() {
      this.update();
      this.draw();
      this.animationId = requestAnimationFrame(this.animate);
    }
  }
};
</script>

<style scoped>
.city-animation-container {
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  background: url(https://jackrugile.com/images/misc/skyline-texture.png);
  z-index: -1;
}

.city-animation-container canvas {
  background: linear-gradient(
    hsl(200, 50%, 80%) 0%, 
    hsl(200, 30%, 95%) 75%
  );
  display: block;
}
</style>