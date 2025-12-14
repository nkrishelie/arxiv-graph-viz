// Это заглушка, чтобы обмануть сборщик
export class WebGPURenderer {
  constructor() {
    console.warn('WebGPURenderer is not supported in this build.');
  }
  render() {}
  setSize() {}
}
