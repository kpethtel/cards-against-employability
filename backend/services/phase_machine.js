class PhaseMachine {

  PHASE_COUNT = 3;

  constructor(startSelection, startVote, showResults) {
    this.phases = [
      { name: 'selection', time: 15000, after: startVote },
      { name: 'voting', time: 15000, after: showResults },
      { name: 'results', time: 5000, after: startSelection },
    ];
    this.currentIndex = 0;
    this.active = false;
    this.timer = null;
  }

  start() {
    this.active = true;
    this.setTimer(this.currentPhase().after, this.time());
  }

  increment() {
    this.currentIndex = (this.currentIndex + 1) % this.PHASE_COUNT;
    this.setTimer(this.currentPhase().after, this.time());
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

  timedOut() {
    return !this.timer;
  }

  setTimer(after, timeout) {
    console.log('SET TIMER FOR ', this.name())
    clearTimeout(this.timer);
    const afterAction = () => {
      clearTimeout(this.timer);
      after();
    }
    this.timer = setTimeout(afterAction, timeout);
  }
}

export default PhaseMachine;