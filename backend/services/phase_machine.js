class PhaseMachine {

  constructor(startSelection, startVote, showResults) {
    this.phases = [
      { name: 'selection', time: 15000, after: startVote },
      { name: 'voting', time: 15000, after: showResults },
      { name: 'results', time: 5000, after: startSelection },
    ];
    this.currentIndex = 0;
    this.phaseCount = 3;
    this.active = false;
    this.timer = null;
  }

  start() {
    this.active = true;
    this.setTimer(this.currentPhase().after, this.time());
  }

  increment() {
    this.cancelTimer();
    this.currentIndex = (this.currentIndex + 1) % this.phaseCount;
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
    return !this.timer
  }

  setTimer(after, timeout) {
    console.log('SET TIMER FOR ', this.name())
    const afterAction = () => {
      this.cancelTimer()
      after()
    }
    this.timer = setTimeout(afterAction, timeout);
  }

  cancelTimer() {
    console.log('CANCEL TIMER FOR', this.name())
    if (!this.timer) return
    clearTimeout(this.timer);
    this.timer = null;
  }
}

export default PhaseMachine;