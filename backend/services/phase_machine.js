class PhaseMachine {

  constructor() {
    this.phases = [
      { name: 'selection', time: 30 },
      { name: 'voting', time: 30 },
      { name: 'results', time: 5 },
    ];
    this.currentIndex = 0;
    this.phaseCount = 3;
    this.active = false;
  }

  increment() {
    if (!this.active) {
      this.active = true;
      return
    }
    this.currentIndex = (this.currentIndex + 1) % this.phaseCount;
  }

  currentPhase() {
    return this.phases[this.currentIndex];
  }

  name() {
    return this.currentPhase().name;
  }

  time() {
    return this.currentPhase().time;
  }
}

export default PhaseMachine;